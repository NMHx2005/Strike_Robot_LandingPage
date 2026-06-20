"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_LOOP } from "@/lib/constants";
import { fadeUp, fadeUpScale } from "@/components/animations/fadeUp";
import {
  staggerContainer,
  staggerContainerSlow,
} from "@/components/animations/stagger";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";
import { cn } from "@/lib/utils";

type Side = "edge" | "cloud";

/** True at the lg breakpoint (≥1024px). Drives desktop-only hover tilt. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

const PANEL_BG_GIF = "/SR%20Agentic%20Assets/Effect%20Card%20Final.gif";

const PANEL_OVERLAYS: Record<Side, string> = {
  edge:
    "linear-gradient(102.41deg, rgba(0, 0, 0, 0.32) 10.83%, rgba(45, 45, 45, 0.28) 57.02%, rgba(0, 0, 0, 0.22) 96.19%)",
  cloud:
    "linear-gradient(222.71deg, rgba(0, 0, 0, 0.22) 5.13%, rgba(45, 45, 45, 0.26) 56.46%, rgba(0, 0, 0, 0.16) 100%)",
};

type NodeLayout = {
  left: string;
  top: string;
  centerX?: boolean;
};

// Chip positions as % of the 452×454 panel so the scattered layout scales
// down on mobile (at the 452px desktop width these % equal the Figma px).
// Figma node 23:2181 (EDGE) — chip top-left x/y over 452×454.
const EDGE_NODES: NodeLayout[] = [
  { left: "3.63%", top: "24.67%" },
  { left: "37.83%", top: "47.58%" },
  { left: "50%", top: "70.93%", centerX: true },
];

// Figma node 23:2202 (CLOUD)
const CLOUD_NODES: NodeLayout[] = [
  { left: "5.39%", top: "22.63%" },
  { left: "18.42%", top: "46.33%" },
  { left: "37.48%", top: "71.03%" },
];

function PanelHeader({
  label,
  subtitle,
  timing,
}: {
  label: string;
  subtitle: string;
  timing: string;
}) {
  return (
    <div className="absolute left-[6.64%] top-[6.83%] z-[2] flex w-[calc(100%-13.28%)] max-w-[86.06%] flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="font-superground text-[20px] lowercase tracking-[0.08em] text-white">
          {label}
        </span>
        <span aria-hidden className="h-px w-8 shrink-0 bg-white/30" />
        <span className="text-[22px] font-medium tracking-[-0.22px] text-white">
          {subtitle}
        </span>
      </div>
      <span className="text-[14px] text-[#7aa297]">{timing}</span>
    </div>
  );
}

function NodeChip({
  title,
  subtitle,
  layout,
}: {
  title: string;
  subtitle: string;
  layout: NodeLayout;
}) {
  return (
    <div
      className={cn(
        "absolute z-[2] flex w-[min(60%,230px)] flex-col items-center justify-center gap-1 rounded-2xl border border-[rgba(217,217,217,0.1)] px-3.5 py-2.5 text-center backdrop-blur-[10px] sm:px-4 sm:py-3 lg:h-[92px] lg:w-auto lg:gap-2 lg:px-5 lg:py-4",
        layout.centerX && "-translate-x-1/2"
      )}
      style={{
        left: layout.centerX ? "50%" : layout.left,
        top: layout.top,
        background:
          "linear-gradient(180deg, #393839 0%, rgba(57, 56, 57, 0.5) 100%)",
      }}
    >
      <div className="text-[clamp(14px,4.4vw,20px)] font-medium leading-tight tracking-[-0.2px] text-white">
        {title}
      </div>
      <div className="text-[clamp(12px,3.5vw,16px)] leading-snug text-[#a5adc5] sm:leading-[22px]">
        {subtitle}
      </div>
    </div>
  );
}

function LoopPanel({
  label,
  subtitle,
  timing,
  nodes,
  side,
}: {
  label: string;
  subtitle: string;
  timing: string;
  nodes: { title: string; subtitle: string }[];
  side: Side;
}) {
  const positions = side === "edge" ? EDGE_NODES : CLOUD_NODES;
  // Hover-tilt only makes sense on desktop. Disabling vanilla-tilt below lg
  // stops it from overwriting the static mobile tilt with a flat transform.
  const isDesktop = useIsDesktop();
  const tiltRef = useVanillaTilt<HTMLDivElement>(undefined, isDesktop);

  // Mobile has no hover, so the card rests at a fixed inward tilt instead.
  // Desktop keeps the hover-driven vanilla-tilt, so this static transform +
  // its perspective are gated to max-lg only and never touch the desktop look.
  const restTilt =
    side === "edge"
      ? "max-lg:[transform:rotateX(3deg)_rotateY(-8deg)]"
      : "max-lg:[transform:rotateX(3deg)_rotateY(8deg)]";

  return (
    <div className="w-full max-lg:[perspective:1400px]">
      <div
        ref={tiltRef}
        className={cn(
          // Mobile: fixed-height portrait so the % chip positions have room to
          // spread (auto-height chips wrap to 2 lines and would overlap on a
          // square card). Desktop keeps the exact 452×454 Figma aspect.
          "relative isolate box-border min-h-[480px] w-full overflow-hidden rounded-3xl border border-white/60 border-l-2 will-change-transform [transform-style:preserve-3d] lg:min-h-0 lg:aspect-[452/454]",
          restTilt
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PANEL_BG_GIF}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 backdrop-blur-[4px]"
          style={{ background: PANEL_OVERLAYS[side] }}
        />

        <PanelHeader label={label} subtitle={subtitle} timing={timing} />

        {nodes.map((node, i) => (
          <NodeChip
            key={node.title}
            title={node.title}
            subtitle={node.subtitle}
            layout={positions[i]}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The two curved labelled arrows that cross between the EDGE and CLOUD panels.
 * viewBox matches Figma container: 920w × 452h. Each panel = 452×452,
 * gap = 16 between them (edge: x=0..452, cloud: x=468..920).
 * Node anchor points derived from EDGE_NODES / CLOUD_NODES positions above.
 */
