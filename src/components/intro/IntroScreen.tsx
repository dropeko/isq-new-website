"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";

/**
 * IntroScreen — abertura "cinema" estilo Netflix.
 *
 * Renderiza uma tela preta full-viewport com a marca ISQ centralizada
 * grande. Conforme o usuário rola a página, a tela desvanece para
 * revelar o conteúdo já montado por baixo.
 *
 * Mecânica:
 *  - Posição: fixed inset-0, z-[90] (abaixo do skip-link em z-[100]).
 *  - Fade: opacity 1 → 0 nos primeiros ~520px de scrollY (ease
 *    natural via Lenis, sem easing curve adicional para preservar
 *    a sensação de "controle pelo dedo").
 *  - Scale do logo: 1 → 1.06 nos mesmos 520px, dando a sensação de
 *    "saindo de cena" pra frente.
 *  - Hint "role para revelar" some mais rápido (120px) — é uma
 *    instrução, não conteúdo.
 *  - pointer-events e visibility ficam off quando a tela está quase
 *    transparente, para não capturar cliques no conteúdo abaixo.
 *
 * Acessibilidade:
 *  - aria-hidden no overlay: o conteúdo real é o que importa para AT.
 *  - O skip-link permanece em z-[100] (acima da intro), então usuários
 *    de teclado podem pular direto para #main sem ver a animação.
 *  - reduceMotion: a animação ainda funciona mas o tempo é o do scroll,
 *    o que respeita o ritmo do usuário (não autoplay).
 */
export default function IntroScreen() {
  const t = useTranslations("intro");
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 520], [1, 0], { clamp: true });
  const scale = useTransform(scrollY, [0, 520], [1, 1.06], { clamp: true });
  const hintOpacity = useTransform(scrollY, [0, 120], [1, 0], { clamp: true });
  const pointerEvents = useTransform(opacity, (v) =>
    v < 0.04 ? "none" : "auto",
  );
  const visibility = useTransform(opacity, (v) =>
    v < 0.01 ? "hidden" : "visible",
  );

  return (
    <motion.div
      style={{ opacity, pointerEvents, visibility }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black"
      aria-hidden
    >
      <motion.div
        style={{ scale }}
        className="relative h-[78vmin] w-[78vmin] will-change-transform"
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
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="block h-10 w-px bg-isq-off"
        />
      </motion.div>
    </motion.div>
  );
}
