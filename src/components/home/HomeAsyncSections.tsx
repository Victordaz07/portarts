import {
  getPortfolioConfig,
  getPublishedProjects,
} from "@/lib/firestore-server";
import { Hero } from "@/components/home/Hero";
import { MiniBio } from "@/components/home/MiniBio";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { GitHubRepos } from "@/components/home/GitHubRepos";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export async function HomeHeroAsync() {
  const config = await getPortfolioConfig();
  return (
    <section className="bg-white" data-analytics-section="hero">
      <Hero config={config} />
    </section>
  );
}

export async function HomeMiniBioAsync() {
  const config = await getPortfolioConfig();
  return <MiniBio config={config} />;
}

export async function HomeProjectsAsync() {
  const projects = await getPublishedProjects();
  return (
    <section id="projects" className="pt-10 pb-14 bg-white" data-analytics-section="projects">
      <div className="reveal">
        <ErrorBoundary section="proyectos">
          <ProjectGrid projects={projects} />
        </ErrorBoundary>
      </div>
    </section>
  );
}

export async function HomeLowerAsync() {
  const config = await getPortfolioConfig();
  return (
    <>
      <section id="github" className="pt-16 pb-14 bg-[#f9fafb]" data-analytics-section="github">
        <div className="flex items-baseline gap-4 mb-11 reveal">
          <span className="font-mono text-xs text-accent">02</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">GitHub</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="reveal">
          <ErrorBoundary section="GitHub repos">
            <GitHubRepos username={config?.githubUsername ?? ""} />
          </ErrorBoundary>
        </div>
      </section>

      <section id="about" className="pt-16 pb-14 bg-white" data-analytics-section="about">
        <div className="flex items-baseline gap-4 mb-11 reveal">
          <span className="font-mono text-xs text-accent">03</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black">About me</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="reveal">
          <ErrorBoundary section="sobre mí">
            <AboutSection config={config} />
          </ErrorBoundary>
        </div>
      </section>

      <section id="contact" className="pt-6 pb-6 bg-white" data-analytics-section="contact">
        <div className="reveal">
          <CTASection
            email={config?.email}
            socialLinks={config?.socialLinks}
          />
        </div>
      </section>
    </>
  );
}
