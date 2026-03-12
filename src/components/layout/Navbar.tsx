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

  const links = [
    { href: "/#projects", label: "Projects" },
    { href: "/#github", label: "GitHub" },
    { href: "/#about", label: "About me" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] flex justify-between items-center
        px-4 md:px-12 py-4
        backdrop-blur-[24px] saturate-[180%] bg-[rgba(6,6,8,0.6)]
        border-b border-border
        transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${compact ? "py-2.5 bg-[rgba(6,6,8,0.88)]" : ""}`}
    >
      <Link
        href="/"
        className="font-display text-2xl text-text-primary hover:text-accent transition-colors"
      >
        V<span className="text-accent">.</span>
      </Link>

      <button
        type="button"
        className="md:hidden p-2 text-text-primary"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <div
        className={`
          hidden md:flex items-center gap-6
          ${mobileOpen ? "flex flex-col absolute top-full left-0 right-0 py-5 px-5 bg-[rgba(6,6,8,0.95)] border-b border-border backdrop-blur-[24px]" : ""}
        `}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-text-secondary hover:text-text-primary text-sm font-medium uppercase tracking-wider transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="px-5 py-2 border border-border rounded-full text-text-primary text-sm font-medium hover:bg-accent hover:text-bg hover:border-accent transition-all"
          onClick={() => setMobileOpen(false)}
        >
          Let&apos;s talk
        </Link>
        <Link
          href="/admin"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            isAdminUser
              ? "bg-accent/20 border border-accent/30 text-accent hover:bg-accent hover:text-bg"
              : "border border-border text-text-secondary hover:text-accent hover:border-accent"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          {isAdminUser ? "Admin" : "Sign in"}
        </Link>
      </div>
    </nav>
  );
}
