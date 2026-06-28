"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Card silhouette (Figma node 110:317 style) — rounded rectangle whose
// bottom-right is scooped up with a diagonal step (speech-bubble notch, the
// same shape as the About mission card), in 330×230 user space.
const CARD_SILHOUETTE =
  "M16 0.5H314C322.56 0.5 329.5 7.43959 329.5 16V161C329.5 170.2 322.56 179.4 314 179.4H240.62C236.91 179.4 233.39 181 231.02 184L213.214 225.362C211.029 227.984 207.793 229.5 204.38 229.5H16C7.43959 229.5 0.5 222.56 0.5 214V16L0.504883 15.5996C0.717249 7.22424 7.57345 0.5 16 0.5Z";

// Mask built from the silhouette — masking (not clip-path) reliably crops the
// backdrop-filter to the notch in Chrome; clip-path + backdrop-filter on the
// same element leaks a rectangle. Same approach as the Community card notch.
const NOTCH_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='330' height='230' viewBox='0 0 330 230' preserveAspectRatio='none'><path d='${CARD_SILHOUETTE}' fill='white'/></svg>`,
)}")`;

function PlayIcon() {
  // Figma play SVG at native 48px; a frosted backdrop sits behind so the
  // translucent circle keeps contrast over the bright preview.
  return (
    <span className="relative flex size-12 items-center justify-center rounded-full backdrop-blur-md">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="size-12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="24" fill="black" fillOpacity="0.2" />
        <path
          d="M31.9184 22.4656C32.9969 23.1744 32.9969 24.8261 31.9184 25.5349L21.3969 32.4495C20.2506 33.2029 18.7637 32.3363 18.7637 30.9148L18.7637 17.0856C18.7637 15.6642 20.2506 14.7976 21.3969 15.5509L31.9184 22.4656Z"
          fill="white"
        />
      </svg>
    </span>
  );
}

function PlayArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 8 10"
      fill="none"
      className="size-[10px] shrink-0 text-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0L8 5L0 10V0Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Hover preview card over the hero video's bottom-right corner. Glass surface
 * (translucent black + 20px backdrop blur) clipped to the Figma silhouette —
 * the bottom-right is scooped up. A white gradient border and a bright dash
 * traveling that outline are drawn as SVG strokes so they follow the notch.
 * Entrance is the fadeUpScale used by the Agentic feature cards; hovering the
 * card tilts it like the Community cards.
 */
export function HeroVideoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ perspective: 1400 }}
      className="pointer-events-auto relative w-[248px]"
    >
      <div className="hero-video-card group relative transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:[transform:rotateX(2deg)_rotateY(-5deg)_rotateZ(-1deg)]">
        {/* Glass body — masked (not clipped) to the notch so the backdrop blur
            is cropped to the silhouette and no rectangle leaks. */}
        <div
          className="relative"
          style={{
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            WebkitMaskImage: NOTCH_MASK,
            maskImage: NOTCH_MASK,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <div className="relative z-[1] px-[18px] pb-5 pt-3">
            {/* Preview frame — 16:9, Figma 280×157.5 */}
            <div className="relative overflow-hidden rounded-lg border border-white/15">
              <Image
                src="/images/hero-watch-preview.png"
                alt=""
                width={700}
                height={394}
                className="h-auto w-full select-none"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <PlayIcon />
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                Watch full video
              </span>
              <PlayArrow />
            </div>
          </div>
        </div>

        {/* Border + traveling dash — drawn on the silhouette so they follow the
            notch. Stretched to the card box; non-scaling strokes stay crisp. */}
        <svg
          aria-hidden
          viewBox="0 0 330 230"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="hero-card-border" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d={CARD_SILHOUETTE}
            fill="none"
            stroke="url(#hero-card-border)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={CARD_SILHOUETTE}
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={100}
            strokeDasharray="14 86"
            className="hero-card-border-run"
          />
        </svg>
      </div>
    </motion.div>
  );
}
