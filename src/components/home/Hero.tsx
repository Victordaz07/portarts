"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioConfig } from "@/lib/types";
import {
  resolveAiWorkflowItems,
  resolveFrontendStackItems,
} from "@/lib/tech-stack";
import {
  resolveHeroHeadline,
  resolveHeroSubtitle,
} from "@/lib/hero-defaults";
import { AnimatedStat } from "@/components/home/AnimatedStat";
import {
  AiWorkflowPills,
  HeroDevStackMarquee,
} from "@/components/home/HeroTechMarquee";
import { MiniBioIntroBlock } from "@/components/home/MiniBio";
import { IntroStatementBlock } from "@/components/home/IntroStatementBlock";

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
  const frontendStackItems = resolveFrontendStackItems(config);
  const aiWorkflowItems = resolveAiWorkflowItems(config);
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
          <HeroDevStackMarquee frontendItems={frontendStackItems} />
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

        <motion.div
          variants={fadeUpVariant}
          className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 lg:items-start"
        >
          <div className="min-w-0 space-y-6 lg:space-y-8">
            <div className="flex items-center gap-6 md:gap-8 py-6 lg:py-0 min-w-0 overflow-x-auto">
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
            </div>
            <MiniBioIntroBlock
              config={config}
              className="max-w-xl border-t border-border/50 pt-8 lg:border-t-0 lg:pt-0"
            />
          </div>

          <motion.div
            variants={fadeUpVariant}
            className="flex min-w-0 flex-col border-t border-border/50 pt-8 lg:border-t-0 lg:border-l lg:border-border/50 lg:pl-10 xl:pl-12 lg:pt-0.5"
          >
            <AiWorkflowPills items={aiWorkflowItems} />
            <IntroStatementBlock config={config} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
