"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import type { AnalyticsDailyDoc } from "@/lib/analytics-types";

function pathKeyToLabel(pathKey: string): string {
  if (pathKey === "home") return "/";
  return `/${pathKey.replace(/__/g, "/")}`;
}

function mergeCounts(
  rows: AnalyticsDailyDoc[],
  key: "sectionCounts" | "pathCounts" | "projectSlugCounts",
): [string, number][] {
  const m = new Map<string, number>();
  for (const r of rows) {
    const obj = r[key];
    for (const [k, v] of Object.entries(obj)) {
      m.set(k, (m.get(k) ?? 0) + v);
    }
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} s`;
  const m = Math.floor(s / 60);
  const rs = Math.round(s % 60);
  return `${m}m ${rs}s`;
}

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
};

interface AdminDashboardInsightsProps {
  rangeDays: number;
  data: AnalyticsDailyDoc[];
}

export function AdminDashboardInsights({ rangeDays, data }: AdminDashboardInsightsProps) {
  const totals = useMemo(() => {
    let sessions = 0;
    let duration = 0;
    let scroll = 0;
    for (const r of data) {
      sessions += r.sessionCount;
      duration += r.totalDurationMs;
      scroll += r.totalScrollPct;
    }
    const avgDur = sessions > 0 ? duration / sessions : 0;
    const avgScroll = sessions > 0 ? scroll / sessions : 0;
    return { sessions, avgDur, avgScroll };
  }, [data]);

  const chartRows = useMemo(
    () =>
      data.map((r) => ({
        day: r.date.slice(5),
        sessions: r.sessionCount,
        avgScroll:
          r.sessionCount > 0 ? Math.round(r.totalScrollPct / r.sessionCount) : 0,
      })),
    [data],
  );

  const topSections = useMemo(() => mergeCounts(data, "sectionCounts").slice(0, 8), [data]);
  const topPaths = useMemo(() => mergeCounts(data, "pathCounts").slice(0, 8), [data]);
  const topProjects = useMemo(
    () => mergeCounts(data, "projectSlugCounts").slice(0, 8),
    [data],
  );

  const hasData = totals.sessions > 0;

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-12 text-center backdrop-blur-sm">
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          Aún no hay sesiones agregadas en los últimos {rangeDays} días. Visita el sitio
          público (fuera de <code className="text-cyan-300/80">/admin</code>) para generar
          datos: tiempo en página, scroll y secciones se envían al salir de la pestaña.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          En local, define{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-slate-300">
            NEXT_PUBLIC_ANALYTICS_DEBUG_LOCAL=true
          </code>{" "}
          para incluir localhost.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Sesiones ({rangeDays}d)
          </p>
          <p className="mt-2 font-display text-3xl text-white tabular-nums">
            {totals.sessions}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Tiempo medio en página
          </p>
          <p className="mt-2 font-display text-3xl text-cyan-200/90 tabular-nums">
            {formatDuration(totals.avgDur)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Scroll medio (máx.)
          </p>
          <p className="mt-2 font-display text-3xl text-emerald-300/90 tabular-nums">
            {Math.round(totals.avgScroll)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 sm:p-5 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Sesiones por día</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminSessionsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#adminSessionsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 sm:p-5 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Scroll medio por día (%)</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="avgScroll" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Secciones (donde hubo más foco)</h3>
          <ul className="space-y-2 text-sm">
            {topSections.map(([name, count]) => (
              <li
                key={name}
                className="flex justify-between gap-2 border-b border-white/5 pb-2 last:border-0 text-slate-400"
              >
                <span className="font-mono text-xs text-cyan-200/80 truncate">{name}</span>
                <span className="text-slate-300 shrink-0 tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Rutas más vistas</h3>
          <ul className="space-y-2 text-sm">
            {topPaths.map(([pathKey, count]) => (
              <li
                key={pathKey}
                className="flex justify-between gap-2 border-b border-white/5 pb-2 last:border-0 text-slate-400"
              >
                <span className="text-xs text-slate-300 truncate" title={pathKeyToLabel(pathKey)}>
                  {pathKeyToLabel(pathKey)}
                </span>
                <span className="text-slate-300 shrink-0 tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Proyectos (páginas /project/…)</h3>
          <ul className="space-y-2 text-sm">
            {topProjects.length === 0 ? (
              <li className="text-slate-500 text-xs">Sin vistas aún en este rango.</li>
            ) : (
              topProjects.map(([slug, count]) => (
                <li
                  key={slug}
                  className="flex justify-between gap-2 border-b border-white/5 pb-2 last:border-0 text-slate-400"
                >
                  <span className="font-mono text-xs text-slate-200 truncate">{slug}</span>
                  <span className="text-slate-300 shrink-0 tabular-nums">{count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
