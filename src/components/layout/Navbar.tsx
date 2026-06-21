"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { ChevronDown, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CTA, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";
import { GlassPill, METALLIC_BORDER_BG, PILL_BAR_BG, PILL_BAR_SHADOW, GPU_LAYER } from "@/components/ui/GlassPill";
import { MenuIcon } from "@/components/ui/MenuIcon";

interface IndicatorStyle {
  left: number;
  width: number;
}

function MobileMenuButton({
  onClick,
  label,
  expanded,
  variant = "light",
}: {
  onClick: () => void;
  label: string;
  expanded: boolean;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      className={cn(
        "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border",
        isDark
          ? "border-white/10 bg-white/[0.05]"
          : "border-black/[0.06] bg-black/[0.05]"
      )}
    >
      {expanded ? (
        <X
          className={cn("size-5", isDark ? "text-white" : "text-black")}
          strokeWidth={2}
        />
      ) : (
        <MenuIcon
          className={cn("size-5", isDark ? "text-white" : "text-black")}
        />
      )}
    </button>
  );
}

function MobileLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      className="flex w-[84px] items-center"
      aria-label={SITE_NAME}
      onClick={onClick}
    >
      <Image
        src="/Logo.png"
        alt={SITE_NAME}
        width={84}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}

const MOBILE_SCROLL_RANGE = 120;
const MOBILE_HEADER_SPRING = { stiffness: 90, damping: 22, mass: 0.5 };

