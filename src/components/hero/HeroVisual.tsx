"use client";

import { motion } from "motion/react";
import TechnicalOverlay from "./TechnicalOverlay";

/**
 * Bloco visual do hero — espaço destinado à foto industrial (Fase 1.1 final).
 * Por enquanto: gradient profissional + overlay técnico animado.
 * A imagem entra como <Image> dentro do wrapper interno quando escolhida.
 */
export default function HeroVisual() {
  return (
    <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-[2px] lg:h-[80vh]">
      {/* Clip-path reveal: a "cortina" sobe de baixo para cima */}
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="absolute inset-0"
      >
        {/* Placeholder até a foto ser escolhida — degrade técnico em deep navy */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 30% 20%, #1f3a5f 0%, #142235 40%, #0b1623 100%)",
          }}
        />
        {/* Camada de "ruído" tipográfico — opcional, dá textura */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 2px, #fff 2px 3px), repeating-linear-gradient(90deg, transparent 0 2px, #fff 2px 3px)",
          }}
        />
        {/* Selo no canto inferior direito */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-isq-off/70">
          <span className="h-px w-8 bg-isq-off/40" />
          IMG · A SER SELECIONADA
        </div>
      </motion.div>

      {/* Overlay técnico animado por cima do visual */}
      <div className="pointer-events-none absolute inset-0">
        <TechnicalOverlay />
      </div>
    </div>
  );
}
