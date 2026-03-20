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
 * Uses only `orderBy("order")` then filters in memory so we do not depend on a composite
 * (published + order) index — that query often returned [] on production when the index
 * was missing or `published` was stored as a string.
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
      console.error("[firestore-server] getPublishedProjects (admin)", e);
      return [];
    }
  }

  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    return snap.docs
      .filter((d) => isPublishedRaw(d.data().published))
      .map(
        (d) =>
          ({
            id: d.id,
            ...serializeClientFirestoreDoc(d.data() as Record<string, unknown>),
          }) as Project
      );
  } catch (e) {
    if (isIndexBuildingError(e)) return [];
    console.error("[firestore-server] getPublishedProjects (client fallback)", e);
    return [];
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
    const q = query(collection(db, "projects"), where("slug", "==", slug));
    const snap = await getDocs(q);
    const docSnap = snap.docs.find((d) => isPublishedRaw(d.data().published));
    if (!docSnap) return null;
    return {
      id: docSnap.id,
      ...serializeClientFirestoreDoc(
        docSnap.data() as Record<string, unknown>
      ),
    } as Project;
  } catch (e) {
    if (isIndexBuildingError(e)) return null;
    console.error("[firestore-server] getProjectBySlug (client fallback)", e);
    return null;
  }
}
