"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CTA, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";

interface IndicatorStyle {
  left: number;
  width: number;
}

export function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  const [indicator, setIndicator] = useState<IndicatorStyle>({ left: 24, width: 24 });
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

  const handleItemClick = (label: string, href: string) => {
    setActiveItem(label);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-32 flex items-center pointer-events-none">
      <div className="relative w-full max-w-[1728px] mx-auto px-6 flex items-center justify-between gap-6 pointer-events-auto">
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
          className="hidden md:block p-[1.4px] rounded-3xl flex-shrink-0"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #D9D9D9 0deg, #D9D9D9 65deg, #F2F2F2 150deg, #DFD0EA 176deg, #D9D9D9 204deg, #D9D9D9 255deg, #A6CEDA 285deg, #ECECEC 319deg, #D9D9D9 360deg)",
          }}
        >
          <div
            ref={navInnerRef}
            className="relative flex items-center h-12 px-6 rounded-[22px]"
            style={{
              background:
                "linear-gradient(97deg, rgba(245,245,247,0.97) 4.23%, rgba(240,240,244,0.95) 56%, rgba(232,234,236,0.97) 99.91%)",
              boxShadow:
                "inset 0 -2px 4px rgba(255,255,255,0.5), inset 0 4px 6px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.06)",
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
          <PillButtonCta className="font-medium">
            {NAV_CTA}
          </PillButtonCta>
        </div>
      </div>
    </header>
  );
}
