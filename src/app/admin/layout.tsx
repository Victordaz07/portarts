"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminLoginPage } from "@/components/admin/AdminLoginPage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function UnauthorizedPage({ uid }: { uid: string }) {
  const { signOut, signInWithGitHub } = useAuth();
  const [pending, setPending] = useState<"none" | "github" | "signout">("none");
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

  return (
    <div className="admin-page-bg relative min-h-screen overflow-hidden bg-[#06080c] text-slate-100">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-6 ring-1 ring-rose-500/30">
            <span className="text-3xl">⛔</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-rose-300 mb-4">
            Unauthorized
          </h1>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Your account does not have admin permissions. Add your UID to the{" "}
            <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-slate-200">config/portfolio</code>{" "}
            document in Firestore, in the <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-slate-200">allowedAdmins</code> field.
          </p>
          <div className="mb-8 p-4 bg-white/[0.04] border border-white/10 rounded-xl text-left backdrop-blur-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Your UID (copy it):</p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-cyan-300/90 break-all flex-1">{uid}</code>
              <button
                type="button"
                onClick={copyUid}
                className="shrink-0 px-3 py-1.5 bg-cyan-500/20 text-cyan-200 rounded-lg text-sm font-medium hover:bg-cyan-500/30"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 border border-white/10 rounded-xl text-left space-y-3 bg-white/[0.02]">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Check vs Firestore (read-only)
            </p>
            {configCheckError && (
              <p className="text-sm text-rose-300">{configCheckError}</p>
            )}
            {allowedFromDb !== null && !configCheckError && (
              <>
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">
                    Your UID is in allowedAdmins:
                  </span>{" "}
                  {uidIsListed ? (
                    <span className="text-emerald-400 font-medium">Yes</span>
                  ) : (
                    <span className="text-rose-300 font-medium">
                      No — likely a different account or outdated list
                    </span>
                  )}
                </p>
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    UIDs currently stored in allowedAdmins ({allowedFromDb.length}):
                  </p>
                  {allowedFromDb.length === 0 ? (
                    <p className="text-sm text-rose-300">Array is empty — add at least one UID.</p>
                  ) : (
                    <ul className="text-xs font-mono text-slate-400 space-y-1 break-all">
                      {allowedFromDb.map((u) => (
                        <li key={u}>
                          {u}
                          {u === uid ? (
                            <span className="text-emerald-400 ml-2">← matches session</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
            {allowedFromDb === null && !configCheckError && (
              <p className="text-sm text-slate-500">Loading Firestore…</p>
            )}
          </div>

          <p className="text-slate-500 text-sm mb-6">
            In Firebase Console → Firestore → config → portfolio → allowedAdmins (array) → add this UID.
          </p>
          <div className="mb-6 grid gap-3">
            <button
              type="button"
              onClick={reloadAndRetry}
              className="w-full px-4 py-2.5 border border-white/15 rounded-xl text-slate-100 hover:border-cyan-500/40 hover:bg-white/5 transition-colors"
            >
              Retry access
            </button>
            <button
              type="button"
              onClick={handleRetryGitHub}
              disabled={pending !== "none"}
              className="w-full px-4 py-2.5 border border-white/15 rounded-xl text-slate-100 hover:border-cyan-500/40 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending === "github" ? "Retrying with GitHub..." : "Retry sign in with GitHub"}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={pending !== "none"}
              className="w-full px-4 py-2.5 border border-rose-500/35 text-rose-200 rounded-xl hover:bg-rose-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending === "signout" ? "Signing out..." : "Sign out"}
            </button>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 text-cyan-100 rounded-full font-medium border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
          >
            ← Back to home
          </Link>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-[#06080c]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage />;
  }

  if (!isAdminUser && user) {
    return <UnauthorizedPage uid={user.uid} />;
  }

  return (
    <AdminShell>
      <AdminSidebar />
      <main
        className="flex-1 min-w-0 w-full overflow-auto px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 xl:py-9 text-slate-100 [--color-text-primary:#f8fafc] [--color-text-secondary:#94a3b8] [--color-text-muted:#64748b] [--color-border:rgba(255,255,255,0.12)] [--color-bg-hover:rgba(255,255,255,0.06)]"
      >
        {children}
      </main>
    </AdminShell>
  );
}
