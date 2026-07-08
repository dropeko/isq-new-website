"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type Variants,
} from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import ScanDivider from "@/components/ui/ScanDivider";
import ChapterMarker from "@/components/ui/ChapterMarker";

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Clientes — substitui o grid estático por marquee de duas linhas com
 * direção oposta. A velocidade base é constante; quando o usuário rola,
 * a velocidade do scroll multiplica o ritmo do marquee e pode inverter
 * direção temporariamente (sensação de "vento do scroll").
 *
 * Referência: pattern de useVelocity/useSpring + wrap do motion docs,
 * adaptado para tipografia editorial (não logos) com alternância de
 * pesos para manter o ritmo visual já estabelecido.
 */
export default function Clients() {
  const t = useTranslations("clients");
  const names = t.raw("names") as string[];
  const sectors = t.raw("sectors") as string[];

  // Divide alternado para os dois trilhos terem variedade de pesos
  const rowA = names.filter((_, i) => i % 2 === 0);
  const rowB = names.filter((_, i) => i % 2 === 1);
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Clientes"
      className="relative isolate overflow-hidden bg-isq-off py-[clamp(4.5rem,9vw,7.5rem)]"
    >
      <ScanDivider />

      <Container>
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 lg:col-span-2">
            <ChapterMarker section={t("section")} />
          </div>
          <div className="col-span-12 lg:col-span-10 lg:pl-4">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeVariants}
              className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-isq-navy"
            >
              <span className="font-sans font-extralight text-isq-navy/55">
                {t("lead")}{" "}
              </span>
              <strong className="font-sans font-semibold text-isq-navy">
                {t("leadEmph")}
              </strong>
            </motion.h2>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={containerVariants}
              className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              {sectors.map((sector) => (
                <motion.li
                  key={sector}
                  variants={itemVariants}
                  className="inline-flex items-center rounded-full border border-isq-navy/15 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-isq-navy/65 transition-colors hover:border-isq-navy/35 hover:text-isq-navy"
                >
                  {sector}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </Container>

      {reduce ? (
        /* Reduced-motion: grade estática acessível (sem auto-scroll) */
        <StaticNames names={names} />
      ) : (
        <>
          {/* Marquee full-bleed com máscara lateral. Hover PAUSA a linha
              (leitura) e cada nome vira "✓ verificado" vermelho. */}
          <div
            className="relative mt-[clamp(3rem,6vw,5rem)] [mask-image:linear-gradient(to_right,transparent_0,#000_8%,#000_92%,transparent_100%)]"
            aria-hidden
          >
            <MarqueeRow names={rowA} baseVelocity={-1.2} />
            <MarqueeRow names={rowB} baseVelocity={1.5} className="mt-3" />
          </div>

          {/* Lista acessível — o marquee é aria-hidden */}
          <ul className="sr-only">
            {names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

type RowProps = {
  names: string[];
  baseVelocity: number;
  className?: string;
};

function MarqueeRow({ names, baseVelocity, className }: RowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Mapeia velocidade real do scroll para um fator multiplicador da
  // velocidade base. Sem clamp: scroll rápido pode acelerar/inverter.
  const velocityFactor = useTransform(
    smoothVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false },
  );

  // wrap entre -25% e -75% — duplicamos o conteúdo 4x abaixo, então 25%
  // representa um ciclo completo de um conjunto.
  const x = useTransform(baseX, (v) => `${wrap(-25, -75, v)}%`);

  const directionFactor = useRef<number>(1);
  const paused = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);

  // Pausa o marquee quando a linha sai da viewport — não gasta RAF/transform
  // com a seção fora da tela (perf).
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((_t, delta) => {
    if (paused.current || !inView.current) return; // hover ou fora da tela
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Quando o usuário rola, a direção do marquee se alinha com a
    // direção do scroll temporariamente
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={rowRef}
      className={`flex overflow-hidden ${className ?? ""}`}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <motion.div
        style={{ x }}
        className="flex shrink-0 items-baseline gap-[clamp(2rem,4vw,4.5rem)] whitespace-nowrap pr-[clamp(2rem,4vw,4.5rem)] will-change-transform"
      >
        {/* 4 cópias para garantir cobertura contínua mesmo em viewports largos */}
        {[0, 1, 2, 3].map((copy) =>
          names.map((name, i) => (
            <MarqueeItem key={`${copy}-${name}`} index={i} name={name} />
          )),
        )}
      </motion.div>
    </div>
  );
}

function MarqueeItem({ index, name }: { index: number; name: string }) {
  // Alternância de pesos preserva o ritmo editorial da versão anterior
  const styleClass =
    index % 3 === 0
      ? "font-serif italic text-[clamp(1.6rem,3vw,3rem)]"
      : index % 3 === 1
        ? "font-sans font-semibold text-[clamp(1.4rem,2.6vw,2.6rem)] tracking-[-0.01em]"
        : "font-sans font-light text-[clamp(1.4rem,2.6vw,2.6rem)] tracking-tight";

  return (
    <span
      className={`group inline-flex items-baseline gap-2 text-isq-navy transition-colors duration-500 hover:text-isq-red ${styleClass}`}
    >
      <span
        aria-hidden
        className="text-[10px] font-mono text-isq-navy/30 transition-colors duration-500 group-hover:text-isq-red"
      >
        ·
      </span>
      <span>{name}</span>
      {/* Selo "verificado" — sutil por padrão, acende no hover (parceiro
          inspecionado/confiável pela ISQ) */}
      <span
        aria-hidden
        className="ml-0.5 self-center text-isq-navy/20 transition-colors duration-500 group-hover:text-isq-red"
      >
        <svg
          viewBox="0 0 24 24"
          width="0.6em"
          height="0.6em"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </span>
  );
}

/**
 * StaticNames — fallback para prefers-reduced-motion: os mesmos nomes em
 * grade estática, legível e acessível (sem auto-scroll). Reusa MarqueeItem
 * para manter a tipografia e o selo "verificado".
 */
function StaticNames({ names }: { names: string[] }) {
  return (
    <div className="mt-[clamp(3rem,6vw,5rem)] px-[var(--container-px)]">
      <ul className="mx-auto flex max-w-[110rem] flex-wrap items-baseline gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-4">
        {names.map((name, i) => (
          <li key={name}>
            <MarqueeItem index={i} name={name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
