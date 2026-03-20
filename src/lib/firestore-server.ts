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

const READ_TIMEOUT_MS = 14_000;

async function withReadTimeout<T>(label: string, fn: () => Promise<T>): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `[firestore-server] ${label} timed out after ${READ_TIMEOUT_MS}ms`
            )
          ),
        READ_TIMEOUT_MS
      )
    ),
  ]);
}

/**
 * Anonymous client SDK: rules require equality on `published`; merge boolean, string, and legacy numeric.
 * Queries run in parallel to avoid long sequential waits when Admin is not configured.
 */
async function fetchPublishedProjectsViaClientSdk(): Promise<Project[]> {
  const byId = new Map<string, Project>();
  const col = collection(db, "projects");
  const queries = [
    query(col, where("published", "==", true), orderBy("order", "asc")),
    query(col, where("published", "==", true)),
    query(col, where("published", "==", "true"), orderBy("order", "asc")),
    query(col, where("published", "==", "true")),
    query(col, where("published", "==", 1), orderBy("order", "asc")),
    query(col, where("published", "==", 1)),
  ];

  const settled = await Promise.allSettled(queries.map((q) => getDocs(q)));
  let sawIndexBuilding = false;
  for (const r of settled) {
    if (r.status === "fulfilled") {
      ingestClientProjects(r.value, byId);
    } else if (isIndexBuildingError(r.reason)) {
      sawIndexBuilding = true;
    } else {
      console.warn("[firestore-server] client parallel published query", r.reason);
    }
  }

  if (sawIndexBuilding && byId.size === 0) return [];

  return sortProjectsByOrder([...byId.values()]);
}

async function fetchProjectBySlugViaClientSdk(
  slug: string
): Promise<Project | null> {
  const attempts: Array<boolean | string | number> = [true, "true", 1];
  const queries = attempts.map((publishedVal) =>
    query(
      collection(db, "projects"),
      where("slug", "==", slug),
      where("published", "==", publishedVal)
    )
  );
  const settled = await Promise.allSettled(queries.map((q) => getDocs(q)));
  for (const r of settled) {
    if (r.status !== "fulfilled") {
      if (isIndexBuildingError(r.reason)) return null;
      continue;
    }
    const snap = r.value;
    if (snap.empty) continue;
    const d = snap.docs[0];
    if (!isPublishedRaw(d.data().published)) continue;
    return {
      id: d.id,
      ...serializeClientFirestoreDoc(d.data() as Record<string, unknown>),
    } as Project;
  }
  return null;
}

async function loadPortfolioConfig(): Promise<PortfolioConfig | null> {
  try {
    return await withReadTimeout("getPortfolioConfig", async () => {
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
        console.error(
          "[firestore-server] getPortfolioConfig (client fallback)",
          e
        );
        return null;
      }
    });
  } catch (e) {
    console.error("[firestore-server] getPortfolioConfig", e);
    return null;
  }
}

async function loadPublishedProjects(): Promise<Project[]> {
  try {
    return await withReadTimeout("getPublishedProjects", async () => {
      const adb = getAdminFirestoreOrNull();
      if (adb) {
        try {
          const snap = await adb
            .collection("projects")
            .orderBy("order", "asc")
            .get();
          return snap.docs
            .filter((d) => isPublishedRaw(d.data().published))
            .map(
              (d) =>
                ({
                  id: d.id,
                  ...serializeAdminFirestoreDoc(
                    d.data() as Record<string, unknown>
                  ),
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
                    ...serializeAdminFirestoreDoc(
                      d.data() as Record<string, unknown>
                    ),
                  }) as Project
              );
            return sortProjectsByOrder(list);
          } catch (e2) {
            console.error(
              "[firestore-server] getPublishedProjects (admin fallback)",
              e2
            );
            return [];
          }
        }
      }

      return fetchPublishedProjectsViaClientSdk();
    });
  } catch (e) {
    console.error("[firestore-server] getPublishedProjects", e);
    return [];
  }
}

async function loadProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await withReadTimeout("getProjectBySlug", async () => {
      const adb = getAdminFirestoreOrNull();
      if (adb) {
        try {
          const snap = await adb
            .collection("projects")
            .where("slug", "==", slug)
            .get();
          const docSnap = snap.docs.find((d) =>
            isPublishedRaw(d.data().published)
          );
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
    });
  } catch (e) {
    console.error("[firestore-server] getProjectBySlug", e);
    return null;
  }
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
