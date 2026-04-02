import type { PortfolioConfig } from "@/lib/types";
import { resolveIntroStatement } from "@/lib/intro-statement-defaults";

interface IntroStatementBlockProps {
  config: PortfolioConfig | null;
  className?: string;
}

/** Párrafo en primera persona bajo el intro + AI pills — no es una cita ni lleva firma. */
export function IntroStatementBlock({
  config,
  className = "",
}: IntroStatementBlockProps) {
  const text = resolveIntroStatement(config);
  if (!text) return null;

  return (
    <div
      className={`mt-8 max-w-xl border-l-2 border-border pl-4 sm:mt-9 sm:pl-5 ${className}`}
      data-analytics-section="intro-statement"
    >
      <p className="text-[13px] leading-[1.65] text-text-secondary sm:text-[0.9375rem]">
        {text}
      </p>
    </div>
  );
}
