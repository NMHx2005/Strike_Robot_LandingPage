"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COMMUNITY, VIDEOS } from "@/lib/constants";
import { AutoplayVideo } from "@/components/ui/AutoplayVideo";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

const MEDIA_HEIGHT = 264;
const CORNER_BTN = 100;

/**
 * Carves a circular notch out of the card's media area at the bottom-right,
 * so the white "go" button appears cut INTO the card. Matches the Figma cards
 * (node 28:434 / Tutorials).
 *
 * Geometry — button is at `bottom-6 right-12` (24px / 48px from article edges)
 * and 100px wide. The media area is at `inset-4` (16px), so the notch center
 * sits 82px from its right edge and 8px above its bottom edge, radius 60px.
 *
 * A plain `radial-gradient` cut leaves two sharp cusps where the circle meets
 * the frame's bottom edge. Instead we build an SVG mask whose notch blends
 * into the bottom edge with a smooth concave S-shaped (ogee) fillet on each
 * side — a small arc tangent to both the horizontal edge and the notch circle,
 * so the junction reverses curvature smoothly instead of forming a point.
 */
const NOTCH_R = 60; // notch circle radius
const NOTCH_X = 114; // notch center, px from media frame's right edge
const NOTCH_Y = 8; // notch center, px above media frame's bottom edge
const FILLET = 12; // S-fillet radius blending bottom edge -> notch
const SVG_W = 1000; // mask width, wider than any card so it always covers

function buildNotchMask(): string {
  const H = MEDIA_HEIGHT;
  const cx = SVG_W - NOTCH_X;
  const cy = H - NOTCH_Y;
  const dist = NOTCH_R + FILLET;

  // Fillet center sits at y = H - FILLET (tangent to bottom edge) and is
  // externally tangent to the notch circle (distance = NOTCH_R + FILLET),
  // which is what produces the reverse-curvature (S) blend.
  const half = Math.sqrt(dist * dist - (NOTCH_Y - FILLET) ** 2);
  const yF = H - FILLET;

  const xFR = cx + half; // right fillet: tangent point on the bottom edge
  const xFL = cx - half; // left fillet: tangent point on the bottom edge

  // Tangent points where each fillet meets the notch circle.
  const uRx = (xFR - cx) / dist;
  const uRy = (yF - cy) / dist;
  const uLx = (xFL - cx) / dist;
  const uLy = (yF - cy) / dist;
  const TRx = cx + NOTCH_R * uRx;
  const TRy = cy + NOTCH_R * uRy;
  const TLx = cx + NOTCH_R * uLx;
  const TLy = cy + NOTCH_R * uLy;

  // Downward-pointing tangent (positive y) of the notch circle at each point,
  // used as the bezier handle so the fillet joins the notch arc smoothly.
  const perp = (ux: number, uy: number): [number, number] =>
    ux > 0 ? [-uy, ux] : [uy, -ux];
  const [pRx, pRy] = perp(uRx, uRy);
  const [pLx, pLy] = perp(uLx, uLy);

  const k = 9; // bezier control length for the fillet curves
  const n = (v: number) => Math.round(v * 1000) / 1000;

  const d = [
    `M0 0 L${SVG_W} 0 L${SVG_W} ${H}`,
    `L${n(xFR)} ${H}`,
    `C${n(xFR - k)} ${H} ${n(TRx + k * pRx)} ${n(TRy + k * pRy)} ${n(TRx)} ${n(TRy)}`,
    `A${NOTCH_R} ${NOTCH_R} 0 0 0 ${n(TLx)} ${n(TLy)}`,
    `C${n(TLx + k * pLx)} ${n(TLy + k * pLy)} ${n(xFL + k)} ${H} ${n(xFL)} ${H}`,
    `L0 ${H} Z`,
  ].join(" ");

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${SVG_W}' height='${H}' viewBox='0 0 ${SVG_W} ${H}'><path fill='#fff' d='${d}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const NOTCH_MASK = buildNotchMask();

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
  const tiltRef = useVanillaTilt<HTMLElement>();

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : fadeUp}
      className="h-[346px] w-full [perspective:1400px]"
    >
      <article
        ref={tiltRef}
        className="group relative h-full w-full overflow-hidden rounded-[20px] p-4 will-change-transform transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-white"
      >
        {/* Card media area — notch-masked so the bottom-right circle is
            carved out for the button. On hover: container bg becomes white,
            video + dark gradient fade out → card looks like a plain white
            surface (no veiled-over-video). Tilt (vanilla-tilt on <article>)
            keeps working. */}
        <div
          aria-hidden
          className="absolute inset-4 overflow-hidden rounded-2xl bg-[#dfdfdf] transition-colors duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:bg-white"
          style={{
            height: MEDIA_HEIGHT,
            WebkitMaskImage: NOTCH_MASK,
            maskImage: NOTCH_MASK,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "right bottom",
            maskPosition: "right bottom",
            WebkitMaskSize: `${SVG_W}px ${MEDIA_HEIGHT}px`,
            maskSize: `${SVG_W}px ${MEDIA_HEIGHT}px`,
          }}
        >
          <AutoplayVideo
            src={videoSrc}
            objectPosition={objectPosition}
            ariaLabel={`${title} preview`}
          />
          {/* Default dark gradient — fades out on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:opacity-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
            }}
          />
        </div>

        {/* Text content layer (above the masked media). */}
        <div
          className="relative flex h-full flex-col p-6"
          style={{ minHeight: MEDIA_HEIGHT }}
        >
          <div className="flex flex-1 flex-col">
            <span
              className="inline-flex w-fit shrink-0 items-center rounded-lg bg-[rgba(30,30,30,0.75)] px-2 py-1 text-sm font-normal text-[#cdcdcd]"
              style={{ border: "1.5px solid rgba(255,255,255,0.1)" }}
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
            className="pointer-events-none absolute right-6 top-6 w-[250px] rounded-xl p-3 text-base leading-snug tracking-[-0.01em] text-white opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:opacity-100"
            style={{ background: "rgba(20,20,20,0.88)" }}
            aria-hidden
          >
            {description}
          </div>
        </div>

        {/* Circle button — default: white + arrow.
            On card hover: switches to black bg with the 2-line label (Figma 35:92). */}
        <div className="absolute bottom-6 right-20 z-20">
          <button
            type="button"
            aria-label={`Open ${title}`}
            className="relative flex cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.14)] transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)] group-hover:bg-black group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.25)]"
            style={{ width: CORNER_BTN, height: CORNER_BTN }}
          >
            <ArrowRight
              className="h-7 w-7 text-black transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:opacity-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 flex flex-col items-center justify-center text-center text-[16px] font-medium leading-[1.15] tracking-[-0.32px] text-white opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:opacity-100"
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
      className="relative pb-16 pt-8 cv-auto"
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
