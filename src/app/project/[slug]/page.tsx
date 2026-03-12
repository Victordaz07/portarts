import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/firestore";
import { DevicePreview } from "@/components/project/DevicePreview";
import { ProjectHero } from "@/components/project/ProjectHero";
import { FeatureGrid } from "@/components/project/FeatureGrid";
import { TechBadges } from "@/components/project/TechBadges";
import { Timeline } from "@/components/project/Timeline";
import { ReadmeViewer } from "@/components/project/ReadmeViewer";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

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

  const hasRepo = !!project.githubRepo;
  const hasLinks =
    project.links &&
    Object.values(project.links).some((v) => v && typeof v === "string");

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all mt-8 mb-9"
      >
        ← Back to projects
      </Link>

      <ProjectHero project={project} />

      <section className="reveal mb-14">
        <h2 className="font-display text-2xl mb-5 pb-2 border-b border-border">
          🖥 Interactive Preview
        </h2>
        <ErrorBoundary section="preview">
          <DevicePreview
            url={project.preview?.url ?? ""}
            type={project.preview?.type ?? "desktop"}
            allowFullscreen={project.preview?.allowFullscreen ?? true}
          />
        </ErrorBoundary>
      </section>

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

      {hasRepo && (
        <section className="reveal mb-12">
          <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
            📄 README
          </h2>
          <div className="bg-bg-raised border border-border rounded-card p-6 max-h-[500px] overflow-y-auto">
            <ErrorBoundary section="README">
              <ReadmeViewer repo={project.githubRepo!} />
            </ErrorBoundary>
          </div>
        </section>
      )}

      {hasLinks && (
        <section className="reveal">
          <ProjectLinks links={project.links} />
        </section>
      )}
    </div>
  );
}
