"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { ChevronDown, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_CTA, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { PillButtonCta } from "@/components/ui/PillButton";
import { GlassPill, METALLIC_BORDER_BG, PILL_BAR_BG, PILL_BAR_SHADOW, GPU_LAYER } from "@/components/ui/GlassPill";
import { MenuIcon } from "@/components/ui/MenuIcon";

const PRODUCT_LINKS = [
  {
    label: "SR Platform",
    description: "Generates physics-valid simulation environments, produce 3D assets",
    href: "/",
  },
  {
    label: "SR Agentic",
    description: "Builds task-shaped spatial understanding on the fly — and adapts instantly",
    href: "/agentic",
  },
];

function ProductCubeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g filter="url(#navbarProductShadow)">
        <path
          d="M5.83213 37.0418C4.17926 36.0088 4.53237 33.5059 6.40651 32.9704L24.0252 27.9365C25.9511 27.3863 28.017 27.6292 29.7626 28.6111L42.0318 35.5125C43.7332 36.4696 43.4921 38.9908 41.6402 39.6081L24.3161 45.3828C22.1938 46.0902 19.8665 45.8133 17.9694 44.6277L5.83213 37.0418Z"
          fill="url(#navbarProductGround)"
        />
        <path
          d="M24.3132 28.9458C25.9694 28.4726 27.7466 28.6815 29.2478 29.5259L41.5173 36.4272C42.4246 36.9377 42.2958 38.2825 41.3083 38.6118L23.9841 44.3862C22.1589 44.9946 20.1576 44.7565 18.5261 43.7368L6.38843 36.1519C5.5069 35.6009 5.69552 34.2656 6.69507 33.98L24.3132 28.9458Z"
          stroke="url(#navbarProductGroundStroke)"
          strokeWidth="2.1"
        />
      </g>
      <path
        d="M40.497 11.188L40.4062 11.0817L27.4917 3.78833L7.5 10.0803L7.50248 29.3887L7.59383 29.4949L20.5078 36.7883L40.5 30.4963L40.497 11.188ZM28.1143 7.91235L34.7567 11.6936L28.1143 13.7568V7.91235ZM19.0428 32.173L12.2514 28.3672L19.0428 26.2306V32.173ZM10.7646 27.0653V14.1006L19.0189 18.7651L19.0463 24.4817L10.7646 27.0653ZM13.6062 11.9478C13.4871 11.8775 13.3243 11.8037 13.2433 11.6945L26.4785 7.51937V14.2968L20.8722 16.0399C18.4734 14.6401 15.9981 13.3589 13.6062 11.9478ZM26.4785 17.7347V22.1543L22.364 23.4311V19.0115L26.4785 17.7347ZM22.364 32.7622V25.1501L27.2351 23.6367L35.7967 28.5142L22.364 32.7622ZM37.2349 27.4091L28.1396 22.2522L28.1113 17.2242L37.2349 14.346V27.4091Z"
        fill="url(#navbarProductCube)"
      />
      <defs>
        <filter
          id="navbarProductShadow"
          x="3.27393"
          y="26.1479"
          width="41.405"
          height="21.1198"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="0" stdDeviation="0.75" floodOpacity="0.3" />
        </filter>
        <radialGradient
          id="navbarProductGround"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20.9649 38.0022) rotate(90) scale(7.2837 18.2092)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#CCCCCC" />
        </radialGradient>
        <linearGradient
          id="navbarProductGroundStroke"
          x1="26.6843"
          y1="31.1743"
          x2="23.8604"
          y2="47.5862"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DDDDDD" stopOpacity="0.3" />
          <stop offset="0.360553" stopColor="white" />
          <stop offset="1" stopColor="#DDDDDD" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient
          id="navbarProductCube"
          x1="24"
          y1="3.78833"
          x2="24"
          y2="36.7883"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2D2C39" />
          <stop offset="1" stopColor="#486466" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NavChevronIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M10 4L6 8L2 4"
        stroke={active ? "white" : "#666666"}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopProductOpen, setDesktopProductOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const productCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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

  useEffect(() => {
    if (!mobileOpen) setMobileProductOpen(false);
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (productCloseTimerRef.current) {
        clearTimeout(productCloseTimerRef.current);
      }
    };
  }, []);

  const openProductDropdown = () => {
    if (productCloseTimerRef.current) {
      clearTimeout(productCloseTimerRef.current);
      productCloseTimerRef.current = null;
    }
    setDesktopProductOpen(true);
  };

  const closeProductDropdown = () => {
    if (productCloseTimerRef.current) {
      clearTimeout(productCloseTimerRef.current);
    }
    productCloseTimerRef.current = setTimeout(
      () => setDesktopProductOpen(false),
      120
    );
  };

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
    setDesktopProductOpen(false);
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
        <div className="pointer-events-auto relative mx-auto hidden w-full items-center justify-between gap-6 p-6 md:flex">
          <Link
            href="/"
            className="flex flex-1 items-center"
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
            className="relative flex-shrink-0"
            onMouseLeave={closeProductDropdown}
          >
          <GlassPill radius={24} className="rounded-[24px]">
            <div
              className="relative flex items-center justify-center overflow-hidden border-[1.4px] border-white/40 px-3 py-2"
              style={{ borderRadius: 24 }}
            >
              <nav className="flex items-center gap-[6px]" aria-label="Main navigation">
                {NAV_LINKS.filter((item) => item.label !== "Home").map((item) => {
                  const isActive = activeItem === item.label;
                  const isProduct = item.label === "Product";
                  const isHighlighted = isActive;
                  return (
                    <button
                      key={item.label}
                      onMouseEnter={
                        isProduct
                          ? openProductDropdown
                          : () => setDesktopProductOpen(false)
                      }
                      onFocus={isProduct ? openProductDropdown : undefined}
                      onClick={() => {
                        if (isProduct) {
                          setActiveItem(item.label);
                          openProductDropdown();
                          return;
                        }
                        handleItemClick(item.label, item.href);
                      }}
                      aria-expanded={isProduct ? desktopProductOpen : undefined}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-full px-4 py-2 font-sans text-sm font-medium leading-none tracking-normal transition-[color,padding] duration-200",
                        isHighlighted
                          ? "px-4 font-semibold text-white"
                          : "text-[#4d4d4d] hover:text-black"
                      )}
                    >
                      {isHighlighted && (
                        <motion.span
                          layoutId="desktop-nav-active-pill"
                          className="absolute inset-0 rounded-full bg-black"
                          transition={{
                            type: "spring",
                            stiffness: 430,
                            damping: 36,
                            mass: 0.8,
                          }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                      {item.hasDropdown && (
                        <NavChevronIcon active={isHighlighted} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </GlassPill>
          <AnimatePresence>
            {desktopProductOpen && (
              <motion.div
                key="desktop-product-dropdown"
                className="absolute left-1/2 top-[58px] z-20 w-max max-w-[min(400px,calc(100vw-96px))] -translate-x-1/2 overflow-hidden rounded-[24px] border-[1.4px] p-4"
                style={{
                  background:
                    "linear-gradient(90.64deg, #FFFFFF 4.23%, rgba(255,255,255,0.8) 56%, rgba(223,227,230,0.8) 99.91%)",
                  borderColor: "#D9D9D9",
                  boxShadow:
                    "0 12px 50px 8px rgba(0,0,0,0.10), inset 0 -2px 4px rgba(255,255,255,0.30), inset 0 4px 6px rgba(255,255,255,0.20)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                }}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                onMouseEnter={openProductDropdown}
                onMouseLeave={closeProductDropdown}
              >
                <div className="flex flex-col">
                  {PRODUCT_LINKS.map((product) => (
                    <Link
                      key={product.label}
                      href={product.href}
                      onClick={() => {
                        setActiveItem("Product");
                        setDesktopProductOpen(false);
                      }}
                      className="group flex items-center gap-4 rounded-[18px] px-2 py-4 transition-colors duration-200 hover:bg-white/55"
                    >
                      <ProductCubeIcon className="size-12 shrink-0 opacity-60" />
                      <span className="min-w-0 flex-1">
                        <span className="mb-2.5 block font-sans text-[18px] font-semibold leading-none tracking-normal text-black">
                          {product.label}
                        </span>
                        <span className="block font-sans text-sm font-normal leading-[18px] tracking-normal text-[#999999]">
                          {product.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <div className="flex flex-1 items-center justify-end">
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
                {NAV_LINKS.map((item, idx) => {
                  const isProduct = item.label === "Product";
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => {
                          if (isProduct) {
                            setActiveItem(item.label);
                            setMobileProductOpen((open) => !open);
                            return;
                          }
                          handleMobileItemClick(item.label, item.href);
                        }}
                        aria-expanded={isProduct ? mobileProductOpen : undefined}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-6 px-3 py-5 text-left text-[20px] tracking-[-0.2px] text-white",
                          idx > 0 && "border-t border-white/10"
                        )}
                      >
                        <span className="flex-1">{item.label}</span>
                        {item.hasDropdown && (
                          <ChevronDown
                            className={cn(
                              "size-4 text-white transition-transform duration-200",
                              isProduct && mobileProductOpen && "rotate-180"
                            )}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      {isProduct && (
                        <AnimatePresence initial={false}>
                          {mobileProductOpen && (
                            <motion.div
                              key="mobile-product-links"
                              className="mx-3 mb-2 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05]"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: prefersReducedMotion ? 0 : 0.22,
                              }}
                            >
                              <div className="flex flex-col p-4">
                                {PRODUCT_LINKS.map((product) => (
                                  <Link
                                    key={product.label}
                                    href={product.href}
                                    onClick={() => {
                                      setActiveItem("Product");
                                      setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-4 rounded-[18px] px-2 py-4 text-white transition-colors active:bg-white/10"
                                  >
                                    <ProductCubeIcon className="size-12 shrink-0 opacity-60" />
                                    <span className="min-w-0 flex-1">
                                      <span className="mb-2.5 block font-sans text-[18px] font-semibold leading-none tracking-normal">
                                        {product.label}
                                      </span>
                                      <span className="block font-sans text-sm font-normal leading-[18px] tracking-normal text-white/55">
                                        {product.description}
                                      </span>
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
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
