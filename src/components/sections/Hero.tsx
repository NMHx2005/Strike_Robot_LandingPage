"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HERO, VIDEOS } from "@/lib/constants";
import { PillButton } from "@/components/ui/PillButton";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { ScrollVideoReveal } from "@/components/ui/ScrollVideoReveal";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

function PlatformIcon() {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.35) 0%, rgba(120,140,160,0.2) 100%)",
        }}
      />
      <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        aria-hidden="true"
        className="relative"
      >
        <path
          d="M10 1L18 6V16L10 21L2 16V6L10 1Z"
          stroke="rgba(180,200,220,0.9)"
          strokeWidth="1.2"
          fill="rgba(100,130,150,0.25)"
        />
      </svg>
    </span>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative z-10 flex flex-col items-center px-6 pt-32 pb-16 md:pt-36 md:pb-20">
      {/* Title block */}
      <motion.div
        className="mx-auto flex w-full max-w-[1200px] flex-col items-center"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-6 flex gap-2.5" variants={prefersReducedMotion ? {} : fadeUp}>
          {[HERO.badge1, HERO.badge2].map((badge) => (
            <span
              key={badge.label}
              className="flex h-[25px] items-center gap-2.5 rounded-lg px-2 text-sm font-normal"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1.5px solid rgba(255,255,255,0.4)",
                color: badge.color,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <circle cx="5" cy="5" r="5" fill={badge.color} />
              </svg>
              {badge.label}
            </span>
          ))}
        </motion.div>

        <motion.h1
          className="max-w-[1200px] text-center text-[clamp(40px,4.6vw,72px)] font-normal leading-[1.05] tracking-[-0.02em] text-black"
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          {HERO.headlinePrefix}
          <span className="text-[#314344]">{HERO.headlineAccent}</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-[800px] text-center text-base leading-6 text-black/70"
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          {HERO.description}
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 py-6"
          variants={prefersReducedMotion ? {} : fadeUp}
        >
          <PillButton size="lg" icon={<PlatformIcon />} showArrow={false} className="pl-4 pr-6 tracking-[-0.02em]">
            {HERO.ctaPrimary}
          </PillButton>
          <PillButton variant="outline" size="lg">
            {HERO.ctaSecondary}
          </PillButton>
        </motion.div>
      </motion.div>

      <ScrollVideoReveal className="mt-4 max-w-[calc(100vw-96px)]">
        <div className="relative aspect-[1200/484] overflow-hidden rounded-3xl border border-black/10 bg-black/5 shadow-[0_32px_90px_rgba(0,0,0,0.18)]">
          <AutoplayVideo
            src={VIDEOS.hero}
            ariaLabel="SR Platform simulation environment with robotic arms"
            loadOnScroll
          />
        </div>
      </ScrollVideoReveal>
    </section>
  );
}