/** Subtle looping "flow" — drift toward the arrowhead + opacity pulse. */
const FLOW_TRANSITION = {
  duration: 2.6,
  ease: "easeInOut" as const,
  repeat: Infinity,
};

const LABEL_STYLE = { fontFamily: "ui-serif, Georgia, serif" } as const;

/**
 * The two Figma comet arrows crossing between the EDGE and CLOUD panels.
 * Each is its own positioned SVG (native viewBox) so its gradient + drop
 * shadow stay intact; positions are % of the grid overlay and approximate
 * the original node anchor points.
 */
function CrossArrows() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* TOP — EDGE → CLOUD ("new event"), points right */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "41%", top: "34%", width: "29.2%" }}
      >
        <motion.svg
          aria-hidden
          viewBox="0 0 269 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full overflow-visible"
          animate={
            prefersReducedMotion
              ? undefined
              : { x: [0, 7, 0], opacity: [0.78, 1, 0.78] }
          }
          transition={prefersReducedMotion ? undefined : FLOW_TRANSITION}
        >
          <g filter="url(#loopArrowTopShadow)">
            <path
              d="M72.4268 10.0981C94.8176 9.41929 118.411 12.2217 138.322 19.6011C183.623 36.3903 220.85 34.6379 240.442 31.5601L238.252 23.3833L256.853 34.0425L245.997 52.2886L244.085 45.1519C222.991 48.6692 182.556 50.926 133.457 32.729C115.664 26.1345 93.9584 23.4513 72.8506 24.0913C51.7176 24.7321 31.7971 28.6844 17.5762 34.8599L12 22.0181C28.2825 14.9474 50.061 10.7763 72.4268 10.0981Z"
              fill="url(#loopArrowTopGrad)"
            />
          </g>
          <defs>
            <filter
              id="loopArrowTopShadow"
              x="0"
              y="0"
              width="268.853"
              height="66.2886"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
            <linearGradient
              id="loopArrowTopGrad"
              x1="12"
              y1="31.1439"
              x2="256.853"
              y2="31.1439"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7AA297" stopOpacity="0" />
              <stop offset="0.215195" stopColor="#8CAFA5" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* BOTTOM — CLOUD → EDGE ("subgoals"), points left */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: "54%", top: "76%", width: "34%" }}
      >
        <motion.svg
          aria-hidden
          viewBox="0 0 313 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full overflow-visible"
          animate={
            prefersReducedMotion
              ? undefined
              : { x: [0, -7, 0], opacity: [0.78, 1, 0.78] }
          }
          transition={prefersReducedMotion ? undefined : FLOW_TRANSITION}
        >
          <g filter="url(#loopArrowBottomShadow)">
            <path
              d="M25.2705 19.8625C70.5001 7.51209 123.436 6.58178 162.676 18.0861C209.618 31.8484 239.1 35.9922 258.748 36.3478C278.231 36.7004 288.139 33.38 297.154 31.4318L300.111 45.1154C291.741 46.9242 279.98 50.7347 258.494 50.3459C237.172 49.9599 206.384 45.4898 158.736 31.5207C122.219 20.8147 71.6718 21.5882 28.3945 33.5207L30.1289 41.0998L12 30.049L23.4561 11.9279L25.2705 19.8625Z"
              fill="url(#loopArrowBottomGrad)"
            />
          </g>
          <defs>
            <filter
              id="loopArrowBottomShadow"
              x="0"
              y="0"
              width="312.111"
              height="64.373"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
            <linearGradient
              id="loopArrowBottomGrad"
              x1="22.4414"
              y1="31.7529"
              x2="306.296"
              y2="31.7529"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7AA297" />
              <stop offset="0.793241" stopColor="#EEF3F2" />
              <stop offset="0.960824" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Flow labels */}
      <span
        className="absolute -translate-x-1/2 -translate-y-full text-[13px] italic text-white/70"
        style={{ left: "41%", top: "30%", ...LABEL_STYLE }}
      >
        new event
      </span>
      <span
        className="absolute -translate-x-1/2 -translate-y-full text-[13px] italic text-white/70"
        style={{ left: "54%", top: "72%", ...LABEL_STYLE }}
      >
        subgoals
      </span>
    </>
  );
}

