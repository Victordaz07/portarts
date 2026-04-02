"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen, ExternalLink } from "lucide-react";
import { getAllProjects, getAnalyticsDailyRange } from "@/lib/firestore";
import { ProjectCard } from "@/components/home/ProjectCard";
import { AdminDashboardInsights } from "@/components/admin/AdminDashboardInsights";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Project } from "@/lib/types";

const RANGE_DAYS = 14;

const VERCEL_ANALYTICS_DOC = "https://vercel.com/docs/analytics";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [analytics, setAnalytics] = useState<Awaited<
    ReturnType<typeof getAnalyticsDailyRange>
  > | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, agg] = await Promise.all([
          getAllProjects(),
          getAnalyticsDailyRange(RANGE_DAYS),
        ]);
        if (!cancelled) {
          setProjects(list);
          setAnalytics(agg);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Error al cargar datos.");
          setProjects([]);
          setAnalytics([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const publishedCount = projects?.filter((p) => p.published).length ?? 0;
  const totalCount = projects?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/60 mb-2">
            Overview
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl">
            Proyectos como en el landing, métricas de sesión (scroll, tiempo, secciones) y
            enlace a Vercel Analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-cyan-500/20 text-cyan-100 border border-cyan-500/35 hover:bg-cyan-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            New project
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium border border-white/15 text-slate-200 hover:bg-white/5 transition-all"
          >
            <FolderOpen className="w-4 h-4" />
            All projects
          </Link>
          <a
            href={VERCEL_ANALYTICS_DOC}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Vercel Analytics
          </a>
        </div>
      </div>

      {loadError && (
        <p className="mb-6 text-sm text-rose-300 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10">
        <div className="rounded-2xl border border-white/10 bg-white/4 px-6 py-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total projects</p>
          <p className="mt-2 font-display text-4xl text-white tabular-nums">
            {projects === null ? "—" : totalCount}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 px-6 py-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">Published</p>
          <p className="mt-2 font-display text-4xl text-emerald-300/90 tabular-nums">
            {projects === null ? "—" : publishedCount}
          </p>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-mono text-xs text-cyan-400/70">Analytics</span>
          <h2 className="text-xl font-semibold text-slate-100">Sesiones en el sitio público</h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        {analytics === null ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <AdminDashboardInsights rangeDays={RANGE_DAYS} data={analytics} />
        )}
      </section>

      <section>
        <div className="flex items-baseline gap-4 mb-8">
          <span className="font-mono text-xs text-cyan-400/70">01</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Projects</h2>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        {projects === null ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-slate-500 py-8">No hay proyectos todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="admin" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
