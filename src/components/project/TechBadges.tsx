import type { Project } from "@/lib/types";

interface TechBadgesProps {
  techStack: Project["techStack"];
}

export function TechBadges({ techStack }: TechBadgesProps) {
  if (!techStack?.length) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {techStack.map((tech) => (
        <span
          key={tech}
          className="px-3 py-1.5 bg-bg-card border border-border rounded-full font-mono text-sm text-text-secondary transition-all hover:border-accent hover:text-accent"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
