import { Suspense } from "react";
import { HomeScrollReveal } from "@/components/home/HomeScrollReveal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  HomeHeroAsync,
  HomeMiniBioAsync,
  HomeProjectsAsync,
  HomeLowerAsync,
} from "@/components/home/HomeAsyncSections";

export const dynamic = "force-dynamic";

function SectionSpinner({ minHeight }: { minHeight: string }) {
  return (
    <div
      className={`${minHeight} flex items-center justify-center bg-white`}
      aria-busy
    >
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeScrollReveal>
      <Suspense fallback={<SectionSpinner minHeight="min-h-[260px]" />}>
        <HomeHeroAsync />
      </Suspense>

      <Suspense fallback={<SectionSpinner minHeight="min-h-[80px]" />}>
        <HomeMiniBioAsync />
      </Suspense>

      <Suspense fallback={<SectionSpinner minHeight="min-h-[200px]" />}>
        <HomeProjectsAsync />
      </Suspense>

      <Suspense
        fallback={<SectionSpinner minHeight="min-h-[320px] bg-[#f9fafb]" />}
      >
        <HomeLowerAsync />
      </Suspense>
    </HomeScrollReveal>
  );
}
