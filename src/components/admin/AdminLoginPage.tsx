"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const MOTIVATION_LINES = [
  "Small steps, shipped daily.",
  "Craft beats noise. Every time.",
  "Your portfolio is your product — own it.",
];

const BACKDROP_ICONS: Array<{
  cls: string;
  className: string;
  style?: CSSProperties;
}> = [
  { cls: "fa-brands fa-react", className: "admin-login-float top-[6%] left-[4%] text-[2.75rem] text-cyan-400/15 -rotate-12" },
  { cls: "fa-brands fa-react", className: "admin-login-float top-[18%] right-[8%] text-[2rem] text-cyan-400/10 rotate-[18deg]", style: { animationDelay: "1.2s" } },
  { cls: "fa-brands fa-github", className: "admin-login-float bottom-[22%] left-[10%] text-[2.25rem] text-white/10 -rotate-6", style: { animationDelay: "0.4s" } },
  { cls: "fa-solid fa-code", className: "admin-login-float top-[42%] left-[3%] text-[1.75rem] text-sky-400/12 rotate-12", style: { animationDelay: "2s" } },
  { cls: "fa-brands fa-react", className: "admin-login-float top-[30%] right-[4%] text-[2.5rem] text-yellow-300/10 rotate-[-8deg]", style: { animationDelay: "0.8s" } },
  { cls: "fa-brands fa-react", className: "admin-login-float bottom-[8%] right-[12%] text-[3rem] text-cyan-400/12 rotate-[10deg]", style: { animationDelay: "1.6s" } },
  { cls: "fa-solid fa-terminal", className: "admin-login-float top-[58%] right-[18%] text-[1.5rem] text-emerald-400/10 rotate-3", style: { animationDelay: "2.4s" } },
  { cls: "fa-brands fa-github", className: "admin-login-float bottom-[38%] right-[6%] text-[1.35rem] text-white/8 rotate-[-14deg]", style: { animationDelay: "1s" } },
  { cls: "fa-brands fa-react", className: "admin-login-float bottom-[14%] left-[22%] text-[1.65rem] text-cyan-400/10 rotate-[22deg]", style: { animationDelay: "1.8s" } },
  { cls: "fa-solid fa-code", className: "admin-login-float top-[12%] left-[38%] text-[1.25rem] text-sky-300/10 -rotate-[20deg]", style: { animationDelay: "0.2s" } },
];

export function AdminLoginPage() {
  const { signInWithGitHub } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06080c] text-white">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[min(92vw,720px)] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.18), transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full blur-[90px] opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {BACKDROP_ICONS.map((item, i) => (
          <i
            key={i}
            className={`${item.cls} absolute ${item.className}`}
            style={item.style}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16 sm:px-8">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-cyan-200/50 transition-colors hover:text-cyan-200/90"
          >
            <i className="fa-brands fa-react text-lg text-cyan-400/80" aria-hidden />
            PORTARTS STUDIO
          </Link>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
            Welcome back,{" "}
            <span className="bg-linear-to-r from-cyan-200 via-white to-sky-200 bg-clip-text text-transparent">
              builder.
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Sign in to shape your portfolio — the same care you put into your
            interfaces, now behind the scenes.
          </p>
        </div>

        <blockquote className="mb-12 border-l-2 border-cyan-500/40 pl-5 text-left">
          <p className="font-display text-lg italic leading-snug text-slate-200">
            &ldquo;The details are not the details. They make the design.&rdquo;
          </p>
          <footer className="mt-3 text-xs font-medium uppercase tracking-widest text-slate-500">
            — Charles Eames
          </footer>
        </blockquote>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-lg sm:p-8">
          <p className="mb-6 text-center text-sm font-medium text-slate-300">
            One tap. No friction.
          </p>

          <button
            type="button"
            onClick={() => signInWithGitHub()}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#2d333b] to-[#1c2128] px-6 py-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-[0_16px_48px_rgba(34,211,238,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 active:scale-[0.99]"
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
              }}
            />
            <span className="relative flex items-center justify-between gap-4">
              <span className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-base font-semibold tracking-tight text-white">
                    Continue with GitHub
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-400">
                    Where your repos already live
                  </span>
                </span>
              </span>
              <span className="text-xl text-cyan-300/90 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>

          <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6">
            {MOTIVATION_LINES.map((line) => (
              <li
                key={line}
                className="text-center text-xs text-slate-500 sm:text-left"
              >
                <span className="text-cyan-500/80">✦</span> {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-slate-500">
          Only authorized accounts can access the panel. If you&apos;re
          stuck, check{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-slate-400">
            allowedAdmins
          </code>{" "}
          in Firestore.
        </p>

        <Link
          href="/"
          className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300/90"
        >
          <span aria-hidden>←</span> Back to portfolio
        </Link>
      </div>
    </div>
  );
}
