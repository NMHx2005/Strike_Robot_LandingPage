"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FEATURES, FEATURES_SECTION, VIDEOS } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const INDICATOR_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.85,
};

const HEADER_BAND_MIN_H = 206;
const BRACKET_HEIGHT = 173;
const BRACKET_TOP = (HEADER_BAND_MIN_H - BRACKET_HEIGHT) / 2;
const LINE_LEFT = 70;
const INDICATOR_HEIGHT = 40;
const INDICATOR_WIDTH = 3;
const ITEM_ICON_CENTER_FROM_TOP = 36;

const ICON_SRC: Record<string, string> = {
  "asset-creation": "/icons/features/asset-creation.png",
  "spatial-layout": "/icons/features/spatial-layout.png",
  "stimulation": "/icons/features/stimulation.png",
  "realtime-edit": "/icons/features/realtime-edit.png",
  "export-pipeline": "/icons/features/export-pipeline.png",
};

const ACTIVE_GRADIENT =
  "linear-gradient(91.36deg, #fff 4.23%, #ebebeb 56%, #fff 99.91%)";

const LEFT_BRACKET_D =
  "M0.391113 0.311523L9.77805 12.0984C11.4699 14.2228 12.3911 16.8582 12.3911 19.574V153.049C12.3911 155.765 11.4699 158.4 9.77804 160.525L0.391113 172.312";
const RIGHT_BRACKET_D =
  "M12.5 0.311523L3.11307 12.0984C1.42121 14.2228 0.5 16.8582 0.5 19.574V153.049C0.5 155.765 1.42121 158.4 3.11307 160.525L12.5 172.312";

function FeatureDescription({
  description,
  boldPhrase,
}: {
  description: string;
  boldPhrase?: string;
}) {
  if (!boldPhrase || !description.includes(boldPhrase)) {
    return (
      <p className="text-[16px] leading-[22px] text-[#3e424d]">{description}</p>
    );
  }

  const [before, after] = description.split(boldPhrase);
  return (
    <p className="text-[16px] leading-[22px] text-[#3e424d]">
      {before}
      <span className="font-semibold">{boldPhrase}</span>
      {after}
    </p>
  );
}

type FeatureItemProps = {
  feature: (typeof FEATURES)[number];
  isActive: boolean;
  showTopBorder: boolean;
  onSelect: () => void;
  prefersReducedMotion: boolean | null;
  buttonRef: (el: HTMLButtonElement | null) => void;
};

function FeatureItem({
  feature,
  isActive,
  showTopBorder,
  onSelect,
  prefersReducedMotion,
  buttonRef,
}: FeatureItemProps) {
  const iconSrc = ICON_SRC[feature.id];

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onSelect}
      aria-expanded={isActive}
      className={cn(
        "group relative w-full cursor-pointer text-left px-6 py-3 rounded-xl",
        "outline-none focus-visible:ring-2 focus-visible:ring-black/15"
      )}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-px origin-center bg-black/10"
        initial={false}
        animate={{ opacity: showTopBorder ? 1 : 0 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease: EASE }
        }
      />

      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl border border-white/60 border-l-2 border-l-white/60"
        style={{ background: ACTIVE_GRADIENT, willChange: "opacity" }}
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE }
        }
      />

      <div className="relative flex items-center gap-6">
        <motion.span
          aria-hidden
          className="relative block h-12 w-12 shrink-0"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0.6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: EASE }
          }
          style={{ willChange: "opacity" }}
        >
          {iconSrc && (
            <Image
              src={iconSrc}
              alt=""
              width={96}
              height={96}
              className="h-12 w-12 object-contain select-none"
              draggable={false}
              priority
            />
          )}
        </motion.span>

        <motion.span
          className="block text-black"
          initial={false}
          animate={{
            fontSize: isActive ? "22px" : "20px",
            letterSpacing: isActive ? "-0.22px" : "-0.2px",
            fontWeight: isActive ? 500 : 400,
            opacity: isActive ? 1 : 0.92,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: EASE }
          }
          style={{
            lineHeight: 1.2,
            willChange: "font-size, font-weight",
          }}
        >
          {feature.title}
        </motion.span>
      </div>

      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{
          height: isActive ? "auto" : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                height: { duration: 0.45, ease: EASE },
                opacity: { duration: isActive ? 0.4 : 0.18, ease: "easeOut" },
              }
        }
        aria-hidden={!isActive}
      >
        <div className="pl-[72px] pr-1 pt-3 pb-1">
          <FeatureDescription
            description={feature.description}
            boldPhrase={feature.boldPhrase}
          />
        </div>
      </motion.div>
    </button>
  );
}

