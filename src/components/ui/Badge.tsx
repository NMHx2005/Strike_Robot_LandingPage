import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "accent" | "muted" | "outline";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

const variantStyles = {
  primary: "bg-primary/10 text-primary border border-primary/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
  muted: "bg-text/6 text-muted border border-text/10",
  outline: "bg-transparent text-text/60 border border-text/15",
};

const sizeStyles = {
  sm: "px-2.5 py-0.5 text-xs rounded-md",
  md: "px-3 py-1 text-xs rounded-lg",
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-medium tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "primary" && "bg-primary",
            variant === "accent" && "bg-accent",
            variant === "muted" && "bg-muted",
            variant === "outline" && "bg-text/40"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
