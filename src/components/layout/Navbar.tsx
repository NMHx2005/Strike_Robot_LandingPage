"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CTA, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";

interface IndicatorStyle {
  left: number;
  width: number;
}

const PILL_BAR_BG =
  "linear-gradient(95deg, rgba(255,255,255,0.80) 4.23%, rgba(255,255,255,0.40) 56%, rgba(223,227,229,0.50) 99.91%)";
const PILL_BAR_SHADOW =
  "inset 0 4px 6px 0 rgba(255,255,255,0.20), inset 0 -2px 4px 0 rgba(255,255,255,0.30)";
// translateZ(0) force GPU compositing layer cho element có backdrop-filter,
// giúp scroll mượt hơn (không repaint blur mỗi frame).
const GPU_LAYER = "translateZ(0)";

export function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [indicator, setIndicator] = useState<IndicatorStyle>({ left: 24, width: 24 });
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
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="hidden md:flex relative w-full mx-auto px-[48px] h-32 items-center justify-between gap-6 pointer-events-auto">
          <Link
            href="/"
            className="flex-shrink-0 w-[360px] flex items-center"
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

          <div
            className="flex-shrink-0 rounded-[24px] p-[1.4px]"
            style={{
              background:
                "linear-gradient(from 0deg at 50% 50%, #D9D9D9 0deg, #D9D9D9 65deg, #F2F2F2 150deg, #DFD0EA 176deg, #D9D9D9 204deg, #D9D9D9 255deg, #A6CEDA 285deg, #ECECEC 319deg, #D9D9D9 360deg)",
            }}
          >
            <div
              ref={navInnerRef}
              className="relative flex h-12 items-center overflow-hidden px-6"
              style={{
                borderRadius: 22.6,
                background: PILL_BAR_BG,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: PILL_BAR_SHADOW,
                transform: GPU_LAYER,
                willChange: "backdrop-filter",
              }}
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
                        "relative flex items-center gap-1 px-3 h-8 text-sm transition-colors duration-200 rounded-lg select-none cursor-pointer",
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
                          className="w-3 h-3 shrink-0 text-[#999]"
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
                  transition={{ type: "spring", stiffness: 450, damping: 38, mass: 0.8 }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute rounded-full bg-black h-1 w-6"
                  style={{ bottom: -1, left: indicator.left }}
                />
              )}
            </div>
          </div>

          <div className="flex-shrink-0 w-[360px] flex items-center justify-end">
            <PillButtonCta className="font-medium">{NAV_CTA}</PillButtonCta>
          </div>
        </div>

        <div className="md:hidden p-3 pointer-events-auto">
          <div
            className="relative border-[1.4px] border-[#d9d9d9] rounded-[12px] flex items-center justify-between px-3 py-2"
            style={{
              background: PILL_BAR_BG,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: PILL_BAR_SHADOW,
              transform: GPU_LAYER,
              willChange: "backdrop-filter",
            }}
          >
            <Link
              href="/"
              className="flex items-center w-[84px]"
              aria-label={SITE_NAME}
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

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
              className="flex items-center justify-center size-8 cursor-pointer"
            >
              <Menu className="size-5 text-black" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="md:hidden fixed inset-0 z-[60] flex flex-col p-3 gap-2.5 overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, #1f1f1f 0%, rgba(10,10,10,0.9) 100%)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              transform: GPU_LAYER,
              willChange: "backdrop-filter",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            <div className="pointer-events-none select-none absolute bottom-0 left-0 w-[525px] max-w-none opacity-5">
              <Image
                src="/images/Logo.png"
                alt=""
                width={525}
                height={200}
                aria-hidden="true"
                className="w-full h-auto"
              />
            </div>

            <div
              className="relative border-[1.4px] border-[#d9d9d9] rounded-[12px] flex items-center justify-between px-3 py-2 h-12 shrink-0"
              style={{
                background: PILL_BAR_BG,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: PILL_BAR_SHADOW,
                transform: GPU_LAYER,
                willChange: "backdrop-filter",
              }}
            >
              <Link
                href="/"
                className="flex items-center w-[84px]"
                aria-label={SITE_NAME}
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/Logo.png"
                  alt={SITE_NAME}
                  width={84}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center size-8 cursor-pointer"
              >
                <X className="size-5 text-black" strokeWidth={2} />
              </button>
            </div>

            <div className="relative flex-1 flex flex-col justify-between w-full min-h-0">
              <nav className="px-2 w-full" aria-label="Mobile navigation">
                {NAV_LINKS.map((item, idx) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMobileItemClick(item.label, item.href)}
                    className={cn(
                      "flex items-center gap-6 px-3 py-5 w-full text-left text-white text-[20px] tracking-[-0.2px] cursor-pointer",
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

              <div className="flex items-center justify-center h-[110px] w-full">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="relative flex items-center justify-center gap-3 w-[276px] h-11 rounded-3xl border-2 border-[#0d0d0d] pl-6 pr-4 overflow-hidden cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(136deg, #333 0.79%, #0d0d0d 35.22%, #262626 99.16%)",
                    boxShadow:
                      "inset 0 2px 4px 0 rgba(0,0,0,0.2), inset 0 -2px 4px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span className="font-medium text-white text-base tracking-[-0.32px] whitespace-nowrap">
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
