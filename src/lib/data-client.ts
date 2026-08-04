"use client";

import type { PortfolioConfig, Project } from "@/lib/types";
import type { AnalyticsDailyDoc } from "@/lib/analytics-types";

/**
 * Client-side data access for the admin panel. The browser can't reach Postgres
 * directly, so every call hits a session-protected `/api/admin/*` route that runs
 * the real Drizzle query on the server. Function names/signatures match the old
 * Firestore client module so the admin pages didn't need rewrites.
 */

async function jsonFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function getPortfolioConfig(): Promise<PortfolioConfig | null> {
  const { config } = await jsonFetch<{ config: PortfolioConfig | null }>(
    "/api/admin/config"
  );
  return config;
}

export async function updatePortfolioConfig(
  data: Partial<PortfolioConfig>
): Promise<void> {
  await jsonFetch("/api/admin/config", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getAllProjects(): Promise<Project[]> {
  const { projects } = await jsonFetch<{ projects: Project[] }>(
    "/api/admin/projects"
  );
  return projects;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { project } = await jsonFetch<{ project: Project | null }>(
    `/api/admin/projects/${encodeURIComponent(id)}`
  );
  return project;
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const { id } = await jsonFetch<{ id: string }>("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return id;
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  await jsonFetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await jsonFetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  await jsonFetch("/api/admin/projects/reorder", {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
}

export async function isSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const params = new URLSearchParams({ slug });
  if (excludeId) params.set("excludeId", excludeId);
  const { unique } = await jsonFetch<{ unique: boolean }>(
    `/api/admin/projects/slug-check?${params.toString()}`
  );
  return unique;
}

export async function slugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const params = new URLSearchParams({ slug });
  if (excludeId) params.set("excludeId", excludeId);
  const { exists } = await jsonFetch<{ exists: boolean }>(
    `/api/admin/projects/slug-check?${params.toString()}`
  );
  return exists;
}

export async function getAnalyticsDailyRange(
  days: number
): Promise<AnalyticsDailyDoc[]> {
  const { days: rows } = await jsonFetch<{ days: AnalyticsDailyDoc[] }>(
    `/api/admin/analytics?days=${encodeURIComponent(String(days))}`
  );
  return rows;
}
