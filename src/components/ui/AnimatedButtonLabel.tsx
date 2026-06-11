"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SCRAMBLE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
const SCRAMBLE_FRAMES = 10;
const SCRAMBLE_INTERVAL_MS = 40;
const LETTER_JUMP_RANGE = 8;

const letterEase = [0.25, 0.1, 0.25, 1] as const;

function parseLetters(text: string): string[] {
  return text.split("").map((char) => (char === " " ? "\u00A0" : char));
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
  const [displayChars, setDisplayChars] = useState(letters);
  const [jumpOffsets, setJumpOffsets] = useState<number[]>(() =>
    letters.map(() => 0)
  );
  const [canAnimate, setCanAnimate] = useState(false);
  const intervalIds = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    setCanAnimate(
      prefersReducedMotion !== true &&
        window.matchMedia("(pointer: fine)").matches
    );
  }, [prefersReducedMotion]);

  const clearIntervals = useCallback(() => {
    intervalIds.current.forEach(clearInterval);
    intervalIds.current = [];
  }, []);

  useEffect(() => {
    const next = parseLetters(children);
    setDisplayChars(next);
    setJumpOffsets(next.map(() => 0));
  }, [children]);

  useEffect(() => clearIntervals, [clearIntervals]);

  const runScramble = useCallback(() => {
    if (!canAnimate) return;
    clearIntervals();

    letters.forEach((original, index) => {
      let frame = 0;
      const jumpY =
        (Math.random() > 0.5 ? 1 : -1) *
        (Math.random() * LETTER_JUMP_RANGE + 2);

      setJumpOffsets((prev) => {
        const next = [...prev];
        next[index] = jumpY;
        return next;
      });

      const id = setInterval(() => {
        frame += 1;
        if (frame >= SCRAMBLE_FRAMES) {
          clearInterval(id);
          intervalIds.current = intervalIds.current.filter((i) => i !== id);
          setDisplayChars((prev) => {
            const next = [...prev];
            next[index] = original;
            return next;
          });
          setJumpOffsets((prev) => {
            const next = [...prev];
            next[index] = 0;
            return next;
          });
          return;
        }

        setDisplayChars((prev) => {
          const next = [...prev];
          next[index] = randomChar();
          return next;
        });
      }, SCRAMBLE_INTERVAL_MS);

      intervalIds.current.push(id);
    });
  }, [canAnimate, clearIntervals, letters]);

  const resetLabel = useCallback(() => {
    if (!canAnimate) return;
    clearIntervals();
    setDisplayChars(letters);
    setJumpOffsets(letters.map(() => 0));
  }, [canAnimate, clearIntervals, letters]);

  useEffect(() => {
    if (active) {
      runScramble();
      return;
    }
    resetLabel();
  }, [active, runScramble, resetLabel]);

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
        {displayChars.map((char, index) =>
          canAnimate ? (
            <motion.span
              key={`${index}-${char}`}
              layout={false}
              className="inline-block"
              animate={{ y: jumpOffsets[index] ?? 0 }}
              transition={{ duration: 0.2, ease: letterEase }}
            >
              {char}
            </motion.span>
          ) : (
            <span key={index} className="inline-block">
              {char}
            </span>
          )
        )}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
