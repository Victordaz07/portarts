import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PortfolioConfig, Project } from "./types";

export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  const snap = await getDoc(doc(db, "config", "portfolio"));
  if (!snap.exists()) return null;
  return snap.data() as PortfolioConfig;
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const q = query(
      collection(db, "projects"),
      where("published", "==", true),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("index") && (msg.includes("building") || msg.includes("required"))) {
      return [];
    }
    throw err;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const q = query(
      collection(db, "projects"),
      where("slug", "==", slug),
      where("published", "==", true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("index") && (msg.includes("building") || msg.includes("required"))) {
      return null;
    }
    throw err;
  }
}

// Admin: get all projects (including unpublished)
export async function getAllProjects(): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

// Admin: get project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
}

// Admin: check if slug exists (excluding given id)
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(
    collection(db, "projects"),
    where("slug", "==", slug)
  );
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}

// Admin: verificar unicidad del slug ANTES de crear/actualizar
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(
    collection(db, "projects"),
    where("slug", "==", slug),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return true;
  if (excludeId && snap.docs[0].id === excludeId) return true;
  return false;
}

// Admin: create project
export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// Admin: update project
export async function updateProject(id: string, data: Partial<Project>) {
  const { id: _id, createdAt, updatedAt, ...rest } = data as Project;
  await updateDoc(doc(db, "projects", id), {
    ...rest,
    updatedAt: serverTimestamp(),
  });
}

// Admin: delete project
export async function deleteProject(id: string) {
  await deleteDoc(doc(db, "projects", id));
}

// Admin: update project order (batch)
export async function reorderProjects(orderedIds: string[]) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "projects", id), { order: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}

// Admin: update portfolio config
export async function updatePortfolioConfig(data: Partial<PortfolioConfig>) {
  await setDoc(doc(db, "config", "portfolio"), data, { merge: true });
}
