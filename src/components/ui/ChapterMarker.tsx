"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE, DUR } from "@/lib/motion";

/**
 * ChapterMarker — abertura cinética de capítulo (n.01–n.06).
 *
 * A partir da string da seção ("n.06 — vamos conversar") monta: índice
 * "06 / 06", o número GRANDE (capítulo de filme), uma linha de scan vermelha
 * e o título em caixa-alta — tudo revelado em cascata com mask-rise ao entrar
 * na viewport. Substitui o eyebrow pequeno anterior. Reduced-motion: estático.
 */
function parseSection(section: string) {
  const num = (section.match(/(\d+)/)?.[1] ?? "").padStart(2, "0");
  const parts = section.split(/\s[—–-]\s/);
  const title = (parts[1] ?? parts[0] ?? "").trim();
  return { num, title };
}

const parent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const riseMask: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: DUR.slow, ease: EASE.out } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.reveal, ease: EASE.out } },
};
const lineGrow: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: DUR.slow, ease: EASE.inOut } },
};

export default function ChapterMarker({
  section,
  total = 6,
  tone = "light",
}: {
  section: string;
  total?: number;
  tone?: "light" | "dark";
}) {
  const reduce = useReducedMotion();
  const { num, title } = parseSection(section);
  const totalStr = String(total).padStart(2, "0");
  const numColor = tone === "dark" ? "text-isq-off" : "text-isq-navy";
  const idxColor = tone === "dark" ? "text-isq-off/40" : "text-isq-navy/40";

  return (
    <motion.div
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={parent}
      className="flex flex-col gap-2.5"
    >
      {/* Índice do capítulo */}
      <span className="block overflow-hidden">
        <motion.span
          variants={fadeIn}
          className={`block font-mono text-[10px] tracking-[0.28em] ${idxColor}`}
        >
          {num} / {totalStr}
        </motion.span>
      </span>

      {/* Número grande */}
      <span className="block overflow-hidden pb-[0.06em] leading-[0.82]">
        <motion.span
          variants={riseMask}
          className={`block font-serif text-[clamp(2.5rem,4.4vw,3.75rem)] tracking-[-0.02em] ${numColor}`}
        >
          {num}
        </motion.span>
      </span>

      {/* Linha de scan */}
      <motion.span
        aria-hidden
        variants={lineGrow}
        className="block h-px w-8 origin-left bg-isq-red"
      />

      {/* Título do capítulo */}
      <span className="block overflow-hidden">
        <motion.span
          variants={riseMask}
          className="block text-[10px] font-medium uppercase tracking-[0.28em] text-isq-red"
        >
          {title}
        </motion.span>
      </span>
    </motion.div>
  );
}
