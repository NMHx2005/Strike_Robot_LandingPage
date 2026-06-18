"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AGENTIC_LOOP } from "@/lib/constants";
import { fadeUp } from "@/components/animations/fadeUp";
import { staggerContainer } from "@/components/animations/stagger";

const PANEL_BG =
  "linear-gradient(135deg, rgba(20,22,26,0.96) 0%, rgba(14,16,20,0.96) 100%)";

const NODE_BG = "rgba(255,255,255,0.04)";

const ARROW_DASH = "5 6";

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
  delay,
}: {
  title: string;
  subtitle: string;
  pos: { left: string; top: string; width: string };
  delay: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1], delay }}
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
    </motion.div>
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
  const prefersReducedMotion = useReducedMotion();
  const positions = side === "edge" ? EDGE_NODES : CLOUD_NODES;

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10"
      style={{ background: PANEL_BG }}
    >
      <PanelHeader label={label} subtitle={subtitle} timing={timing} />

      {nodes.map((node, i) => (
        <NodeChip
          key={node.title}
          title={node.title}
          subtitle={node.subtitle}
          pos={positions[i]}
          delay={0.1 + i * 0.1}
        />
      ))}
    </motion.div>
  );
}

/**
 * The two curved labelled arrows that cross between the EDGE and CLOUD panels.
 * viewBox matches Figma container: 920w × 452h. Each panel = 452×452,
 * gap = 16 between them (edge: x=0..452, cloud: x=468..920).
 * Node anchor points derived from EDGE_NODES / CLOUD_NODES positions above.
 */
function CrossArrows() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 920 452"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrow-event"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(150,210,190,0.95)" />
        </marker>
        <marker
          id="arrow-subgoals"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(170,200,230,0.95)" />
        </marker>
      </defs>

      {/* TOP arrow — Sensors right edge → Open-vocab left edge
          Sensors center ~y=160, Open-vocab center ~y=145; gentle dip-down then up. */}
      <motion.path
        d="M 260 160 C 360 200, 410 200, 492 148"
        stroke="rgba(150,210,190,0.9)"
        strokeWidth="1.6"
        strokeDasharray={ARROW_DASH}
        markerEnd="url(#arrow-event)"
        initial={prefersReducedMotion ? undefined : { strokeDashoffset: 60 }}
        animate={prefersReducedMotion ? undefined : { strokeDashoffset: 0 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2.2, ease: "linear", repeat: Infinity }
        }
      />
      <text
        x="376"
        y="155"
        textAnchor="middle"
        className="fill-white/70"
        fontSize="13"
        fontStyle="italic"
        fontFamily="ui-serif, Georgia, serif"
      >
        new event
      </text>

      {/* BOTTOM arrow — Reasoning left edge → Safety right edge
          Reasoning center ~y=352, Safety center ~y=352; gentle dip-down then up. */}
      <motion.path
        d="M 638 352 C 540 400, 460 400, 362 352"
        stroke="rgba(170,200,230,0.9)"
        strokeWidth="1.6"
        strokeDasharray={ARROW_DASH}
        markerEnd="url(#arrow-subgoals)"
        initial={prefersReducedMotion ? undefined : { strokeDashoffset: -60 }}
        animate={prefersReducedMotion ? undefined : { strokeDashoffset: 0 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 2.4, ease: "linear", repeat: Infinity }
        }
      />
      <text
        x="500"
        y="347"
        textAnchor="middle"
        className="fill-white/70"
        fontSize="13"
        fontStyle="italic"
        fontFamily="ui-serif, Georgia, serif"
      >
        subgoals
      </text>
    </svg>
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
      <motion.div
        className="mx-auto w-full max-w-[1268px]"
        variants={prefersReducedMotion ? {} : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
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
          variants={prefersReducedMotion ? {} : fadeUp}
          className="relative mx-auto mt-14 grid w-full max-w-[920px] grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4"
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
}
