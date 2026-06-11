"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HIDDEN_CLIP,
  REVEAL_SCROLL_END_PX,
  VISIBLE_CLIP,
} from "@/components/animations/scrollVideoReveal";

type ScrollVideoRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollVideoReveal({
  children,
  className,
}: ScrollVideoRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();

  const clipPath = useTransform(
    scrollY,
    [0, REVEAL_SCROLL_END_PX],
    [HIDDEN_CLIP, VISIBLE_CLIP]
  );
  const opacity = useTransform(scrollY, [0, REVEAL_SCROLL_END_PX * 0.4], [0, 1]);
  const y = useTransform(scrollY, [0, REVEAL_SCROLL_END_PX], [20, 0]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("w-full", className)}
      style={{ clipPath, opacity, y }}
    >
      {children}
    </motion.div>
  );
}
