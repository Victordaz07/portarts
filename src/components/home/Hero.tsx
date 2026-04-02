"use client";

import Link from "next/link";
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioConfig } from "@/lib/types";
import { resolveTechStackItems } from "@/lib/tech-stack";
import {
  resolveHeroHeadline,
  resolveHeroSubtitle,
} from "@/lib/hero-defaults";
import { ResumeButton } from "@/components/ResumeButton";
import { AnimatedStat } from "@/components/home/AnimatedStat";
import { HeroTechMarquee } from "@/components/home/HeroTechMarquee";

interface HeroProps {
  config: PortfolioConfig | null;
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const HERO_STATS = [
  { value: 9, suffix: "+", label: "Years in operations" },
  { value: 3, suffix: "+", label: "Production apps" },
  { value: 13, suffix: "+", label: "People managed" },
] as const;

export function Hero({ config }: HeroProps) {
  const headline = resolveHeroHeadline(config?.heroHeadline);
  const subtitle = resolveHeroSubtitle(config?.subtitle);
  const techItems = resolveTechStackItems(config);
  const prefersReduced = useReducedMotion();
  const staggerVariant = prefersReduced ? {} : stagger;
  const fadeUpVariant = prefersReduced ? {} : fadeUp;

  return (
    <section className="bg-white pt-1 pb-10 md:pt-2 md:pb-14">
      <motion.div
        variants={staggerVariant}
        initial={prefersReduced ? false : "hidden"}
        animate={prefersReduced ? false : "visible"}
      >
        <motion.div variants={fadeUpVariant} className="mb-5 w-full min-w-0">
          <HeroTechMarquee items={techItems} />
        </motion.div>

        <motion.h1
          variants={fadeUpVariant}
          className="font-body text-[40px] md:text-[58px] lg:text-[68px] font-bold leading-[0.98] tracking-tight mb-4 text-black max-w-[980px]"
        >
          {headline}
        </motion.h1>

        <motion.p
          variants={fadeUpVariant}
          className="text-text-secondary text-base md:text-xl max-w-[760px] leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div variants={fadeUpVariant} className="flex items-center gap-6 md:gap-8 py-6">
          {HERO_STATS.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 ? (
                <div
                  className="h-8 md:h-10 w-px bg-border shrink-0 self-stretch min-h-8 md:min-h-10"
                  aria-hidden
                />
              ) : null}
              <AnimatedStat
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </Fragment>
          ))}
        </motion.div>

        <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-3 mt-6">
          <Link
            href="/#projects"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition-opacity"
          >
            View my work
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-black bg-white text-black font-medium hover:bg-bg-hover transition-colors"
          >
            Let&apos;s talk
          </Link>
          <ResumeButton variant="ghost" />
        </motion.div>
      </motion.div>
    </section>
  );
}
