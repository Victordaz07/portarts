import Link from "next/link";
import type { PortfolioConfig } from "@/lib/types";

interface HeroProps {
  config: PortfolioConfig | null;
}

export function Hero({ config }: HeroProps) {
  const subtitle = config?.subtitle ?? "Full-stack developer building products that combine impeccable design with solid architecture.";
  const stats = (config?.stats?.slice(0, 4) ?? []).length > 0
    ? (config?.stats?.slice(0, 4) ?? [])
    : [
        { value: "15+", label: "Projects launched" },
        { value: "6+", label: "Years building" },
        { value: "99%", label: "Client satisfaction" },
        { value: "24h", label: "Avg response time" },
      ];

  return (
    <section className="bg-white pt-0 pb-10 md:pb-14">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-dim border border-[#d7e8ff] rounded-full text-accent text-sm font-medium w-fit mb-6">
        <span
          className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse-dot"
          aria-hidden
        />
        Available for projects
      </div>
      <h1 className="font-body text-[48px] md:text-[72px] font-bold leading-[0.95] tracking-tight mb-5 text-black">
        <span className="block">Creating</span>
        <span className="block text-accent">digital</span>
        <span className="block">experiences</span>
      </h1>
      <p className="text-text-secondary text-lg md:text-xl max-w-[620px] leading-relaxed">
        {subtitle}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/#projects"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition-opacity"
        >
          View my work
        </Link>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-black bg-white text-black font-medium hover:bg-bg-hover transition-colors"
        >
          Let&apos;s talk
        </Link>
      </div>
      <div className="mt-10 border border-border rounded-xl overflow-x-auto bg-white">
        <div className="min-w-[760px] grid grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className={`px-5 py-4 ${index < stats.length - 1 ? "border-r border-border" : ""}`}
            >
            <div className="text-2xl md:text-3xl font-bold text-black">{stat.value}</div>
            <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
