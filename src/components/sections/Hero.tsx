"use client";

import HeroHeading from "@/components/hero/HeroHeading";
import HeroVisual from "@/components/hero/HeroVisual";

/**
 * Hero da home — Fase 1.1
 *
 * Animações:
 *  - Headline com reveal por palavra (motion)
 *  - Visual com clip-path reveal (motion)
 *  - Overlay técnico desenhando linhas de cota (SVG stroke-dasharray via motion)
 *
 * A transição de fundo body que existia anteriormente foi removida na revisão
 * de identidade visual: off-white é a cor predominante do site (institucional)
 * e o navy fica reservado para footer e accents.
 */
export default function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative isolate overflow-hidden pt-[clamp(5.5rem,8vw,6.5rem)] pb-[clamp(3.5rem,7vw,6rem)]"
    >
      <div className="mx-auto grid max-w-[110rem] grid-cols-1 gap-12 px-[var(--container-px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex items-center">
          <HeroHeading />
        </div>
        <div className="flex items-center">
          <HeroVisual />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <span className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-isq-navy/40">
          <span aria-hidden className="h-10 w-px bg-isq-navy/30" />
        </span>
      </div>
    </section>
  );
}
