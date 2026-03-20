import { cache } from "react";
import { Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import type { QuerySnapshot } from "firebase/firestore";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  Timestamp as ClientTimestamp,
} from "firebase/firestore";
import { getAdminFirestoreOrNull } from "@/lib/firebase-admin-server";
import { db } from "@/lib/firebase";
import type { PortfolioConfig, Project } from "@/lib/types";

/**
 * Firestore reads for Server Components only.
 * Prefers Firebase Admin (bypasses rules, works on Vercel). Falls back to the web SDK if Admin is not configured.
 * Do not import this file from client components.
 *
 * Exported getters are wrapped in `react/cache` so layout + page in the same request dedupe reads.
 */

function serializeClientFirestoreDoc(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof ClientTimestamp) {
      result[key] = value.toDate().toISOString();
    } else {
      result[key] = value;
    }
  }
  return result;
}

function serializeAdminFirestoreDoc(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof AdminTimestamp) {
      result[key] = value.toDate().toISOString();
    } else {
      result[key] = value;
    }
  }
  return result;
}

function isIndexBuildingError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : "";
  return (
    msg.includes("index") &&
    (msg.includes("building") || msg.includes("required"))
  );
}

/** Treats legacy string/number truthy values as published (Firestore imports sometimes store wrong types). */
function isPublishedRaw(value: unknown): boolean {
  if (value === true) return true;
  if (value === 1) return true;
  if (typeof value === "string" && value.trim().toLowerCase() === "true") {
    return true;
  }
  return false;
}

function sortProjectsByOrder(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ao =
      typeof a.order === "number"
        ? a.order
        : Number.parseInt(String(a.order ?? 0), 10) || 0;
    const bo =
      typeof b.order === "number"
        ? b.order
        : Number.parseInt(String(b.order ?? 0), 10) || 0;
    return ao - bo;
  });
}

function ingestClientProjects(snap: QuerySnapshot, byId: Map<string, Project>) {
  for (const d of snap.docs) {
    if (byId.has(d.id)) continue;
    if (!isPublishedRaw(d.data().published)) continue;
    byId.set(d.id, {
      id: d.id,
      ...serializeClientFirestoreDoc(d.data() as Record<string, unknown>),
    } as Project);
  }
}

/**
 * Anonymous client SDK: rules require equality on `published`; merge boolean, string, and legacy numeric.
 */
async function fetchPublishedProjectsViaClientSdk(): Promise<Project[]> {
  const byId = new Map<string, Project>();

  try {
    const q = query(
      collection(db, "projects"),
      where("published", "==", true),
      orderBy("order", "asc")
    );
    ingestClientProjects(await getDocs(q), byId);
  } catch (e) {
    if (isIndexBuildingError(e)) return [];
    console.warn(
      "[firestore-server] getPublishedProjects client compound (true) failed, trying published-only",
      e
    );
    try {
      ingestClientProjects(
        await getDocs(
          query(collection(db, "projects"), where("published", "==", true))
        ),
        byId
      );
    } catch (e2) {
      console.error("[firestore-server] getPublishedProjects (client true)", e2);
    }
  }

  for (const publishedVal of ["true", 1] as const) {
    try {
      const qOrd = query(
        collection(db, "projects"),
        where("published", "==", publishedVal),
        orderBy("order", "asc")
      );
      ingestClientProjects(await getDocs(qOrd), byId);
    } catch (e) {
      if (isIndexBuildingError(e)) return [];
      try {
        ingestClientProjects(
          await getDocs(
            query(
              collection(db, "projects"),
              where("published", "==", publishedVal)
            )
          ),
          byId
        );
      } catch (e2) {
        console.warn(
          "[firestore-server] getPublishedProjects legacy published value",
          publishedVal,
          e2
        );
      }
    }
  }

  return sortProjectsByOrder([...byId.values()]);
}

