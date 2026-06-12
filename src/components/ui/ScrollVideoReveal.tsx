"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  INITIAL_ROTATE_X_DEG,
  INITIAL_SCALE,
  REVEAL_PERSPECTIVE_PX,
  REVEAL_SCROLL_END_PX,
} from "@/components/animations/scrollVideoReveal";

type ScrollVideoRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollVideoReveal({
  children,
  className,
}: ScrollVideoRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const rotateX = useTransform(
    scrollY,
    [0, REVEAL_SCROLL_END_PX],
    [INITIAL_ROTATE_X_DEG, 0],
    { clamp: true }
  );
  const scale = useTransform(
    scrollY,
    [0, REVEAL_SCROLL_END_PX],
    [INITIAL_SCALE, 1],
    { clamp: true }
  );

  if (prefersReducedMotion) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  return (
    <div
      className={cn("w-full", className)}
      style={{ perspective: `${REVEAL_PERSPECTIVE_PX}px` }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
