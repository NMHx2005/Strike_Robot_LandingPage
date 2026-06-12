"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SCRAMBLE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
const SCRAMBLE_FRAMES = 10;
const FRAME_DURATION_MS = 40;
const LETTER_JUMP_RANGE = 8;

function parseLetters(text: string): string[] {
  return text.split("").map((char) => (char === " " ? " " : char));
}

function randomChar(): string {
  return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
}

type AnimatedButtonLabelProps = {
  children: string;
  className?: string;
  active?: boolean;
};

export function AnimatedButtonLabel({
  children,
  className,
  active = false,
}: AnimatedButtonLabelProps) {
  const prefersReducedMotion = useReducedMotion();
  const letters = useMemo(() => parseLetters(children), [children]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    setCanAnimate(
      prefersReducedMotion !== true &&
        window.matchMedia("(pointer: fine)").matches
    );
  }, [prefersReducedMotion]);

  // Keep ref array length in sync when the label changes
  useEffect(() => {
    letterRefs.current.length = letters.length;
  }, [letters.length]);

  useEffect(() => {
    const cancel = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const resetLetters = () => {
      for (let i = 0; i < letters.length; i++) {
        const el = letterRefs.current[i];
        if (!el) continue;
        el.textContent = letters[i];
        el.style.transform = "translateY(0px)";
      }
    };

    if (!canAnimate) {
      cancel();
      resetLetters();
      return;
    }

    if (!active) {
      cancel();
      resetLetters();
      return;
    }

    cancel();

    const jumpYs = letters.map(
      () =>
        (Math.random() > 0.5 ? 1 : -1) *
        (Math.random() * LETTER_JUMP_RANGE + 2)
    );
    const lastFrameApplied = new Array<number>(letters.length).fill(-1);

    // Kick off the CSS-transitioned jump on the next frame so the change
    // is animated instead of snapping.
    for (let i = 0; i < letters.length; i++) {
      const el = letterRefs.current[i];
      if (el) el.style.transform = `translateY(${jumpYs[i]}px)`;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const frame = Math.min(
        SCRAMBLE_FRAMES,
        Math.floor(elapsed / FRAME_DURATION_MS)
      );

      for (let i = 0; i < letters.length; i++) {
        if (lastFrameApplied[i] === frame) continue;
        const el = letterRefs.current[i];
        if (!el) continue;

        if (frame >= SCRAMBLE_FRAMES) {
          el.textContent = letters[i];
          el.style.transform = "translateY(0px)";
        } else {
          el.textContent = randomChar();
        }
        lastFrameApplied[i] = frame;
      }

      if (frame >= SCRAMBLE_FRAMES) {
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return cancel;
  }, [active, canAnimate, letters]);

  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      <span className="invisible whitespace-pre" aria-hidden="true">
        {children}
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center whitespace-pre"
        aria-hidden="true"
      >
        {letters.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className={cn(
              "inline-block",
              canAnimate &&
                "transition-transform duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            )}
            style={{ willChange: canAnimate ? "transform" : undefined }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
