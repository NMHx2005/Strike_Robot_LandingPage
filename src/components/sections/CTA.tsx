"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { VIDEO_CTA } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

export function CTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="cta"
      className="relative px-3 pb-16 pt-4 md:px-12"
      aria-label="Call to action section"
    >
      <motion.div
        className="relative mx-auto max-w-[1632px] overflow-hidden rounded-3xl"
        style={{ minHeight: 423 }}
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={VIDEO_CTA.background}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center"
          sizes="(max-width: 1632px) 100vw, 1632px"
        />

        <motion.div
          className="relative z-10 flex min-h-[423px] flex-col items-center justify-center px-8 py-16 text-center"
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            variants={prefersReducedMotion ? {} : fadeUp}
            className="max-w-[800px] text-[clamp(36px,4.5vw,72px)] font-normal leading-[1.05] tracking-[-0.02em] text-white"
          >
            {VIDEO_CTA.headlineLine1}
            <br />
            {VIDEO_CTA.headlineLine2}
          </motion.h2>

          <motion.div variants={prefersReducedMotion ? {} : fadeUp} className="mt-6 py-6">
            <PillButtonCta showShadow>{VIDEO_CTA.cta}</PillButtonCta>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
