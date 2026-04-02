import type { PortfolioConfig } from "@/lib/types";

export const DEFAULT_MINI_BIO_HEADLINE =
  "From warehouse ops to shipping production apps.";

/** Directo: Agile, Git, entrega — alineado con el subtítulo del hero. */
export const DEFAULT_MINI_BIO_BODY =
  "I run work in Agile: short sprints, clear backlog, PRs you can review fast. Git is the source of truth — branches, reviews, releases. I build interfaces that solve the problem, not demos.";

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
