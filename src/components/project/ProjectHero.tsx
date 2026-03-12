import type { Project, ProjectTheme } from "@/lib/types";

const THEME_CLASSES: Record<ProjectTheme, string> = {
  fleet: "theme-fleet",
  family: "theme-family",
  focus: "theme-focus",
  gospel: "theme-gospel",
  default: "theme-default",
  custom: "theme-default",
};

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const themeClass = THEME_CLASSES[(project.theme ?? "default") as ProjectTheme] ?? "theme-default";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
      <div>
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
        <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light mb-5">
          {project.fullDescription || project.description}
        </p>
        {project.metadata && Object.keys(project.metadata).length > 0 && (
          <div className="grid grid-cols-2 gap-2">
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
      <div className="rounded-card-lg overflow-hidden border border-border aspect-video">
        <div className={`w-full h-full ${themeClass}`} />
      </div>
    </div>
  );
}
