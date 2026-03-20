import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedAdminDb: Firestore | null | undefined;

/**
 * Admin SDK for API routes (custom claims, etc.).
 * Set FIREBASE_SERVICE_ACCOUNT_JSON to the full JSON of a service account (Vercel/env),
 * or GOOGLE_APPLICATION_CREDENTIALS to a key file path (local).
 */
export function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json?.trim()) {
    try {
      const cred = JSON.parse(json);
      return initializeApp({
        credential: cert(cred),
        projectId:
          (typeof cred === "object" &&
            cred !== null &&
            "project_id" in cred &&
            typeof (cred as { project_id: unknown }).project_id === "string" &&
            (cred as { project_id: string }).project_id) ||
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (e) {
      console.error("[firebase-admin-server] Invalid FIREBASE_SERVICE_ACCOUNT_JSON", e);
      return null;
    }
  }

  try {
    return initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch {
    return null;
  }
}

/**
 * Firestore via Admin SDK (server only). Bypasses security rules — use only in Server Components / API routes.
 * Returns null if the app is not initialized (missing credentials).
 */
export function getAdminFirestoreOrNull(): Firestore | null {
  if (typeof window !== "undefined") return null;
  if (cachedAdminDb !== undefined) return cachedAdminDb;
  const app = getFirebaseAdminApp();
  if (!app) {
    cachedAdminDb = null;
    return null;
  }
  cachedAdminDb = getFirestore(app);
  return cachedAdminDb;
}
