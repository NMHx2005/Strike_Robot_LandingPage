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
  /** On mobile, keep the inline video paused and open a landscape player on tap. */
  mobileTapFullscreen?: boolean;
};

type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
  unlock?: () => void;
};

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function AutoplayVideo({
  src,
  className,
  objectPosition = "center",
  ariaLabel,
  eager = false,
  loadOnScroll = false,
  playMode = "auto",
  isPressing = false,
  mobileTapFullscreen = false,
}: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isPressMode = playMode === "press";
  const [isMobileViewport, setIsMobileViewport] = useState(mobileTapFullscreen);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(false);
  const [modalCurrentTime, setModalCurrentTime] = useState(0);
  const [modalDuration, setModalDuration] = useState(0);
  const [modalVolume, setModalVolume] = useState(1);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const shouldUseMobilePlayer = mobileTapFullscreen && isMobileViewport;
  const [shouldLoad, setShouldLoad] = useState(
    eager && !isPressMode && !shouldUseMobilePlayer
  );

  useEffect(() => {
    if (!mobileTapFullscreen) return;

    const media = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(media.matches);

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, [mobileTapFullscreen]);

  useEffect(() => {
    if (shouldUseMobilePlayer) return;
    if (loadOnScroll && prefersReducedMotion) {
      setShouldLoad(true);
    }
  }, [loadOnScroll, prefersReducedMotion, shouldUseMobilePlayer]);

  useEffect(() => {
    if (shouldUseMobilePlayer || !loadOnScroll || shouldLoad || prefersReducedMotion) return;

    const onScroll = () => {
      if (window.scrollY > 0) {
        setShouldLoad(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadOnScroll, shouldLoad, prefersReducedMotion, shouldUseMobilePlayer]);

  // Lazy-load: only set src when video is near the viewport
  useEffect(() => {
    if (shouldUseMobilePlayer) return;
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
  }, [eager, loadOnScroll, shouldLoad, shouldUseMobilePlayer]);

  useEffect(() => {
    if (shouldUseMobilePlayer) return;
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
  }, [isPressMode, shouldLoad, prefersReducedMotion, shouldUseMobilePlayer, src]);

  useEffect(() => {
    if (shouldUseMobilePlayer) return;
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
  }, [isPressMode, isPressing, shouldLoad, prefersReducedMotion, shouldUseMobilePlayer, src]);

  useEffect(() => {
    if (!isPlayerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const video = modalVideoRef.current;
    const orientation = screen.orientation as LockableScreenOrientation | undefined;
    void video?.play().catch(() => {});
    void orientation?.lock?.("landscape").catch(() => {});

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPlayerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
      video?.pause();
      orientation?.unlock?.();
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => {});
      }
    };
  }, [isPlayerOpen]);

  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video || !isPlayerOpen) return;

    const syncTime = () => {
      setModalCurrentTime(video.currentTime);
      setModalDuration(video.duration || 0);
    };
    const syncPlayState = () => setIsModalPlaying(!video.paused);
    const syncVolume = () => {
      setModalVolume(video.volume);
      setIsModalMuted(video.muted);
    };

    syncTime();
    syncPlayState();
    syncVolume();

    video.addEventListener("timeupdate", syncTime);
    video.addEventListener("loadedmetadata", syncTime);
    video.addEventListener("durationchange", syncTime);
    video.addEventListener("play", syncPlayState);
    video.addEventListener("pause", syncPlayState);
    video.addEventListener("volumechange", syncVolume);

    return () => {
      video.removeEventListener("timeupdate", syncTime);
      video.removeEventListener("loadedmetadata", syncTime);
      video.removeEventListener("durationchange", syncTime);
      video.removeEventListener("play", syncPlayState);
      video.removeEventListener("pause", syncPlayState);
      video.removeEventListener("volumechange", syncVolume);
    };
  }, [isPlayerOpen]);

  const openMobilePlayer = () => {
    setModalCurrentTime(0);
    setIsModalPlaying(true);
    setIsPlayerOpen(true);
    void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const closeMobilePlayer = () => {
    setIsPlayerOpen(false);
  };

  const toggleModalPlay = () => {
    const video = modalVideoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const seekModalVideo = (value: string) => {
    const video = modalVideoRef.current;
    if (!video) return;

    const nextTime = Number(value);
    video.currentTime = nextTime;
    setModalCurrentTime(nextTime);
  };

  const toggleModalMute = () => {
    const video = modalVideoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsModalMuted(video.muted);
  };

  const changeModalVolume = (value: string) => {
    const video = modalVideoRef.current;
    const nextVolume = Number(value);
    setModalVolume(nextVolume);
    setIsModalMuted(nextVolume === 0);

    if (!video) return;
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
  };

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)}>
      {shouldUseMobilePlayer ? (
        <>
          <button
            type="button"
            aria-label={`Play ${ariaLabel ?? "video"}`}
            className="group relative h-full w-full cursor-pointer overflow-hidden text-left"
            onClick={openMobilePlayer}
          >
            <video
              src={src}
              className="h-full w-full object-cover"
              style={{ objectPosition }}
              muted
              playsInline
              preload="metadata"
              aria-label={ariaLabel}
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/5 transition-colors group-active:bg-black/10"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
              >
                <rect width="48" height="48" rx="24" fill="white" fillOpacity="0.2" />
                <path
                  d="M31.2864 22.304C32.5397 23.0873 32.5397 24.9127 31.2864 25.696L21.06 32.0875C19.7279 32.9201 18 31.9624 18 30.3915L18 17.6085C18 16.0376 19.7279 15.0799 21.06 15.9125L31.2864 22.304Z"
                  fill="white"
                />
              </svg>
            </span>
          </button>

          {isPlayerOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              className="mobile-video-modal"
            >
              <div className="mobile-landscape-shell">
                <video
                  ref={modalVideoRef}
                  src={src}
                  className="mobile-landscape-video"
                  style={{ objectPosition }}
                  autoPlay
                  playsInline
                  preload="auto"
                  aria-label={ariaLabel}
                  onClick={toggleModalPlay}
                />
                <button
                  type="button"
                  aria-label="Close video"
                  className="absolute right-4 top-4 z-20 flex size-12 items-center justify-center rounded-full bg-black/35 text-white shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors active:bg-black/50"
                  onClick={closeMobilePlayer}
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pb-5 pt-14 text-white">
                  <input
                    aria-label="Video progress"
                    className="mobile-video-range mb-5 w-full"
                    type="range"
                    min="0"
                    max={modalDuration || 0}
                    step="0.01"
                    value={Math.min(modalCurrentTime, modalDuration || modalCurrentTime)}
                    onChange={(event) => seekModalVideo(event.currentTarget.value)}
                  />
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      aria-label={isModalPlaying ? "Pause video" : "Play video"}
                      className="flex size-11 shrink-0 items-center justify-center text-white"
                      onClick={toggleModalPlay}
                    >
                      {isModalPlaying ? (
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-8"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" />
                        </svg>
                      ) : (
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-8"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 5.8c0-1.18 1.3-1.9 2.3-1.26l9.2 5.7a1.5 1.5 0 0 1 0 2.52l-9.2 5.7C9.3 19.1 8 18.38 8 17.2V5.8Z" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label={isModalMuted ? "Unmute video" : "Mute video"}
                      className="flex size-11 shrink-0 items-center justify-center text-white"
                      onClick={toggleModalMute}
                    >
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-8"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 9.5v5h4l5 4.5V5L8 9.5H4Z"
                          fill="currentColor"
                        />
                        {isModalMuted || modalVolume === 0 ? (
                          <path
                            d="M17 9l4 4m0-4-4 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        ) : (
                          <path
                            d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </button>
                    <input
                      aria-label="Video volume"
                      className="mobile-video-range hidden w-24 sm:block"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isModalMuted ? 0 : modalVolume}
                      onChange={(event) => changeModalVolume(event.currentTarget.value)}
                    />
                    <span className="min-w-[104px] text-[22px] font-normal leading-none tracking-[-0.02em]">
                      {formatVideoTime(modalCurrentTime)} /{" "}
                      {formatVideoTime(modalDuration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : shouldLoad ? (
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
      ) : null}
    </div>
  );
}
