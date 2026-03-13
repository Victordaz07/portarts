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
            className="text-[#444444] leading-[1.8] mb-4"
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 bg-white border border-border rounded-[12px] transition-colors duration-300 hover:border-accent"
          >
            <div className="text-3xl font-bold text-black">
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary uppercase tracking-wider mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
