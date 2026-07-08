"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Image, { type ImageLoaderProps } from "next/image";
import TechnicalOverlay from "./TechnicalOverlay";
import { use3DCapable } from "@/lib/use3DCapable";

/**
 * Cena WebGL carregada só no cliente. Em SSR e em dispositivos sem suporte
 * (mobile, reduced-motion, sem WebGL) nunca é baixada — o fallback é a foto.
 */
const HeroScene = dynamic(() => import("./scene/HeroScene"), { ssr: false });

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
  const enable3D = use3DCapable();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pausa o frameloop do Hero quando ele sai da viewport (economiza GPU no
  // resto da página). Começa true — o Hero está visível no load.
  useEffect(() => {
    if (!enable3D || !containerRef.current) return;
    const el = containerRef.current;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enable3D]);

  return (
    <div
      ref={containerRef}
      className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-[2px] lg:h-[80vh]"
    >
      {/* Base: foto com reveal por clip-path (SSR + fallback) */}
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
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,22,35,0.10) 0%, rgba(11,22,35,0.00) 30%, rgba(11,22,35,0.00) 70%, rgba(11,22,35,0.35) 100%)",
          }}
        />
        {!enable3D && (
          <div className="absolute bottom-5 right-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-isq-off/75">
            <span aria-hidden className="h-px w-6 bg-isq-off/45" />
            Foto · {HERO_PHOTO_CREDIT}
          </div>
        )}
      </motion.div>

      {/* Fallback: overlay técnico em SVG sobre a foto (quando não há 3D) */}
      {!enable3D && (
        <div className="pointer-events-none absolute inset-0">
          <TechnicalOverlay />
        </div>
      )}

      {/* Painel de inspeção 3D — sobe sobre a foto após o reveal dela.
          Narrativa: material físico (foto) → ensaio técnico (cena WebGL). */}
      {enable3D && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 16%, #16273d 0%, #0b1623 58%, #070e18 100%)",
          }}
        >
          <HeroScene active={inView} />

          {/* Vinheta interna — assenta a peça no painel */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 140px 24px rgba(7,14,24,0.65)" }}
          />

          {/* Rótulo técnico do painel */}
          <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em] text-isq-off/70">
            <span aria-hidden className="h-px w-6 bg-isq-red" />
            Inspeção · Ensaios não-destrutivos
          </div>
        </motion.div>
      )}
    </div>
  );
}
