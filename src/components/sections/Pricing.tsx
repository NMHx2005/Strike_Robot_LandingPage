"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COMMUNITY, VIDEOS } from "@/lib/constants";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";
import { cn } from "@/lib/utils";

const MEDIA_HEIGHT_DESKTOP = 264;
const MEDIA_HEIGHT_MOBILE = 173;
const SVG_W = 1000;

const maskUrl = (d: string, h: number): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${SVG_W}' height='${h}' viewBox='0 0 ${SVG_W} ${h}'><path fill='#fff' d='${d}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

// Desktop notch — the Figma scoop (node 23:2982) scaled ×1.5625 to the 100px
// button, centred 114px from the media's right edge. A wide, shallow cubic with
// soft fillet shoulders so the two bottom contact points read smooth, not pinched.
const NOTCH_MASK_DESKTOP = maskUrl(
  "M0 0 L1000 0 L1000 264 L960.956 264 " +
    "C954.416 264 949.147 258.794 947.798 252.392 " +
    "C934.384 188.698 840.002 184.412 823.958 253.008 " +
    "C822.523 259.145 817.347 264 811.045 264 L0 264 Z",
  MEDIA_HEIGHT_DESKTOP
);

// Mobile notch — exact curve exported from Figma (node 23:2982), in the 1000×173
// mask space, anchored to the media's right edge (maskPosition: right bottom);
// notch centre sits ~87px from the right edge.
const NOTCH_MASK_MOBILE = maskUrl(
  "M0 0 L1000 0 L1000 173 L960.612 173 " +
    "C956.426 173 953.054 169.545 952.191 165.448 " +
    "C943.606 124.684 883.201 121.941 872.933 165.842 " +
    "C872.015 169.77 868.702 173 864.669 173 L0 173 Z",
  MEDIA_HEIGHT_MOBILE
);

type CommunityCardProps = {
  tag: string;
  title: string;
  description: string;
  videoSrc: string;
  objectPosition?: string;
  hoverLabel: string;
};

