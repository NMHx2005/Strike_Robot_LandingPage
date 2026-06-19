"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AGENTIC_AWARENESS } from "@/lib/constants";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";
import { cn } from "@/lib/utils";

const SLIDES = AGENTIC_AWARENESS.slides;

export function AgenticAwareness() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const goTo = (next: number) => {
    const total = SLIDES.length;
    const wrapped = ((next % total) + total) % total;
    setIndex(wrapped);
  };

  return (
    <section
      id="awareness"
      className="relative px-3 pb-20 pt-12 md:px-[48px] cv-auto"
      aria-label="Awareness engine across deployments"
    >
      <motion.div
        className="mx-auto w-full max-w-[1268px]"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.span
          variants={prefersReducedMotion ? {} : fadeUp}
          className="block text-[11px] font-medium uppercase tracking-[0.22em] text-black/45"
        >
          {AGENTIC_AWARENESS.tag}
        </motion.span>

        <motion.h2
          variants={prefersReducedMotion ? {} : fadeUp}
          className="mt-4 max-w-[820px] text-[clamp(32px,4vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] text-black"
        >
          {AGENTIC_AWARENESS.headline}
        </motion.h2>

        <motion.p
          variants={prefersReducedMotion ? {} : fadeUp}
          className="mt-5 max-w-[760px] text-base leading-6 text-[#3e424d]/75"
        >
          {AGENTIC_AWARENESS.description}
        </motion.p>

        <motion.div
          variants={prefersReducedMotion ? {} : fadeUp}
          className="relative mt-12 overflow-hidden rounded-3xl border border-black/10 bg-black/5 shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
        >
          <div className="relative aspect-[1268/640] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <AutoplayVideo
                  src={slide.videoSrc}
                  ariaLabel={slide.title}
                  loadOnScroll
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/85 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-white" />
              {index + 1} / {SLIDES.length}
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 md:bottom-8 md:left-8 md:right-8">
              {/* Left column: info card on top, slide indicator 72px below it */}
              <div className="flex max-w-[560px] flex-col gap-[72px]">
                <div
                  className="rounded-2xl border border-white/10 p-6 md:p-7"
                  style={{
                    background: "rgba(10,12,16,0.55)",
                    backdropFilter: "blur(14px) saturate(120%)",
                    WebkitBackdropFilter: "blur(14px) saturate(120%)",
                    boxShadow:
                      "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  <h3 className="text-[clamp(24px,2.4vw,36px)] font-medium leading-[1.05] tracking-[-0.01em] text-white">
                    {slide.title}
                  </h3>
                  <p className="mt-4 text-sm leading-[1.55] text-white/80 md:text-[15px]">
                    {slide.description}
                  </p>
                </div>

                {/* Slide indicator — separated from the card (Figma 416×4,
                    gap 6, pad-left 4). Active segment slides + grows brighter;
                    others shrink/dim. */}
                <div className="flex w-full max-w-[416px] items-center gap-1.5 pl-1">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={cn(
                        "h-1 cursor-pointer rounded-full transition-all duration-500 ease-out",
                        i === index
                          ? "flex-[3] bg-white"
                          : "flex-1 bg-white/30 hover:bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-3 md:flex">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => goTo(index - 1)}
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronLeft className="size-5" strokeWidth={2.75} />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => goTo(index + 1)}
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <ChevronRight className="size-5" strokeWidth={2.75} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
