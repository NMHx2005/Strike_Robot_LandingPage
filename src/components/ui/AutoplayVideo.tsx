"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type AutoplayVideoProps = {
  src: string;
  className?: string;
  objectPosition?: string;
  ariaLabel?: string;
  /** Load immediately without waiting for IntersectionObserver (e.g. above-the-fold) */
  eager?: boolean;
  /** Defer loading until the user has scrolled (scrollY > 0) */
  loadOnScroll?: boolean;
};

export function AutoplayVideo({
  src,
  className,
  objectPosition = "center",
  ariaLabel,
  eager = false,
  loadOnScroll = false,
}: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (loadOnScroll && prefersReducedMotion) {
      setShouldLoad(true);
    }
  }, [loadOnScroll, prefersReducedMotion]);

  useEffect(() => {
    if (!loadOnScroll || shouldLoad || prefersReducedMotion) return;

    const onScroll = () => {
      if (window.scrollY > 0) {
        setShouldLoad(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadOnScroll, shouldLoad, prefersReducedMotion]);

  // Lazy-load: only set src when video is near the viewport
  useEffect(() => {
    if (eager || loadOnScroll || shouldLoad) return;
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, loadOnScroll, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || prefersReducedMotion) return;

    const tryPlay = () => video.play().catch(() => {});

    // Pause video khi out of viewport — giảm tải decode/render cost.
    // Resume khi vào lại viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { rootMargin: "200px" }
    );
    observer.observe(container);

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, [shouldLoad, prefersReducedMotion, src]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          autoPlay={!prefersReducedMotion}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={ariaLabel}
        />
      )}
    </div>
  );
}
