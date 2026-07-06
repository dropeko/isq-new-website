import type { Variants } from "motion/react";

/**
 * Fonte única de motion do site (ver docs/motion-guide.md).
 * Centraliza easing/duração/variants antes espalhados como literais
 * ([0.22,1,0.36,1] etc.) por dezenas de componentes.
 */

/** Easing como control points (para Motion / framer). */
type Bezier = [number, number, number, number];
export const EASE = {
  out: [0.22, 1, 0.36, 1] as Bezier, // entradas, reveals — espelha --ease-isq
  in: [0.7, 0, 0.84, 0] as Bezier, // saídas — --ease-isq-in
  inOut: [0.65, 0, 0.35, 1] as Bezier, // scrub, atravessar — --ease-isq-inout
  curtain: [0.76, 0, 0.24, 1] as Bezier, // clip / curtain reveals
};

/** Easing como string CSS (para GSAP e estilos inline). */
export const EASE_CSS = {
  out: "cubic-bezier(0.22,1,0.36,1)",
  in: "cubic-bezier(0.7,0,0.84,0)",
  inOut: "cubic-bezier(0.65,0,0.35,1)",
  curtain: "cubic-bezier(0.76,0,0.24,1)",
} as const;

/** Escala de duração em segundos (unidade do Motion/GSAP). */
export const DUR = {
  micro: 0.18,
  fast: 0.3,
  reveal: 0.7,
  slow: 1.1,
  hero: 1.4,
} as const;

export const STAGGER = 0.1;

/** Entrada padrão de conteúdo em viewport (sobe + fade). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE.out },
  },
};

/** Pai que orquestra filhos em cascata. */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.1 },
  },
};

/** Hairline "desenhada" da esquerda (scaleX) — divisor scan-line. */
export const lineDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DUR.slow, ease: EASE.inOut },
  },
};

/** Conteúdo que emerge por clip-path (camada de profundidade). */
export const clipUp: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", y: 12 },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    y: 0,
    transition: { duration: DUR.slow, ease: EASE.curtain },
  },
};

/** Viewport padrão para reveals com scroll (once + meio da seção). */
export const inViewOnce = { once: true, amount: 0.3 } as const;
