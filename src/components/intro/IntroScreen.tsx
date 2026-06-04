"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";

/**
 * IntroScreen — abertura "cinema" estilo Netflix.
 *
 * Renderiza uma tela preta full-viewport com a marca ISQ centralizada
 * grande. O fade é atrelado ao scroll DENTRO do IntroBuffer (componente
 * h-screen no topo de page.tsx). Quando o usuário rola todo o buffer
 * (100vh), o overlay vira transparente e a Hero aparece no topo da
 * viewport sem qualquer sobreposição.
 *
 * Diferença para a versão anterior: antes o fade era um range fixo em
 * px (90/140/180/520) e terminava enquanto o usuário ainda estava no
 * topo da Hero — sobreposição visível. Agora o range = viewport height
 * (medido em runtime e atualizado em resize), exatamente igual ao
 * IntroBuffer h-screen. Resultado: fade termina precisamente onde
 * a Hero começa.
 *
 * Animação do logo (3 camadas independentes, todas no mesmo motion.div):
 *  1. Sonar pulse rings — 2 círculos vermelhos pulsando defasados
 *     (delay 0.65s, ritmo enérgico de 1.3s).
 *  2. Iris reveal — clip-path circle(0%) → 72% no mount, 1.4s.
 *  3. Breathing — scale 1 → 1.025 em loop, delay pós-iris.
 *
 * Acessibilidade: aria-hidden no overlay, skip-link em z-[100] acima
 * da intro (z-[90]) pra usuários de teclado pularem direto pra #main.
 */
export default function IntroScreen() {
  const t = useTranslations("intro");
  const { scrollY } = useScroll();

  // Mede a altura do viewport pra ajustar o fade ao tamanho do buffer.
  // SSR inicia com 800 (chute razoável); cliente atualiza no mount.
  const [vh, setVh] = useState(800);
  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fade percorre os 100vh do buffer inteiros — o overlay só vira
  // totalmente transparente quando o buffer foi 100% scrollado.
  const opacity = useTransform(scrollY, [0, vh], [1, 0], { clamp: true });
  const scale = useTransform(scrollY, [0, vh], [1, 1.08], { clamp: true });
  // Hint some bem mais cedo (~25% do buffer) — é uma instrução,
  // não conteúdo, e perde utilidade assim que o usuário começou.
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
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black"
      aria-hidden
    >
      <motion.div
        style={{ scale }}
        className="relative h-[78vmin] w-[78vmin] will-change-transform"
      >
        {/* Sonar pulse rings — 2 ondas defasadas, ritmo enérgico */}
        {[0, 0.65].map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{
              scale: [0.92, 1.12, 1.45],
              opacity: [0, 0.55, 0],
            }}
            transition={{
              duration: 1.3,
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
