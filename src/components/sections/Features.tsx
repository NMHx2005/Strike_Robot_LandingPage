"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Box,
  LayoutGrid,
  Car,
  PencilLine,
  Download,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURES, FEATURES_SECTION, VIDEOS } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Box,
  LayoutGrid,
  Car,
  PencilLine,
  Download,
};

const activeGradient =
  "linear-gradient(91deg, #fff 4.23%, #ebebeb 56%, #fff 99.91%)";

const indicatorSpring = { type: "spring" as const, stiffness: 450, damping: 38, mass: 0.8 };

interface IndicatorStyle {
  top: number;
  height: number;
}

function FeatureDescription({
  description,
  boldPhrase,
}: {
  description: string;
  boldPhrase?: string;
}) {
  if (!boldPhrase || !description.includes(boldPhrase)) {
    return <p className="text-base leading-[22px] text-[#3e424d]">{description}</p>;
  }

  const [before, after] = description.split(boldPhrase);
  return (
    <p className="text-base leading-[22px] text-[#3e424d]">
      {before}
      <span className="font-semibold">{boldPhrase}</span>
      {after}
    </p>
  );
}

type FeatureItemProps = {
  feature: (typeof FEATURES)[number];
  isActive: boolean;
  isFirst: boolean;
  onSelect: () => void;
  prefersReducedMotion: boolean | null;
  headerRef: (el: HTMLDivElement | null) => void;
};

function FeatureItem({
  feature,
  isActive,
  isFirst,
  onSelect,
  prefersReducedMotion,
  headerRef,
}: FeatureItemProps) {
  const Icon = ICON_MAP[feature.icon] ?? Box;
  const animateDescription = !prefersReducedMotion;

  return (
    <div className="overflow-hidden">
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={isActive}
        className={cn(
          "w-full cursor-pointer text-left transition-[background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "px-6 py-3",
          !isFirst && !isActive && "border-t border-black/10",
          isActive
            ? "rounded-xl border border-white/60 border-l-2 border-l-white/60"
            : "hover:opacity-85"
        )}
        style={isActive ? { background: activeGradient } : undefined}
      >
        <div ref={headerRef} className="flex items-center gap-6">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-[background-color,opacity] duration-300",
              isActive ? "bg-black/5 opacity-100" : "bg-transparent opacity-60"
            )}
          >
            <Icon className="h-6 w-6 text-black/70" strokeWidth={1.5} />
          </span>

          <span
            className={cn(
              "text-[20px] tracking-[-0.01em] text-black transition-[font-weight] duration-300",
              isActive ? "font-medium" : "font-normal"
            )}
          >
            {feature.title}
          </span>
        </div>

        <div
          className={cn(
            "grid overflow-hidden",
            animateDescription &&
              "transition-[grid-template-rows,opacity,margin] duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            isActive ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          )}
          aria-hidden={!isActive}
        >
          <div className="min-h-0 overflow-hidden pl-[54px] pr-1 pb-3">
            <FeatureDescription
              description={feature.description}
              boldPhrase={feature.boldPhrase}
            />
          </div>
        </div>
      </button>
    </div>
  );
}

export function Features() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);
  const [indicator, setIndicator] = useState<IndicatorStyle>({ top: 0, height: 24 });
  const prefersReducedMotion = useReducedMotion();

  const listRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const updateIndicator = useCallback((id: string) => {
    const listEl = listRef.current;
    const headerEl = headerRefs.current.get(id);
    if (!listEl || !headerEl) return;

    const listRect = listEl.getBoundingClientRect();
    const headerRect = headerEl.getBoundingClientRect();
    const centerY = headerRect.top - listRect.top + headerRect.height / 2;
    setIndicator({ top: centerY - 12, height: 24 });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => updateIndicator(activeId), 60);
    return () => clearTimeout(t);
  }, [activeId, updateIndicator]);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const ro = new ResizeObserver(() => updateIndicator(activeId));
    ro.observe(listEl);
    return () => ro.disconnect();
  }, [activeId, updateIndicator]);

  const setHeaderRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) headerRefs.current.set(id, el);
      else headerRefs.current.delete(id);
    },
    []
  );


  return (
    <section
      id="features"
      className="relative bg-bg pt-[80px] md:pt-[110px]"
      aria-label="Features section"
    >
      <div
        className="relative mx-auto max-w-[1632px] overflow-hidden px-6 py-12 md:pl-[216px] md:pr-12"
        style={{ minHeight: 206 }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-black/15"
          initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-black/15"
          initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 hidden h-[172px] w-[1px] -translate-y-1/2 md:block"
          initial={prefersReducedMotion ? undefined : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.55 }}
          style={{
            transformOrigin: "50% 0%",
            borderLeft: "1px solid transparent",
            borderImage: "linear-gradient(#d9d9d9, #bbb) 1",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[172px] w-3 -translate-y-1/2 md:block"
          initial={prefersReducedMotion ? undefined : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay: 0.55 }}
          style={{ transformOrigin: "50% 0%" }}
        >
          <div className="h-full w-[1px] rounded-sm bg-gradient-to-b from-black/10 via-black/20 to-black/10" />
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-[913px]"
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

      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-12 px-6 py-6 lg:flex-row lg:gap-12">
        <motion.div
          className="w-full shrink-0 lg:w-[462px]"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div ref={listRef} className="relative pl-5">
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-black/10 via-black/20 to-black/10"
            />

            {!prefersReducedMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-0 w-1 -translate-x-[1.5px] rounded-full bg-black"
                animate={{ top: indicator.top, height: indicator.height }}
                transition={indicatorSpring}
              />
            ) : (
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 h-6 w-1 -translate-x-[1.5px] rounded-full bg-black"
                style={{ top: indicator.top }}
              />
            )}

            <div className="flex flex-col">
              {FEATURES.map((feature, index) => (
                <FeatureItem
                  key={feature.id}
                  feature={feature}
                  isActive={feature.id === activeId}
                  isFirst={index === 0}
                  onSelect={() => setActiveId(feature.id)}
                  prefersReducedMotion={prefersReducedMotion}
                  headerRef={setHeaderRef(feature.id)}
                />
              ))}
            </div>
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
    </section>
  );
}
