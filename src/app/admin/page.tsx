"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { getAllProjects } from "@/lib/firestore";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<{ total: number; published: number } | null>(null);

  useEffect(() => {
    getAllProjects()
      .then((list) => {
        setProjects({
          total: list.length,
          published: list.filter((p) => p.published).length,
        });
      })
      .catch(() => setProjects({ total: 0, published: 0 }));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 bg-bg-card border border-border rounded-card-lg">
          <div className="font-display text-4xl text-accent mb-1">
            {projects?.total ?? "—"}
          </div>
          <div className="text-text-secondary text-sm">Total projects</div>
        </div>
        <div className="p-6 bg-bg-card border border-border rounded-card-lg">
          <div className="font-display text-4xl text-green mb-1">
            {projects?.published ?? "—"}
          </div>
          <div className="text-text-secondary text-sm">Published</div>
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-full font-medium hover:shadow-[0_6px_24px_rgba(232,197,71,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          New project
        </Link>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-full font-medium text-text-primary hover:border-accent hover:bg-accent-dim transition-all"
        >
          <FolderOpen className="w-4 h-4" />
          View projects
        </Link>
      </div>
    </div>
  );
}
