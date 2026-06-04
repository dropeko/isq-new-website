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
 * Composição da animação do logo (3 camadas):
 *  1. Sonar pulse rings — 2 círculos vermelhos pulsando em fase
 *     defasada (delay 1.4s entre eles), sensação de "energia
 *     emanando da marca". Fit com a linguagem técnica/precisão.
 *  2. Iris reveal — clip-path circle 0% → 72% (cobertura completa de
 *     um quadrado: raio 70.7% via teorema de Pitágoras), 1.4s na
 *     entrada com ease cinematográfico [0.7, 0, 0.3, 1].
 *  3. Breathing — scale 1 → 1.025 → 1 em loop de 4.5s, delay 1.5s
 *     pra começar só depois do iris terminar.
 *
 * Fade do overlay: rápido (180px de scrollY) pra primeira seção
 * ficar claramente visível assim que o usuário começa a rolar.
 * Antes era 520px — usuário reportou que demorava demais.
 *
 * Acessibilidade:
 *  - aria-hidden no overlay: o conteúdo real é o que importa para AT.
 *  - O skip-link permanece em z-[100] (acima da intro), então usuários
 *    de teclado podem pular direto para #main sem ver a animação.
 */
export default function IntroScreen() {
  const t = useTranslations("intro");
  const { scrollY } = useScroll();

  // Fade muito rápido: 140px ≈ 17% de viewport típica
  const opacity = useTransform(scrollY, [0, 140], [1, 0], { clamp: true });
  const scale = useTransform(scrollY, [0, 140], [1, 1.08], { clamp: true });
  const hintOpacity = useTransform(scrollY, [0, 50], [1, 0], { clamp: true });
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
        {/* Sonar pulse rings — 2 ondas defasadas, ritmo mais ágil */}
        {[0, 0.95].map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{
              scale: [0.92, 1.12, 1.45],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 1.9,
              repeat: Infinity,
              ease: "easeOut",
              times: [0, 0.3, 1],
              delay,
            }}
            className="absolute inset-[-12%] rounded-full border border-isq-red/45"
          />
        ))}

        {/* Iris reveal — clip-path circular abrindo do centro */}
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)", scale: 0.96 }}
          animate={{ clipPath: "circle(72% at 50% 50%)", scale: 1 }}
          transition={{ duration: 1.4, ease: [0.7, 0, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Breathing — pulsação sutil em loop após o iris */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.025, 1] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
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
