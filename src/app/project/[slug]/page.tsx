import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/firestore";
import { DevicePreview } from "@/components/project/DevicePreview";
import { DemoCredentials } from "@/components/project/DemoCredentials";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureGrid } from "@/components/project/FeatureGrid";
import { TechBadges } from "@/components/project/TechBadges";
import { Timeline } from "@/components/project/Timeline";
import { ReadmeViewer } from "@/components/project/ReadmeViewer";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ScrollReveal } from "@/components/project/ScrollReveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project)
    return { title: "Project not found | PortArts" };
  return {
    title: `${project.name} | PortArts`,
    description: project.description || project.tagline,
    openGraph: {
      title: `${project.name} | PortArts`,
      description: project.description || project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const githubFullRepo = project.githubUrl
    ? project.githubUrl.replace("https://github.com/", "").replace(/\/$/, "")
    : null;
  const hasLinks =
    project.links &&
    Object.values(project.links).some((v) => v && typeof v === "string");

  const explicitPreviews = (project.previews ?? []).filter((p) => p?.url?.trim());
  const fallbackPreviews =
    project.slug === "familydash" && project.preview?.url
      ? [
          {
            url: project.preview.url,
            type: "desktop" as const,
            label: "Landing Page",
            allowFullscreen: true,
          },
          {
            url: project.demoCredentials?.url || "https://familydash.net/login",
            type: "phone" as const,
            label: "Live App",
            allowFullscreen: true,
          },
        ]
      : [];
  const previewsToRender =
    explicitPreviews.length > 0 ? explicitPreviews : fallbackPreviews;

  return (
    <ScrollReveal>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all mt-8 mb-9"
        >
          ← Back to projects
        </Link>

        <ProjectHero project={project} />

        {previewsToRender.length > 0 ? (
          previewsToRender.map((p, i) => (
            <section key={p.url} className="reveal mb-14">
              <h2 className="font-display text-2xl mb-5 pb-2 border-b border-border">
                🖥 {p.label}
              </h2>
              <ErrorBoundary section={`preview-${i}`}>
                <DevicePreview
                  url={p.url}
                  type={p.type}
                  allowFullscreen={p.allowFullscreen ?? true}
                  projectName={project.name}
                />
              </ErrorBoundary>
              {project.demoCredentials && i === previewsToRender.length - 1 && (
                <DemoCredentials {...project.demoCredentials} />
              )}
            </section>
          ))
        ) : (
          <section className="reveal mb-14">
            <h2 className="font-display text-2xl mb-5 pb-2 border-b border-border">
              🖥 Interactive Preview
            </h2>
            <ErrorBoundary section="preview">
              <DevicePreview
                url={project.preview?.url ?? ""}
                type={project.preview?.type ?? "desktop"}
                allowFullscreen={project.preview?.allowFullscreen ?? true}
                projectName={project.name}
              />
            </ErrorBoundary>
          </section>
        )}

        {(project.features?.length ?? 0) > 0 && (
          <section className="reveal mb-12">
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
              Features
            </h2>
            <ErrorBoundary section="features">
              <FeatureGrid features={project.features} />
            </ErrorBoundary>
          </section>
        )}

        {(project.techStack?.length ?? 0) > 0 && (
          <section className="reveal mb-12">
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
              Tech Stack
            </h2>
            <TechBadges techStack={project.techStack} />
          </section>
        )}

        {(project.timeline?.length ?? 0) > 0 && (
          <section className="reveal mb-12">
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
              Timeline
            </h2>
            <ErrorBoundary section="timeline">
              <Timeline timeline={project.timeline} />
            </ErrorBoundary>
          </section>
        )}

        {githubFullRepo && (
          <section className="reveal mb-12">
            <ErrorBoundary section="README">
              <ReadmeViewer repo={githubFullRepo} />
            </ErrorBoundary>
          </section>
        )}

        {hasLinks && (
          <section className="reveal">
            <ProjectLinks links={project.links} />
          </section>
        )}
      </div>
    </ScrollReveal>
  );
}
