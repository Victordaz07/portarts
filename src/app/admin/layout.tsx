"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminLoginPage } from "@/components/admin/AdminLoginPage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { useState } from "react";

function UnauthorizedPage({ email }: { email: string | null }) {
  const { signOut, signInWithGitHub } = useAuth();
  const [pending, setPending] = useState<"none" | "github" | "signout">("none");

  const copyEmail = () => {
    if (email) navigator.clipboard.writeText(email);
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
            Your account does not have admin permissions. Add your email to the{" "}
            <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-slate-200">
              ADMIN_EMAILS
            </code>{" "}
            environment variable (comma-separated) on the server, then sign in
            again.
          </p>
          <div className="mb-8 p-4 bg-white/4 border border-white/10 rounded-xl text-left backdrop-blur-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Your email (copy it):
            </p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-cyan-300/90 break-all flex-1">
                {email ?? "unknown"}
              </code>
              <button
                type="button"
                onClick={copyEmail}
                className="shrink-0 px-3 py-1.5 bg-cyan-500/20 text-cyan-200 rounded-lg text-sm font-medium hover:bg-cyan-500/30"
              >
                Copy
              </button>
            </div>
          </div>

          <p className="text-slate-500 text-sm mb-6">
            On Vercel: Project → Settings → Environment Variables → add your email
            to{" "}
            <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded text-slate-200">
              ADMIN_EMAILS
            </code>
            , then redeploy.
          </p>
          <div className="mb-6 grid gap-3">
            <button
              type="button"
              onClick={handleRetryGitHub}
              disabled={pending !== "none"}
              className="w-full px-4 py-2.5 border border-white/15 rounded-xl text-slate-100 hover:border-cyan-500/40 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending === "github"
                ? "Retrying with GitHub..."
                : "Retry sign in with GitHub"}
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
    return <UnauthorizedPage email={user.email} />;
  }

  return (
    <AdminShell>
      <AdminSidebar />
      <main
        className={[
          "flex-1 min-w-0 w-full overflow-auto text-slate-100",
          "px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10 xl:py-9",
          // Tokens de color — modo oscuro del admin
          "[--color-bg:#111827]",
          "[--color-bg-raised:#161b26]",
          "[--color-bg-card:#0f1419]",
          "[--color-bg-hover:rgba(255,255,255,0.07)]",
          "[--color-border:rgba(255,255,255,0.12)]",
          "[--color-border-hover:rgba(255,255,255,0.25)]",
          "[--color-text-primary:#f8fafc]",
          "[--color-text-secondary:#94a3b8]",
          "[--color-text-muted:#64748b]",
          "[--color-accent:#22d3ee]",
          "[--color-accent-dim:rgba(34,211,238,0.12)]",
          "[--color-rose:#f87171]",
          "[--color-green:#4ade80]",
        ].join(" ")}
      >
        {children}
      </main>
    </AdminShell>
  );
}
