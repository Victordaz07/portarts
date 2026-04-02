import type { PortfolioConfig } from "@/lib/types";
import { resolveMiniBio } from "@/lib/mini-bio-defaults";

interface MiniBioIntroBlockProps {
  config: PortfolioConfig | null;
  className?: string;
}

/** Intro copy (headline + body + link) debajo de las métricas del hero. */
export function MiniBioIntroBlock({ config, className = "" }: MiniBioIntroBlockProps) {
  const { headline, body } = resolveMiniBio(config);

  return (
    <div className={className} data-analytics-section="intro">
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
  );
}
