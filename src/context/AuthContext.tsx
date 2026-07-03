"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { FirebaseError } from "firebase/app";
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
  authError: string | null;
  signInWithGitHub: () => Promise<unknown>;
  signInWithGoogle: () => Promise<unknown>;
  signOut: () => Promise<void>;
}

function describeAuthError(e: unknown): string {
  if (e instanceof FirebaseError) {
    if (e.code === "auth/unauthorized-domain") {
      return "Este dominio no está autorizado en Firebase Authentication (Authentication → Settings → Authorized domains).";
    }
    if (e.code === "auth/account-exists-with-different-credential") {
      return "Ya existe una cuenta con ese correo usando otro proveedor de acceso.";
    }
    return `Error de autenticación (${e.code}).`;
  }
  return e instanceof Error ? e.message : "No se pudo iniciar sesión.";
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
    void getRedirectResult(auth).catch((e) => {
      setAuthError(describeAuthError(e));
    });
    return () => unsub();
  }, []);

  const handleSignInGitHub = useCallback(async () => {
    setAuthError(null);
    try {
      return await signInWithGitHub();
    } catch (e) {
      setAuthError(describeAuthError(e));
      throw e;
    }
  }, []);

  const handleSignInGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      return await signInWithGoogle();
    } catch (e) {
      setAuthError(describeAuthError(e));
      throw e;
    }
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
        authError,
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
