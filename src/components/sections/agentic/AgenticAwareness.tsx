"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AGENTIC_AWARENESS } from "@/lib/constants";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { fadeUp, fadeUpScale } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";
import { cn } from "@/lib/utils";

const SLIDES = AGENTIC_AWARENESS.slides;

const EASE = [0.25, 0.1, 0.25, 1] as const;

function SlideCounter({
  index,
  total,
  className,
}: {
  index: number;
  total: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-[26px] w-[66px] shrink-0 items-center gap-2.5 self-start overflow-hidden rounded-xl px-3 py-1 backdrop-blur-[10px]",
        className
      )}
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <span className="inline-flex h-4 items-center font-superground text-[18px] leading-none text-white">
        {index + 1}
      </span>
      <span className="inline-flex h-4 items-center gap-0.5 text-[16px] leading-none text-white/60">
        <span>/</span>
        <span>{total}</span>
      </span>
    </div>
  );
}

function SlideInfoCard({
  title,
  description,
  className,
  variant = "mobile",
}: {
  title: string;
  description: string;
  className?: string;
  variant?: "mobile" | "desktop";
}) {
  const surfaceStyle =
    variant === "desktop"
      ? {
          background: "rgba(10,12,16,0.55)",
          backdropFilter: "blur(14px) saturate(120%)",
          WebkitBackdropFilter: "blur(14px) saturate(120%)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        }
      : {
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(7.5px) saturate(120%)",
          WebkitBackdropFilter: "blur(7.5px) saturate(120%)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        };

  return (
    <div
      className={cn("rounded-[20px] border border-white/10 p-5 md:rounded-2xl md:p-7", className)}
      style={surfaceStyle}
    >
      <h3 className="text-[20px] font-medium leading-normal tracking-[-0.4px] text-white md:text-[clamp(24px,2.4vw,36px)] md:leading-[1.05] md:tracking-[-0.01em]">
        {title}
      </h3>
      <p className="mt-2.5 text-xs leading-5 text-white/70 md:mt-4 md:text-sm md:leading-[1.55] md:text-white/80 lg:text-[15px]">
        {description}
      </p>
    </div>
  );
}

function MobilePagination({
  index,
  onGoTo,
}: {
  index: number;
  onGoTo: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onGoTo(i)}
          className={cn(
            "h-1 cursor-pointer rounded-xl transition-all duration-500 ease-out",
            i === index ? "w-[62px] bg-black" : "w-5 bg-black/30 hover:bg-black/45"
          )}
        />
      ))}
    </div>
  );
}

function DesktopPagination({
  index,
  onGoTo,
}: {
  index: number;
  onGoTo: (next: number) => void;
}) {
  return (
    <div className="flex w-full max-w-[416px] items-center gap-1.5 pl-1">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onGoTo(i)}
          className={cn(
            "h-1 cursor-pointer rounded-full transition-all duration-500 ease-out",
            i === index
              ? "flex-[3] bg-white"
              : "flex-1 bg-white/30 hover:bg-white/50"
          )}
        />
      ))}
    </div>
  );
}

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
      className="relative px-3 pb-12 pt-16 md:px-[48px] md:pb-20 cv-auto"
      aria-label="Awareness engine across deployments"
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
        className="relative mx-auto flex w-full max-w-[1268px] flex-col items-center gap-6 md:items-stretch md:gap-0"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex w-full flex-col items-center px-3 text-center md:items-start md:px-0 md:text-left">
          <motion.span
            variants={prefersReducedMotion ? {} : fadeUp}
            className="block text-[14px] font-normal uppercase tracking-[0.22em] text-[#8fa6b0] md:text-[11px] md:font-medium md:text-black/45"
          >
            {AGENTIC_AWARENESS.tag}
          </motion.span>

          <motion.h2
            variants={prefersReducedMotion ? {} : fadeUp}
            className="mt-3 max-w-[820px] text-[32px] font-medium leading-9 tracking-[-0.64px] text-black md:mt-4 md:text-[clamp(32px,4vw,56px)] md:font-normal md:leading-[1.1] md:tracking-[-0.02em]"
          >
            {AGENTIC_AWARENESS.headline}
          </motion.h2>

          <motion.p
            variants={prefersReducedMotion ? {} : fadeUp}
            className="mt-3 max-w-[760px] text-[14px] leading-6 text-[#3e424d]/70 md:mt-5 md:text-base md:text-[#3e424d]/75"
          >
            {AGENTIC_AWARENESS.description}
          </motion.p>
        </div>

        <motion.div
          variants={prefersReducedMotion ? {} : fadeUpScale}
          className="flex w-full flex-col items-center gap-2.5 md:mt-12"
        >
          {/* Mobile carousel card */}
          <div className="relative w-full max-w-[406px] overflow-hidden rounded-[20px] md:hidden">
            <div className="relative aspect-[406/512] w-full bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0"
                >
                  <AutoplayVideo
                    src={slide.videoSrc}
                    ariaLabel={slide.title}
                    loadOnScroll
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 flex flex-col justify-between px-3 pb-4 pt-6">
                <SlideCounter index={index} total={SLIDES.length} />

                <div className="flex w-full justify-start">
                  <SlideInfoCard
                    title={slide.title}
                    description={slide.description}
                    className="w-full max-w-[309px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:hidden">
            <MobilePagination index={index} onGoTo={goTo} />
          </div>

          {/* Desktop carousel */}
          <div className="relative hidden w-full overflow-hidden rounded-3xl border border-black/10 bg-black/5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:block">
            <div className="relative aspect-[1268/640] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0"
                >
                  <AutoplayVideo
                    src={slide.videoSrc}
                    ariaLabel={slide.title}
                    loadOnScroll
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute left-6 top-6 hidden items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/85 backdrop-blur-sm md:flex">
                <span className="size-1.5 rounded-full bg-white" />
                {index + 1} / {SLIDES.length}
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 md:bottom-8 md:left-8 md:right-8">
                <div className="flex max-w-[560px] flex-col gap-[72px]">
                  <SlideInfoCard
                    variant="desktop"
                    title={slide.title}
                    description={slide.description}
                  />
                  <DesktopPagination index={index} onGoTo={goTo} />
                </div>

                <div className="flex shrink-0 items-center gap-3">
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
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
