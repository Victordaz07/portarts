"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject, getAllProjects, slugExists } from "@/lib/firestore";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: Parameters<Parameters<typeof ProjectForm>[0]["onSubmit"]>[0]
  ) => {
    const exists = await slugExists(data.slug);
    if (exists) throw new Error("This slug already exists");
    const projects = await getAllProjects();
    const order = projects.length;
    const id = await createProject({ ...data, order });
    router.push(`/admin/projects/${id}/edit`);
  };

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-text-secondary hover:text-accent text-sm mb-6 inline-block"
      >
        ← Projects
      </Link>
      <h1 className="font-display text-3xl mb-8">New project</h1>
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/projects")}
      />
    </div>
  );
}
