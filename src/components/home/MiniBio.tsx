import type { PortfolioConfig } from "@/lib/types";
import { resolveMiniBio } from "@/lib/mini-bio-defaults";

interface MiniBioProps {
  config: PortfolioConfig | null;
}

export function MiniBio({ config }: MiniBioProps) {
  const { headline, body } = resolveMiniBio(config);

  return (
    <section className="py-12 border-y border-border/50 bg-white" data-analytics-section="intro">
      <div className="max-w-2xl mx-auto px-4 md:px-6 min-w-[320px]">
        <p className="text-lg font-medium text-text-primary leading-snug mb-3">
          {headline}
        </p>
        <p className="text-base text-text-secondary leading-relaxed">
          {body}{" "}
          <a
            href="#about"
            className="text-text-primary underline-offset-4 hover:underline transition-colors"
          >
            More about me →
          </a>
        </p>
      </div>
    </section>
  );
}
