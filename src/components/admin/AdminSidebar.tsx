"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "portarts-admin-sidebar-collapsed";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        startTransition(() => setCollapsed(true));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <aside
      className={`flex shrink-0 border-border bg-bg-raised transition-[width] duration-200 ease-out
        flex-row w-full border-b p-3 sm:p-4 gap-2
        md:flex-col md:border-b-0 md:border-r md:py-3 md:px-2
        ${collapsed ? "md:w-17 md:px-1.5" : "md:w-56 md:px-3"}`}
    >
      <div
        className={`hidden md:flex items-center shrink-0 gap-1 mb-2
          ${collapsed ? "flex-col w-full" : "flex-row justify-between w-full"}`}
      >
        <Link
          href="/"
          title="Ver portfolio"
          className={`flex items-center gap-2 rounded-lg text-xs text-text-muted hover:text-accent transition-colors
            ${collapsed ? "justify-center p-2.5 w-full hover:bg-bg-hover" : "px-2 py-1.5 flex-1 min-w-0"}`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <span className={collapsed ? "sr-only" : "truncate"}>Ver portfolio</span>
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? "Expandir menú" : "Minimizar menú"}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expandir menú lateral" : "Minimizar menú lateral"}
          className="flex items-center justify-center rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex flex-1 flex-row md:flex-col gap-1 min-w-0 overflow-x-auto md:overflow-y-auto md:overflow-x-visible [-webkit-overflow-scrolling:touch] md:pb-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`flex items-center gap-2 rounded-lg whitespace-nowrap shrink-0 md:shrink-0 transition-colors
                px-3 py-2 md:mb-0.5
                ${collapsed ? "md:justify-center md:px-2" : ""}
                ${
                  isActive
                    ? "bg-accent-dim border border-accent/20 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-transparent"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className={collapsed ? "md:sr-only" : ""}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => signOut()}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-rose hover:bg-bg-hover transition-colors shrink-0
          ${collapsed ? "md:justify-center md:px-2" : ""}`}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span
          className={
            collapsed
              ? "max-md:hidden md:sr-only"
              : "hidden sm:inline"
          }
        >
          Sign out
        </span>
      </button>
    </aside>
  );
}
