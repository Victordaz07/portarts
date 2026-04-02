/** Shared defaults for Hero + admin preview (keep in sync). */

export const DEFAULT_HERO_HEADLINE =
  "Frontend Developer building products people actually use";

export const DEFAULT_HERO_SUBTITLE =
  "9+ years in operations and logistics taught me how real systems fail. Now I build the interfaces that make them work.";

const LEGACY_SUBTITLES = new Set([
  "",
  "Designing and developing useful digital products focused on structure, simplicity, and real-world impact.",
  "Full-stack developer building products that combine impeccable design with solid architecture.",
  "Building real products for real problems.",
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
