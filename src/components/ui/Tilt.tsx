"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  /** Inclinação máxima em graus para cada eixo. */
  max?: number;
  /** Escala no hover (1 = sem zoom). */
  scale?: number;
  /** Profundidade da perspectiva em px (menor = mais dramático). */
  perspective?: number;
  /** Brilho que segue o cursor (luz batendo na superfície). */
  glare?: boolean;
};

/**
 * Tilt — micro-interação 3D reutilizável (pseudo-3D, sem WebGL).
 *
 * Inclina o conteúdo na direção do cursor com perspective + rotateX/Y,
 * suavizado por gsap.quickTo. Com `glare`, sobrepõe um brilho radial que
 * acompanha o cursor — leitura de luz numa superfície (aço/painel técnico).
 *
 * Desativa-se sozinho em prefers-reduced-motion e em ponteiros grossos
 * (touch) — degradando para conteúdo estático, sem listeners.
 */
export default function Tilt({
  children,
  className,
  max = 7,
  scale = 1,
  perspective = 900,
  glare = false,
}: TiltProps) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const rotY = useRef<gsap.QuickToFunc | null>(null);
  const rotX = useRef<gsap.QuickToFunc | null>(null);
  const scl = useRef<gsap.QuickToFunc | null>(null);
  const active = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    active.current = !reduce && fine;
    if (!active.current || !inner.current) return;

    const opts = { duration: 0.55, ease: "power3.out" };
    rotY.current = gsap.quickTo(inner.current, "rotationY", opts);
    rotX.current = gsap.quickTo(inner.current, "rotationX", opts);
    scl.current = gsap.quickTo(inner.current, "scale", opts);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotY.current?.(px * max * 2);
    rotX.current?.(-py * max * 2);
    if (glareRef.current) {
      glareRef.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      glareRef.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    }
  };

  const onEnter = () => {
    if (!active.current) return;
    scl.current?.(scale);
    if (glareRef.current) glareRef.current.style.opacity = "1";
  };

  const onLeave = () => {
    if (!active.current) return;
    rotY.current?.(0);
    rotX.current?.(0);
    scl.current?.(1);
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={root}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={className}
      style={{ perspective }}
    >
      <div
        ref={inner}
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
        {glare && (
          <span
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              opacity: 0,
              transition: "opacity 0.4s ease",
              mixBlendMode: "soft-light",
              background:
                "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
