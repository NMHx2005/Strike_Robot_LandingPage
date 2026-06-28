"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  /** Image 1 — base robot hands (bottom layer) */
  baseImage: string;
  /** Image 2 — effect art revealed under the cursor (middle reveal layer). Falls back to a placeholder glow. */
  effectImage?: string;
  /** Image 3 — second effect art revealed under the cursor, stacked on top of image 2. */
  effectImage2?: string;
  /** Reveal circle radius in px (250 => 500px circle) */
  radius?: number;
  /** Solid core fraction (0..1) before the feather fades out — lower = softer/more feather */
  feather?: number;
  /** Glowing ring around the reveal circle ("viền sáng") */
  glow?: boolean;
  /** Reverse-magnet hover: the whole hands group is pushed away from the cursor with heavy inertia. */
  magnet?: boolean;
};

// Reverse-magnet physics (ported from the reference): a wide trigger ring, a
// gentle max push, and a tiny lerp factor for a heavy, settled feel. The push
// is never upward (Y stays >= 0) so the hands only ever recoil down/aside.
const MAGNET_TRIGGER = 380;
const MAGNET_MAX_PUSH = 60;
const MAGNET_INERTIA = 0.025;

/**
 * Cursor-driven spotlight reveal: image 2 sits on top of image 1, hidden behind a
 * radial-gradient mask; the mask window follows the cursor (`--mx`/`--my`) and fades
 * in via `--reveal`. Those CSS vars are set by the parent section's pointer handlers.
 *
 * With `magnet`, the whole group is also repelled from the cursor (reverse magnet)
 * via a transform on this same node — the spotlight mask still tracks correctly
 * because its coords are recomputed against the live (transformed) rect.
 */
export const HeroSpotlightHands = forwardRef<HTMLDivElement, Props>(
  function HeroSpotlightHands(
    {
      baseImage,
      effectImage,
      effectImage2,
      radius = 250,
      feather = 0.25,
      glow = false,
      magnet = false,
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const localRef = useRef<HTMLDivElement | null>(null);

    const setRef = (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    useEffect(() => {
      const el = localRef.current;
      if (!el || !magnet || prefersReducedMotion) return;

      let curX = 0;
      let curY = 0;
      let tgtX = 0;
      let tgtY = 0;
      let raf = 0;
      let running = false;

      const apply = () => {
        el.style.transform =
          `perspective(1000px) translate(calc(-50% + ${curX.toFixed(2)}px), ${curY.toFixed(2)}px)` +
          ` rotateX(${(curY * -0.03).toFixed(2)}deg) rotateY(${(curX * 0.03).toFixed(2)}deg)`;
      };

      const tick = () => {
        curX += (tgtX - curX) * MAGNET_INERTIA;
        curY += (tgtY - curY) * MAGNET_INERTIA;
        apply();
        const atRest =
          tgtX === 0 &&
          tgtY === 0 &&
          Math.abs(curX) < 0.05 &&
          Math.abs(curY) < 0.05;
        if (atRest) {
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

        if (dist > 0 && dist < MAGNET_TRIGGER) {
          const force = Math.pow((MAGNET_TRIGGER - dist) / MAGNET_TRIGGER, 2.5);
          tgtX = (dx / dist) * force * MAGNET_MAX_PUSH;
          tgtY = Math.max(0, (dy / dist) * force * MAGNET_MAX_PUSH);
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
        el.style.transform = "translateX(-50%)";
      };
    }, [magnet, prefersReducedMotion]);

    const solid = Math.round(feather * 100);
    const mask = `radial-gradient(circle ${radius}px at var(--mx) var(--my), #000 0%, #000 ${solid}%, transparent 100%)`;

    return (
      <div
        ref={setRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 left-1/2 z-0 hidden md:block",
          !magnet && "-translate-x-1/2",
        )}
        style={
          {
            width: 1200,
            height: 1045,
            opacity: 1,
            "--mx": "600px",
            "--my": "522px",
            "--reveal": "0",
            ...(magnet
              ? { transform: "translateX(-50%)", willChange: "transform" }
              : {}),
          } as React.CSSProperties
        }
      >
        {/* Image 1 — base robot hands */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
          <Image
            src={baseImage}
            alt=""
            width={760}
            height={836}
            priority
            draggable={false}
            className="h-[clamp(462px,66vw,935px)] w-auto select-none object-contain"
          />
        </div>

        {/* Image 3 — effect, masked cursor reveal (middle layer, no blend) */}
        {effectImage2 && (
          <div
            className="absolute inset-0"
            style={
              {
                opacity: "var(--reveal)",
                transition: "opacity 0.4s ease",
                WebkitMaskImage: mask,
                maskImage: mask,
              } as React.CSSProperties
            }
          >
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
              <Image
                src={effectImage2}
                alt=""
                width={740}
                height={740}
                draggable={false}
                className="h-[clamp(462px,66vw,935px)] w-auto select-none object-contain"
              />
            </div>
          </div>
        )}

        {/* Image 2 — effect, masked cursor reveal (top layer) */}
        <div
          className="absolute inset-0"
          style={
            {
              opacity: "var(--reveal)",
              transition: "opacity 0.4s ease",
              WebkitMaskImage: mask,
              maskImage: mask,
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
            {effectImage ? (
              <Image
                src={effectImage}
                alt=""
                width={740}
                height={740}
                draggable={false}
                className="h-[clamp(462px,66vw,935px)] w-auto select-none object-contain"
              />
            ) : (
              // Placeholder until image 2 (the real effect art) is ready
              <div
                className="h-[clamp(360px,53vw,760px)] w-[clamp(360px,53vw,760px)] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 60%, #7df9ff 0%, #4d7cff 35%, #b14dff 70%, transparent 100%)",
                }}
              />
            )}
          </div>
        </div>

        {/* "Viền sáng" — optional glowing ring around the reveal circle */}
        {glow && (
          <div
            className="absolute rounded-full"
            style={
              {
                left: "var(--mx)",
                top: "var(--my)",
                width: radius * 2,
                height: radius * 2,
                transform: "translate(-50%, -50%)",
                opacity: "var(--reveal)",
                transition: "opacity 0.4s ease",
                boxShadow:
                  "0 0 60px 6px rgba(125,249,255,0.45), inset 0 0 40px rgba(125,249,255,0.25)",
              } as React.CSSProperties
            }
          />
        )}
      </div>
    );
  },
);
