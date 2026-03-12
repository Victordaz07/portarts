import type { Project } from "@/lib/types";

interface TimelineProps {
  timeline: Project["timeline"];
}

export function Timeline({ timeline }: TimelineProps) {
  if (!timeline?.length) return null;

  return (
    <div className="relative pl-6">
      <div className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
      {timeline.map((item, i) => (
        <div key={i} className="relative mb-5">
          <div className="absolute -left-[18px] top-1 w-2 h-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(232,197,71,0.1)]" />
          <div className="font-mono text-xs text-text-muted mb-0.5">
            {item.date}
          </div>
          <h4 className="text-sm font-medium text-text-primary mb-0.5">
            {item.title}
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed font-light">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
