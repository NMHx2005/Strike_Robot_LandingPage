"use client";

import { type RefObject, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

type Options = {
  /** Turn the effect on/off (e.g. behind a prop). */
  enabled?: boolean;
  /** Cursor distance (px from the element centre) at which the push begins. */
  trigger?: number;
  /** Maximum push distance in px. */
  maxPush?: number;
  /** Lerp factor toward the target — smaller = heavier/slower. */
  inertia?: number;
  /** 3D tilt amount per px of push (0 disables the tilt). */
  rotate?: number;
  /** Never push upward (Y stays >= 0). */
  clampUp?: boolean;
  /** Transform prepended before the magnet offset, e.g. "translateX(-50%)" for a centred node. */
  basePrefix?: string;
};

/**
 * Reverse-magnet hover: the element is repelled from the cursor with heavy
 * inertia and a subtle 3D tilt, easing back to rest. Driven off a global
 * mousemove so it works on pointer-events:none decorations; the RAF parks
 * itself once settled. Honors prefers-reduced-motion.
 */
export function useReverseMagnet(
  ref: RefObject<HTMLElement | null>,
  {
    enabled = true,
    trigger = 380,
    maxPush = 60,
    inertia = 0.025,
    rotate = 0.03,
    clampUp = true,
    basePrefix = "",
  }: Options = {},
) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || prefersReducedMotion) return;

    const base = basePrefix ? `${basePrefix} ` : "";
    let curX = 0;
    let curY = 0;
    let tgtX = 0;
    let tgtY = 0;
    let raf = 0;
    let running = false;

    const apply = () => {
      el.style.transform =
        `perspective(1000px) ${base}translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)` +
        ` rotateX(${(curY * -rotate).toFixed(2)}deg) rotateY(${(curX * rotate).toFixed(2)}deg)`;
    };

    const tick = () => {
      curX += (tgtX - curX) * inertia;
      curY += (tgtY - curY) * inertia;
      apply();
      if (
        tgtX === 0 &&
        tgtY === 0 &&
        Math.abs(curX) < 0.05 &&
        Math.abs(curY) < 0.05
      ) {
        curX = 0;
        curY = 0;
        apply();
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Rest centre = live rect centre minus the current push (avoids feedback).
      const cx = rect.left + rect.width / 2 - curX;
      const cy = rect.top + rect.height / 2 - curY;
      const dx = cx - event.clientX;
      const dy = cy - event.clientY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0 && dist < trigger) {
        const force = Math.pow((trigger - dist) / trigger, 2.5);
        tgtX = (dx / dist) * force * maxPush;
        const py = (dy / dist) * force * maxPush;
        tgtY = clampUp ? Math.max(0, py) : py;
      } else {
        tgtX = 0;
        tgtY = 0;
      }
      start();
    };

    apply();
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.style.transform = base.trim();
    };
  }, [
    ref,
    enabled,
    trigger,
    maxPush,
    inertia,
    rotate,
    clampUp,
    basePrefix,
    prefersReducedMotion,
  ]);
}
