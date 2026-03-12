"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-bg-raised p-4 flex flex-col">
      <nav className="flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-accent-dim border border-accent/20 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-rose hover:bg-bg-hover transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </aside>
  );
}
