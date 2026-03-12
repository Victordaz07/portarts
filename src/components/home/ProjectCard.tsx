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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const themeClass = THEME_CLASSES[(project.theme ?? "default") as ProjectTheme] ?? "theme-default";
  const statusDot = STATUS_DOTS[project.status?.color ?? "green"] ?? "bg-green";
  const hasPreview = !!project.preview?.url;

  return (
    <Link
      href={`/project/${project.slug}`}
      className={`block rounded-card-lg overflow-hidden border border-border bg-bg-card cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-3px] hover:border-border-hover hover:shadow-[0_20px_56px_rgba(0,0,0,0.4)] group ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative w-full aspect-video overflow-hidden group">
        {project.featured && (
          <div className="absolute inset-0 aspect-[21/9] md:aspect-[21/9]" />
        )}
        <div
          className={`absolute inset-0 ${themeClass} transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent" />
        {hasPreview && project.preview && (
          <div className="absolute top-3 right-3 z-[5] flex gap-1">
            <span className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-md text-xs font-mono text-text-secondary flex items-center gap-1">
              {project.preview.type === "phone" && "📱"}
              {project.preview.type === "tablet" && "📱"}
              {project.preview.type === "desktop" && "🖥"}
              {project.preview.type === "phone" ? "Mobile" : project.preview.type === "tablet" ? "Tablet" : "Desktop"}
            </span>
            <span className="px-2 py-1 text-green text-xs">● Live</span>
          </div>
        )}
      </div>
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
