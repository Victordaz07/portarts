import {
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, githubProvider, googleProvider, db } from "./firebase";

export async function signInWithGitHub() {
  return signInWithPopup(auth, githubProvider);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
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
