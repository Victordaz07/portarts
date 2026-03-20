"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { getAllProjects, updateProject, deleteProject } from "@/lib/firestore";
import type { Project } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const togglePublish = async (p: Project) => {
    try {
      await updateProject(p.id, { published: !p.published });
      setProjects((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProject(p.id);
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-full font-medium hover:shadow-[0_6px_24px_rgba(232,197,71,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          New project
        </Link>
      </div>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-text-muted py-8">
            No projects yet. Create the first one.
          </p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 bg-bg-card border border-border rounded-card hover:border-border-hover transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">{p.name}</span>
                  {p.published ? (
                    <span className="text-xs text-green">● Published</span>
                  ) : (
                    <span className="text-xs text-text-muted">● Draft</span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-0.5">
                  {p.tagline || p.description?.slice(0, 60)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublish(p)}
                  className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-accent-dim transition-colors"
                  title={
                    p.published
                      ? "Visible on the home page — click to unpublish"
                      : "Draft — click to publish"
                  }
                >
                  {p.published ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-accent-dim transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p)}
                  className="p-2 rounded-lg text-text-secondary hover:text-rose hover:bg-rose/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
