"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_OEMS } from "@/lib/constants";
import { fadeUp, fadeUpScale } from "@/components/animations/fadeUp";
import {
  staggerContainer,
  staggerContainerSlow,
} from "@/components/animations/stagger";
import { cn } from "@/lib/utils";

function OEMBullet({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <>
      <div className="relative mx-auto flex size-[72px] shrink-0 items-center justify-center lg:mx-0">
        <Image
          src={icon}
          alt=""
          width={144}
          height={144}
          className="h-[72px] w-[72px] object-contain"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-[20px] font-medium leading-[1.2] tracking-[-0.2px] text-black">
          {title}
        </h3>
        <p className="mt-3 text-[14px] leading-[22px] text-[#3e424d]/75 lg:max-w-[460px]">
          {description}
        </p>
      </div>
    </>
  );
}

export function AgenticOEMs() {
  const prefersReducedMotion = useReducedMotion();
  const EASE = [0.25, 0.1, 0.25, 1] as const;

  return (
    <section
      id="oems"
      className="relative px-3 pb-24 pt-16 md:px-[48px] cv-auto"
      aria-label="Built for robotics teams and OEMs"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-3 right-3 top-0 h-px bg-black/15 md:left-[48px] md:right-[48px]"
        initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ transformOrigin: "50% 50%" }}
      />

      <motion.div
        className="relative mx-auto grid w-full max-w-[1268px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/45">
            {AGENTIC_OEMS.tag}
          </span>

          <h2 className="mt-4 text-[clamp(34px,3.6vw,52px)] font-normal leading-[1.08] tracking-[-0.02em] text-black">
            {AGENTIC_OEMS.headlinePart1}
            {AGENTIC_OEMS.headlinePart2}{" "}
            <span className="font-superground font-normal tracking-[-0.01em] text-[#2a3e3e]">
              {AGENTIC_OEMS.headlineAccent}
            </span>
          </h2>

          <p className="mt-5 max-w-[420px] text-[14.5px] leading-[1.55] text-[#3e424d]/75">
            {AGENTIC_OEMS.description}
          </p>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : staggerContainerSlow}
          className="order-2 flex flex-col lg:order-1"
        >
          {AGENTIC_OEMS.bullets.map((bullet, i) => (
            <motion.div
              key={bullet.title}
              variants={prefersReducedMotion ? {} : fadeUpScale}
              className={cn(
                "flex flex-col items-center gap-4 py-7 text-center",
                "lg:flex-row lg:items-start lg:gap-4 lg:py-0 lg:text-left",
                i > 0 && "border-t border-black/10 lg:mt-7 lg:border-t-0"
              )}
            >
              <OEMBullet
                title={bullet.title}
                description={bullet.description}
                icon={bullet.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
