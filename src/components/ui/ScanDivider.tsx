"use client";

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE } from "@/lib/motion";

/**
 * ScanDivider — transição de fronteira entre seções.
 *
 * A hairline do topo se "desenha" da esquerda (scaleX) enquanto uma cabeça de
 * varredura vermelha cruza a largura — eco do anel de inspeção do Hero. Um
 * gesto por fronteira (ver docs/motion-guide.md). Drop-in para as hairlines
 * estáticas que existiam no topo das seções.
 *
 * Só `transform`/`opacity`. Em prefers-reduced-motion degrada para uma
 * hairline estática (sem desenho, sem varredura).
 */
export default function ScanDivider({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const reduce = useReducedMotion();
  const hairline = tone === "dark" ? "bg-isq-off/15" : "bg-isq-navy/12";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-full max-w-[110rem] overflow-hidden"
    >
      {/* Hairline desenhada da esquerda */}
      <motion.span
        className={`absolute inset-0 block origin-left ${hairline}`}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.inOut }}
      />

      {/* Cabeça de varredura vermelha — varre a largura uma vez */}
      {!reduce && (
        <motion.span
          className="absolute left-0 top-0 block h-px w-[20%] bg-gradient-to-r from-transparent via-isq-red to-transparent will-change-transform"
          style={{ boxShadow: "0 0 10px 1px rgba(214,0,0,0.55)" }}
          initial={{ x: "-110%", opacity: 0 }}
          whileInView={{ x: "610%", opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: DUR.slow, ease: EASE.inOut }}
        />
      )}
    </div>
  );
}
