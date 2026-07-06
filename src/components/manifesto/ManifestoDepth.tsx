"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * ManifestoDepth — "descida ao detalhe": camadas técnicas de fundo em parallax
 * atrás do statement da n.01, dando profundidade e imersão (ref. Lando Norris).
 *
 * Três planos (blueprint grid ao longe → callout do "detalhe" no meio → cota
 * de precisão perto) percorrem o scroll em ritmos diferentes + leve zoom
 * (sensação de descer/entrar no detalhe) e reagem sutilmente ao cursor
 * (retículo). Faint navy sobre o papel — não compete com a leitura.
 *
 * Só transform/opacity. Em prefers-reduced-motion fica estático (sem parallax
 * de scroll nem de cursor).
 */

const GRID =
  "repeating-linear-gradient(0deg, rgba(11,22,35,0.5) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(11,22,35,0.5) 0 1px, transparent 1px 40px)";

export default function ManifestoDepth({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();

  // Parallax de cursor (suavizado por spring).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  // Parallax de scroll + zoom por plano.
  const farY = useTransform(progress, [0, 1], ["-3%", "5%"]);
  const midY = useTransform(progress, [0, 1], ["7%", "-7%"]);
  const nearY = useTransform(progress, [0, 1], ["13%", "-13%"]);
  const farZoom = useTransform(progress, [0, 1], [1, 1.1]);
  const midZoom = useTransform(progress, [0, 1], [1, 1.05]);

  // Parallax de cursor por plano (mais forte perto = profundidade).
  const farCx = useTransform(smx, [-0.5, 0.5], [-8, 8]);
  const farCy = useTransform(smy, [-0.5, 0.5], [-6, 6]);
  const midCx = useTransform(smx, [-0.5, 0.5], [-18, 18]);
  const midCy = useTransform(smy, [-0.5, 0.5], [-13, 13]);
  const nearCx = useTransform(smx, [-0.5, 0.5], [-30, 30]);
  const nearCy = useTransform(smy, [-0.5, 0.5], [-22, 22]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden text-isq-navy"
    >
      {/* PLANO LONGE — grid blueprint */}
      <motion.div
        style={{ y: reduce ? 0 : farY, scale: reduce ? 1 : farZoom }}
        className="absolute inset-[-12%]"
      >
        <motion.div
          style={{
            x: reduce ? 0 : farCx,
            y: reduce ? 0 : farCy,
            backgroundImage: GRID,
            backgroundPosition: "center",
          }}
          className="h-full w-full opacity-[0.05]"
        />
      </motion.div>

      {/* PLANO MEIO — callout do "detalhe" (círculo + crosshair + ticks) */}
      <motion.div
        style={{ y: reduce ? 0 : midY, scale: reduce ? 1 : midZoom }}
        className="absolute right-[3%] top-[10%] hidden lg:block"
      >
        <motion.div style={{ x: reduce ? 0 : midCx, y: reduce ? 0 : midCy }}>
          <svg
            width="440"
            height="440"
            viewBox="0 0 440 440"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="220" cy="220" r="190" strokeWidth="1" strokeOpacity="0.1" />
            <circle
              cx="220"
              cy="220"
              r="140"
              strokeWidth="1"
              strokeOpacity="0.07"
              strokeDasharray="3 6"
            />
            {/* crosshair */}
            <path
              d="M220 12 V70 M220 370 V428 M12 220 H70 M370 220 H428"
              strokeWidth="1"
              strokeOpacity="0.12"
            />
            {/* ticks radiais (a cada 30°) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r1 = 190;
              const r2 = 176;
              return (
                <line
                  key={i}
                  x1={220 + r1 * Math.cos(a)}
                  y1={220 + r1 * Math.sin(a)}
                  x2={220 + r2 * Math.cos(a)}
                  y2={220 + r2 * Math.sin(a)}
                  strokeWidth="1"
                  strokeOpacity="0.14"
                />
              );
            })}
            <text
              x="220"
              y="224"
              textAnchor="middle"
              fontSize="12"
              letterSpacing="6"
              fill="currentColor"
              fillOpacity="0.2"
              className="font-mono uppercase"
            >
              detalhe
            </text>
          </svg>
        </motion.div>
      </motion.div>

      {/* PLANO PERTO — cota de precisão */}
      <motion.div
        style={{ y: reduce ? 0 : nearY }}
        className="absolute bottom-[12%] left-[2%] hidden md:block"
      >
        <motion.div style={{ x: reduce ? 0 : nearCx, y: reduce ? 0 : nearCy }}>
          <svg
            width="280"
            height="60"
            viewBox="0 0 280 60"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.16"
          >
            <line x1="8" y1="40" x2="272" y2="40" strokeWidth="1" />
            <path d="M8 40 l12 -4 M8 40 l12 4 M272 40 l-12 -4 M272 40 l-12 4" strokeWidth="1" />
            <path d="M8 30 V50 M272 30 V50" strokeWidth="1" />
            <text
              x="140"
              y="28"
              textAnchor="middle"
              fontSize="11"
              letterSpacing="3"
              fill="currentColor"
              fillOpacity="0.28"
              stroke="none"
              className="font-mono uppercase"
            >
              ± 0,01 mm
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
