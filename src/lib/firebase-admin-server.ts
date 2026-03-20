import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedAdminDb: Firestore | null | undefined;

function resolveProjectId(cred: unknown): string | undefined {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (fromEnv) return fromEnv;
  if (
    typeof cred === "object" &&
    cred !== null &&
    "project_id" in cred &&
    typeof (cred as { project_id: unknown }).project_id === "string"
  ) {
    const id = (cred as { project_id: string }).project_id.trim();
    if (id) return id;
  }
  return undefined;
}

/**
 * Admin SDK for API routes (custom claims, etc.).
 * Set FIREBASE_SERVICE_ACCOUNT_JSON to the full JSON of a service account (Vercel/env),
 * or GOOGLE_APPLICATION_CREDENTIALS to a key file path (local).
 *
 * Firestore requires an explicit project id — set NEXT_PUBLIC_FIREBASE_PROJECT_ID or include project_id in the service account JSON.
 */
export function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json?.trim()) {
    try {
      const cred = JSON.parse(json) as unknown;
      const projectId = resolveProjectId(cred);
      if (!projectId) {
        console.error(
          "[firebase-admin-server] Missing project id: set NEXT_PUBLIC_FIREBASE_PROJECT_ID or project_id in FIREBASE_SERVICE_ACCOUNT_JSON"
        );
        return null;
      }
      return initializeApp({
        credential: cert(cred as Parameters<typeof cert>[0]),
        projectId,
      });
    } catch (e) {
      console.error("[firebase-admin-server] Invalid FIREBASE_SERVICE_ACCOUNT_JSON", e);
      return null;
    }
  }

  const projectIdOnly = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!projectIdOnly) {
    console.error(
      "[firebase-admin-server] Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID (required for applicationDefault / local Admin)"
    );
    return null;
  }

  try {
    return initializeApp({
      credential: applicationDefault(),
      projectId: projectIdOnly,
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
