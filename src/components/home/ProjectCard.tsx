"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pencil } from "lucide-react";
import { KpiChips } from "@/components/KpiChips";
import { cn } from "@/lib/cn";
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

export interface ProjectCardProps {
  project: Project;
  /** Admin dashboard: tarjeta como en el landing + barra para editar */
  variant?: "default" | "admin";
  /** Pie admin en tema oscuro (lista de proyectos) */
  adminFooterTone?: "light" | "dark";
  /** Botones extra (p. ej. publicar / borrar) en el pie admin */
  adminActionsSlot?: ReactNode;
  className?: string;
}

function resolveCover(project: Project): { src: string; caption?: string } | null {
  const explicit = project.coverImage?.trim();
  if (explicit) return { src: explicit };
  const first = project.gallery?.find((g) => g.url?.trim());
  if (first?.url) return { src: first.url.trim(), caption: first.caption };
  return null;
}

export function ProjectCard({
  project,
  variant = "default",
  adminFooterTone = "light",
  adminActionsSlot,
  className,
}: ProjectCardProps) {
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
  const problem = project.valueProps?.problem?.trim();
  const role = project.valueProps?.role?.trim();
  const hasProblemOrRole = Boolean(problem || role);

  const publicHref = `/project/${project.slug}`;
  const editHref = `/admin/projects/${project.id}/edit`;

  const cardBody = (
    <>
      <div className="relative w-full h-[200px] overflow-hidden rounded-t-[12px]">
        {hasCover ? (
          <>
            <div
              className={`absolute inset-0 z-0 ${visualGradient} opacity-50`}
              aria-hidden
            />
            <Image
              src={cover.src}
              alt={coverAlt}
              fill
              className={cn(
                "object-cover z-1",
                "transition-transform duration-500 ease-out",
                "group-hover:scale-105",
              )}
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
        <div
          className={
            showTitleOnCard || logoUrl
              ? "absolute inset-0 z-2 bg-linear-to-t from-black/60 via-black/25 to-black/10 pointer-events-none"
              : "absolute inset-0 z-2 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none"
          }
          aria-hidden
        />
        <div
          className="absolute inset-0 z-3 pointer-events-none bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
          aria-hidden
        />
        {(logoUrl || showTitleOnCard) && (
          <div className="absolute inset-0 z-4 flex flex-col items-center justify-center gap-3 px-4 text-center pointer-events-none">
            {logoUrl ? (
              <div className="relative h-14 w-14 shrink-0 rounded-xl bg-white/15 p-1.5 ring-1 ring-white/25 shadow-lg backdrop-blur-sm">
                <Image
                  src={logoUrl}
                  alt={`${project.name} — logo`}
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
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 z-5 h-21 pointer-events-none",
            "flex items-end justify-center pb-3",
            "bg-linear-to-t from-black/50 via-black/10 to-transparent",
            "opacity-0 transition-opacity duration-300 ease-out",
            "group-hover:opacity-100",
          )}
        >
          <span
            className={cn(
              "translate-y-1 text-sm font-medium",
              "px-3.5 py-1.5 rounded-full",
              "bg-white/95 text-black shadow-md",
              "border border-white/40",
              "transition-transform duration-300 ease-out",
              "group-hover:translate-y-0",
            )}
          >
            View project →
          </span>
        </div>
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
        <h3
          className={cn(
            "text-black font-bold text-[20px] mb-2",
            "transition-colors duration-200",
            "group-hover:text-text-primary",
          )}
        >
          {project.name}
        </h3>
        {project.kpis && project.kpis.length > 0 ? (
          <KpiChips kpis={project.kpis} className="mt-3 mb-1" />
        ) : null}
        <p className="text-text-secondary text-[14px] leading-relaxed max-w-[420px]">
          {project.description}
        </p>
        {hasProblemOrRole ? (
          <div className="mt-4 space-y-1 text-[13px] leading-relaxed text-text-secondary">
            {problem ? (
              <p>
                <span className="font-semibold text-black">Problem:</span> {problem}
              </p>
            ) : null}
            {role ? (
              <p>
                <span className="font-semibold text-black">Role:</span> {role}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
            {project.status?.text ?? "In development"}
          </div>
          <div className="w-8 h-8 rounded-full border border-[#dbeafe] flex items-center justify-center text-accent transition-all duration-300 group-hover:bg-[#eff6ff] group-hover:-rotate-12">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );

  if (variant === "admin") {
    const footerDark = adminFooterTone === "dark";
    return (
      <div
        className={cn(
          "rounded-[12px] overflow-hidden border bg-white",
          "group transition-all duration-300 ease-smooth",
          "hover:-translate-y-1 hover:shadow-md",
          footerDark
            ? "border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:border-white/25"
            : "border-border hover:border-border",
          className,
        )}
      >
        <Link href={publicHref} className="block cursor-pointer">
          {cardBody}
        </Link>
        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3",
            footerDark
              ? "border-white/10 bg-[#0f1419]/90 backdrop-blur-sm"
              : "border-border bg-slate-50/90",
          )}
        >
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "text-xs truncate block",
                footerDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              {project.published ? (
                <span
                  className={footerDark ? "text-emerald-400 font-medium" : "text-emerald-600 font-medium"}
                >
                  Published
                </span>
              ) : (
                <span className={footerDark ? "text-amber-200/90" : undefined}>Draft</span>
              )}
              <span className={footerDark ? "text-slate-500" : "text-slate-400"}>
                {" "}
                · Vista pública
              </span>
            </span>
            <span
              className={cn(
                "font-mono text-[10px] leading-tight mt-1 block truncate",
                footerDark ? "text-slate-600" : "text-slate-400",
              )}
              title={project.slug}
            >
              /{project.slug}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
            {adminActionsSlot}
            <Link
              href={editHref}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ring-1 transition-colors",
                footerDark
                  ? "bg-cyan-500/15 text-cyan-100 ring-cyan-400/30 hover:bg-cyan-500/25"
                  : "bg-cyan-500/10 text-cyan-800 ring-cyan-500/25 hover:bg-cyan-500/20",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={publicHref}
      className={cn(
        "block rounded-[12px] overflow-hidden border border-border bg-white cursor-pointer",
        "group transition-all duration-300 ease-smooth",
        "hover:-translate-y-1 hover:shadow-sm hover:border-border",
      )}
    >
      {cardBody}
    </Link>
  );
}
