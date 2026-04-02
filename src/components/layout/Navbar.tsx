"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, isAdminUser } = useAuth();
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-200 flex justify-between items-center
        px-4 md:px-12 py-4
        backdrop-blur-[10px] bg-white/90
        border-b border-border
        transition-all duration-400 ease-smooth
        ${compact ? "py-3 bg-white/95" : ""}`}
    >
      <div className="flex items-center gap-1 sm:gap-1.5">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-black tracking-tight hover:opacity-80 transition-opacity"
        >
          Victor Ruiz
        </Link>
        <Link
          href="/admin"
          className="group/icon inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-black/4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 sm:min-h-0 sm:min-w-0 sm:p-1"
          aria-label={user ? "Open admin workspace" : "Workspace — sign in"}
          title={user ? "Admin" : "Workspace"}
        >
          <i
            className="fa-brands fa-react shrink-0 text-[1.125rem] leading-none opacity-55 transition-[opacity,color] group-hover/icon:opacity-100 sm:text-xl"
            aria-hidden
          />
        </Link>
      </div>

      <button
        type="button"
        className="md:hidden p-2 text-black"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <div
        className={`items-center gap-5 md:gap-6 ${
          mobileOpen
            ? "flex flex-col absolute top-full left-0 right-0 py-5 px-5 bg-white border-b border-border"
            : "hidden md:flex"
        }`}
      >
        <div className="flex flex-col items-start shrink-0">
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-bg px-2 py-1 text-xs sm:gap-2 sm:px-3 sm:py-1.5 sm:text-sm"
            aria-label="Available for work — Frontend Developer"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-text-primary font-medium">Available</span>
            <span className="text-text-secondary">·</span>
            <span className="whitespace-nowrap text-text-secondary">
              Frontend Developer
            </span>
          </span>
          <p className="text-xs text-text-secondary tracking-wide mt-1 max-w-[min(100%,280px)] leading-snug">
            Agile workflow
            <span className="mx-1.5 opacity-40">·</span>
            Cursor
            <span className="mx-1.5 opacity-40">·</span>
            Claude
            <span className="mx-1.5 opacity-40">·</span>
            GPT
            <span className="mx-1.5 opacity-40">·</span>
            Gemini
          </p>
        </div>
        <Link
          href="/#projects"
          className="text-text-secondary hover:text-black text-sm font-medium transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          Projects
        </Link>
        <Link
          href="/#github"
          className="text-text-secondary hover:text-black text-sm font-medium transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          GitHub
        </Link>
        <Link
          href="/#about"
          className="text-text-secondary hover:text-black text-sm font-medium transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          About me
        </Link>
        <Link
          href="/#contact"
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium border border-black hover:opacity-90 transition-all"
          onClick={() => setMobileOpen(false)}
        >
          Let&apos;s talk
        </Link>
        {user ? (
          <Link
            href="/admin"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border border-black ${
              isAdminUser
                ? "text-black bg-bg-hover"
                : "text-black bg-transparent hover:bg-bg-hover"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
