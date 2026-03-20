"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function LoginPage() {
  const { signInWithGitHub, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 -top-20 -left-20"
          style={{
            background:
              "radial-gradient(circle, rgba(232,197,71,.15), transparent 70%)",
          }}
        />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl text-text-primary hover:text-accent transition-colors inline-block mb-6">
            V<span className="text-accent">.</span>
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
            Admin panel
          </h1>
          <p className="text-text-secondary text-base">
            Sign in to manage your portfolio
          </p>
        </div>

        <div className="bg-bg-card border border-border rounded-card-lg p-6 space-y-4">
          <button
            type="button"
            onClick={() => signInWithGitHub()}
            className="w-full px-6 py-3.5 bg-bg-hover border border-border rounded-lg text-text-primary font-medium hover:border-accent hover:bg-accent-dim transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full px-6 py-3.5 bg-bg-hover border border-border rounded-lg text-text-primary font-medium hover:border-accent hover:bg-accent-dim transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Only authorized users can access the panel.
        </p>

        <Link
          href="/"
          className="mt-8 flex items-center justify-center gap-2 text-text-secondary hover:text-accent text-sm transition-colors"
        >
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}

function UnauthorizedPage({ uid }: { uid: string }) {
  const { signOut, signInWithGitHub, signInWithGoogle } = useAuth();
  const [pending, setPending] = useState<"none" | "github" | "google" | "signout">("none");
  const [allowedFromDb, setAllowedFromDb] = useState<string[] | null>(null);
  const [configCheckError, setConfigCheckError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "config", "portfolio"));
        if (cancelled) return;
        if (!snap.exists()) {
          setAllowedFromDb([]);
          setConfigCheckError("No existe el documento config/portfolio en Firestore.");
          return;
        }
        const raw = snap.data()?.allowedAdmins;
        const list = Array.isArray(raw)
          ? raw.filter((x): x is string => typeof x === "string")
          : [];
        setAllowedFromDb(list);
        setConfigCheckError(null);
      } catch (e) {
        if (!cancelled) {
          setAllowedFromDb(null);
          setConfigCheckError(
            e instanceof Error ? e.message : "No se pudo leer Firestore."
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const uidIsListed =
    allowedFromDb !== null && allowedFromDb.includes(uid);

  const copyUid = () => {
    navigator.clipboard.writeText(uid);
  };

  const reloadAndRetry = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      setPending("signout");
      await signOut();
    } finally {
      setPending("none");
    }
  };

  const handleRetryGitHub = async () => {
    try {
      setPending("github");
      await signOut();
      await signInWithGitHub();
    } finally {
      setPending("none");
    }
  };

  const handleRetryGoogle = async () => {
    try {
      setPending("google");
      await signOut();
      await signInWithGoogle();
    } finally {
      setPending("none");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⛔</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-rose mb-4">
          Unauthorized
        </h1>
        <p className="text-text-secondary mb-6 leading-relaxed">
          Your account does not have admin permissions. Add your UID to the{" "}
          <code className="text-xs bg-bg-hover px-1.5 py-0.5 rounded">config/portfolio</code>{" "}
          document in Firestore, in the <code className="text-xs bg-bg-hover px-1.5 py-0.5 rounded">allowedAdmins</code> field.
        </p>
        <div className="mb-8 p-4 bg-bg-hover border border-border rounded-lg text-left">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Your UID (copy it):</p>
          <div className="flex items-center gap-2">
            <code className="text-sm text-accent break-all flex-1">{uid}</code>
            <button
              type="button"
              onClick={copyUid}
              className="shrink-0 px-3 py-1.5 bg-accent text-bg rounded text-sm font-medium hover:opacity-90"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mb-6 p-4 border border-border rounded-lg text-left space-y-3">
          <p className="text-xs text-text-muted uppercase tracking-wider">
            Check vs Firestore (read-only)
          </p>
          {configCheckError && (
            <p className="text-sm text-rose">{configCheckError}</p>
          )}
          {allowedFromDb !== null && !configCheckError && (
            <>
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">
                  Your UID is in allowedAdmins:
                </span>{" "}
                {uidIsListed ? (
                  <span className="text-green font-medium">Yes</span>
                ) : (
                  <span className="text-rose font-medium">
                    No — likely a different account or outdated list
                  </span>
                )}
              </p>
              <div>
                <p className="text-xs text-text-muted mb-1">
                  UIDs currently stored in allowedAdmins ({allowedFromDb.length}):
                </p>
                {allowedFromDb.length === 0 ? (
                  <p className="text-sm text-rose">Array is empty — add at least one UID.</p>
                ) : (
                  <ul className="text-xs font-mono text-text-secondary space-y-1 break-all">
                    {allowedFromDb.map((u) => (
                      <li key={u}>
                        {u}
                        {u === uid ? (
                          <span className="text-green ml-2">← matches session</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          {allowedFromDb === null && !configCheckError && (
            <p className="text-sm text-text-muted">Loading Firestore…</p>
          )}
        </div>

        <p className="text-text-muted text-sm mb-6">
          In Firebase Console → Firestore → config → portfolio → allowedAdmins (array) → add this UID.
        </p>
        <div className="mb-6 grid gap-3">
          <button
            type="button"
            onClick={reloadAndRetry}
            className="w-full px-4 py-2.5 border border-border rounded-lg text-text-primary hover:border-accent transition-colors"
          >
            Retry access
          </button>
          <button
            type="button"
            onClick={handleRetryGitHub}
            disabled={pending !== "none"}
            className="w-full px-4 py-2.5 border border-border rounded-lg text-text-primary hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending === "github" ? "Retrying with GitHub..." : "Retry sign in with GitHub"}
          </button>
          <button
            type="button"
            onClick={handleRetryGoogle}
            disabled={pending !== "none"}
            className="w-full px-4 py-2.5 border border-border rounded-lg text-text-primary hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending === "google" ? "Retrying with Google..." : "Retry sign in with Google"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={pending !== "none"}
            className="w-full px-4 py-2.5 border border-rose/40 text-rose rounded-lg hover:bg-rose/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending === "signout" ? "Signing out..." : "Sign out"}
          </button>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-full font-medium hover:shadow-[0_6px_24px_rgba(232,197,71,0.3)] transition-all"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdminUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!isAdminUser && user) {
    return <UnauthorizedPage uid={user.uid} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 w-full overflow-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 xl:py-9">
        {children}
      </main>
    </div>
  );
}