export function AgenticLoop() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="loop"
      className="relative px-3 pb-24 pt-16 md:px-[48px] cv-auto"
      aria-label="Edge and cloud loop architecture"
    >
      {/* Top horizontal rule — spans the page frame (48px gutters) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-3 right-3 top-0 h-px bg-black/15 md:left-[48px] md:right-[48px]"
        initial={prefersReducedMotion ? undefined : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: "50% 50%" }}
      />

      <motion.div
        className="relative mx-auto w-full max-w-[1268px]"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Left vertical rule — 10px inside the content box (matches AgenticLayer) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 hidden w-px bg-black/15 md:block"
          initial={prefersReducedMotion ? undefined : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          style={{ left: 10, transformOrigin: "50% 0%" }}
        />

        <motion.h2
          variants={prefersReducedMotion ? {} : fadeUp}
          className="text-center text-[clamp(32px,3.8vw,52px)] font-normal leading-[1.15] tracking-[-0.02em] text-black"
        >
          <span className="block">{AGENTIC_LOOP.headlineLine1}</span>
          <span className="block">{AGENTIC_LOOP.headlineLine2}</span>
        </motion.h2>

        <motion.p
          variants={prefersReducedMotion ? {} : fadeUp}
          className="mx-auto mt-5 max-w-[760px] text-center text-base leading-6 text-[#3e424d]/75"
        >
          {AGENTIC_LOOP.description}
        </motion.p>

        <motion.div
          className="relative isolate mx-auto mt-14 grid w-full max-w-[920px] grid-cols-1 gap-6 overflow-visible py-2 lg:grid-cols-2 lg:gap-4"
          variants={prefersReducedMotion ? {} : staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div
            variants={prefersReducedMotion ? {} : fadeUpScale}
            className="w-full"
          >
            <LoopPanel
              label={AGENTIC_LOOP.edge.label}
              subtitle={AGENTIC_LOOP.edge.subtitle}
              timing={AGENTIC_LOOP.edge.timing}
              nodes={AGENTIC_LOOP.edge.nodes}
              side="edge"
            />
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? {} : fadeUpScale}
            className="w-full"
          >
            <LoopPanel
              label={AGENTIC_LOOP.cloud.label}
              subtitle={AGENTIC_LOOP.cloud.subtitle}
              timing={AGENTIC_LOOP.cloud.timing}
              nodes={AGENTIC_LOOP.cloud.nodes}
              side="cloud"
            />
          </motion.div>

          {/* Cross-panel curved arrows — only on lg+ where panels sit side-by-side */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <CrossArrows />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
