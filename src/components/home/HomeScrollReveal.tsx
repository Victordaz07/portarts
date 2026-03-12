"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function HomeScrollReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  useScrollReveal(".reveal");
  return <>{children}</>;
}
