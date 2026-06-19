"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_CTA } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";
import { CircularText } from "@/components/ui/CircularText";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

export function AgenticCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="cta"
      className="relative px-3 pb-16 pt-4 md:px-12 cv-auto"
      aria-label="Agentic call to action"
    >
      <motion.div
        className="relative mx-auto max-w-[1632px] overflow-hidden rounded-3xl bg-black"
        style={{ minHeight: 423 }}
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={AGENTIC_CTA.background}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center"
          sizes="(max-width: 1632px) 100vw, 1632px"
        />

        <nav
          aria-label="Agentic quick links"
          className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 text-[13px] text-white/75 md:flex lg:left-12"
        >
          {AGENTIC_CTA.sidebarLinks.map((link, i) => (
            <a
              key={`${link.label}-${i}`}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <CircularText
          text={AGENTIC_CTA.rotatingBadge}
          diameter={264}
          fontSize={18}
          letterSpacing={0.22}
          durationSeconds={28}
          className="absolute right-[-10%] top-[25%] z-[5] hidden h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 text-white opacity-60 sm:block md:h-[180px] md:w-[180px] lg:h-[220px] lg:w-[220px] xl:h-[264px] xl:w-[264px]"
        />

        <motion.div
          className="relative z-10 flex min-h-[423px] flex-col items-center justify-center px-8 py-16 text-center"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p
            variants={prefersReducedMotion ? {} : fadeUp}
            className="text-base font-normal text-white/85 md:text-lg"
          >
            {AGENTIC_CTA.subtitle}
          </motion.p>

          <motion.h2
            variants={prefersReducedMotion ? {} : fadeUp}
            className="mt-2 font-superground text-[clamp(56px,10vw,140px)] font-normal leading-none tracking-[0.02em] text-white"
          >
            {AGENTIC_CTA.wordmark}
          </motion.h2>

          <motion.div
            variants={prefersReducedMotion ? {} : fadeUp}
            className="mt-8 py-2"
          >
            <PillButtonCta showShadow>{AGENTIC_CTA.cta}</PillButtonCta>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
