import type { PortfolioConfig } from "@/lib/types";

interface HeroProps {
  config: PortfolioConfig | null;
}

export function Hero({ config }: HeroProps) {
  const subtitle = config?.subtitle ?? "Full-stack developer building products that combine impeccable design with solid architecture.";

  return (
    <section className="min-h-screen flex flex-col justify-center">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-full text-text-secondary text-sm w-fit mb-6">
        <span
          className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"
          aria-hidden
        />
        Available for projects
      </div>
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal leading-[0.96] tracking-tight mb-5">
        Creating
        <br />
        <em className="text-accent not-italic">digital</em>
        <br />
        <span className="[-webkit-text-stroke:1.2px] [-webkit-text-fill-color:transparent] text-text-primary">
          experiences
        </span>
      </h1>
      <p className="text-text-secondary text-base md:text-lg max-w-[460px] leading-relaxed font-light">
        {subtitle}
      </p>
    </section>
  );
}
