"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";

type LineProps = {
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Linha cujo reveal é atrelado ao progresso de scroll dentro da seção.
 * - y: 105% → 0% conforme progress percorre [start, end]
 * - opacity acompanha um pouco antes, evitando fade-in tardio
 *
 * Cada linha tem seu próprio range, criando o efeito "as palavras vão
 * subindo enquanto você rola" — substitui o stagger viewport-once anterior.
 */
function Line({ progress, start, end, className, children }: LineProps) {
  const y = useTransform(progress, [start, end], ["105%", "0%"], {
    clamp: true,
  });
  const opacity = useTransform(
    progress,
    [start, start + (end - start) * 0.7],
    [0, 1],
    { clamp: true },
  );

  return (
    <span className="relative block overflow-hidden pb-[0.08em] leading-[0.98]">
      <motion.span
        style={{ y, opacity }}
        className={`inline-block will-change-transform ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Manifesto() {
  const t = useTranslations("manifesto");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Stagger das 4 linhas dentro do range visível (0..1 do scroll na seção).
  // Cada linha "acende" em janelas sobrepostas, criando cascata contínua.
  const sigOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.66],
    [0, 1],
    { clamp: true },
  );
  const sigY = useTransform(
    scrollYProgress,
    [0.52, 0.66],
    [28, 0],
    { clamp: true },
  );

  return (
    <section
      ref={ref}
      aria-label="Manifesto"
      className="relative isolate overflow-hidden bg-isq-off py-[clamp(3.5rem,7.5vw,6rem)] text-isq-navy"
    >
      {/* Hairline superior — divisor sutil que sinaliza nova seção sem
          quebrar a continuidade off-white com o hero */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] origin-left bg-isq-navy/10"
      />

      <Container className="relative">
        <div className="grid grid-cols-12 gap-y-10">
          {/* Rail blueprint à esquerda — continuidade com o overlay técnico do hero */}
          <div className="col-span-12 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red">
                {t("section")}
              </span>
              <span
                aria-hidden
                className="h-px w-24 bg-isq-navy/20 lg:h-24 lg:w-px"
              />
              <span className="text-[10px] uppercase tracking-[0.32em] text-isq-navy/45">
                {t("marker")}
              </span>
            </motion.div>
          </div>

          {/* Bloco do manifesto */}
          <div className="col-span-12 lg:col-span-10 lg:pl-4">
            {/* Meta editorial top-right */}
            <div className="mb-4 hidden items-baseline justify-end gap-2 lg:flex">
              <span aria-hidden className="h-px w-10 bg-isq-navy/20" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                {t("meta")}
              </span>
            </div>

            <h2 className="font-serif tracking-[-0.02em] text-[clamp(2rem,5vw,4.75rem)] leading-[1.02]">
              <Line
                progress={scrollYProgress}
                start={0.18}
                end={0.34}
                className="font-sans font-extralight text-isq-navy/45"
              >
                {t("line1")}{" "}
                <em className="font-serif italic font-normal text-isq-navy">
                  {t("line1Emph")}
                </em>
              </Line>
              <Line
                progress={scrollYProgress}
                start={0.26}
                end={0.42}
                className="font-sans font-extralight text-isq-navy/45"
              >
                {t("line2")}{" "}
                <em className="font-serif italic font-normal text-isq-navy">
                  {t("line2Emph")}
                </em>
              </Line>
              <Line
                progress={scrollYProgress}
                start={0.34}
                end={0.50}
                className="font-sans font-extralight text-isq-navy/45"
              >
                {t("line3")}{" "}
                <strong className="font-sans font-semibold text-isq-navy">
                  {t("line3Emph")}
                </strong>
              </Line>
              <Line
                progress={scrollYProgress}
                start={0.42}
                end={0.58}
                className="font-sans font-extralight text-isq-navy/45"
              >
                {t("line4")}{" "}
                <strong className="font-sans font-semibold text-isq-red">
                  {t("line4Emph")}
                </strong>
              </Line>
            </h2>

            {/* Assinatura editorial — entra após a 4ª linha terminar */}
            <motion.div
              style={{ opacity: sigOpacity, y: sigY }}
              className="mt-8 flex max-w-2xl items-start gap-5 lg:mt-10 will-change-transform"
            >
              <span
                aria-hidden
                className="mt-3 h-px w-12 shrink-0 bg-isq-navy/30"
              />
              <p className="font-serif italic text-base text-isq-navy/65 sm:text-lg">
                {t("signature")}
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
