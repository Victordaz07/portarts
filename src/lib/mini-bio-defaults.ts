import type { PortfolioConfig } from "@/lib/types";

export const DEFAULT_MINI_BIO_HEADLINE =
  "From warehouse ops to shipping production apps.";

/** Agile = valor iterativo, colaboración y adaptación — no “entrega rápida”. Alineado con el hero. */
export const DEFAULT_MINI_BIO_BODY =
  "I work with an Agile mindset: clear priorities, tight feedback loops with stakeholders, and adjusting the plan when we learn more — not chasing a fixed spec. Git is the source of truth — branches, reviews, releases. I build interfaces that solve the problem, not demos.";

export function resolveMiniBio(config: PortfolioConfig | null): {
  headline: string;
  body: string;
} {
  const h = config?.miniBio?.headline?.trim();
  const b = config?.miniBio?.body?.trim();
  return {
    headline: h || DEFAULT_MINI_BIO_HEADLINE,
    body: b || DEFAULT_MINI_BIO_BODY,
  };
}
