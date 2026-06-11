"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SCROLLING_TEXT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const enterVariants = {
  hidden: { opacity: 0, x: "12vw" },
  visible: {
    opacity: 1,
    x: "0vw",
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isNearViewport = useInView(sectionRef, {
    once: true,
    amount: 0.35,
    margin: "0px 0px -15% 0px",
  });

  const phrase = `${SCROLLING_TEXT.parts[0]} ${SCROLLING_TEXT.parts[1]} ${SCROLLING_TEXT.parts[2]}`;
  const marqueeActive = isNearViewport && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden bg-white py-16 md:py-24"
      aria-label="Platform title section"
    >
      <motion.div
        className="flex overflow-hidden"
        variants={prefersReducedMotion ? {} : enterVariants}
        initial="hidden"
        animate={marqueeActive || prefersReducedMotion ? "visible" : "hidden"}
      >
        <div
          className={cn("flex w-max", marqueeActive && "spatial-marquee")}
          aria-hidden={!prefersReducedMotion}
        >
          {[0, 1, 2, 3].map((i) => (
            <p
              key={i}
              className="viewport-text-gradient whitespace-nowrap px-6 font-normal tracking-normal"
              style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 1.05 }}
            >
              {phrase}
              <span className="px-8 text-black/20">·</span>
            </p>
          ))}
        </div>
      </motion.div>
      {prefersReducedMotion && (
        <p className="sr-only">{phrase}</p>
      )}
    </section>
  );
}
