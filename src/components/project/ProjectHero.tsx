import type { Project } from "@/lib/types";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <div className="mb-12">
      <div className="flex gap-1 flex-wrap mb-3">
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-[rgba(255,255,255,0.04)] border border-border rounded-full text-xs font-mono text-text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-primary mb-2">
        {project.name}
      </h1>
      <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light mb-5 max-w-3xl">
        {project.fullDescription || project.description}
      </p>
      {project.metadata && Object.keys(project.metadata).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(project.metadata).map(([key, value]) => (
            <div
              key={key}
              className="p-3 bg-surface border border-border rounded-card"
            >
              <div className="text-xs text-text-muted uppercase tracking-wider mb-0.5">
                {key}
              </div>
              <div className="text-sm text-text-primary font-medium">
                {value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
