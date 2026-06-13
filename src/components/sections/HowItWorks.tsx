"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SCROLLING_TEXT } from "@/lib/constants";

/**
 * Lặp text rất nhiều lần để drift trôi liên tục mãi không hết.
 * 50 phrases × ~95%/phrase ≈ 4750% path length. Với DRIFT_SPEED -10%/s,
 * text mất ~8 phút mới drift hết → user gần như không bao giờ thấy "end".
 * KHÔNG dùng wrap modulo nữa → không có jump.
 */
const REPEAT_COUNT = 50;
const SEPARATOR = "  ·  ";

/**
 * startOffset (%) — phải < 100 để chars visible.
 * 90 = rất tucked, chỉ ~3 chữ ở khúc cong cuối.
 */
const OFFSET_START = 90;
/** Khi section ra viewport top — visible chars phủ thêm khúc curve giữa. */
const OFFSET_END = 60;

/** Tốc độ drift liên tục (% path length / giây). Âm = trôi sang trái. */
const DRIFT_SPEED = -10;

/** Cỡ chữ SVG (viewBox 1440x230) */
const FONT_SIZE = 96;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scrollOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [OFFSET_START, OFFSET_END]
  );

  const phrase = `${SCROLLING_TEXT.parts[0]} ${SCROLLING_TEXT.parts[1]} ${SCROLLING_TEXT.parts[2]}`;
  const repeatedText = Array.from({ length: REPEAT_COUNT })
    .map(() => phrase)
    .join(SEPARATOR);

  // Drift — rAF gated by IntersectionObserver, KHÔNG wrap → trôi liên tục
  // không quay đầu. Vì text dài 50 phrases, drift mất ~8 phút mới hết.
  const driftOffset = useMotionValue(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;
    let lastTime = 0;

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      driftOffset.set(driftOffset.get() + (DRIFT_SPEED * delta) / 1000);
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (rafId !== null) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "100px" }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [prefersReducedMotion, driftOffset]);

  const totalOffset = useTransform(
    [scrollOffset, driftOffset],
    (latest: number[]) => latest[0] + latest[1]
  );

  useMotionValueEvent(totalOffset, "change", (v) => {
    if (prefersReducedMotion) return;
    textPathRef.current?.setAttribute("startOffset", `${v}%`);
  });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden pt-[150px]"
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
          {/* Bên trái nằm ngang phía trên, mép phải hạ xuống dưới */}
          <path
            id="arc-text-path"
            d="M -40 75 L 700 75 C 1050 75 1180 205 1480 205"
          />
        </defs>
        <text
          fill="url(#arc-text-gradient)"
          style={{
            fontSize: FONT_SIZE,
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
