"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  SessionProvider,
  useSession,
  signIn as nextSignIn,
  signOut as nextSignOut,
} from "next-auth/react";

/**
 * Auth context — thin shim over Auth.js (NextAuth). Keeps the same `useAuth()`
 * shape the app already consumes so components did not need rewrites when we
 * moved off Firebase Auth. `user.uid` maps to the Auth.js user id/email.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdminUser: boolean;
  authError: string | null;
  signInWithGitHub: () => Promise<unknown>;
  signInWithGoogle: () => Promise<unknown>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function describeAuthErrorParam(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case "OAuthAccountNotLinked":
      return "Ya existe una cuenta con ese correo usando otro proveedor de acceso.";
    case "AccessDenied":
      return "Acceso denegado por el proveedor de autenticación.";
    case "Configuration":
      return "Error de configuración de autenticación. Revisa las variables AUTH_* en el servidor.";
    default:
      return `Error de autenticación (${code}).`;
  }
}

function InnerAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    const message = describeAuthErrorParam(code);
    if (!message) return;
    const timer = window.setTimeout(() => setAuthError(message), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const user: AuthUser | null = session?.user
    ? {
        uid: session.user.id ?? session.user.email ?? "",
        email: session.user.email ?? null,
        displayName: session.user.name ?? null,
        photoURL: session.user.image ?? null,
      }
    : null;

  const isAdminUser = Boolean(session?.user?.isAdmin);

  const signInWithGitHub = useCallback(async () => {
    setAuthError(null);
    return nextSignIn("github", { callbackUrl: "/admin" });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    return nextSignIn("google", { callbackUrl: "/admin" });
  }, []);

  const signOut = useCallback(async () => {
    await nextSignOut({ callbackUrl: "/" });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        isAdminUser,
        authError,
        signInWithGitHub,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <InnerAuthProvider>{children}</InnerAuthProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
