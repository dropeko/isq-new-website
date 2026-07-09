"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * PillarsDepth — profundidade em parallax atrás do leque da n.02 ("O que
 * entregamos"), na mesma linguagem imersiva do Manifesto (ref. Lando Norris).
 *
 * Planos: grid blueprint ao longe → colunas blueprint no meio (os "pilares"
 * que as cartas materializam) → cota "04 pilares" perto. Cada plano percorre
 * o scroll em ritmo diferente + leve zoom e reage ao cursor (retículo). Faint
 * navy sobre o papel — não compete com as cartas (que ficam por cima).
 *
 * Só transform/opacity. Em prefers-reduced-motion fica estático.
 */

const GRID =
  "repeating-linear-gradient(0deg, rgba(11,22,35,0.5) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(11,22,35,0.5) 0 1px, transparent 1px 40px)";

const COLUMNS = [180, 450, 720];

export default function PillarsDepth({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.4 });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = rootRef.current;
    let inView = false;
    const io = el
      ? new IntersectionObserver(
          ([e]) => {
            inView = e.isIntersecting;
          },
          { rootMargin: "100px 0px" },
        )
      : undefined;
    if (io && el) io.observe(el);
    // Só processa o cursor quando a seção está na viewport (perf).
    const onMove = (e: PointerEvent) => {
      if (!inView) return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, mx, my]);

  const farY = useTransform(progress, [0, 1], ["-3%", "5%"]);
  const midY = useTransform(progress, [0, 1], ["8%", "-8%"]);
  const nearY = useTransform(progress, [0, 1], ["14%", "-14%"]);
  const farZoom = useTransform(progress, [0, 1], [1, 1.1]);
  const midZoom = useTransform(progress, [0, 1], [1, 1.06]);

  const farCx = useTransform(smx, [-0.5, 0.5], [-8, 8]);
  const farCy = useTransform(smy, [-0.5, 0.5], [-6, 6]);
  const midCx = useTransform(smx, [-0.5, 0.5], [-20, 20]);
  const midCy = useTransform(smy, [-0.5, 0.5], [-14, 14]);
  const nearCx = useTransform(smx, [-0.5, 0.5], [-32, 32]);
  const nearCy = useTransform(smy, [-0.5, 0.5], [-24, 24]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden text-isq-navy"
    >
      {/* LONGE — grid blueprint */}
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

      {/* MEIO — colunas blueprint (os "pilares") */}
      <div className="absolute bottom-[6%] left-1/2 hidden -translate-x-1/2 lg:block">
        <motion.div style={{ y: reduce ? 0 : midY, scale: reduce ? 1 : midZoom }}>
          <motion.div style={{ x: reduce ? 0 : midCx, y: reduce ? 0 : midCy }}>
            <svg
              width="900"
              height="540"
              viewBox="0 0 900 540"
              fill="none"
              stroke="currentColor"
            >
              <line x1="40" y1="500" x2="860" y2="500" strokeWidth="1" strokeOpacity="0.1" />
              {COLUMNS.map((cx) => (
                <g key={cx} strokeWidth="1" strokeOpacity="0.09">
                  <line x1={cx - 26} y1="90" x2={cx - 26} y2="500" />
                  <line x1={cx + 26} y1="90" x2={cx + 26} y2="500" />
                  <line x1={cx - 42} y1="90" x2={cx + 42} y2="90" />
                  <line x1={cx - 42} y1="108" x2={cx + 42} y2="108" />
                  <line x1={cx - 40} y1="500" x2={cx + 40} y2="500" />
                </g>
              ))}
              {/* cota superior entre colunas externas */}
              <line x1="180" y1="60" x2="720" y2="60" strokeWidth="1" strokeOpacity="0.08" />
              <path
                d="M180 60 l10 -4 M180 60 l10 4 M720 60 l-10 -4 M720 60 l-10 4 M180 52 V68 M720 52 V68"
                strokeWidth="1"
                strokeOpacity="0.1"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* PERTO — cota "04 pilares" */}
      <motion.div
        style={{ y: reduce ? 0 : nearY }}
        className="absolute bottom-[16%] right-[3%] hidden md:block"
      >
        <motion.div style={{ x: reduce ? 0 : nearCx, y: reduce ? 0 : nearCy }}>
          <svg
            width="220"
            height="60"
            viewBox="0 0 220 60"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.16"
          >
            <line x1="8" y1="40" x2="212" y2="40" strokeWidth="1" />
            <path d="M8 40 l12 -4 M8 40 l12 4 M212 40 l-12 -4 M212 40 l-12 4 M8 30 V50 M212 30 V50" strokeWidth="1" />
            <text
              x="110"
              y="28"
              textAnchor="middle"
              fontSize="11"
              letterSpacing="3"
              fill="currentColor"
              fillOpacity="0.28"
              stroke="none"
              className="font-mono uppercase"
            >
              04 pilares
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
