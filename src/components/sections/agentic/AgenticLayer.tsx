"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_LAYER_SECTION, AGENTIC_PARTS } from "@/lib/constants";
import { fadeUp, fadeUpScale } from "@/components/animations/fadeUp";
import {
  staggerContainer,
  staggerContainerSlow,
} from "@/components/animations/stagger";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const HEADER_BAND_MIN_H = 206;
const BRACKET_HEIGHT = 173;
const BRACKET_TOP = (HEADER_BAND_MIN_H - BRACKET_HEIGHT) / 2;
const LINE_LEFT = 10;

const LEFT_BRACKET_D =
  "M0.391113 0.311523L9.77805 12.0984C11.4699 14.2228 12.3911 16.8582 12.3911 19.574V153.049C12.3911 155.765 11.4699 158.4 9.77804 160.525L0.391113 172.312";
const RIGHT_BRACKET_D =
  "M12.5 0.311523L3.11307 12.0984C1.42121 14.2228 0.5 16.8582 0.5 19.574V153.049C0.5 155.765 1.42121 158.4 3.11307 160.525L12.5 172.312";

export function AgenticLayer() {
  const prefersReducedMotion = useReducedMotion();

  // Header band height drives the bottom line + side brackets so they always
  // sit at the band's real bottom edge — the headline can wrap to multiple
  // lines without the text overflowing past the bottom rule.
  const headerRef = useRef<HTMLDivElement>(null);
  const [bandHeight, setBandHeight] = useState(HEADER_BAND_MIN_H);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let rafId: number | null = null;
    const ro = new ResizeObserver(() => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setBandHeight(el.offsetHeight);
      });
    });
    ro.observe(el);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const bracketHeight = bandHeight - BRACKET_TOP * 2;

  return (
    <section
      id="intelligence-layer"
      className="relative bg-transparent pt-[80px] md:pt-[110px]"
      aria-label="Intelligence layer breakdown"
    >
      <div className="relative mx-6 md:mx-[48px]">
        {/* Top horizontal line of header band — full frame width */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-black/15"
          initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ transformOrigin: "50% 50%" }}
        />

        {/* Bottom horizontal line of header band — full frame width */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 h-px bg-black/15"
          style={{ top: bandHeight, transformOrigin: "50% 50%" }}
          initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        />

        {/* Left bracket SVG — at outer frame edge */}
        <motion.svg
          aria-hidden
          width="13"
          height={bracketHeight}
          viewBox="0 0 13 173"
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none absolute hidden md:block"
          style={{ left: 0, top: BRACKET_TOP }}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
        >
          <path d={LEFT_BRACKET_D} stroke="black" strokeOpacity="0.15" />
        </motion.svg>

        {/* Right bracket SVG — at outer frame edge */}
        <motion.svg
          aria-hidden
          width="13"
          height={bracketHeight}
          viewBox="0 0 13 173"
          preserveAspectRatio="none"
          fill="none"
          className="pointer-events-none absolute hidden md:block"
          style={{ right: 0, top: BRACKET_TOP }}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
        >
          <path d={RIGHT_BRACKET_D} stroke="black" strokeOpacity="0.15" />
        </motion.svg>

        {/* Inner content — locked at max 1268px, centered (matches Features.tsx
            on the homepage). Contains the text, parts grid, and the vertical
            line so it stays 50px from the content's left edge at any width. */}
        <div className="relative mx-auto w-full max-w-[1268px]">
          {/* Single continuous vertical line — 50px left of content text */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-black/15 hidden md:block"
            style={{ left: LINE_LEFT, transformOrigin: "50% 0%" }}
            initial={prefersReducedMotion ? undefined : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          />

          {/* Header band content */}
          <div
            ref={headerRef}
            className="relative md:pl-[60px] md:pr-[60px]"
            style={{ minHeight: HEADER_BAND_MIN_H }}
          >
            <motion.div
              variants={prefersReducedMotion ? {} : staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="py-12 max-w-[913px]"
            >
              <motion.h2
                variants={prefersReducedMotion ? {} : fadeUp}
                className="text-[clamp(32px,4vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] text-black"
              >
                {AGENTIC_LAYER_SECTION.headline}
              </motion.h2>
              <motion.p
                variants={prefersReducedMotion ? {} : fadeUp}
                className="mt-4 max-w-[913px] text-base leading-6 text-[#3e424d]/70"
              >
                {AGENTIC_LAYER_SECTION.description}
              </motion.p>
            </motion.div>
          </div>

          {/* Parts grid — gentle A→B→C→D reveal (slower stagger) */}
          <motion.div
            className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:pl-[60px] md:pr-[60px] lg:grid-cols-4 lg:gap-6"
            variants={prefersReducedMotion ? {} : staggerContainerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {AGENTIC_PARTS.map((part) => (
              <motion.article
                key={part.id}
                variants={prefersReducedMotion ? {} : fadeUpScale}
                className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
              >
                {/* Media visual — Figma 308×150 (≈2.05:1) */}
                <div className="relative aspect-[308/150] w-full">
                  {part.media.endsWith(".gif") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={part.media}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={part.media}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Text — padding 20/16/20/24, centered (Figma) */}
                <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-4 text-center">
                  <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.22px] text-black">
                    {part.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-[#3e424d]">
                    {part.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom watermark band — wide "SR AGENTIC" repeating text from /end_one_layer.png */}
      <motion.div
        aria-hidden
        className="pointer-events-none relative mt-8 w-full overflow-hidden"
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Image
          src="/end_one_layer.png"
          alt=""
          width={1728}
          height={110}
          className="h-auto w-full select-none"
        />
      </motion.div>
    </section>
  );
}
