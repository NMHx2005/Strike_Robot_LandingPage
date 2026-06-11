"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "none";
  hover?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "primary",
  hover = true,
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "relative rounded-2xl p-6 bg-white overflow-hidden",
        "border border-[rgba(108,99,255,0.10)] shadow-[0_2px_16px_rgba(108,99,255,0.06),0_1px_4px_rgba(0,0,0,0.04)]",
        hover &&
          "transition-all duration-300 hover:border-[rgba(108,99,255,0.30)] hover:shadow-[0_8px_32px_rgba(108,99,255,0.12),0_2px_8px_rgba(0,0,0,0.05)] cursor-pointer",
        className
      )}
    >
      {glowColor !== "none" && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-15 pointer-events-none",
            glowColor === "primary" && "bg-primary",
            glowColor === "accent" && "bg-accent"
          )}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
