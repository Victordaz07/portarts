"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectTheme } from "@/lib/types";

const THEME_CLASSES: Record<ProjectTheme, string> = {
  fleet: "theme-fleet",
  family: "theme-family",
  focus: "theme-focus",
  gospel: "theme-gospel",
  default: "theme-default",
  custom: "theme-default",
};

const STATUS_DOTS: Record<string, string> = {
  green: "bg-green",
  yellow: "bg-accent",
  blue: "bg-cyan",
  red: "bg-rose",
};

const VISUAL_GRADIENTS: Record<string, string> = {
  family: "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500",
  fleet: "bg-gradient-to-br from-slate-950 via-blue-900 to-teal-600",
  gospel: "bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600",
  default: "bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-700",
};

const VISUAL_ICONS: Record<string, string> = {
  family: "👨‍👩‍👧‍👦",
  fleet: "🚚",
  gospel: "✨",
  default: "💻",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const themeClass = THEME_CLASSES[(project.theme ?? "default") as ProjectTheme] ?? "theme-default";
  const statusDot = STATUS_DOTS[project.status?.color ?? "green"] ?? "bg-green";
  const previewCollection = (
    project as Project & { previews?: Array<{ url?: string }> }
  ).previews;
  const previewUrl = project.preview?.url || previewCollection?.[0]?.url;
  const hasPreview = !!previewUrl;
  const visualTheme =
    project.theme === "family" || project.theme === "fleet" || project.theme === "gospel"
      ? project.theme
      : "default";
  const visualGradient = VISUAL_GRADIENTS[visualTheme] ?? VISUAL_GRADIENTS.default;
  const visualIcon = VISUAL_ICONS[visualTheme] ?? VISUAL_ICONS.default;

  return (
    <Link
      href={`/project/${project.slug}`}
      className={`block rounded-card-lg overflow-hidden border border-border bg-bg-card cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-3px] hover:border-border-hover hover:shadow-[0_20px_56px_rgba(0,0,0,0.4)] group ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      {hasPreview ? (
        <div className="relative w-full h-[160px] md:h-[200px] overflow-hidden">
          <div
            className={`absolute inset-0 ${visualGradient} transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
          />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl md:text-5xl drop-shadow-md">{visualIcon}</span>
            <h3 className="mt-3 font-display text-2xl md:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
              {project.name}
            </h3>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-video overflow-hidden group">
          {project.featured && (
            <div className="absolute inset-0 aspect-[21/9] md:aspect-[21/9]" />
          )}
          <div
            className={`absolute inset-0 ${themeClass} transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent" />
        </div>
      )}
      <div className="relative z-[3] p-5">
        <div className="flex gap-1 flex-wrap mb-2">
          {project.featured && (
            <span className="px-2 py-0.5 bg-accent-dim border border-accent/20 rounded-full text-xs font-mono text-accent">
              Featured
            </span>
          )}
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[rgba(255,255,255,0.04)] border border-border rounded-full text-xs font-mono text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className={`font-display text-text-primary mb-1 ${project.featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
          {project.name}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed font-light max-w-[420px]">
          {project.description}
        </p>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {project.status?.text ?? "In development"}
          </div>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-secondary transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-bg group-hover:rotate-[-45deg]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
