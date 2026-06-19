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
  /** `press` — load/play only while user is pressing (mobile-friendly) */
  playMode?: "auto" | "press";
  /** Required when playMode is `press` */
  isPressing?: boolean;
};

export function AutoplayVideo({
  src,
  className,
  objectPosition = "center",
  ariaLabel,
  eager = false,
  loadOnScroll = false,
  playMode = "auto",
  isPressing = false,
}: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isPressMode = playMode === "press";
  const [shouldLoad, setShouldLoad] = useState(eager && !isPressMode);

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
    if (!shouldLoad || isPressMode) return;
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
  }, [isPressMode, shouldLoad, prefersReducedMotion, src]);

  useEffect(() => {
    if (!isPressMode || !shouldLoad) return;
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const pauseAtStart = () => {
      video.pause();
      if (video.readyState >= 1) {
        try {
          video.currentTime = 0;
        } catch {
          /* ignore seek errors before metadata */
        }
      }
    };

    const onLoaded = () => {
      if (!isPressing) pauseAtStart();
    };

    video.addEventListener("loadeddata", onLoaded);

    if (isPressing) {
      void video.play();
    } else {
      pauseAtStart();
    }

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, [isPressMode, isPressing, shouldLoad, prefersReducedMotion, src]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          autoPlay={!prefersReducedMotion && !isPressMode}
          loop
          muted
          playsInline
          preload={isPressMode ? "auto" : "metadata"}
          aria-label={ariaLabel}
        />
      )}
    </div>
  );
}
