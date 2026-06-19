"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_LOOP } from "@/lib/constants";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";

const PANEL_BG =
  "linear-gradient(135deg, rgba(20,22,26,0.96) 0%, rgba(14,16,20,0.96) 100%)";

const NODE_BG = "rgba(255,255,255,0.04)";

// Node positions inside a 452×454 panel (Figma 1:1195 metadata, normalized).
// EDGE — Sensors(top-left) → Obstacle(mid-right) → Safety(bottom-center)
const EDGE_NODES = [
  { left: "3.6%", top: "24.6%", width: "54%" },   // Sensors + local SLAM
  { left: "37.8%", top: "47.5%", width: "50%" },  // Obstacle avoidance
  { left: "20.1%", top: "70.9%", width: "59.9%" }, // Safety governor
];

// CLOUD — Open-vocab(top-left) → Build TC-SG(mid-center) → Reasoning(bottom-right)
const CLOUD_NODES = [
  { left: "5.4%", top: "22.6%", width: "57.9%" },  // Open-vocab perception
  { left: "18.4%", top: "46.3%", width: "61%" },   // Build TC-SG
  { left: "37.5%", top: "71%", width: "52.6%" },   // Reasoning + planner
];

type Side = "edge" | "cloud";

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
    <div className="absolute left-[7%] right-[7%] top-[7%] z-[2] flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <span className="text-[15px] font-semibold uppercase tracking-[0.16em] text-white">
          {label}
        </span>
        <span aria-hidden className="h-px w-8 bg-white/30" />
        <span className="text-[14px] text-white/55">{subtitle}</span>
      </div>
      <span className="text-[11.5px] uppercase tracking-[0.14em] text-white/45">
        {timing}
      </span>
    </div>
  );
}

function NodeChip({
  title,
  subtitle,
  pos,
}: {
  title: string;
  subtitle: string;
  pos: { left: string; top: string; width: string };
}) {
  return (
    <div
      className="absolute rounded-xl border border-white/10 px-4 py-3 text-center"
      style={{
        left: pos.left,
        top: pos.top,
        width: pos.width,
        background: NODE_BG,
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="text-[14px] font-medium leading-tight text-white">
        {title}
      </div>
      <div className="mt-1.5 text-[11.5px] leading-tight text-white/50">
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
  const tiltRef = useVanillaTilt<HTMLDivElement>();

  return (
    <div
      ref={tiltRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 will-change-transform"
      style={{ background: PANEL_BG }}
    >
      <PanelHeader label={label} subtitle={subtitle} timing={timing} />

      {nodes.map((node, i) => (
        <NodeChip
          key={node.title}
          title={node.title}
          subtitle={node.subtitle}
          pos={positions[i]}
        />
      ))}
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

        <div className="relative isolate mx-auto mt-14 grid w-full max-w-[922px] grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
          <LoopPanel
            label={AGENTIC_LOOP.edge.label}
            subtitle={AGENTIC_LOOP.edge.subtitle}
            timing={AGENTIC_LOOP.edge.timing}
            nodes={AGENTIC_LOOP.edge.nodes}
            side="edge"
          />

          <LoopPanel
            label={AGENTIC_LOOP.cloud.label}
            subtitle={AGENTIC_LOOP.cloud.subtitle}
            timing={AGENTIC_LOOP.cloud.timing}
            nodes={AGENTIC_LOOP.cloud.nodes}
            side="cloud"
          />

          {/* Cross-panel curved arrows — only on lg+ where panels sit side-by-side */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <CrossArrows />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