function MobileScrollHeader({
  mobileOpen,
  onOpenMenu,
  prefersReducedMotion,
}: {
  mobileOpen: boolean;
  onOpenMenu: () => void;
  prefersReducedMotion: boolean | null;
}) {
  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, [0, MOBILE_SCROLL_RANGE], [0, 1], {
    clamp: true,
  });
  const progress = useSpring(
    rawProgress,
    prefersReducedMotion
      ? { stiffness: 1000, damping: 100, mass: 0.1 }
      : MOBILE_HEADER_SPRING
  );

  const paddingTop = useTransform(progress, [0, 1], [12, 12]);
  const paddingBottom = useTransform(progress, [0, 1], [0, 12]);
  const innerPx = useTransform(progress, [0, 1], [0, 12]);
  const borderRadius = useTransform(progress, [0, 1], [0, 12]);
  const innerRadius = useTransform(progress, [0, 1], [0, 10.6]);
  const blurPx = useTransform(progress, [0, 1], [0, 10]);
  const backdropFilter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      className="pointer-events-auto px-3 md:hidden"
      style={{ paddingTop, paddingBottom }}
    >
      <div className="relative">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 p-[1.4px]"
          style={{
            opacity: progress,
            borderRadius,
            background: METALLIC_BORDER_BG,
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-[1.4px]"
          style={{
            opacity: progress,
            borderRadius: innerRadius,
            background: PILL_BAR_BG,
            backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            boxShadow: PILL_BAR_SHADOW,
            transform: GPU_LAYER,
          }}
        />
        <motion.div
          className="relative flex h-14 items-center justify-between"
          style={{
            paddingLeft: innerPx,
            paddingRight: innerPx,
          }}
        >
          <MobileLogo />
          <MobileMenuButton
            onClick={onOpenMenu}
            label="Open menu"
            expanded={mobileOpen}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [indicator, setIndicator] = useState<IndicatorStyle>({
    left: 24,
    width: 24,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const navInnerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const updateIndicator = useCallback((label: string) => {
    const navEl = navInnerRef.current;
    const itemEl = itemRefs.current.get(label);
    if (!navEl || !itemEl) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const centerX = itemRect.left - navRect.left + itemRect.width / 2;
    setIndicator({ left: centerX - 12, width: 24 });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => updateIndicator(activeItem), 60);
    return () => clearTimeout(t);
  }, [activeItem, updateIndicator]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const navigateTo = (href: string) => {
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleItemClick = (label: string, href: string) => {
    setActiveItem(label);
    navigateTo(href);
  };

  const handleMobileItemClick = (label: string, href: string) => {
    setActiveItem(label);
    setMobileOpen(false);
    setTimeout(() => navigateTo(href), 220);
  };

  return (
    <>
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-[1000]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-[#E5E5E5] md:hidden"
        />
        {/* Desktop */}
        <div className="pointer-events-auto relative mx-auto hidden h-32 w-full items-center justify-between gap-6 px-[48px] md:flex">
          <Link
            href="/"
            className="flex w-[360px] flex-shrink-0 items-center"
            aria-label={SITE_NAME}
          >
            <Image
              src="/Logo.png"
              alt={SITE_NAME}
              width={116}
              height={44}
              className="h-11 w-auto"
              priority
            />
          </Link>

          <GlassPill radius={24} className="flex-shrink-0 rounded-[24px]">
            <div
              ref={navInnerRef}
              className="relative flex h-12 items-center overflow-hidden px-6"
              style={{ borderRadius: 22.6 }}
            >
              <nav className="flex items-center gap-3" aria-label="Main navigation">
                {NAV_LINKS.map((item) => {
                  const isActive = activeItem === item.label;
                  return (
                    <button
                      key={item.label}
                      ref={(el) => {
                        if (el) itemRefs.current.set(item.label, el);
                      }}
                      onClick={() => handleItemClick(item.label, item.href)}
                      className={cn(
                        "relative flex h-8 cursor-pointer select-none items-center gap-1 rounded-lg px-3 text-sm transition-colors duration-200",
                        !isActive && "font-medium text-[#4d4d4d] hover:text-black"
                      )}
                      style={
                        isActive
                          ? {
                            background:
                              "linear-gradient(180deg, #8c8c8c 0%, #000000 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontWeight: 700,
                          }
                          : undefined
                      }
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown
                          className="h-3 w-3 shrink-0 text-[#999]"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {!prefersReducedMotion ? (
                <motion.div
                  aria-hidden="true"
                  className="absolute rounded-full bg-black"
                  style={{ height: 4, bottom: -1 }}
                  animate={{ left: indicator.left, width: indicator.width }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 38,
                    mass: 0.8,
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute h-1 w-6 rounded-full bg-black"
                  style={{ bottom: -1, left: indicator.left }}
                />
              )}
            </div>
          </GlassPill>

          <div className="flex w-[360px] flex-shrink-0 items-center justify-end">
            <PillButtonCta className="font-medium">{NAV_CTA}</PillButtonCta>
          </div>
        </div>

        <MobileScrollHeader
          mobileOpen={mobileOpen}
          onOpenMenu={() => setMobileOpen(true)}
          prefersReducedMotion={prefersReducedMotion}
        />
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-0 isolate z-[1001] flex flex-col gap-3 overflow-hidden p-3 md:hidden"
            style={{
              background:
                "linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            {/* Watermark — logo chạy ngang chân menu */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 flex w-[240vw] select-none opacity-50"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { x: ["0%", "-50%"] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 18, ease: "linear", repeat: Infinity }
              }
            >
              {[0, 1].map((i) => (
                <Image
                  key={i}
                  src="/images/Logo.png"
                  alt=""
                  width={525}
                  height={200}
                  aria-hidden="true"
                  className="h-auto w-[min(525px,120vw)] shrink-0"
                />
              ))}
            </motion.div>

            <GlassPill>
              <div className="flex h-14 items-center justify-between px-3">
                <MobileLogo onClick={() => setMobileOpen(false)} />
                <MobileMenuButton
                  onClick={() => setMobileOpen(false)}
                  label="Close menu"
                  expanded
                  variant="dark"
                />
              </div>
            </GlassPill>

            <div className="relative flex min-h-0 w-full flex-1 flex-col justify-between">
              <nav className="w-full px-2" aria-label="Mobile navigation">
                {NAV_LINKS.map((item, idx) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMobileItemClick(item.label, item.href)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-6 px-3 py-5 text-left text-[20px] tracking-[-0.2px] text-white",
                      idx > 0 && "border-t border-white/10"
                    )}
                  >
                    <span className="flex-1">{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className="size-4 text-white"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </nav>

              <div className="flex h-[110px] w-full items-center justify-center">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="relative flex h-11 w-[276px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-[#0d0d0d] pl-6 pr-4"
                  style={{
                    background:
                      "linear-gradient(136deg, #333 0.79%, #0d0d0d 35.22%, #262626 99.16%)",
                    boxShadow:
                      "inset 0 2px 4px 0 rgba(0,0,0,0.2), inset 0 -2px 4px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span className="whitespace-nowrap text-base font-medium tracking-[-0.32px] text-white">
                    {NAV_CTA}
                  </span>
                  <ArrowRight className="size-[18px] text-white" strokeWidth={2} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
