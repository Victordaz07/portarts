import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-text-muted text-center py-12 space-y-2 max-w-md mx-auto">
        <p>No published projects on the home page yet.</p>
        <p className="text-sm text-text-secondary">
          The logo links to this same page (<code className="text-xs bg-bg-hover px-1 rounded">/</code>
          ). In <strong className="text-text-primary">Admin → Projects</strong>, open each project and
          enable <strong className="text-text-primary">Published</strong> so it appears here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-4 mb-10">
        <span className="font-mono text-xs text-accent">01</span>
        <h2 className="text-3xl md:text-4xl font-bold text-black">Projects</h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
