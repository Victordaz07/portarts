import { ProjectCard } from "./ProjectCard";
import {
  PROJECT_CATEGORY_LABELS,
  PROJECT_CATEGORY_ORDER,
  type Project,
  type ProjectCategory,
} from "@/lib/types";

interface ProjectGridProps {
  projects: Project[];
}

interface CategoryGroup {
  key: string;
  label: string | null;
  items: Project[];
}

/** Buckets projects by category in a stable order; uncategorized go last (unlabeled). */
function groupByCategory(projects: Project[]): CategoryGroup[] {
  const buckets = new Map<string, Project[]>();
  for (const p of projects) {
    const key = p.category ?? "_uncategorized";
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(p);
  }

  const groups: CategoryGroup[] = [];
  for (const cat of PROJECT_CATEGORY_ORDER) {
    const items = buckets.get(cat);
    if (items?.length) {
      groups.push({ key: cat, label: PROJECT_CATEGORY_LABELS[cat as ProjectCategory], items });
    }
  }
  const rest = buckets.get("_uncategorized");
  if (rest?.length) groups.push({ key: "_uncategorized", label: null, items: rest });
  return groups;
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <p className="text-text-muted text-center py-12">
        No published projects yet.
      </p>
    );
  }

  const groups = groupByCategory(projects);
  // Only show category headings when projects actually span more than one group.
  const showHeadings = groups.length > 1;

  return (
    <div>
      <div className="flex items-baseline gap-4 mb-10">
        <span className="font-mono text-xs text-accent">01</span>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Projects</h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-12">
        {groups.map((group) => (
          <div key={group.key}>
            {showHeadings && group.label ? (
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-5">
                {group.label}
              </h3>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {group.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
