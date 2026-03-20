"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getRedirectResult, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  isAdmin,
  signInWithGitHub,
  signInWithGoogle,
  signOut as authSignOut,
} from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdminUser: boolean;
  signInWithGitHub: () => Promise<unknown>;
  signInWithGoogle: () => Promise<unknown>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const admin = await isAdmin(u.uid);
        setIsAdminUser(admin);
      } else {
        setIsAdminUser(false);
      }
      setLoading(false);
    });
    void getRedirectResult(auth).catch(() => {
      /* redirect errors are surfaced via onAuthStateChanged or next sign-in */
    });
    return () => unsub();
  }, []);

  const handleSignInGitHub = useCallback(async () => {
    return signInWithGitHub();
  }, []);

  const handleSignInGoogle = useCallback(async () => {
    return signInWithGoogle();
  }, []);

  const handleSignOut = useCallback(async () => {
    await authSignOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminUser,
        signInWithGitHub: handleSignInGitHub,
        signInWithGoogle: handleSignInGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
