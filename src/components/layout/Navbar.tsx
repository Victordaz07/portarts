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
      className={`fixed top-0 left-0 right-0 z-200 flex justify-between items-center
        px-4 md:px-12 py-4
        backdrop-blur-[10px] bg-white/90
        border-b border-border
        transition-all duration-400 ease-smooth
        ${compact ? "py-3 bg-white/95" : ""}`}
    >
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <span className="text-xl md:text-2xl font-bold text-black tracking-tight">Victor Ruiz</span>
      </Link>

      <button
        type="button"
        className="md:hidden p-2 text-black"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <div
        className={`items-center gap-6 ${
          mobileOpen
            ? "flex flex-col absolute top-full left-0 right-0 py-5 px-5 bg-white border-b border-border"
            : "hidden md:flex"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-text-secondary hover:text-black text-sm font-medium transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium border border-black hover:opacity-90 transition-all"
          onClick={() => setMobileOpen(false)}
        >
          Let&apos;s talk
        </Link>
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
      </div>
    </nav>
  );
}
