"use client";

import { motion, type Variants } from "motion/react";

/**
 * Overlay decorativo com linguagem de blueprint:
 * - linhas de cota (com setas tipo dimensão técnica)
 * - callout circular com label
 * - grid técnico sutil
 * Cada elemento é desenhado via stroke-dasharray animado.
 */

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 1.1 + i * 0.18 },
      opacity: { duration: 0.4, delay: 1.1 + i * 0.18 },
    },
  }),
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: 1.5 + i * 0.18, ease: "easeOut" },
  }),
};

export default function TechnicalOverlay() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 600 720"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full text-isq-navy/70"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      {/* Linha de cota horizontal superior (com extensões verticais) */}
      <motion.path
        custom={0}
        variants={drawVariants}
        d="M 60 80 L 60 110 M 540 80 L 540 110 M 60 95 L 540 95"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Setas da linha de cota */}
      <motion.path
        custom={0}
        variants={drawVariants}
        d="M 60 95 L 72 90 M 60 95 L 72 100 M 540 95 L 528 90 M 540 95 L 528 100"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Label da cota superior */}
      <motion.g custom={1} variants={fadeVariants}>
        <rect
          x="270"
          y="82"
          width="60"
          height="26"
          rx="2"
          fill="var(--color-isq-off)"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <text
          x="300"
          y="99"
          textAnchor="middle"
          className="font-sans"
          fontSize="9"
          letterSpacing="0.18em"
          fill="currentColor"
        >
          ISO 9001
        </text>
      </motion.g>

      {/* Linha de cota vertical lateral direita */}
      <motion.path
        custom={2}
        variants={drawVariants}
        d="M 555 130 L 580 130 M 555 640 L 580 640 M 568 130 L 568 640"
        stroke="currentColor"
        strokeWidth="1"
      />
      <motion.path
        custom={2}
        variants={drawVariants}
        d="M 568 130 L 563 142 M 568 130 L 573 142 M 568 640 L 563 628 M 568 640 L 573 628"
        stroke="currentColor"
        strokeWidth="1"
      />
      <motion.g custom={3} variants={fadeVariants}>
        <text
          x="582"
          y="388"
          textAnchor="start"
          className="font-sans"
          fontSize="9"
          letterSpacing="0.22em"
          fill="currentColor"
          transform="rotate(90 582 388)"
        >
          50 ANOS
        </text>
      </motion.g>

      {/* Callout circular com cross-hair — referência a inspeção */}
      <motion.circle
        custom={4}
        variants={drawVariants}
        cx="120"
        cy="540"
        r="44"
        stroke="currentColor"
        strokeWidth="1"
      />
      <motion.path
        custom={4}
        variants={drawVariants}
        d="M 120 504 L 120 576 M 84 540 L 156 540"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="3 3"
      />
      <motion.path
        custom={5}
        variants={drawVariants}
        d="M 164 540 L 240 540 L 240 600"
        stroke="currentColor"
        strokeWidth="1"
      />
      <motion.g custom={6} variants={fadeVariants}>
        <text
          x="248"
          y="604"
          className="font-sans"
          fontSize="9"
          letterSpacing="0.22em"
          fill="currentColor"
        >
          INSPEÇÃO · ENSAIOS
        </text>
      </motion.g>

      {/* Grid técnico sutil ao fundo */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.2, delay: 0.6 }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={60 + i * 48}
            y1="120"
            x2={60 + i * 48}
            y2="620"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="2 4"
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="60"
            y1={120 + i * 50}
            x2="540"
            y2={120 + i * 50}
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="2 4"
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}
