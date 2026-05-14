"use client";

import { motion } from "motion/react";
import Image, { type ImageLoaderProps } from "next/image";
import TechnicalOverlay from "./TechnicalOverlay";

/**
 * Loader custom para imagens do Unsplash — usa a CDN deles
 * (que já aceita parâmetros de transformação) sem passar pelo
 * otimizador da Vercel (evita limite de quota e duplicação de cache).
 */
const unsplashLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 85));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
};

const HERO_PHOTO_SRC =
  "https://images.unsplash.com/photo-1513828646384-e4d8ec30d2bb";
const HERO_PHOTO_ALT =
  "Equipamento industrial em aço inoxidável — tanques e tubulação de processo, registrando o detalhe técnico que a ISQ inspeciona e certifica.";
const HERO_PHOTO_CREDIT = "Crystal Kwok · Unsplash";

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
        <Image
          loader={unsplashLoader}
          src={HERO_PHOTO_SRC}
          alt={HERO_PHOTO_ALT}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          quality={85}
          className="object-cover"
        />
        {/* Gradient de leitura — escurece sutilmente as bordas para o overlay técnico
            (em deep navy) manter contraste sobre o aço claro da foto */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,22,35,0.10) 0%, rgba(11,22,35,0.00) 30%, rgba(11,22,35,0.00) 70%, rgba(11,22,35,0.35) 100%)",
          }}
        />
        {/* Crédito do fotógrafo — discreto no canto inferior direito */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-isq-off/75">
          <span aria-hidden className="h-px w-6 bg-isq-off/45" />
          Foto · {HERO_PHOTO_CREDIT}
        </div>
      </motion.div>

      {/* Overlay técnico animado por cima do visual */}
      <div className="pointer-events-none absolute inset-0">
        <TechnicalOverlay />
      </div>
    </div>
  );
}
