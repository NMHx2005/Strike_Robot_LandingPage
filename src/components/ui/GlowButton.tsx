"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  href?: string;
}

const variantStyles = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-glow-sm hover:shadow-glow-primary",
  accent:
    "bg-accent text-white hover:bg-accent/90 shadow-[0_0_10px_rgba(0,153,170,0.2)] hover:shadow-glow-accent",
  outline:
    "border border-primary/30 text-primary bg-white hover:border-primary hover:bg-primary/5 shadow-sm",
  ghost:
    "text-text/60 hover:text-text hover:bg-text/5",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-xl",
};

export function GlowButton({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
  ...props
}: GlowButtonProps) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 font-display font-semibold",
    "transition-all duration-300 cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    "disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button className={classes} {...motionProps} {...(props as object)}>
      {children}
    </motion.button>
  );
}