function CommunityCard({
  tag,
  title,
  description,
  videoSrc,
  objectPosition = "center",
  hoverLabel,
}: CommunityCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPressing, setIsPressing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const isMobile = !isDesktop;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const tiltRef = useVanillaTilt<HTMLElement>(undefined, isDesktop);

  const handlePointerDown = () => {
    if (isMobile) setIsPressing(true);
  };

  const handlePointerUp = () => {
    setIsPressing(false);
  };

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : fadeUp}
      className="w-full max-md:h-[239px] md:h-[346px] [perspective:1400px]"
    >
      <article
        ref={tiltRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="group relative h-full w-full rounded-[14px] p-2.5 will-change-transform transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] max-md:h-[193px] max-md:overflow-visible max-md:hover:bg-transparent md:overflow-hidden md:rounded-[20px] md:p-4 md:hover:bg-white"
      >
        {/* Card media area — notch-masked so the bottom-right circle is
            carved out for the button. On hover: container bg becomes white,
            video + dark gradient fade out → card looks like a plain white
            surface (no veiled-over-video). Tilt (vanilla-tilt on <article>)
            keeps working. */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-2.5 h-[173px] overflow-hidden rounded-[10px] bg-surface-muted transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:inset-4 md:h-[264px] md:rounded-2xl md:group-hover:bg-white",
            isPressing && "bg-white"
          )}
          style={{
            WebkitMaskImage: isMobile ? NOTCH_MASK_MOBILE : NOTCH_MASK_DESKTOP,
            maskImage: isMobile ? NOTCH_MASK_MOBILE : NOTCH_MASK_DESKTOP,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "right bottom",
            maskPosition: "right bottom",
            WebkitMaskSize: `${SVG_W}px ${isMobile ? MEDIA_HEIGHT_MOBILE : MEDIA_HEIGHT_DESKTOP}px`,
            maskSize: `${SVG_W}px ${isMobile ? MEDIA_HEIGHT_MOBILE : MEDIA_HEIGHT_DESKTOP}px`,
          }}
        >
          <AutoplayVideo
            src={videoSrc}
            objectPosition={objectPosition}
            ariaLabel={`${title} preview`}
            playMode={isMobile ? "press" : "auto"}
            isPressing={isPressing}
          />
          {/* Default dark gradient — fades out on hover (desktop only) */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b from-transparent from-60% to-black transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:group-hover:opacity-0",
              isPressing && "opacity-0"
            )}
          />
        </div>

        {/* Text content layer (above the masked media). */}
        <div className="relative flex h-full min-h-[173px] flex-col p-3.5 md:min-h-[264px] md:p-6">
          <div className="flex flex-1 flex-col gap-2.5 md:gap-0">
            <span className="inline-flex w-fit shrink-0 items-center rounded-[5px] border border-white/10 bg-black/20 px-1.5 py-0.5 text-xs font-normal leading-normal text-white/80 backdrop-blur-sm md:rounded-lg md:border-[1.5px] md:bg-black/75 md:px-2 md:py-1 md:text-sm">
              {tag}
            </span>

            <div className="relative flex h-[52px] w-4 shrink-0 items-start justify-center md:mt-4 md:h-[83px] md:w-6">
              <div className="absolute top-0 size-1.5 rounded-full bg-white/30" />
              <div className="h-full w-px bg-white/30" />
              <div className="absolute bottom-0 size-1.5 rounded-full bg-white/30" />
            </div>

            <h3 className="max-w-[120px] shrink-0 text-xl font-medium leading-normal tracking-[-0.2px] text-white max-md:whitespace-pre-line md:mt-4 md:min-h-[76px] md:max-w-[182px] md:text-[32px] md:leading-[1.15] md:tracking-[-0.01em]">
              {title}
            </h3>
          </div>

          <p
            className={cn(
              "pointer-events-none absolute rounded-[8px] bg-black/30 p-2 text-[13px] font-normal leading-normal tracking-[-0.13px] text-white opacity-0 backdrop-blur-md transition-opacity duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
              "right-3.5 top-3.5 w-[56%] md:right-6 md:top-6 md:w-[250px] md:rounded-xl md:bg-black/90 md:p-3 md:text-base md:leading-snug md:tracking-[-0.01em] md:group-hover:opacity-100",
              isPressing && "opacity-100"
            )}
            aria-hidden
          >
            {description}
          </p>
        </div>

        {/* Circle button — default: white + arrow.
            On card hover: switches to black bg with the 2-line label (Figma 35:92). */}
        <div className="absolute -bottom-[22px] right-[65px] z-20 md:bottom-4 md:right-20">
          <button
            type="button"
            aria-label={`Open ${title}`}
            className={cn(
              "relative flex size-16 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.14)] transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
              "md:size-[100px] md:hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)] md:group-hover:bg-black md:group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.25)]",
              isPressing && "bg-black shadow-[0_6px_28px_rgba(0,0,0,0.25)]"
            )}
          >
            <ArrowRight
              className={cn(
                "size-[18px] text-black transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:size-7 md:group-hover:opacity-0",
                isPressing && "opacity-0"
              )}
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <span
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center text-center text-xs font-medium leading-normal tracking-[-0.24px] text-white opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:text-base md:leading-[1.15] md:tracking-[-0.32px] md:group-hover:opacity-100",
                isPressing && "opacity-100"
              )}
              aria-hidden="true"
            >
              {hoverLabel.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </span>
          </button>
        </div>
      </article>
    </motion.div>
  );
}

export function Pricing() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="community"
      className="relative max-md:rounded-t-3xl max-md:pt-12 max-md:pb-8 cv-auto md:pb-16 md:pt-8"
      aria-label="Community section"
    >
      <motion.div
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-0 px-3 max-md:gap-0 md:grid-cols-2 md:grid-rows-1 md:gap-4 md:px-6"
      >
        <CommunityCard
          tag={COMMUNITY.explore.tag}
          title={COMMUNITY.explore.title}
          description={COMMUNITY.explore.description}
          videoSrc={VIDEOS.communityExplore}
          objectPosition="center"
          hoverLabel={COMMUNITY.explore.hoverLabel}
        />
        <CommunityCard
          tag={COMMUNITY.tutorials.tag}
          title={COMMUNITY.tutorials.title}
          description={COMMUNITY.tutorials.description}
          videoSrc={VIDEOS.communityTutorials}
          objectPosition="65% center"
          hoverLabel={COMMUNITY.tutorials.hoverLabel}
        />
      </motion.div>
    </section>
  );
}
