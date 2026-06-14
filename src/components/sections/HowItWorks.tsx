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
 * Path start ở x=-200 (ngoài viewBox bên trái) để text phủ kín từ mép trái;
 * transition (horizontal→curve) ở x≈1050, kết thúc tại góc dưới-phải
 * (1440, 230). Đoạn visible (x=0→1440) nằm gọn trong viewBox.
 */
const OFFSET_START = 48;
/** Khi section ra viewport top — text trôi vào đoạn ngang bên trái. */
const OFFSET_END = 18;

/** Tốc độ drift liên tục (% path length / giây). Âm = trôi sang trái. */
const DRIFT_SPEED = -10;

/** Cỡ chữ SVG (viewBox 1440x230) */
const FONT_SIZE = 96;

/**
 * Desktop path: curve ở góc phải-dưới của viewBox 1440x230.
 * Mobile path: viewBox vẫn 1440x230 nhưng SVG render w-[180%] nên vùng nhìn
 * thấy chỉ là viewBox 0-800. Curve phải nằm trong khoảng đó (kết thúc ở x=800)
 * để user thấy text cong xuống ở mép phải mobile.
 */
const PATH_D_DESKTOP = "M -200 75 L 1050 75 C 1280 75 1400 150 1440 230";
const PATH_D_MOBILE = "M -200 75 L 700 75 C 760 75 790 140 800 230";

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const textPathDesktopRef = useRef<SVGTextPathElement>(null);
  const textPathMobileRef = useRef<SVGTextPathElement>(null);
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
    const offsetStr = `${v}%`;
    textPathDesktopRef.current?.setAttribute("startOffset", offsetStr);
    textPathMobileRef.current?.setAttribute("startOffset", offsetStr);
  });

  const initialOffset = prefersReducedMotion ? "0%" : `${OFFSET_START}%`;
  const gradientStops = (
    <>
      <stop offset="0%" stopColor="#000000" />
      <stop offset="38%" stopColor="#000000" />
      <stop offset="46%" stopColor="#5a4059" />
      <stop offset="54%" stopColor="#4a606d" />
      <stop offset="61%" stopColor="#515a6e" />
      <stop offset="72%" stopColor="#000000" />
      <stop offset="100%" stopColor="#000000" />
    </>
  );
  const textStyle = {
    fontSize: FONT_SIZE,
    fontFamily: "var(--font-golos-text), sans-serif",
    letterSpacing: "-0.01em" as const,
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden pt-[150px]"
      aria-label="Platform title section"
    >
      {/* Desktop: SVG full width, curve ở viewBox x≈1050→1440. */}
      <svg
        className="hidden md:block w-full"
        viewBox="0 0 1440 230"
        fill="none"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="arc-text-gradient-d" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops}
          </linearGradient>
          <path id="arc-text-path-d" d={PATH_D_DESKTOP} />
        </defs>
        <text fill="url(#arc-text-gradient-d)" style={textStyle}>
          <textPath
            ref={textPathDesktopRef}
            href="#arc-text-path-d"
            startOffset={initialOffset}
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>

      {/* Mobile: SVG w-[180%] (text lớn hơn) — vùng nhìn thấy là viewBox 0-800,
          nên curve thiết kế để kết thúc ở (800, 230) đảm bảo user thấy text
          cong xuống ở mép phải màn mobile. */}
      <svg
        className="block md:hidden w-[180%]"
        viewBox="0 0 1440 230"
        fill="none"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="arc-text-gradient-m" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops}
          </linearGradient>
          <path id="arc-text-path-m" d={PATH_D_MOBILE} />
        </defs>
        <text fill="url(#arc-text-gradient-m)" style={textStyle}>
          <textPath
            ref={textPathMobileRef}
            href="#arc-text-path-m"
            startOffset={initialOffset}
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
      <p className="sr-only">{phrase}</p>
    </section>
  );
}
