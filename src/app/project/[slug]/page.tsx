import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/firestore-server";
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
import { BrowserMockup } from "@/components/BrowserMockup";
import { MobileMockup } from "@/components/MobileMockup";
import type { Project } from "@/lib/types";

const MOBILE_MOCKUP_SLUGS = new Set(["familydash", "xthegospel"]);

function resolveProjectHeroImage(project: Project): string | null {
  const explicit = project.coverImage?.trim();
  if (explicit) return explicit;
  const first = project.gallery?.find((g) => g.url?.trim());
  return first?.url?.trim() ?? null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found" };
  }
  const description =
    project.description?.trim() || project.tagline?.trim() || "";
  const coverUrl =
    project.coverImage?.trim() ||
    project.gallery?.find((g) => g.url?.trim())?.url?.trim();
  const ogImages = coverUrl
    ? [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: `${project.name} — screenshot`,
        },
      ]
    : undefined;

  return {
    title: project.name,
    description,
    openGraph: {
      title: `${project.name} | Victor Ruiz`,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Victor Ruiz`,
      description,
      images: coverUrl ? [coverUrl] : undefined,
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

  const heroImageUrl = resolveProjectHeroImage(project);
  const useMobileMockup = MOBILE_MOCKUP_SLUGS.has(project.slug);

  return (
    <ScrollReveal>
      <div data-analytics-section="project-page">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all mt-8 mb-9"
        >
          ← Back to projects
        </Link>

        <div data-analytics-section="project-hero">
          <ProjectHero project={project} />
        </div>

        {heroImageUrl ? (
          <section className="reveal mb-12" data-analytics-section="project-media">
            {useMobileMockup ? (
              <MobileMockup
                src={heroImageUrl}
                alt={`${project.name} — app screenshot`}
                className="my-8"
              />
            ) : (
              <BrowserMockup
                src={heroImageUrl}
                alt={`${project.name} — screenshot`}
                className="my-8"
              />
            )}
          </section>
        ) : null}

        {previewsToRender.length > 0 ? (
          previewsToRender.map((p, i) => (
            <section
              key={`preview-${i}`}
              className="reveal mb-14"
              data-analytics-section="project-interactive"
            >
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
          <section className="reveal mb-14" data-analytics-section="project-interactive">
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
          <section className="reveal mb-12" data-analytics-section="project-details">
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
              Features
            </h2>
            <ErrorBoundary section="features">
              <FeatureGrid features={project.features} />
            </ErrorBoundary>
          </section>
        )}

        {(project.techStack?.length ?? 0) > 0 && (
          <section className="reveal mb-12" data-analytics-section="project-details">
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
              Tech Stack
            </h2>
            <TechBadges techStack={project.techStack} />
          </section>
        )}

        {(project.timeline?.length ?? 0) > 0 && (
          <section className="reveal mb-12" data-analytics-section="project-details">
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border">
              Timeline
            </h2>
            <ErrorBoundary section="timeline">
              <Timeline timeline={project.timeline} />
            </ErrorBoundary>
          </section>
        )}

        {githubFullRepo && (
          <section className="reveal mb-12" data-analytics-section="project-readme">
            <ErrorBoundary section="README">
              <ReadmeViewer repo={githubFullRepo} />
            </ErrorBoundary>
          </section>
        )}

        {hasLinks && (
          <section className="reveal" data-analytics-section="project-links">
            <ProjectLinks links={project.links} />
          </section>
        )}
      </div>
    </ScrollReveal>
  );
}
