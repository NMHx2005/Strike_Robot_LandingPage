"use client";

import { useEffect, type ReactNode } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function maxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduceMotion.matches || !desktopPointer.matches) return;

    let current = window.scrollY;
    let target = current;
    let raf = 0;
    let isDriving = false;
    let lastWheelTime = 0;

    const tick = () => {
      const distance = target - current;
      current += distance * 0.22;

      if (Math.abs(distance) < 0.75) {
        current = target;
        window.scrollTo(0, current);
        raf = 0;
        isDriving = false;
        return;
      }

      window.scrollTo(0, current);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) {
        isDriving = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.defaultPrevented) return;

      event.preventDefault();
      const isLikelyTrackpad = Math.abs(event.deltaY) < 45 && event.deltaMode === 0;
      if (isLikelyTrackpad) return;

      const multiplier = event.deltaMode === 1 ? 16 : 1;
      const delta = event.deltaY * multiplier * 0.72;
      const currentScroll = window.scrollY;
      const now = performance.now();
      const rapidWheel = now - lastWheelTime < 90;
      lastWheelTime = now;

      if (rapidWheel && Math.abs(target - currentScroll) > window.innerHeight * 0.45) {
        current = currentScroll + (target - currentScroll) * 0.55;
        window.scrollTo(0, current);
      }

      const base = Math.abs(target - currentScroll) > window.innerHeight * 0.9
        ? currentScroll
        : target;

      target = clamp(base + delta, 0, maxScrollY());
      start();
    };

    const onScroll = () => {
      if (isDriving) return;
      current = window.scrollY;
      target = current;
    };

    const onResize = () => {
      target = clamp(target, 0, maxScrollY());
      current = clamp(current, 0, maxScrollY());
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return children;
}
