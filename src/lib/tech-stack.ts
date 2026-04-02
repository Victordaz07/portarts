import type { PortfolioConfig } from "@/lib/types";

/** Carril 1 — solo frontend / producto (sin herramientas de AI workflow). */
export const FALLBACK_FRONTEND_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Firebase",
  "Figma",
  "Framer Motion",
] as const;

/** Carril 2 — AI workflow (IDE / modelos). */
export const FALLBACK_AI_WORKFLOW = [
  "Cursor",
  "Claude",
  "GPT",
  "Gemini",
] as const;

/** Segundos por ciclo del marquee del stack dev (`animation: marquee Xs`). */
export const MARQUEE_DURATION_FRONTEND_SEC = 25;

const AI_TICKER_NORMALIZED = new Set(
  (["Cursor", "Claude", "GPT", "Gemini", "ChatGPT"] as const).map((t) =>
    t.toLowerCase(),
  ),
);

function isAiWorkflowToken(raw: string): boolean {
  const n = raw.trim().toLowerCase();
  if (AI_TICKER_NORMALIZED.has(n)) return true;
  if (n === "openai gpt") return true;
  return false;
}

function displayAiToken(raw: string): string {
  const n = raw.trim().toLowerCase();
  if (n === "chatgpt") return "GPT";
  return raw.trim();
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

function normalizeStringArray(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  const out = raw.filter(
    (t): t is string => typeof t === "string" && t.trim().length > 0,
  );
  return out.length > 0 ? out.map((t) => t.trim()) : null;
}

/** Carril "Frontend Stack" para el hero. */
export function resolveFrontendStackItems(
  config: PortfolioConfig | null,
): string[] {
  const fromTech = normalizeStringArray(config?.techStack);
  if (!fromTech) return [...FALLBACK_FRONTEND_STACK];

  if (fromTech.some(isLegacyTickerToken)) {
    return [...FALLBACK_FRONTEND_STACK];
  }

  const withoutAi = fromTech.filter((t) => !isAiWorkflowToken(t));
  if (withoutAi.length > 0) return withoutAi;

  return [...FALLBACK_FRONTEND_STACK];
}

function sortAiWorkflowOrder(items: string[]): string[] {
  const rank = (raw: string): number => {
    const n = raw.trim().toLowerCase();
    if (n === "chatgpt" || n === "gpt") return 2;
    const order = ["cursor", "claude", "gpt", "gemini"];
    const i = order.indexOf(n);
    return i === -1 ? 50 + n.charCodeAt(0) : i;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

/** Carril "AI Workflow" para el hero. Si `aiTools` en Firestore omite GPT, se añade el label canónico. */
export function resolveAiWorkflowItems(
  config: PortfolioConfig | null,
): string[] {
  const fromAiField = normalizeStringArray(config?.aiTools);
  if (fromAiField && fromAiField.length > 0) {
    let mapped = fromAiField.map(displayAiToken);
    const hasGpt = mapped.some(
      (t) => /^gpt$/i.test(t.trim()) || /^chatgpt$/i.test(t.trim()),
    );
    if (!hasGpt) {
      mapped = [...mapped, "GPT"];
    }
    return sortAiWorkflowOrder(mapped);
  }

  const fromTech = normalizeStringArray(config?.techStack);
  if (fromTech && !fromTech.some(isLegacyTickerToken)) {
    const extracted = fromTech
      .filter(isAiWorkflowToken)
      .map(displayAiToken);
    if (extracted.length > 0) return sortAiWorkflowOrder(extracted);
  }

  return [...FALLBACK_AI_WORKFLOW];
}

/** Lista combinada (p. ej. vista previa compacta). */
export function resolveTechStackItems(
  config: PortfolioConfig | null,
): string[] {
  return [
    ...resolveFrontendStackItems(config),
    ...resolveAiWorkflowItems(config),
  ];
}
