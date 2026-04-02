import type { PortfolioConfig } from "@/lib/types";

export const DEFAULT_MINI_BIO_HEADLINE =
  "From running warehouse operations to shipping production apps.";

export const DEFAULT_MINI_BIO_BODY =
  "9+ years managing teams and systems taught me that good software isn't about code — it's about solving the right problem. I bring that ops mindset to every interface I build.";

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
