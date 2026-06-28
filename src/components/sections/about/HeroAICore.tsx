"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic "AI Core" embedded verbatim from public/ai-core/index.html (the
 * standalone three.js scene). The HTML file is never modified — only the
 * iframe's size/position are controlled here. Its built-in opaque page
 * background (a radial gradient) is overridden to transparent at runtime via
 * the same-origin DOM (the file on disk stays byte-identical) so the crystal
 * core overlays the hands cleanly. No logo asset ships next to it, so only the
 * core renders.
 */
export function HeroAICore({ className }: { className?: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    const clearBackground = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc?.body) return false;
        doc.documentElement.style.background = "transparent";
        doc.body.style.background = "transparent";
        doc.body.style.backgroundImage = "none";
        return true;
      } catch {
        return false;
      }
    };

    // Apply on load and retry briefly — covers lazy-load / parse timing.
    clearBackground();
    iframe.addEventListener("load", clearBackground);
    let tries = 0;
    const id = window.setInterval(() => {
      if (clearBackground() || ++tries > 20) window.clearInterval(id);
    }, 150);

    return () => {
      iframe.removeEventListener("load", clearBackground);
      window.clearInterval(id);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src="/ai-core/index.html?v=3"
      title="StrikeRobot AI core"
      aria-hidden
      tabIndex={-1}
      scrolling="no"
      className={className}
      style={{ border: 0, background: "transparent" }}
    />
  );
}
