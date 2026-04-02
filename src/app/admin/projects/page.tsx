"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { getAllProjects, updateProject, deleteProject } from "@/lib/firestore";
import type { Project } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ProjectCard } from "@/components/home/ProjectCard";

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
    if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProject(p.id);
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/60 mb-2">
            Content
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
            Projects
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl">
            Vista en tarjetas con portada y branding como en el sitio público. Publica
            o edita, o abre la vista previa en vivo.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium bg-cyan-500/20 text-cyan-100 border border-cyan-500/35 hover:bg-cyan-500/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/2 px-8 py-16 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-cyan-400/50 mb-4">
            <i className="fa-brands fa-react text-2xl" aria-hidden />
          </div>
          <p className="text-slate-300 font-medium">Aún no hay proyectos</p>
          <p className="text-slate-500 text-sm mt-2 mb-6">
            Crea el primero para que aparezca aquí y en el portfolio.
          </p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-cyan-500/20 text-cyan-100 border border-cyan-500/35 hover:bg-cyan-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Crear proyecto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((p) => (
            <article key={p.id} className="flex flex-col">
              <ProjectCard
                project={p}
                variant="admin"
                adminFooterTone="dark"
                adminActionsSlot={
                  <>
                    <button
                      type="button"
                      onClick={() => togglePublish(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                      title={
                        p.published
                          ? "Visible en el home — clic para ocultar"
                          : "Borrador — clic para publicar"
                      }
                    >
                      {p.published ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                      )}
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-300/90 ring-1 ring-rose-500/25 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden />
                      Delete
                    </button>
                  </>
                }
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
