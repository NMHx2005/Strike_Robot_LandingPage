"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

interface UseParticlesOptions {
  count?: number;
  colors?: string[];
  maxRadius?: number;
  minRadius?: number;
  speed?: number;
  connectionDistance?: number;
  connectionOpacity?: number;
}

const DEFAULT_OPTIONS: Required<UseParticlesOptions> = {
  count: 60,
  colors: ["rgba(108,99,255,{o})", "rgba(0,245,255,{o})"],
  maxRadius: 2.5,
  minRadius: 0.5,
  speed: 0.3,
  connectionDistance: 120,
  connectionOpacity: 0.08,
};

function createParticle(
  canvasWidth: number,
  canvasHeight: number,
  opts: Required<UseParticlesOptions>
): Particle {
  const colorTemplate =
    opts.colors[Math.floor(Math.random() * opts.colors.length)];
  const opacity = 0.3 + Math.random() * 0.5;
  const color = colorTemplate.replace("{o}", String(opacity));

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * opts.speed * 2,
    vy: (Math.random() - 0.5) * opts.speed * 2,
    radius: opts.minRadius + Math.random() * (opts.maxRadius - opts.minRadius),
    opacity,
    color,
  };
}

export function useParticles(options: UseParticlesOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const opts = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...options }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      options?.count,
      options?.speed,
      options?.maxRadius,
      options?.minRadius,
      options?.connectionDistance,
      options?.connectionOpacity,
    ]
  );

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Cap at ~60fps
      const delta = timestamp - lastTimeRef.current;
      if (delta < 16) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTimeRef.current = timestamp;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < opts.connectionDistance) {
            const alpha =
              opts.connectionOpacity * (1 - dist / opts.connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    },
    [opts.connectionDistance, opts.connectionOpacity]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      particlesRef.current = Array.from({ length: opts.count }, () =>
        createParticle(canvas.width, canvas.height, opts)
      );
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, opts]);

  return canvasRef;
}
