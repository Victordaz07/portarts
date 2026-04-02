import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/firestore-server";

const BASE = "https://portarts.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/project/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectEntries,
  ];
}
