"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_OEMS } from "@/lib/constants";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

export function AgenticOEMs() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="oems"
      className="relative px-3 pb-24 pt-16 md:px-[48px] cv-auto"
      aria-label="Built for robotics teams and OEMs"
    >
      <motion.div
        className="mx-auto grid w-full max-w-[1268px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="flex flex-col gap-7 lg:order-1"
        >
          {AGENTIC_OEMS.bullets.map((bullet) => (
            <motion.div
              key={bullet.title}
              variants={prefersReducedMotion ? {} : fadeUp}
              className="flex gap-4"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center">
                <Image
                  src={bullet.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="h-10 w-10 object-contain"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-medium leading-snug text-black">
                  {bullet.title}
                </h3>
                <p className="mt-2 max-w-[460px] text-[13.5px] leading-[1.55] text-[#3e424d]/75">
                  {bullet.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="flex flex-col lg:order-2 lg:items-start"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/45">
            {AGENTIC_OEMS.tag}
          </span>

          <h2 className="mt-4 text-[clamp(34px,3.6vw,52px)] font-normal leading-[1.08] tracking-[-0.02em] text-black">
            {AGENTIC_OEMS.headlinePart1}
            {AGENTIC_OEMS.headlinePart2}{" "}
            <span className="font-superground font-normal uppercase tracking-[-0.01em] text-[#2a3e3e]">
              {AGENTIC_OEMS.headlineAccent}
            </span>
          </h2>

          <p className="mt-5 max-w-[420px] text-[14.5px] leading-[1.55] text-[#3e424d]/75">
            {AGENTIC_OEMS.description}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
