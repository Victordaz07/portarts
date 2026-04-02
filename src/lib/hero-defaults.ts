/** Shared defaults for Hero + admin preview (keep in sync). */

export const DEFAULT_HERO_HEADLINE =
  "Frontend Developer building products people actually use";

/** Primer vistazo: Agile + Git + experiencia operativa, en una línea escaneable. */
export const DEFAULT_HERO_SUBTITLE =
  "Agile delivery, Git-first version control, and UIs shipped to production — grounded in 9+ years running real operations.";

const LEGACY_SUBTITLES = new Set([
  "",
  "Designing and developing useful digital products focused on structure, simplicity, and real-world impact.",
  "Full-stack developer building products that combine impeccable design with solid architecture.",
  "Building real products for real problems.",
  "9+ years in operations and logistics taught me how real systems fail. Now I build the interfaces that make them work.",
]);

export function resolveHeroSubtitle(configSubtitle: string | undefined): string {
  const t = configSubtitle?.trim() ?? "";
  if (!t || LEGACY_SUBTITLES.has(t)) return DEFAULT_HERO_SUBTITLE;
  return t;
}

export function resolveHeroHeadline(configHeadline: string | undefined): string {
  const h = configHeadline?.trim() ?? "";
  return h || DEFAULT_HERO_HEADLINE;
}
