"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";

/**
 * IntroScreen — abertura cinematográfica "boot de calibração".
 *
 * No load, uma sequência de calibração auto-play: cantos de mira (viewfinder)
 * desenham, uma varredura vermelha cruza a tela, readouts técnicos (HUD)
 * entram e uma barra de calibração enche até 100% — e a marca ISQ se revela
 * (iris) como "resultado". Depois os readouts dimem, deixando a marca + hint.
 *
 * O dismiss segue igual ao ajustado antes: atrelado ao scroll do IntroBuffer
 * (100vh no topo), a marca se eleva e dissolve em ~75% do buffer, sumindo
 * antes de o Hero assentar. aria-hidden; skip-link (z-[100]) fica acima.
 */

// Readouts decorativos (aria-hidden) — termos técnicos/marca.
const READOUTS = [
  { pos: "left-6 top-16 sm:left-10", text: "ISQ · sistema de inspeção", delay: 0.35 },
  { pos: "right-6 top-16 text-right sm:right-10", text: "rev · 2026.06", delay: 0.5 },
  { pos: "left-6 bottom-16 sm:left-10", text: "ensaios não-destrutivos · ok", delay: 0.95 },
  { pos: "right-6 bottom-16 text-right sm:right-10", text: "iso 9001 · iec 17025", delay: 1.1 },
];

const CORNERS = [
  "left-6 top-6 border-l border-t sm:left-8 sm:top-8",
  "right-6 top-6 border-r border-t sm:right-8 sm:top-8",
  "right-6 bottom-6 border-b border-r sm:right-8 sm:bottom-8",
  "left-6 bottom-6 border-b border-l sm:left-8 sm:bottom-8",
];

export default function IntroScreen() {
  const t = useTranslations("intro");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const [vh, setVh] = useState(800);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fadeEnd = vh * 0.75;
  const opacity = useTransform(scrollY, [0, fadeEnd], [1, 0], { clamp: true });
  const scale = useTransform(scrollY, [0, fadeEnd], [1, 1.08], { clamp: true });
  const y = useTransform(scrollY, [0, fadeEnd], [0, -vh * 0.09], {
    clamp: true,
  });
  const hintOpacity = useTransform(scrollY, [0, vh * 0.25], [1, 0], {
    clamp: true,
  });
  const pointerEvents = useTransform(opacity, (v) =>
    v < 0.04 ? "none" : "auto",
  );
  const visibility = useTransform(opacity, (v) =>
    v < 0.01 ? "hidden" : "visible",
  );

  return (
    <motion.div
      style={{ opacity, pointerEvents, visibility }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#06090f]"
      aria-hidden
    >
      {/* Camada de calibração — auto-play no mount, dima ao final */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0.32] }}
          transition={{ duration: 3, times: [0, 0.78, 1], ease: "easeInOut" }}
        >
          {/* Cantos de mira (viewfinder) */}
          {CORNERS.map((c, i) => (
            <motion.span
              key={c}
              className={`absolute h-8 w-8 border-isq-off/40 ${c}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}

          {/* Varredura vermelha — sweep único de cima a baixo */}
          <motion.span
            className="absolute inset-x-0 top-0 block h-px bg-gradient-to-r from-transparent via-isq-red to-transparent"
            style={{ boxShadow: "0 0 16px 1px rgba(214,0,0,0.6)" }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: vh, opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 1.9, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Readouts HUD */}
          {READOUTS.map((r) => (
            <motion.span
              key={r.text}
              className={`absolute font-mono text-[10px] uppercase tracking-[0.22em] text-isq-off/55 ${r.pos}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: r.delay, ease: "easeOut" }}
            >
              {r.text}
            </motion.span>
          ))}

          {/* Barra de calibração */}
          <motion.div
            className="absolute bottom-24 left-1/2 flex w-[min(64vw,22rem)] -translate-x-1/2 items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-isq-off/60">
              calibração
            </span>
            <span className="relative h-px flex-1 overflow-hidden bg-isq-off/20">
              <motion.span
                className="absolute inset-0 block bg-isq-red"
                style={{ transformOrigin: "left center" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
              />
            </span>
            <motion.span
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-isq-red"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.55 }}
            >
              100%
            </motion.span>
          </motion.div>
        </motion.div>
      )}

      {/* Marca ISQ — iris reveal como "resultado" da calibração */}
      <motion.div
        style={{ scale, y }}
        className="relative h-[78vmin] w-[78vmin] will-change-transform"
      >
        {/* Sonar pulse rings — começam após a calibração */}
        {[0, 0.65].map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: [0.92, 1.12, 1.45], opacity: [0, 0.55, 0] }}
            transition={{
              duration: 1.3,
              repeat: Infinity,
              ease: "easeOut",
              times: [0, 0.3, 1],
              delay: 1.0 + delay,
            }}
            className="absolute inset-[-12%] rounded-full border border-isq-red/45"
          />
        ))}

        {/* Iris reveal — abre após o início da calibração */}
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)", scale: 0.96 }}
          animate={{ clipPath: "circle(72% at 50% 50%)", scale: 1 }}
          transition={{ duration: 1.4, delay: reduce ? 0 : 0.9, ease: [0.7, 0, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Breathing — pulsação sutil em loop */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.025, 1] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.4,
            }}
            className="relative h-full w-full"
          >
            <Image
              src="/brand/isq-logo.svg"
              alt=""
              fill
              priority
              sizes="78vmin"
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-isq-off/55">
          {t("hint")}
        </span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 10, 0], opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-10 w-px bg-isq-off"
        />
      </motion.div>
    </motion.div>
  );
}
