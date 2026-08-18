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
        backdrop-blur-[14px] bg-bg/80
        border-b border-border
        transition-all duration-400 ease-smooth
        ${compact ? "py-3 bg-bg/90" : ""}`}
    >
      <div className="flex items-center gap-2 sm:gap-2.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent font-mono text-sm font-bold text-black"
            aria-hidden
          >
            VR
          </span>
          <span className="text-lg md:text-xl font-semibold text-text-primary tracking-tight">
            Victor Ruiz
          </span>
        </Link>
        {user ? (
          <Link
            href="/admin"
            className="group/icon inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-white/6 hover:text-accent"
            aria-label="Open admin workspace"
            title="Admin"
          >
            <i
              className="fa-brands fa-react shrink-0 text-xl leading-none opacity-55 transition-[opacity,color] group-hover/icon:opacity-100"
              aria-hidden
            />
          </Link>
        ) : null}
      </div>

      <button
        type="button"
        className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center p-2 text-text-primary"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <div
        className={`items-center gap-5 md:gap-6 ${
          mobileOpen
            ? "flex flex-col absolute top-full left-0 right-0 py-5 px-5 bg-bg border-b border-border"
            : "hidden md:flex"
        }`}
      >
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
        <Link
          href="/#projects"
          className="inline-flex min-h-11 items-center text-text-secondary hover:text-accent text-sm font-medium transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          Projects
        </Link>
        <Link
          href="/#github"
          className="inline-flex min-h-11 items-center text-text-secondary hover:text-accent text-sm font-medium transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          GitHub
        </Link>
        <Link
          href="/#about"
          className="inline-flex min-h-11 items-center text-text-secondary hover:text-accent text-sm font-medium transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          About me
        </Link>
        <Link
          href="/#contact"
          className="inline-flex min-h-11 items-center px-4 py-2 rounded-full bg-accent text-[#080a0c] text-sm font-semibold border border-transparent hover:brightness-110 transition-all"
          style={{ color: "#080a0c" }}
          onClick={() => setMobileOpen(false)}
        >
          Let&apos;s talk
        </Link>
        {user ? (
          <Link
            href="/admin"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border border-border ${
              isAdminUser
                ? "text-text-primary bg-bg-hover"
                : "text-text-primary bg-transparent hover:bg-bg-hover"
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
