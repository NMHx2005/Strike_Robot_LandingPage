"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMUNITY, VIDEOS } from "@/lib/constants";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

const MEDIA_HEIGHT = 264;
const CORNER_BTN = 100;

type CommunityCardProps = {
  tag: string;
  title: string;
  description: string;
  videoSrc: string;
  objectPosition?: string;
};

function CommunityCard({
  tag,
  title,
  description,
  videoSrc,
  objectPosition = "center",
}: CommunityCardProps) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const tiltRef = useVanillaTilt<HTMLElement>();

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : fadeUp}
      className="h-[346px] w-full [perspective:1400px]"
    >
      <article
        ref={tiltRef}
        className="group relative h-full w-full overflow-hidden rounded-[20px] p-4 will-change-transform"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div
          aria-hidden
          className="absolute inset-4 overflow-hidden rounded-2xl bg-[#dfdfdf]"
          style={{ height: MEDIA_HEIGHT }}
        >
          <AutoplayVideo
            src={videoSrc}
            objectPosition={objectPosition}
            ariaLabel={`${title} preview`}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
            }}
          />
        </div>

        <div className="relative flex h-full flex-col p-6" style={{ minHeight: MEDIA_HEIGHT }}>
          <div className="flex flex-1 flex-col">
            <span
              className="inline-flex w-fit shrink-0 items-center rounded-lg px-2 py-1 text-sm font-normal text-[#cdcdcd]"
              style={{
                background: "rgba(30,30,30,0.75)",
                border: "1.5px solid rgba(255,255,255,0.1)",
              }}
            >
              {tag}
            </span>

            <div className="relative mt-4 flex h-[83px] w-6 shrink-0 items-start justify-center">
              <div className="absolute top-0 h-1.5 w-1.5 rounded-full bg-white/30" />
              <div className="h-full w-px bg-white/30" />
              <div className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>

            <h3 className="mt-4 min-h-[76px] max-w-[182px] shrink-0 text-[32px] font-medium leading-[1.15] tracking-[-0.01em] text-white">
              {title}
            </h3>
          </div>


          <div
            className={cn(
              "pointer-events-none absolute right-6 top-6 w-[250px] rounded-xl p-3 text-base leading-snug tracking-[-0.01em] text-white transition-opacity duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
              hovered ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: "rgba(20,20,20,0.88)",
            }}
            aria-hidden={!hovered}
          >
            {description}
          </div>
        </div>

        <div className="absolute bottom-6 right-12 z-20">
          <button
            type="button"
            aria-label={`Open ${title}`}
            className="flex cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.14)] transition-shadow duration-200 hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)]"
            style={{ width: CORNER_BTN, height: CORNER_BTN }}
          >
            <ArrowRight className="h-7 w-7 text-black" strokeWidth={2.2} />
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
      className="relative bg-white pb-16 pt-8"
      aria-label="Community section"
    >
      <motion.div
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 px-6 md:grid-cols-2 md:grid-rows-1"
      >
        <CommunityCard
          tag={COMMUNITY.explore.tag}
          title={COMMUNITY.explore.title}
          description={COMMUNITY.explore.description}
          videoSrc={VIDEOS.communityExplore}
          objectPosition="center"
        />
        <CommunityCard
          tag={COMMUNITY.tutorials.tag}
          title={COMMUNITY.tutorials.title}
          description={COMMUNITY.tutorials.description}
          videoSrc={VIDEOS.communityTutorials}
          objectPosition="65% center"
        />
      </motion.div>
    </section>
  );
}
