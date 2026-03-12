"use client";

import type { PortfolioConfig } from "@/lib/types";

interface HomePreviewProps {
  config: PortfolioConfig | null;
}

export function HomePreview({ config }: HomePreviewProps) {
  if (!config) return null;
  const about = config.about ?? [];
  const stats = config.stats ?? [];

  return (
    <div className="text-[11px] leading-tight scale-[0.4] origin-top-left w-[250%] h-[250%] overflow-hidden pointer-events-none select-none">
      <div className="min-h-screen flex flex-col justify-center p-4">
        <div className="flex items-center gap-1 px-2 py-0.5 bg-surface border border-border rounded-full text-text-secondary w-fit mb-3">
          <span className="w-1 h-1 rounded-full bg-green animate-pulse" />
          Available for projects
        </div>
        <h1 className="font-display text-2xl font-normal leading-tight tracking-tight mb-2">
          Creating <em className="text-accent not-italic">digital</em>{" "}
          <span className="[-webkit-text-stroke:1px] [-webkit-text-fill-color:transparent]">
            experiences
          </span>
        </h1>
        <p className="text-text-secondary max-w-[200px] leading-snug font-light">
          {config.subtitle || "Full-stack developer…"}
        </p>
      </div>
      <div className="p-4 space-y-2">
        <h2 className="font-display text-lg">About me</h2>
        <div className="grid grid-cols-2 gap-2">
          {about.slice(0, 2).map((p, i) => (
            <p key={i} className="text-text-secondary text-[9px] line-clamp-2">
              {p || "…"}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {stats.slice(0, 4).map((s, i) => (
            <div key={i} className="p-2 bg-surface border border-border rounded">
              <div className="font-display text-sm bg-gradient-to-br from-text-primary to-accent bg-clip-text text-transparent">
                {s.value || "—"}
              </div>
              <div className="text-[8px] text-text-muted uppercase">{s.label || "—"}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 text-center">
        <h2 className="font-display text-lg mb-2">Ready to build together?</h2>
        <div className="flex gap-1 justify-center">
          {config.email && (
            <span className="px-2 py-0.5 bg-accent/20 rounded text-accent text-[9px]">
              Email
            </span>
          )}
          {config.socialLinks?.github && (
            <span className="px-2 py-0.5 bg-surface border border-border rounded text-[9px]">
              GitHub
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
