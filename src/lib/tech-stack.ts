import type { PortfolioConfig } from "@/lib/types";

/** Canonical homepage ticker — single source of truth when config is empty or legacy. */
export const FALLBACK_TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Firebase",
  "Figma",
  "Framer Motion",
] as const;

const LEGACY_TICKER_NORMALIZED = new Set(
  [
    "supabase",
    "prisma",
    "postgresql",
    "postgres",
    "node.js",
    "nodejs",
    "node",
    "react native",
    "stripe",
  ].map((s) => s.toLowerCase()),
);

function isLegacyTickerToken(raw: string): boolean {
  const n = raw.trim().toLowerCase();
  return LEGACY_TICKER_NORMALIZED.has(n);
}

export function resolveTechStackItems(
  config: PortfolioConfig | null,
): string[] {
  const fromConfig = config?.techStack?.filter(
    (t): t is string => typeof t === "string" && t.trim().length > 0,
  );
  if (fromConfig && fromConfig.length > 0) {
    const hasLegacy = fromConfig.some(isLegacyTickerToken);
    if (!hasLegacy) return fromConfig;
  }
  return [...FALLBACK_TECH_STACK];
}
