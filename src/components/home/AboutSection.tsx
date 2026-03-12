import type { PortfolioConfig } from "@/lib/types";

interface AboutSectionProps {
  config: PortfolioConfig | null;
}

export function AboutSection({ config }: AboutSectionProps) {
  const about = config?.about ?? [];
  const stats = config?.stats ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div>
        {about.map((paragraph, i) => (
          <p
            key={i}
            className="text-text-secondary leading-relaxed font-light mb-4"
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 bg-surface border border-border rounded-card"
          >
            <div className="font-display text-3xl bg-gradient-to-br from-text-primary to-accent bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
