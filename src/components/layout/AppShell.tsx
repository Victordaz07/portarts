"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Admin usa todo el ancho (sin tope 1240px ni navbar del sitio).
 * El portfolio público mantiene el contenedor centrado y el pie.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <div className="min-h-screen bg-bg">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <main className="pt-20 pb-8">{children}</main>
        <Footer name="Victor Ruiz" />
      </div>
    </>
  );
}
