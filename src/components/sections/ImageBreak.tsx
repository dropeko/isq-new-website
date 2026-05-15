"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { photoCredits } from "@/data/photoCredits";

/**
 * Quebra atmosférica entre Manifesto (n.01) e Pilares (n.02). Full-bleed
 * landscape com parallax suave e crédito do fotógrafo discreto no rodapé
 * direito. A intenção é dar pausa editorial — como dobra de revista — antes
 * dos 4 pilares.
 */
export default function ImageBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax: imagem desloca ~12% vertical entre entrada e saída
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const credit = photoCredits.breakManifestoPillars;

  return (
    <section
      ref={ref}
      aria-label="Pausa visual — refinaria"
      className="relative isolate w-full overflow-hidden bg-isq-navy"
    >
      <div className="relative h-[clamp(22rem,58vw,40rem)] w-full">
        <motion.div style={{ y }} className="absolute inset-[-6%]">
          <Image
            src={credit.src}
            alt={credit.alt}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
          />
        </motion.div>

        {/* Gradiente sutil em cima/embaixo para amarrar com as seções vizinhas
            (paper acima → paper abaixo) sem cortar a foto */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-isq-paper to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-isq-paper to-transparent"
        />

        {/* Crédito discreto */}
        <a
          href={credit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-isq-navy/55 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-isq-off/85 backdrop-blur-sm transition-colors hover:bg-isq-navy/75 hover:text-isq-off sm:bottom-6 sm:right-6"
        >
          <span>foto</span>
          <span className="text-isq-off">{credit.photographer}</span>
          <span aria-hidden className="text-isq-off/55">·</span>
          <span>{credit.source}</span>
        </a>
      </div>
    </section>
  );
}
