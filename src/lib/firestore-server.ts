import { Timestamp as AdminTimestamp } from "firebase-admin/firestore";
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

export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
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

/**
 * Lists published projects for the public home page.
 * - **Admin SDK:** bypasses rules; orderBy(order) + in-memory filter (supports string "true").
 * - **Client SDK (unauthenticated server):** must use `where('published','==',true)` so Firestore
 *   security rules allow the query (listing all projects by order only is rejected for anon).
 */
export async function getPublishedProjects(): Promise<Project[]> {
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

  try {
    const q = query(
      collection(db, "projects"),
      where("published", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...serializeClientFirestoreDoc(d.data() as Record<string, unknown>),
        }) as Project
    );
  } catch (e) {
    if (isIndexBuildingError(e)) return [];
    console.warn(
      "[firestore-server] getPublishedProjects client compound query failed, trying published-only",
      e
    );
    try {
      const q2 = query(collection(db, "projects"), where("published", "==", true));
      const snap = await getDocs(q2);
      const list = snap.docs.map(
        (d) =>
          ({
            id: d.id,
            ...serializeClientFirestoreDoc(d.data() as Record<string, unknown>),
          }) as Project
      );
      return sortProjectsByOrder(list);
    } catch (e2) {
      console.error("[firestore-server] getPublishedProjects (client fallback)", e2);
      return [];
    }
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
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

  try {
    const q = query(
      collection(db, "projects"),
      where("slug", "==", slug),
      where("published", "==", true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return {
      id: snap.docs[0].id,
      ...serializeClientFirestoreDoc(
        snap.docs[0].data() as Record<string, unknown>
      ),
    } as Project;
  } catch (e) {
    if (isIndexBuildingError(e)) return null;
    console.error("[firestore-server] getProjectBySlug (client fallback)", e);
    return null;
  }
}
