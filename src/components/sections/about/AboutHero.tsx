"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ABOUT_HERO } from "@/lib/constants";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";
import { AnimatedButtonLabel } from "@/components/ui/AnimatedButtonLabel";

const darkGradient =
  "linear-gradient(131deg, rgb(51, 51, 51) 0.79%, rgb(13, 13, 13) 35.22%, rgb(38, 38, 38) 99.16%)";

const tapEase = [0.25, 0.1, 0.25, 1] as const;

const XIcon = (
  <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  X: XIcon,
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (
    <svg width="12" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Discord: (
    <svg width="20" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 12.916 12.916 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.165 12.165 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

export function AboutHero() {
  const prefersReducedMotion = useReducedMotion();
  const [followHovered, setFollowHovered] = useState(false);

  const followTap = prefersReducedMotion
    ? {}
    : { whileTap: { scale: 0.97 }, transition: { duration: 0.2, ease: tapEase } };

  return (
    <section
      className="relative overflow-hidden px-3 md:px-12 cv-auto"
      aria-label="About StrikeRobot"
    >
      {/* Robot hands — centered behind the columns on desktop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden items-end justify-center md:flex"
      >
        <Image
          src={ABOUT_HERO.image}
          alt=""
          width={760}
          height={836}
          priority
          className="h-auto w-[clamp(260px,36vw,540px)] select-none object-contain"
          draggable={false}
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full flex-col pb-12 pt-28 md:min-h-[100dvh] md:pb-16 md:pt-36"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-1 flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Title block */}
          <motion.div
            variants={prefersReducedMotion ? {} : fadeUp}
            className="flex flex-col items-start"
          >
            <h1 className="bg-gradient-to-r from-black to-[#314344] bg-clip-text text-[clamp(56px,9vw,96px)] font-normal leading-[1.02] tracking-[-0.02em] text-transparent">
              <span className="block">{ABOUT_HERO.titlePrefix}</span>
              <span className="block text-[clamp(52px,8.4vw,88px)]">
                {ABOUT_HERO.titleAccent}
              </span>
            </h1>

            <span
              aria-hidden
              className="mt-6 block h-1.5 w-11 rounded-[2px] bg-[#020202]"
            />

            <motion.a
              href={ABOUT_HERO.followHref}
              onMouseEnter={() => setFollowHovered(true)}
              onMouseLeave={() => setFollowHovered(false)}
              className="mt-7 flex w-auto cursor-pointer select-none items-center justify-center gap-2 rounded-3xl px-[50px] py-[17px] text-[16px] font-medium tracking-[-0.32px] text-white"
              style={{
                background: darkGradient,
                border: "2px solid #0d0d0d",
                boxShadow:
                  "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.2)",
              }}
              {...followTap}
            >
              <span className="flex items-center gap-2">
                <AnimatedButtonLabel active={followHovered}>
                  {ABOUT_HERO.followLabel}
                </AnimatedButtonLabel>
                <span className="flex size-4 items-center justify-center">
                  {XIcon}
                </span>
              </span>
              <ArrowRight className="size-[18px] shrink-0 text-white/80" strokeWidth={2} />
            </motion.a>
          </motion.div>

          {/* Mobile hands image */}
          <div aria-hidden className="flex justify-center md:hidden">
            <Image
              src={ABOUT_HERO.image}
              alt=""
              width={760}
              height={836}
              className="h-auto w-[min(360px,78vw)] select-none object-contain"
              draggable={false}
            />
          </div>

          {/* Description block */}
          <motion.div
            variants={prefersReducedMotion ? {} : fadeUp}
            className="flex flex-col md:max-w-[420px] md:pt-2"
          >
            {/* <span
              aria-hidden
              className="mb-5 hidden items-center gap-2 text-black/30 md:flex"
            >
              <span className="h-px w-16 bg-current" />
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </span> */}
            <p className="text-[20px] leading-[30px] tracking-[-0.4px] text-black md:text-[32px] md:leading-[48px] md:tracking-[-0.64px]">
              {ABOUT_HERO.description}
            </p>
          </motion.div>
        </div>

        {/* Social links */}
        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="mt-12 flex items-center gap-3 opacity-60 md:mt-0"
          role="list"
          aria-label="Social links"
        >
          {ABOUT_HERO.socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              role="listitem"
              aria-label={label}
              className="flex size-9 items-center justify-center rounded-[10px] bg-black/[0.06] text-[#3e424d] transition-colors duration-200 hover:bg-black/[0.1]"
            >
              {SOCIAL_ICONS[label]}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
