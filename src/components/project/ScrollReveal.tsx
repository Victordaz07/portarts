"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  useScrollReveal(".reveal");
  return <>{children}</>;
}
