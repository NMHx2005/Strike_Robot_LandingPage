"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { AGENTIC_HERO, VIDEOS } from "@/lib/constants";
import { PillButton } from "@/components/ui/PillButton";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { ScrollVideoReveal } from "@/components/ui/ScrollVideoReveal";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";
import { REVEAL_OFFSET } from "@/components/animations/scrollVideoReveal";

export function AgenticHero() {
  const prefersReducedMotion = useReducedMotion();
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: videoWrapperRef,
    offset: REVEAL_OFFSET as unknown as ["start end", "center 65%"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.7, 0]);

  const titleMotionStyle = prefersReducedMotion
    ? undefined
    : { opacity: titleOpacity };

  return (
    <section
      className="relative z-10 flex flex-col items-center px-3 md:px-[48px]"
      aria-label="Agentic hero"
    >
      {/* Title block — vertically centered in viewport below navbar */}
      <motion.div
        className="grid w-full grid-cols-1 items-center gap-12 min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-128px)] pt-24 md:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        style={titleMotionStyle}
      >
        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="flex flex-col items-start"
        >
          <h1 className="font-superground bg-gradient-to-r from-black to-[#314344] bg-clip-text text-[clamp(42px,8vw,78px)] font-normal uppercase leading-none tracking-normal text-transparent [filter:drop-shadow(0_14px_24px_rgba(0,0,0,0.28))]">
            <span className="block">SR</span>
            <span className="block">AGENTIC</span>
          </h1>

          <span aria-hidden className="mt-4 block h-[6px] w-[44px] rounded-[2px] bg-[#020202]" />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <PillButton size="lg" showArrow className="pl-6 pr-5">
              {AGENTIC_HERO.ctaPrimary}
            </PillButton>
            <PillButton variant="outline" size="lg" showArrow={false}>
              {AGENTIC_HERO.ctaSecondary}
            </PillButton>
          </div>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="flex flex-col items-start"
        >
          <h2 className="max-w-[760px] text-[clamp(36px,4.4vw,68px)] font-normal leading-[1.05] tracking-[-0.02em] text-black">
            {AGENTIC_HERO.headlinePrefix}
            <span className="text-[#314344]">
              {AGENTIC_HERO.headlineAccent}
            </span>
          </h2>

          <p className="mt-6 max-w-[600px] text-base leading-6 text-black/70">
            {AGENTIC_HERO.description}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-sm text-black/75 backdrop-blur-sm">
            <Sparkles
              className="size-4 text-[#5a7c7c]"
              strokeWidth={1.8}
              aria-hidden
            />
            {AGENTIC_HERO.badge}
          </span>
        </motion.div>
      </motion.div>

      <ScrollVideoReveal
        className="mb-16 mt-4 max-w-[calc(100vw-24px)] md:max-w-[calc(100vw-96px)] md:mb-20"
        targetRef={videoWrapperRef}
      >
        <div className="relative aspect-[1632/720] overflow-hidden rounded-3xl border border-black/10 bg-black/5 shadow-[0_32px_90px_rgba(0,0,0,0.18)]">
          <AutoplayVideo
            src={VIDEOS.hero}
            ariaLabel="SR Agentic robotics task demonstration"
            loadOnScroll
          />
        </div>

        <p className="mx-auto mt-6 max-w-[760px] text-center text-sm leading-relaxed text-black/55 md:text-base">
          {AGENTIC_HERO.videoCaption}
        </p>
      </ScrollVideoReveal>
    </section>
  );
}
