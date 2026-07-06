"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { use3DCapable } from "@/lib/use3DCapable";

/**
 * Quebra entre Manifesto (n.01) e Pilares (n.02) — um "momento de inspeção"
 * na transição, na linguagem do Hero: um pipeline de aço sendo varrido.
 *
 * Desktop capaz: cena WebGL (BreakScene) montada só quando a faixa entra na
 * viewport (não mantém dois canvases sempre ativos). Fallback (mobile /
 * reduced-motion / sem WebGL): painel técnico navy com grade + varredura CSS
 * dirigida pelo scroll — nada de foto estática.
 */
const BreakScene = dynamic(() => import("@/components/break/BreakScene"), {
  ssr: false,
});

const GRID =
  "repeating-linear-gradient(0deg, rgba(227,236,245,0.4) 0 1px, transparent 1px 30px), repeating-linear-gradient(90deg, rgba(227,236,245,0.4) 0 1px, transparent 1px 30px)";

export default function ImageBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const capable = use3DCapable();
  const [mounted, setMounted] = useState(false); // trava: monta uma vez
  const [active, setActive] = useState(false); // controla o frameloop

  // Monta/ativa a cena WebGL conforme a faixa entra/sai da viewport.
  useEffect(() => {
    if (!capable || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [capable]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Varredura horizontal (esq→dir) do fallback CSS, dirigida pelo scroll.
  const scan = useTransform(scrollYProgress, [0.1, 0.9], ["-6%", "106%"], {
    clamp: true,
  });

  const show3D = capable && mounted;
  const cssScan = !show3D && !reduce; // varredura CSS só quando não há WebGL
  const BAND = "12%";
  const bandMask = `linear-gradient(to right, transparent calc(var(--scan) - ${BAND}), #000 var(--scan), transparent calc(var(--scan) + ${BAND}))`;

  return (
    <section
      ref={ref}
      aria-label="Pausa visual — inspeção de pipeline"
      className="relative isolate w-full overflow-hidden bg-isq-navy"
    >
      <div
        className="relative h-[clamp(16rem,34vw,26rem)] w-full"
        style={{
          background:
            "radial-gradient(120% 130% at 50% 32%, #16273d 0%, #0b1623 60%, #070e18 100%)",
        }}
      >
        {/* Painel técnico — backdrop (também base sob o WebGL) */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={
            {
              "--scan": reduce ? "50%" : scan,
            } as unknown as React.CSSProperties
          }
        >
          {/* Grade técnica sutil */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: GRID, backgroundPosition: "center" }}
          />
          {/* "Tubo" — seam horizontal central */}
          <div className="absolute inset-x-[6%] top-1/2 h-px -translate-y-1/2 bg-isq-off/15" />

          {cssScan && (
            <>
              {/* Banda técnica revelada em torno da varredura */}
              <div
                className="absolute inset-0 mix-blend-soft-light"
                style={{
                  maskImage: bandMask,
                  WebkitMaskImage: bandMask,
                  backgroundColor: "rgba(227,236,245,0.10)",
                  backgroundImage: GRID,
                  backgroundPosition: "center",
                }}
              />
              {/* Linha de varredura vertical (posição horizontal = --scan) */}
              <div
                className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-isq-red to-transparent"
                style={{
                  left: "var(--scan)",
                  boxShadow: "0 0 14px 1px rgba(214,0,0,0.6)",
                }}
              />
            </>
          )}
        </motion.div>

        {/* Cena WebGL — desktop capaz, montada on-view */}
        {show3D && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <BreakScene active={active} />
          </motion.div>
        )}

        {/* Vinheta interna — assenta a cena */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 120px 24px rgba(7,14,24,0.6)" }}
        />

        {/* Rótulo técnico */}
        <div className="pointer-events-none absolute bottom-4 left-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-isq-off/70 sm:bottom-6 sm:left-6">
          <span aria-hidden className="h-px w-6 bg-isq-red" />
          Varredura · Integridade estrutural
        </div>

        {/* Gradiente topo/baixo — amarra com as seções paper vizinhas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-isq-paper to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-isq-paper to-transparent"
        />
      </div>
    </section>
  );
}
