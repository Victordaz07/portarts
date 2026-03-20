"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";
import {
  getProjectById,
  updateProject,
  slugExists,
} from "@/lib/firestore";
import type { Project } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectById(id)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (
    data: Parameters<Parameters<typeof ProjectForm>[0]["onSubmit"]>[0]
  ) => {
    const exists = await slugExists(data.slug, id);
    if (exists) throw new Error("This slug already exists");
    await updateProject(id, data);
    router.push("/admin/projects");
  };

  const handleAutosave = async (
    data: Parameters<Parameters<typeof ProjectForm>[0]["onSubmit"]>[0]
  ) => {
    await updateProject(id, data);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <p className="text-rose">Project not found.</p>
        <Link href="/admin/projects" className="text-accent mt-4 inline-block">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-text-secondary hover:text-accent text-sm mb-6 inline-block"
      >
        ← Projects
      </Link>
      <h1 className="font-display text-3xl mb-8">
        Edit: {project.name}
      </h1>
      <ProjectForm
        key={id}
        initial={project}
        projectId={id}
        onSubmit={handleSubmit}
        onAutosave={handleAutosave}
        onCancel={() => router.push("/admin/projects")}
      />
    </div>
  );
}
