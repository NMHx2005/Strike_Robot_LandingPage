"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButtonLabel } from "@/components/ui/AnimatedButtonLabel";

const darkGradient =
  "linear-gradient(131deg, rgb(51, 51, 51) 0.79%, rgb(13, 13, 13) 35.22%, rgb(38, 38, 38) 99.16%)";

const tapEase = [0.25, 0.1, 0.25, 1] as const;

type PillButtonProps = {
  variant?: "dark" | "outline";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const sizeClasses = {
  sm: "h-11 pl-6 pr-4 text-sm gap-1.5",
  md: "h-11 pl-6 pr-4 text-sm gap-2",
  lg: "h-[52px] pl-4 pr-6 text-base gap-1",
};

function ButtonLabel({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  if (typeof children === "string") {
    return <AnimatedButtonLabel active={active}>{children}</AnimatedButtonLabel>;
  }
  return <span>{children}</span>;
}

function useTapMotion(prefersReducedMotion: boolean | null) {
  if (prefersReducedMotion) return {};
  return {
    whileTap: { scale: 0.97 },
    transition: { duration: 0.2, ease: tapEase },
  };
}

export function PillButton({
  variant = "dark",
  size = "md",
  showArrow = true,
  icon,
  className,
  children,
  onClick,
}: PillButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = useTapMotion(prefersReducedMotion);
  const [hovered, setHovered] = useState(false);

  if (variant === "outline") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center rounded-3xl font-normal text-black/70 cursor-pointer select-none overflow-hidden",
          sizeClasses[size],
          className
        )}
        style={{
          border: "1.4px solid #0d0d0d",
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.05), inset 0 -2px 4px rgba(255,255,255,0.2)",
        }}
        {...motionProps}
      >
        <span
          aria-hidden
          className="absolute inset-0 z-0 bg-white pointer-events-none rounded-[inherit]"
        />
        <span className="relative z-[2]">
          <ButtonLabel active={hovered}>{children}</ButtonLabel>
        </span>
        {showArrow && (
          <ArrowRight
            className="relative z-[2] w-[18px] h-[18px] shrink-0 opacity-80"
            strokeWidth={2}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-3xl font-medium text-white cursor-pointer select-none overflow-hidden",
        sizeClasses[size],
        className
      )}
      style={{
        background: darkGradient,
        border: "2px solid #0d0d0d",
        boxShadow:
          "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.2)",
      }}
      {...motionProps}
    >
      {icon && <span className="relative z-[2] shrink-0">{icon}</span>}
      <span className="relative z-[2] text-[#e0e0e0]">
        <ButtonLabel active={hovered}>{children}</ButtonLabel>
      </span>
      {showArrow && (
        <ArrowRight
          className="relative z-[2] w-[18px] h-[18px] shrink-0 text-white/80"
          strokeWidth={2}
        />
      )}
    </motion.button>
  );
}

export function PillButtonCta({
  className,
  children,
  showShadow = false,
}: {
  className?: string;
  children: React.ReactNode;
  showShadow?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = useTapMotion(prefersReducedMotion);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center gap-1.5 h-11 pl-6 pr-4 rounded-3xl text-sm font-medium text-[#e0e0e0] cursor-pointer select-none overflow-hidden",
        className
      )}
      style={{
        background: darkGradient,
        border: "2px solid #0d0d0d",
        boxShadow: showShadow
          ? "0 4px 0 rgba(0,0,0,0.25), inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.2)"
          : "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.2)",
      }}
      {...motionProps}
    >
      <span className="relative z-[2]">
        <ButtonLabel active={hovered}>{children}</ButtonLabel>
      </span>
      <ArrowRight
        className="relative z-[2] w-[18px] h-[18px] shrink-0 text-white/80"
        strokeWidth={2}
      />
    </motion.button>
  );
}
