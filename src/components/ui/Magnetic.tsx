"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** Força do puxão (px no limite da área). */
  strength?: number;
};

/**
 * Magnetic — puxa o conteúdo sutilmente em direção ao cursor quando ele se
 * aproxima, afunilando a atenção para a ação (usado no CTA do fecho).
 *
 * Desativa em prefers-reduced-motion e em ponteiros grossos (touch).
 */
export default function Magnetic({
  children,
  className,
  strength = 10,
}: MagneticProps) {
  const root = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const active = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    active.current = !reduce && fine;
    if (!active.current || !root.current) return;
    const opts = { duration: 0.6, ease: "power3.out" };
    xTo.current = gsap.quickTo(root.current, "x", opts);
    yTo.current = gsap.quickTo(root.current, "y", opts);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    xTo.current?.(px * strength * 2);
    yTo.current?.(py * strength * 2);
  };

  const onLeave = () => {
    if (!active.current) return;
    xTo.current?.(0);
    yTo.current?.(0);
  };

  return (
    <div
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
