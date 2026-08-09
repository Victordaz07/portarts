import "server-only";
import { cache } from "react";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import {
  analyticsDaily,
  portfolioConfig as portfolioConfigTable,
  projects as projectsTable,
  type ProjectRow,
} from "@/lib/db/schema";
import type { PortfolioConfig, Project } from "@/lib/types";
import type { AnalyticsDailyDoc } from "@/lib/analytics-types";

/**
 * Server-only data-access layer (Neon Postgres via Drizzle).
 * Replaces the old Firestore client/admin layers. Public read getters are
 * wrapped in `react/cache` so layout + page dedupe within one request.
 *
 * Do not import this file from client components — write paths go through the
 * `/api/admin/*` routes which call these functions after checking the session.
 */

/** Columns promoted out of the JSONB `data` blob. */
const PROMOTED_KEYS = [
  "id",
  "slug",
  "published",
  "order",
  "featured",
  "name",
  "createdAt",
  "updatedAt",
] as const;

/** Strip `undefined` (objects) and drop `undefined` array items, mirroring Firestore's old behavior. */
function deepClean<T>(value: T): T {
  if (value === undefined || value === null) return value;
  if (Array.isArray(value)) {
    return value
      .map((v) => deepClean(v))
      .filter((v) => v !== undefined) as unknown as T;
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const cleaned = deepClean(v);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out as T;
  }
  return value;
}

function rowToProject(row: ProjectRow): Project {
  const data = (row.data ?? {}) as Record<string, unknown>;
  return {
    ...data,
    id: row.id,
    slug: row.slug,
    published: row.published,
    order: row.order,
    featured: row.featured,
    name: row.name,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  } as Project;
}

/** Split a (partial) Project into promoted columns + the JSONB remainder. */
function splitProject(input: Partial<Project>): {
  columns: Partial<Pick<ProjectRow, "slug" | "published" | "order" | "featured" | "name">>;
  data: Record<string, unknown>;
} {
  const columns: Partial<Pick<ProjectRow, "slug" | "published" | "order" | "featured" | "name">> = {};
  if (input.slug !== undefined) columns.slug = input.slug;
  if (input.published !== undefined) columns.published = Boolean(input.published);
  if (input.order !== undefined) columns.order = Number(input.order) || 0;
  if (input.featured !== undefined) columns.featured = Boolean(input.featured);
  if (input.name !== undefined) columns.name = input.name;

  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if ((PROMOTED_KEYS as readonly string[]).includes(k)) continue;
    data[k] = v;
  }
  return { columns, data: deepClean(data) };
}

// ─── Public reads (Server Components) ───────────────────────────────────────

async function loadPortfolioConfig(): Promise<PortfolioConfig | null> {
  if (!isDbConfigured()) return null;
  try {
    const rows = await getDb()
      .select()
      .from(portfolioConfigTable)
      .where(eq(portfolioConfigTable.id, "portfolio"))
      .limit(1);
    return rows[0]?.data ?? null;
  } catch (e) {
    console.error("[data-server] getPortfolioConfig", e);
    return null;
  }
}

async function loadPublishedProjects(): Promise<Project[]> {
  if (!isDbConfigured()) return [];
  try {
    const rows = await getDb()
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.published, true))
      .orderBy(asc(projectsTable.order));
    return rows.map(rowToProject);
  } catch (e) {
    console.error("[data-server] getPublishedProjects", e);
    return [];
  }
}

async function loadProjectBySlug(slug: string): Promise<Project | null> {
  if (!isDbConfigured()) return null;
  try {
    const rows = await getDb()
      .select()
      .from(projectsTable)
      .where(and(eq(projectsTable.slug, slug), eq(projectsTable.published, true)))
      .limit(1);
    return rows[0] ? rowToProject(rows[0]) : null;
  } catch (e) {
    console.error("[data-server] getProjectBySlug", e);
    return null;
  }
}

const getPortfolioConfigCached = cache(loadPortfolioConfig);
const getPublishedProjectsCached = cache(loadPublishedProjects);
const getProjectBySlugCached = cache(loadProjectBySlug);

export function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  return getPortfolioConfigCached();
}

export function getPublishedProjects(): Promise<Project[]> {
  return getPublishedProjectsCached();
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return getProjectBySlugCached(slug);
}

// ─── Admin reads ─────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
  const rows = await getDb()
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.order));
  return rows.map(rowToProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const rows = await getDb()
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  return rows[0] ? rowToProject(rows[0]) : null;
}

export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const rows = await getDb()
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug))
    .limit(1);
  if (rows.length === 0) return true;
  if (excludeId && rows[0].id === excludeId) return true;
  return false;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const rows = await getDb()
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(eq(projectsTable.slug, slug));
  return rows.some((r) => r.id !== excludeId);
}

