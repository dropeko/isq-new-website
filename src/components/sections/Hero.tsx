"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroHeading from "@/components/hero/HeroHeading";
import HeroVisual from "@/components/hero/HeroVisual";

/**
 * Hero da home — Fase 1.1
 *
 * Animações:
 *  - Headline com reveal por palavra (motion)
 *  - Visual com clip-path reveal (motion)
 *  - Overlay técnico desenhando linhas de cota (SVG stroke-dasharray via motion)
 *  - Transição de fundo off-white → deep navy via GSAP ScrollTrigger
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sectionRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.body.style.background = "var(--color-isq-off)";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(document.body, { backgroundColor: "var(--color-isq-off)" });
      gsap.to(document.body, {
        backgroundColor: "#0b1623",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "bottom bottom",
          end: "bottom top+=20%",
          scrub: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.body.style.background = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="relative isolate overflow-hidden pt-[120px] pb-[var(--section-py)]"
    >
      <div className="mx-auto grid max-w-[110rem] grid-cols-1 gap-12 px-[var(--container-px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="flex items-center">
          <HeroHeading />
        </div>
        <div className="flex items-center">
          <HeroVisual />
        </div>
      </div>

      {/* Indicador de scroll discreto */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <span className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-isq-navy/40">
          <span aria-hidden className="h-10 w-px bg-isq-navy/30" />
        </span>
      </div>
    </section>
  );
}
