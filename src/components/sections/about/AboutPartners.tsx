"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_PARTNERS } from "@/lib/constants";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer, staggerItem } from "@/components/animations/stagger";
import { cn } from "@/lib/utils";

// Natural pixel dimensions of each logo PNG, used to keep next/image ratio correct.
const LOGO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/about/partner-virtuals.png": { width: 2838, height: 971 },
  "/about/partner-base.png": { width: 1281, height: 325 },
  "/about/partner-reppo.png": { width: 429, height: 143 },
};

const FALLBACK_DIMENSIONS = { width: 240, height: 80 };

export function AboutPartners() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="partners"
      aria-label="Trusted partners"
      className="relative px-3 py-20 md:px-12 md:py-[229px] cv-auto"
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-12"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <motion.h2
            variants={prefersReducedMotion ? {} : fadeUp}
            className="text-[clamp(34px,5vw,64px)] font-normal leading-[1.1] tracking-[-1.28px] text-black"
          >
            {ABOUT_PARTNERS.headline}
          </motion.h2>

          <motion.p
            variants={prefersReducedMotion ? {} : fadeUp}
            className="max-w-[620px] text-[16px] leading-[24px] text-[#3e424d] opacity-70"
          >
            {ABOUT_PARTNERS.description}
          </motion.p>
        </div>

        <div className="flex w-full flex-wrap justify-center gap-4">
          {ABOUT_PARTNERS.logos.map((logo, i) => {
            const dimensions = LOGO_DIMENSIONS[logo.src] ?? FALLBACK_DIMENSIONS;

            return (
              <motion.div
                key={`${logo.name}-${i}`}
                variants={prefersReducedMotion ? {} : staggerItem}
                className="flex h-[100px] w-[calc(50%-0.5rem)] items-center justify-center rounded-[16px] border-b border-black/10 bg-white px-6 py-4 md:w-[240px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={dimensions.width}
                  height={dimensions.height}
                  className={cn(
                    "h-[40px] w-auto max-w-[180px] object-contain",
                    logo.invert && "invert"
                  )}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
