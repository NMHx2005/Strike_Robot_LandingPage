"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_PARTNERS } from "@/lib/constants";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer, staggerItem } from "@/components/animations/stagger";
import { cn } from "@/lib/utils";

// Natural pixel dimensions of each logo PNG, used to keep next/image ratio correct.
const LOGO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/about/Logo Partners/Virtuals Protocol.png": { width: 210, height: 100 },
  "/about/Logo Partners/Base.png": { width: 210, height: 100 },
  "/about/Logo Partners/Reppo.png": { width: 210, height: 100 },
  "/about/Logo Partners/Eastworlds.png": { width: 210, height: 100 },
  "/about/Logo Partners/Venice.png": { width: 210, height: 100 },
  "/about/Logo Partners/Orboh.png": { width: 210, height: 100 },
};

const FALLBACK_DIMENSIONS = { width: 240, height: 80 };

// Mobile-only: one infinite marquee row. Logos are duplicated once so the
// translateX(-50%) loop is seamless; the duplicate set is hidden from a11y.
function LogoMarqueeRow({ direction }: { direction: "left" | "right" }) {
  const items = [...ABOUT_PARTNERS.logos, ...ABOUT_PARTNERS.logos];

  return (
    <div className="w-full overflow-hidden">
      <div
        className={cn(
          "flex w-max",
          direction === "left" ? "marquee-track-left" : "marquee-track-right"
        )}
      >
        {items.map((logo, i) => {
          const dimensions = LOGO_DIMENSIONS[logo.src] ?? FALLBACK_DIMENSIONS;
          const isClone = i >= ABOUT_PARTNERS.logos.length;

          return (
            <div
              key={`${logo.name}-${i}`}
              className="mr-4 shrink-0"
              aria-hidden={isClone}
            >
              <div className="flex h-[76px] w-[160px] items-center justify-center rounded-[16px] border-b border-[#0000001a] bg-white px-4">
                <Image
                  src={logo.src}
                  alt={isClone ? "" : logo.name}
                  width={dimensions.width}
                  height={dimensions.height}
                  className={cn(
                    "h-[40px] w-auto max-w-[120px] object-contain",
                    logo.invert && "invert"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AboutPartners() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="partners"
      aria-label="Trusted partners"
      className="relative px-[32px] py-20 md:px-12 md:py-[229px] cv-auto"
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-12"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.h2
            variants={prefersReducedMotion ? {} : fadeUp}
            className="text-[clamp(34px,5vw,64px)] font-normal leading-[1.1] tracking-[-1.28px] text-black"
          >
            {ABOUT_PARTNERS.headline}
          </motion.h2>

          <motion.p
            variants={prefersReducedMotion ? {} : fadeUp}
            className="max-w-[620px] text-[14px] leading-[24px] text-[#3e424d] opacity-70"
          >
            {ABOUT_PARTNERS.description}
          </motion.p>
        </div>

        {/* Mobile: two opposite-direction marquee rows (top → right, bottom → left) */}
        <div className="flex w-full flex-col gap-4 md:hidden">
          <LogoMarqueeRow direction="right" />
          <LogoMarqueeRow direction="left" />
        </div>

        {/* Desktop: static 4 / 2 grid */}
        <div className="hidden w-full flex-wrap justify-center gap-4 md:flex">
          {ABOUT_PARTNERS.logos.map((logo, i) => {
            const dimensions = LOGO_DIMENSIONS[logo.src] ?? FALLBACK_DIMENSIONS;

            return (
              <motion.div
                key={`${logo.name}-${i}`}
                variants={prefersReducedMotion ? {} : staggerItem}
                className="w-[calc(50%-0.5rem)] [perspective:1400px] md:w-[calc(25%-0.75rem)]"
              >
                <div className="group flex w-full items-center justify-center rounded-[16px] border-b border-[#0000001a] bg-white px-6 py-4 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform md:hover:[transform:rotateX(4deg)_rotateY(-6deg)_scale(1.02)] md:hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)]">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={dimensions.width}
                    height={dimensions.height}
                    className={cn(
                      "h-[100px] w-auto max-w-[240px] object-contain",
                      logo.invert && "invert"
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
