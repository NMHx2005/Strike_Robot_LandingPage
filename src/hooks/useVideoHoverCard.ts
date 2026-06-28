"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only hover-preview-card state for a hero video: the card shows while
 * the pointer is over the video and auto-hides `hideDelayMs` after it leaves.
 * Gated to fine-pointer / md+ so the mobile tap-to-play flow is untouched.
 */
export function useVideoHoverCard(hideDelayMs = 2500) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isDesktop) {
      clearHideTimer();
      setCardVisible(false);
    }
  }, [isDesktop]);

  useEffect(() => () => clearHideTimer(), []);

  const onVideoEnter = () => {
    if (!isDesktop) return;
    clearHideTimer();
    setCardVisible(true);
  };

  const onVideoLeave = () => {
    if (!isDesktop) return;
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setCardVisible(false);
      hideTimerRef.current = null;
    }, hideDelayMs);
  };

  return { isDesktop, cardVisible, onVideoEnter, onVideoLeave };
}
