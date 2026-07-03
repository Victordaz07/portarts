import {
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { auth, githubProvider, googleProvider, db } from "./firebase";

function shouldUseRedirectInsteadOfPopup(e: unknown): boolean {
  return (
    e instanceof FirebaseError &&
    (e.code === "auth/popup-blocked" ||
      e.code === "auth/cancelled-popup-request" ||
      e.code === "auth/popup-closed-by-user" ||
      e.code === "auth/operation-not-supported-in-this-environment")
  );
}

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function signInWithPopupOrRedirect(
  provider: typeof githubProvider
): Promise<void> {
  // Popups are unreliable on mobile browsers (blocked, closed instantly, or
  // unsupported in embedded webviews), so go straight to redirect there.
  if (isMobileBrowser()) {
    await signInWithRedirect(auth, provider);
    return;
  }
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (shouldUseRedirectInsteadOfPopup(e)) {
      await signInWithRedirect(auth, provider);
      return;
    }
    throw e;
  }
}

export async function signInWithGitHub() {
  return signInWithPopupOrRedirect(githubProvider);
}

export async function signInWithGoogle() {
  return signInWithPopupOrRedirect(googleProvider);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function isAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "config", "portfolio"));
  if (!snap.exists()) return false;
  const allowedAdmins = snap.data()?.allowedAdmins as string[] | undefined;
  return Array.isArray(allowedAdmins) && allowedAdmins.includes(uid);
}