export function Features() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);
  const [indicator, setIndicator] = useState({ top: 0, ready: false });
  const prefersReducedMotion = useReducedMotion();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const updateIndicator = useCallback((id: string) => {
    const wrapperEl = wrapperRef.current;
    const itemEl = itemRefs.current.get(id);
    if (!wrapperEl || !itemEl) return;

    const wrapperRect = wrapperEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const iconCenterY = itemRect.top - wrapperRect.top + ITEM_ICON_CENTER_FROM_TOP;
    const top = iconCenterY - INDICATOR_HEIGHT / 2;

    setIndicator((prev) =>
      prev.top === top && prev.ready ? prev : { top, ready: true }
    );
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => updateIndicator(activeId));
    return () => cancelAnimationFrame(raf);
  }, [activeId, updateIndicator]);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;
    const ro = new ResizeObserver(() => updateIndicator(activeId));
    ro.observe(wrapperEl);
    return () => ro.disconnect();
  }, [activeId, updateIndicator]);

  useEffect(() => {
    const onResize = () => updateIndicator(activeId);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId, updateIndicator]);

  const setItemRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) itemRefs.current.set(id, el);
      else itemRefs.current.delete(id);
    },
    []
  );

  return (
    <section
      id="features"
      className="relative bg-bg pt-[80px] md:pt-[110px]"
      aria-label="Features section"
    >
      <div ref={wrapperRef} className="relative mx-[48px] pl-[100px]">
        {/* Top horizontal line of header band */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-black/15"
          initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ transformOrigin: "50% 50%" }}
        />

        {/* Bottom horizontal line of header band */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 h-px bg-black/15"
          style={{ top: HEADER_BAND_MIN_H, transformOrigin: "50% 50%" }}
          initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        />

        {/* Left bracket SVG */}
        <motion.svg
          aria-hidden
          width="13"
          height={BRACKET_HEIGHT}
          viewBox="0 0 13 173"
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

        {/* Right bracket SVG */}
        <motion.svg
          aria-hidden
          width="13"
          height={BRACKET_HEIGHT}
          viewBox="0 0 13 173"
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

        {/* Single continuous vertical line — spans header band + features list */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-black/15 hidden md:block"
          style={{ left: LINE_LEFT, transformOrigin: "50% 0%" }}
          initial={prefersReducedMotion ? undefined : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        />

        {/* Animated black indicator on the vertical line */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute hidden md:block rounded-full bg-black"
          style={{
            left: LINE_LEFT,
            x: "-50%",
            width: INDICATOR_WIDTH,
            height: INDICATOR_HEIGHT,
            willChange: "top",
          }}
          initial={false}
          animate={{
            top: indicator.top,
            opacity: indicator.ready ? 1 : 0,
          }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  top: INDICATOR_SPRING,
                  opacity: { duration: 0.35, ease: EASE, delay: indicator.ready ? 0.15 : 0 },
                }
          }
        />

        {/* Header band content */}
        <div
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
              className="text-[clamp(36px,4vw,64px)] font-normal leading-[1.1] tracking-[-0.02em] text-black"
            >
              {FEATURES_SECTION.headline}
            </motion.h2>
            <motion.p
              variants={prefersReducedMotion ? {} : fadeUp}
              className="mt-4 max-w-[913px] text-base leading-6 text-[#3e424d]/70"
            >
              {FEATURES_SECTION.description}
            </motion.p>
          </motion.div>
        </div>

        {/* Features content */}
        <div className="flex flex-col items-start gap-12 py-6 lg:flex-row lg:gap-12 md:pl-[60px] md:pr-[60px]">
          <motion.div
            className="w-full shrink-0 lg:w-[462px]"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex flex-col">
              {FEATURES.map((feature, index) => {
                const isActive = feature.id === activeId;
                const prev = index > 0 ? FEATURES[index - 1] : null;
                const prevIsActive = prev ? prev.id === activeId : false;
                const showTopBorder = index > 0 && !isActive && !prevIsActive;
                return (
                  <FeatureItem
                    key={feature.id}
                    feature={feature}
                    isActive={isActive}
                    showTopBorder={showTopBorder}
                    onSelect={() => setActiveId(feature.id)}
                    prefersReducedMotion={prefersReducedMotion}
                    buttonRef={setItemRef(feature.id)}
                  />
                );
              })}
            </div>

            <div className="pt-6">
              <PillButtonCta>{FEATURES_SECTION.cta}</PillButtonCta>
            </div>
          </motion.div>

          <div className="relative h-[400px] w-full shrink-0 overflow-hidden rounded-2xl border border-[#d9d9d9] bg-black/5 lg:h-[511px] lg:flex-1">
            <AutoplayVideo
              src={VIDEOS.featureEditor}
              objectPosition="top center"
              ariaLabel="SR Platform 3D asset editor interface"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
