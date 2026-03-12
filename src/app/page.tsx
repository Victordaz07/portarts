import { getPortfolioConfig, getPublishedProjects } from "@/lib/firestore";

export const dynamic = "force-dynamic";
import { Hero } from "@/components/home/Hero";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { TechMarquee } from "@/components/home/TechMarquee";
import { GitHubRepos } from "@/components/home/GitHubRepos";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default async function HomePage() {
  const [config, projects] = await Promise.all([
    getPortfolioConfig(),
    getPublishedProjects(),
  ]);

  return (
    <HomeScrollReveal>
      <section className="min-h-screen flex flex-col justify-center">
        <Hero config={config} />
      </section>

      <section id="projects" className="pt-24 pb-12">
        <div className="flex items-baseline gap-4 mb-11 reveal">
          <span className="font-mono text-xs text-accent opacity-50">01</span>
          <h2 className="font-display text-3xl md:text-4xl">Projects</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="reveal">
          <ErrorBoundary section="proyectos">
            <ProjectGrid projects={projects} />
          </ErrorBoundary>
        </div>
      </section>

      <section id="marquee">
        <div className="reveal">
          <TechMarquee items={config?.techStack ?? []} />
        </div>
      </section>

      <section id="github" className="pt-24 pb-12">
        <div className="flex items-baseline gap-4 mb-11 reveal">
          <span className="font-mono text-xs text-accent opacity-50">02</span>
          <h2 className="font-display text-3xl md:text-4xl">GitHub</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="reveal">
          <ErrorBoundary section="GitHub repos">
            <GitHubRepos username={config?.githubUsername ?? ""} />
          </ErrorBoundary>
        </div>
      </section>

      <section id="about" className="pt-24 pb-12">
        <div className="flex items-baseline gap-4 mb-11 reveal">
          <span className="font-mono text-xs text-accent opacity-50">03</span>
          <h2 className="font-display text-3xl md:text-4xl">About me</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="reveal">
          <ErrorBoundary section="sobre mí">
            <AboutSection config={config} />
          </ErrorBoundary>
        </div>
      </section>

      <section id="contact">
        <div className="reveal">
          <CTASection
            email={config?.email}
            socialLinks={config?.socialLinks}
          />
        </div>
      </section>
    </HomeScrollReveal>
  );
}
