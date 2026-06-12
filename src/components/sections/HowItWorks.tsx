"use client";

import { useRef } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SCROLLING_TEXT } from "@/lib/constants";

const REPEAT_COUNT = 6;
/** startOffset (%) khi section vừa chạm mép dưới viewport — chữ còn nằm ngoài bên phải */
const OFFSET_START = 100;
/** startOffset (%) khi section rời khỏi mép trên viewport */
const OFFSET_END = -250;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const startOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [OFFSET_START, OFFSET_END]
  );

  useMotionValueEvent(startOffset, "change", (v) => {
    if (prefersReducedMotion) return;
    textPathRef.current?.setAttribute("startOffset", `${v}%`);
  });

  const phrase = `${SCROLLING_TEXT.parts[0]} ${SCROLLING_TEXT.parts[1]} ${SCROLLING_TEXT.parts[2]}`;
  const repeatedText = Array.from({ length: REPEAT_COUNT })
    .map(() => phrase)
    .join("  ·  ");

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden bg-white py-8"
      aria-label="Platform title section"
    >
      <svg
        className="block w-full"
        viewBox="0 0 1440 230"
        fill="none"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="arc-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="38%" stopColor="#000000" />
            <stop offset="46%" stopColor="#5a4059" />
            <stop offset="54%" stopColor="#4a606d" />
            <stop offset="61%" stopColor="#515a6e" />
            <stop offset="72%" stopColor="#000000" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          {/* Bên trái nằm ngang phía trên, mép phải hạ xuống dưới —
              chữ vào từ góc dưới-phải rồi leo dần lên đường ngang */}
          <path
            id="arc-text-path"
            d="M -40 75 L 700 75 C 1050 75 1180 205 1480 205"
          />
        </defs>
        <text
          fill="url(#arc-text-gradient)"
          style={{
            fontSize: 72,
            fontFamily: "var(--font-golos-text), sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          <textPath
            ref={textPathRef}
            href="#arc-text-path"
            startOffset={
              prefersReducedMotion ? "0%" : `${OFFSET_START}%`
            }
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
      <p className="sr-only">{phrase}</p>
    </section>
  );
}
