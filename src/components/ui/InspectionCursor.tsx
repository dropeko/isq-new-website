"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * InspectionCursor — cursor cinematográfico em forma de retículo de inspeção.
 *
 * Um alvo (4 cantos + ponto central) que segue o cursor com leve atraso
 * (cinematográfico), "trava" ao passar por elementos interativos (amplia) e
 * fica "armado" nos botões/CTAs (amplia + gira 45°). Usa mix-blend difference
 * para permanecer visível tanto nas seções claras quanto nas escuras.
 *
 * Só aparece em ponteiros finos e sem prefers-reduced-motion — caso contrário
 * o cursor nativo é mantido (nada muda). Nos campos de formulário o retículo
 * some e o cursor de texto nativo volta.
 */
const FIELD = "input, textarea, select, [contenteditable='true']";
const CTA = "button, [data-cursor='cta']";
const HOVER = "a, [role='button'], label, [data-cursor='hover']";

export default function InspectionCursor() {
  const [active, setActive] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // 1) Decide se ativa — NÃO depende do elemento já existir (senão nunca
  //    ativa: o div com o ref só renderiza depois de `active` virar true).
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setActive(true);
  }, []);

  // 2) Já ativo (o retículo renderizou): monta gsap + listeners.
  useEffect(() => {
    if (!active || !root.current) return;
    document.documentElement.classList.add("has-reticle");
    const el = root.current;

    const xTo = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3.out" });
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        gsap.set(el, { x: e.clientX, y: e.clientY, autoAlpha: 1 });
        seen = true;
      } else {
        xTo(e.clientX);
        yTo(e.clientY);
      }
      const t = e.target as HTMLElement | null;
      let state = "";
      if (t?.closest?.(FIELD)) state = "hide";
      else if (t?.closest?.(CTA)) state = "cta";
      else if (t?.closest?.(HOVER)) state = "hover";
      if (el.dataset.state !== state) el.dataset.state = state;
    };

    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    const enter = () => gsap.to(el, { autoAlpha: 1, duration: 0.2 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-reticle");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={root} aria-hidden className="reticle">
      <div className="reticle__inner">
        <svg
          viewBox="0 0 44 44"
          width="44"
          height="44"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="square"
        >
          <path d="M8 15 V8 H15" />
          <path d="M29 8 H36 V15" />
          <path d="M36 29 V36 H29" />
          <path d="M15 36 H8 V29" />
        </svg>
        <span className="reticle__dot" />
      </div>
    </div>
  );
}
