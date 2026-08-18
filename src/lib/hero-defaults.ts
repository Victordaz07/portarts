/** Shared defaults for Hero + admin preview (keep in sync). */

export const DEFAULT_HERO_HEADLINE =
  "Full-Stack Developer building products people actually use";

/** Primer vistazo: filosofía Agile (valor iterativo, colaboración, adaptación) + Git + producción. */
export const DEFAULT_HERO_SUBTITLE =
  "I turn real operational problems into production-ready web products with React, Next.js, and TypeScript.";

const LEGACY_SUBTITLES = new Set([
  "",
  "Designing and developing useful digital products focused on structure, simplicity, and real-world impact.",
  "Full-stack developer building products that combine impeccable design with solid architecture.",
  "Building real products for real problems.",
  "9+ years in operations and logistics taught me how real systems fail. Now I build the interfaces that make them work.",
  "Agile delivery, Git-first version control, and UIs shipped to production — grounded in 9+ years running real operations.",
  "Agile ways of working — iterative value, collaboration with stakeholders, and adapting when priorities shift — alongside Git-first version control and production UIs. Grounded in 9+ years running real operations.",
]);

const LEGACY_HEADLINES = new Set([
  "Frontend Developer building products people actually use",
]);

export function resolveHeroSubtitle(configSubtitle: string | undefined): string {
  const t = configSubtitle?.trim() ?? "";
  if (!t || LEGACY_SUBTITLES.has(t)) return DEFAULT_HERO_SUBTITLE;
  return t;
}

export function resolveHeroHeadline(configHeadline: string | undefined): string {
  const h = configHeadline?.trim() ?? "";
  return !h || LEGACY_HEADLINES.has(h) ? DEFAULT_HERO_HEADLINE : h;
}
