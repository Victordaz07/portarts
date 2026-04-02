import type { PortfolioConfig } from "@/lib/types";

/** Canonical homepage ticker — frontend stack + AI workflow tools (HeroTechMarquee loop). */
export const FALLBACK_TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Firebase",
  "Figma",
  "Framer Motion",
  "Cursor",
  "Claude",
  "GPT",
  "Gemini",
] as const;

const AI_TICKER_TOOLS = ["Cursor", "Claude", "GPT", "Gemini"] as const;

function ensureAiTickerTools(items: string[]): string[] {
  const seen = new Set(items.map((t) => t.trim().toLowerCase()));
  const out = [...items];
  for (const tool of AI_TICKER_TOOLS) {
    const key = tool.toLowerCase();
    if (!seen.has(key)) {
      out.push(tool);
      seen.add(key);
    }
  }
  return out;
}

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
    if (!hasLegacy) return ensureAiTickerTools(fromConfig);
  }
  return [...FALLBACK_TECH_STACK];
}
