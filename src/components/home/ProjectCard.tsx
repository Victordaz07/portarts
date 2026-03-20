"use client";

import Image from "next/image";
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
  green: "bg-[#dcfce7] text-[#166534]",
  yellow: "bg-[#fef3c7] text-[#92400e]",
  blue: "bg-[#dbeafe] text-[#1d4ed8]",
  red: "bg-[#ffe4e6] text-[#be123c]",
};

const VISUAL_GRADIENTS: Record<string, string> = {
  family: "bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#3b82f6]",
  fleet: "bg-gradient-to-br from-[#475569] via-[#2563eb] to-[#0ea5e9]",
  gospel: "bg-gradient-to-br from-[#f59e0b] via-[#f97316] to-[#facc15]",
  default: "bg-gradient-to-br from-[#334155] via-[#1d4ed8] to-[#0f172a]",
};

interface ProjectCardProps {
  project: Project;
}

function resolveCover(project: Project): { src: string; caption?: string } | null {
  const explicit = project.coverImage?.trim();
  if (explicit) return { src: explicit };
  const first = project.gallery?.find((g) => g.url?.trim());
  if (first?.url) return { src: first.url.trim(), caption: first.caption };
  return null;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const themeClass = THEME_CLASSES[(project.theme ?? "default") as ProjectTheme] ?? "theme-default";
  const previewCollection = (
    project as Project & { previews?: Array<{ url?: string }> }
  ).previews;
  const previewUrl = project.preview?.url || previewCollection?.[0]?.url;
  const hasLivePreview = !!previewUrl;
  const visualTheme =
    project.theme === "family" || project.theme === "fleet" || project.theme === "gospel"
      ? project.theme
      : "default";
  const visualGradient = VISUAL_GRADIENTS[visualTheme] ?? VISUAL_GRADIENTS.default;
  const statusColor = STATUS_DOTS[project.status?.color ?? "blue"] ?? STATUS_DOTS.blue;

  const cover = resolveCover(project);
  const hasCover = !!cover;
  const logoUrl = project.logoUrl?.trim();
  const showTitleOnCard = project.showTitleOnCard !== false;
  const coverAlt = cover?.caption
    ? `${project.name}: ${cover.caption}`
    : `${project.name} — vista del proyecto`;

  return (
    <Link
      href={`/project/${project.slug}`}
      className="block rounded-[12px] overflow-hidden border border-border bg-white cursor-pointer transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] group"
    >
      <div className="relative w-full h-[200px] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-smooth group-hover:scale-105">
          {hasCover ? (
            <>
              <div className={`absolute inset-0 z-0 ${visualGradient} opacity-50`} aria-hidden />
              <Image
                src={cover.src}
                alt={coverAlt}
                fill
                className="object-cover z-1"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={project.featured}
                unoptimized
              />
            </>
          ) : (
            <div
              className={`absolute inset-0 z-0 ${hasLivePreview ? visualGradient : themeClass} opacity-95`}
            />
          )}
        </div>
        <div
          className={
            showTitleOnCard || logoUrl
              ? "absolute inset-0 z-2 bg-linear-to-t from-black/60 via-black/25 to-black/10 pointer-events-none"
              : "absolute inset-0 z-2 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none"
          }
          aria-hidden
        />
        {(logoUrl || showTitleOnCard) && (
          <div className="absolute inset-0 z-3 flex flex-col items-center justify-center gap-3 px-4 text-center">
            {logoUrl ? (
              <div className="relative h-14 w-14 shrink-0 rounded-xl bg-white/15 p-1.5 ring-1 ring-white/25 shadow-lg backdrop-blur-sm">
                <Image
                  src={logoUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="object-contain object-center size-full"
                  unoptimized
                />
              </div>
            ) : null}
            {showTitleOnCard ? (
              <h3 className="text-white text-2xl md:text-3xl font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                {project.name}
              </h3>
            ) : null}
          </div>
        )}
      </div>
      <div className="relative z-3 p-5">
        <div className="flex gap-2 flex-wrap mb-3">
          {project.featured && (
            <span className="px-2.5 py-1 bg-[#f4f4f5] rounded-full text-xs text-text-secondary font-medium">
              Featured
            </span>
          )}
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#f4f4f5] rounded-full text-xs text-text-secondary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-black font-bold text-[20px] mb-2">
          {project.name}
        </h3>
        <p className="text-text-secondary text-[14px] leading-relaxed max-w-[420px]">
          {project.description}
        </p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
            {project.status?.text ?? "In development"}
          </div>
          <div className="w-8 h-8 rounded-full border border-[#dbeafe] flex items-center justify-center text-accent transition-all duration-300 group-hover:bg-[#eff6ff] group-hover:-rotate-12">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
