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
      e.code === "auth/cancelled-popup-request")
  );
}

async function signInWithPopupOrRedirect(
  provider: typeof githubProvider
): Promise<void> {
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
