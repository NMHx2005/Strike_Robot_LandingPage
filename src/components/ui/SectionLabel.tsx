"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/components/animations/fadeUp";
import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function SectionLabel({
  children,
  className,
  animate = true,
}: SectionLabelProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest",
        "text-primary/70",
        className
      )}
    >
      <span className="w-6 h-px bg-primary/40" aria-hidden="true" />
      {children}
      <span className="w-6 h-px bg-primary/40" aria-hidden="true" />
    </span>
  );

  if (!animate) return content;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {content}
    </motion.div>
  );
}
