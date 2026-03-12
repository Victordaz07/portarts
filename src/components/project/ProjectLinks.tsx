import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";

interface ProjectLinksProps {
  links: Project["links"];
}

export function ProjectLinks({ links }: ProjectLinksProps) {
  if (!links) return null;

  const entries = Object.entries(links).filter(
    ([, url]) => url && typeof url === "string"
  );
  if (entries.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-7">
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-medium bg-accent text-bg no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_18px_rgba(232,197,71,0.3)]"
        >
          View project
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-medium bg-transparent text-text-primary border border-border no-underline transition-all hover:border-text-secondary hover:-translate-y-0.5"
        >
          GitHub
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
      {links.figma && (
        <a
          href={links.figma}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-medium bg-transparent text-text-primary border border-border no-underline transition-all hover:border-text-secondary hover:-translate-y-0.5"
        >
          Figma
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
