import type { PortfolioConfig } from "@/lib/types";

/**
 * Texto bajo las píldoras AI: primera persona (tú hablando), no cita de un tercero.
 * Campo Firestore: `introTestimonial.quote` (histórico) — es el cuerpo del párrafo.
 */
export const DEFAULT_INTRO_STATEMENT =
  "I own customer-facing UI from backlog to production — scoped work, collaborative review, and releases I stand behind. I use AI to support refactors and technical writing; Git, tests, and design review stay non-negotiable. That’s my bar when the goal is production, not demos.";

export function resolveIntroStatement(config: PortfolioConfig | null): string | null {
  const t = config?.introTestimonial;
  if (t?.enabled === false) return null;

  const body = t?.quote?.trim();
  if (body) return body;

  return DEFAULT_INTRO_STATEMENT;
}