async function fetchProjectBySlugViaClientSdk(
  slug: string
): Promise<Project | null> {
  const attempts: Array<boolean | string | number> = [true, "true", 1];
  for (const publishedVal of attempts) {
    try {
      const q = query(
        collection(db, "projects"),
        where("slug", "==", slug),
        where("published", "==", publishedVal)
      );
      const snap = await getDocs(q);
      if (snap.empty) continue;
      const d = snap.docs[0];
      if (!isPublishedRaw(d.data().published)) continue;
      return {
        id: d.id,
        ...serializeClientFirestoreDoc(d.data() as Record<string, unknown>),
      } as Project;
    } catch (e) {
      if (isIndexBuildingError(e)) return null;
      console.warn(
        "[firestore-server] getProjectBySlug client slug attempt",
        publishedVal,
        e
      );
    }
  }
  return null;
}

async function loadPortfolioConfig(): Promise<PortfolioConfig | null> {
  const adb = getAdminFirestoreOrNull();
  if (adb) {
    try {
      const snap = await adb.doc("config/portfolio").get();
      if (!snap.exists) return null;
      return snap.data() as PortfolioConfig;
    } catch (e) {
      console.error("[firestore-server] getPortfolioConfig (admin)", e);
      return null;
    }
  }

  try {
    const snap = await getDoc(doc(db, "config", "portfolio"));
    if (!snap.exists()) return null;
    return snap.data() as PortfolioConfig;
  } catch (e) {
    console.error("[firestore-server] getPortfolioConfig (client fallback)", e);
    return null;
  }
}

async function loadPublishedProjects(): Promise<Project[]> {
  const adb = getAdminFirestoreOrNull();
  if (adb) {
    try {
      const snap = await adb.collection("projects").orderBy("order", "asc").get();
      return snap.docs
        .filter((d) => isPublishedRaw(d.data().published))
        .map(
          (d) =>
            ({
              id: d.id,
              ...serializeAdminFirestoreDoc(d.data() as Record<string, unknown>),
            }) as Project
        );
    } catch (e) {
      if (isIndexBuildingError(e)) return [];
      console.warn(
        "[firestore-server] getPublishedProjects admin orderBy failed, falling back to full scan",
        e
      );
      try {
        const snapAll = await adb.collection("projects").get();
        const list = snapAll.docs
          .filter((d) => isPublishedRaw(d.data().published))
          .map(
            (d) =>
              ({
                id: d.id,
                ...serializeAdminFirestoreDoc(d.data() as Record<string, unknown>),
              }) as Project
          );
        return sortProjectsByOrder(list);
      } catch (e2) {
        console.error("[firestore-server] getPublishedProjects (admin fallback)", e2);
        return [];
      }
    }
  }

  return fetchPublishedProjectsViaClientSdk();
}

async function loadProjectBySlug(slug: string): Promise<Project | null> {
  const adb = getAdminFirestoreOrNull();
  if (adb) {
    try {
      const snap = await adb
        .collection("projects")
        .where("slug", "==", slug)
        .get();
      const docSnap = snap.docs.find((d) => isPublishedRaw(d.data().published));
      if (!docSnap) return null;
      return {
        id: docSnap.id,
        ...serializeAdminFirestoreDoc(
          docSnap.data() as Record<string, unknown>
        ),
      } as Project;
    } catch (e) {
      if (isIndexBuildingError(e)) return null;
      console.error("[firestore-server] getProjectBySlug (admin)", e);
      return null;
    }
  }

  return fetchProjectBySlugViaClientSdk(slug);
}

const getPortfolioConfigCached = cache(loadPortfolioConfig);
const getPublishedProjectsCached = cache(loadPublishedProjects);
const getProjectBySlugCached = cache(loadProjectBySlug);

export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  return getPortfolioConfigCached();
}

export async function getPublishedProjects(): Promise<Project[]> {
  return getPublishedProjectsCached();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return getProjectBySlugCached(slug);
}
