import {
  pgTable,
  text,
  boolean,
  integer,
  bigint,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import type {
  PortfolioConfig,
  Project,
  ProjectKpi,
  ProjectStatusColor,
  ProjectTheme,
  DeviceType,
} from "@/lib/types";

/**
 * Postgres schema (Neon) — replaces Firestore collections.
 *
 * Firestore was document-oriented, so each table keeps the queryable/sortable
 * fields as real columns and stores the rest of the document in a `data` JSONB
 * column. This maps the old documents 1:1 with almost no shape churn.
 */

/** `projects` collection → table. Queryable columns + full document in `data`. */
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  published: boolean("published").notNull().default(false),
  order: integer("order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  name: text("name").notNull().default(""),
  /** Everything else on the Project document (nested arrays/objects). */
  data: jsonb("data").notNull().$type<ProjectData>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** The Project fields kept inside the JSONB `data` column (everything except the promoted columns). */
export type ProjectData = Partial<
  Omit<Project, "id" | "slug" | "published" | "order" | "featured" | "name" | "createdAt" | "updatedAt">
> & {
  tagline?: string;
  description?: string;
  fullDescription?: string;
  status?: { text: string; color: ProjectStatusColor };
  tags?: string[];
  theme?: ProjectTheme;
  themeColor?: string;
  coverImage?: string;
  logoUrl?: string;
  showTitleOnCard?: boolean;
  preview?: { url: string; type: DeviceType; allowFullscreen?: boolean };
  kpis?: ProjectKpi[];
};

/** `config/portfolio` document → single-row table keyed by id = 'portfolio'. */
export const portfolioConfig = pgTable("portfolio_config", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull().$type<PortfolioConfig>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** `analytics_daily` collection → table keyed by yyyy-mm-dd date string. */
export const analyticsDaily = pgTable("analytics_daily", {
  date: text("date").primaryKey(),
  sessionCount: integer("session_count").notNull().default(0),
  totalDurationMs: bigint("total_duration_ms", { mode: "number" }).notNull().default(0),
  totalScrollPct: integer("total_scroll_pct").notNull().default(0),
  sectionCounts: jsonb("section_counts").notNull().$type<Record<string, number>>().default({}),
  pathCounts: jsonb("path_counts").notNull().$type<Record<string, number>>().default({}),
  projectSlugCounts: jsonb("project_slug_counts").notNull().$type<Record<string, number>>().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type PortfolioConfigRow = typeof portfolioConfig.$inferSelect;
export type AnalyticsDailyRow = typeof analyticsDaily.$inferSelect;