// ─── Admin writes ────────────────────────────────────────────────────────────

export async function createProject(
  input: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const id = crypto.randomUUID();
  const { columns, data } = splitProject(input);
  await getDb().insert(projectsTable).values({
    id,
    slug: columns.slug ?? "",
    published: columns.published ?? false,
    order: columns.order ?? 0,
    featured: columns.featured ?? false,
    name: columns.name ?? "",
    data,
  });
  return id;
}

export async function updateProject(id: string, input: Partial<Project>): Promise<void> {
  const existing = await getDb()
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  if (!existing[0]) throw new Error(`Project ${id} not found`);

  const { columns, data } = splitProject(input);
  const mergedData = deepClean({ ...(existing[0].data ?? {}), ...data });

  await getDb()
    .update(projectsTable)
    .set({
      ...columns,
      data: mergedData as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, id));
}

export async function deleteProject(id: string): Promise<void> {
  await getDb().delete(projectsTable).where(eq(projectsTable.id, id));
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const db = getDb();
  // neon-http is stateless (no multi-statement transaction); sequential updates are fine for admin ordering.
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(projectsTable)
        .set({ order: index, updatedAt: new Date() })
        .where(eq(projectsTable.id, id))
    )
  );
}

export async function updatePortfolioConfig(input: Partial<PortfolioConfig>): Promise<void> {
  const db = getDb();
  const existing = await db
    .select()
    .from(portfolioConfigTable)
    .where(eq(portfolioConfigTable.id, "portfolio"))
    .limit(1);
  const merged = deepClean({
    ...(existing[0]?.data ?? {}),
    ...input,
  }) as PortfolioConfig;

  await db
    .insert(portfolioConfigTable)
    .values({ id: "portfolio", data: merged, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: portfolioConfigTable.id,
      set: { data: merged, updatedAt: new Date() },
    });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalyticsDailyRange(days: number): Promise<AnalyticsDailyDoc[]> {
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  const ids: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(todayUtc);
    d.setUTCDate(d.getUTCDate() - i);
    ids.push(d.toISOString().slice(0, 10));
  }

  const rows = await getDb()
    .select()
    .from(analyticsDaily)
    .where(inArray(analyticsDaily.date, ids));

  const byDate = new Map(rows.map((r) => [r.date, r]));
  const out: AnalyticsDailyDoc[] = [];
  for (const id of ids) {
    const r = byDate.get(id);
    if (!r) continue;
    out.push({
      date: r.date,
      sessionCount: r.sessionCount,
      totalDurationMs: r.totalDurationMs,
      totalScrollPct: r.totalScrollPct,
      sectionCounts: r.sectionCounts ?? {},
      pathCounts: r.pathCounts ?? {},
      projectSlugCounts: r.projectSlugCounts ?? {},
      updatedAt: r.updatedAt?.toISOString(),
    });
  }
  return out;
}

export interface RecordSessionInput {
  pathKey: string;
  lastSection: string;
  durationMs: number;
  maxScrollPct: number;
  projectSlug: string | null;
}

/** Increments the daily aggregate row (read-modify-write; analytics tolerate rare races). */
export async function recordAnalyticsSession(input: RecordSessionInput): Promise<void> {
  const db = getDb();
  const date = new Date().toISOString().slice(0, 10);
  const existing = await db
    .select()
    .from(analyticsDaily)
    .where(eq(analyticsDaily.date, date))
    .limit(1);
  const prev = existing[0];

  const sectionCounts = { ...(prev?.sectionCounts ?? {}) };
  sectionCounts[input.lastSection] = (sectionCounts[input.lastSection] ?? 0) + 1;

  const pathCounts = { ...(prev?.pathCounts ?? {}) };
  pathCounts[input.pathKey] = (pathCounts[input.pathKey] ?? 0) + 1;

  const projectSlugCounts = { ...(prev?.projectSlugCounts ?? {}) };
  if (input.projectSlug) {
    projectSlugCounts[input.projectSlug] = (projectSlugCounts[input.projectSlug] ?? 0) + 1;
  }

  const row = {
    date,
    sessionCount: (prev?.sessionCount ?? 0) + 1,
    totalDurationMs: (prev?.totalDurationMs ?? 0) + input.durationMs,
    totalScrollPct: (prev?.totalScrollPct ?? 0) + input.maxScrollPct,
    sectionCounts,
    pathCounts,
    projectSlugCounts,
    updatedAt: new Date(),
  };

  await db
    .insert(analyticsDaily)
    .values(row)
    .onConflictDoUpdate({ target: analyticsDaily.date, set: row });
}
