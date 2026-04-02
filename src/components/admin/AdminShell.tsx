"use client";

import type { CSSProperties, ReactNode } from "react";

const BACKDROP_ICONS: Array<{
  cls: string;
  className: string;
  style?: CSSProperties;
}> = [
  { cls: "fa-brands fa-react", className: "admin-login-float top-[4%] left-[3%] text-[2rem] text-cyan-400/12 -rotate-12" },
  { cls: "fa-brands fa-github", className: "admin-login-float bottom-[18%] left-[6%] text-[1.75rem] text-white/8 -rotate-6", style: { animationDelay: "0.5s" } },
  { cls: "fa-solid fa-code", className: "admin-login-float top-[35%] right-[4%] text-[1.5rem] text-sky-400/10 rotate-12", style: { animationDelay: "1.2s" } },
  { cls: "fa-brands fa-react", className: "admin-login-float bottom-[8%] right-[10%] text-[2.25rem] text-cyan-400/10 rotate-[8deg]", style: { animationDelay: "0.9s" } },
];

/**
 * Fondo oscuro compartido con AdminLoginPage (sin tocar el body global del portfolio).
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-page-bg relative min-h-screen w-full overflow-hidden bg-[#06080c] text-slate-100">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[min(92vw,720px)] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.14), transparent 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full blur-[90px] opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
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
      <div className="relative z-10 flex min-h-screen w-full flex-col md:flex-row">{children}</div>
    </div>
  );
}
