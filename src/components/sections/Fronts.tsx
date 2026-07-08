"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import FrontEntry from "@/components/fronts/FrontEntry";
import Tilt from "@/components/ui/Tilt";
import ScanDivider from "@/components/ui/ScanDivider";
import ChapterMarker from "@/components/ui/ChapterMarker";
import { photoCredits, type PhotoCredit } from "@/data/photoCredits";

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

type Front = {
  number: string;
  kicker: string;
  title: string;
  description: string;
  cta: string;
  photo: PhotoCredit;
  href: string;
};

/**
 * Fronts (n.03) — pinned horizontal "long scrub" (rodada 2).
 *
 * Diferenciação proposital em relação a Pilares (n.02):
 *  - Pilares  : 4 cards estreitos, scrub mais rápido, cada card com seu
 *               spotlight (opacity 0.25→1, y 40→0). Sensação de cards
 *               sendo "apresentados" um a um.
 *  - Frentes  : 3 painéis largos (foto + conteúdo lado a lado, ~70vw),
 *               scrub mais lento (320vh de runway), sem reveal por item.
 *               Sensação de filme rolando — passagem contínua de spreads
 *               editoriais. A interação fica no hover (zoom de foto + CTA).
 *
 * Mobile mantém o list full-width vertical (FrontEntry) original.
 */
export default function Fronts() {
  const t = useTranslations("fronts");
  const items = t.raw("items") as Record<
    "sectorSolutions" | "technicalServices" | "academy",
    Omit<Front, "photo" | "href">
  >;

  const fronts: Front[] = [
    {
      ...items.sectorSolutions,
      photo: photoCredits.frontsSolutions,
      href: "#solucoes",
    },
    {
      ...items.technicalServices,
      photo: photoCredits.frontsServices,
      href: "#servicos",
    },
    { ...items.academy, photo: photoCredits.frontsAcademy, href: "#academy" },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxX = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      if (mq.matches && trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        maxX.set(Math.max(0, trackWidth - window.innerWidth));
      } else {
        maxX.set(0);
      }
    };
    measure();

    const ro =
      trackRef.current && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (ro && trackRef.current) ro.observe(trackRef.current);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }

    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
      ro?.disconnect();
    };
  }, [maxX]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Long scrub: mapeamento linear puro (sem ease), 5% intro + 5% outro.
  // Sem snap, sem por-item reveal — apenas continuous translation.
  const x = useTransform([scrollYProgress, maxX], ([p, m]) => {
    const eased = Math.max(0, Math.min(1, ((p as number) - 0.05) / 0.9));
    return -(m as number) * eased;
  });

  const progressScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1], {
    clamp: true,
  });

  // Profundidade horizontal: as fotos deslizam mais devagar que os painéis
  // (parallax de tracking shot). Bounded a ±8% da própria largura — a foto
  // "transborda" 10% de cada lado (ver FrontPanel), então nunca revela borda.
  const reduce = useReducedMotion();
  const photoParallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const photoX = reduce ? undefined : photoParallax;

  return (
    <section
      ref={sectionRef}
      aria-label="Três frentes"
      className="relative bg-isq-off lg:h-[320vh]"
    >
      <ScanDivider />

      <div className="relative pt-[clamp(4.5rem,8vw,7rem)] pb-0 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden lg:pb-0 lg:pt-[clamp(2.75rem,4.5vw,4.25rem)]">
        {/* Header */}
        <Container>
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 lg:col-span-2">
              <ChapterMarker section={t("section")} />
            </div>

            <div className="col-span-12 lg:col-span-10 lg:pl-4">
              <div className="mb-3 hidden items-baseline justify-end gap-2 lg:flex">
                <span aria-hidden className="h-px w-10 bg-isq-navy/20" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                  {t("meta")}
                </span>
              </div>

              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeVariants}
                className="font-serif text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-isq-navy"
              >
                <span className="font-sans font-extralight text-isq-navy/55">
                  {t("lead")}
                </span>
              </motion.h2>
            </div>
          </div>
        </Container>

        {/* Mobile: lista vertical full-width (mantém design original) */}
        <div className="mt-[clamp(3rem,5vw,4.5rem)] border-t border-isq-navy/15 lg:hidden">
          {fronts.map((f) => (
            <FrontEntry
              key={f.number}
              number={f.number}
              kicker={f.kicker}
              title={f.title}
              description={f.description}
              cta={f.cta}
              href={f.href}
              photo={f.photo}
            />
          ))}
        </div>

        {/* Desktop: trilha horizontal de painéis */}
        <div className="relative hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center">
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex w-max items-stretch gap-[clamp(2.5rem,4vw,4.5rem)] pl-[var(--container-px)] pr-[8vw] will-change-transform"
            >
              {fronts.map((f) => (
                <FrontPanel key={f.number} {...f} photoX={photoX} />
              ))}
            </motion.div>
          </div>

          {/* Trilho de progresso editorial — vermelho ISQ pra diferenciar
              do trilho navy dos pilares, reforçando "frentes" como bloco
              de ação/decisão */}
          <div className="mx-auto mt-10 flex w-full max-w-[110rem] items-center gap-4 px-[var(--container-px)]">
            <span className="text-[10px] uppercase tracking-[0.32em] text-isq-navy/45">
              {t("meta")}
            </span>
            <div className="relative h-px flex-1 bg-isq-navy/15">
              <motion.span
                aria-hidden
                style={{
                  scaleX: progressScale,
                  transformOrigin: "left center",
                }}
                className="absolute inset-0 block h-px bg-isq-red"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
              03 / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Painel individual da trilha horizontal — formato "spread" de revista:
 * foto à esquerda (7/12), conteúdo à direita (5/12). Largura clamp para
 * garantir legibilidade em viewports intermediárias (1024-1280).
 *
 * Interação: hover faz a foto zoom suavemente + CTA sublinha cresce. Sem
 * inversão de cor (que pertence ao FrontEntry full-bleed do mobile).
 */
function FrontPanel({
  number,
  kicker,
  title,
  description,
  cta,
  href,
  photo,
  photoX,
}: Front & { photoX?: MotionValue<string> }) {
  return (
    <a
      href={href}
      className="group relative block shrink-0 w-[clamp(28rem,68vw,62rem)]"
    >
      <Tilt max={5} scale={1.012} perspective={1400} glare>
      <article className="grid h-full grid-cols-12 items-stretch gap-x-8">
        {/* Photo */}
        <div className="col-span-7 flex items-center">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-isq-navy/5">
            {/* Foto "transborda" 10% de cada lado e desliza (parallax) dentro
                do quadro conforme a trilha rola — profundidade de tracking shot */}
            <motion.div
              style={{ x: photoX }}
              className="absolute inset-y-0 -inset-x-[10%] will-change-transform"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </motion.div>
            {/* Gradient inferior para o badge do número manter contraste */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-20"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11,22,35,0.35) 0%, rgba(11,22,35,0) 100%)",
              }}
            />
            <span className="absolute top-4 left-4 font-serif italic text-sm tracking-tight text-isq-off">
              n.{number}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-5 flex flex-col justify-center gap-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red">
            {kicker}
          </span>
          <h3 className="font-serif tracking-[-0.015em] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.02] text-isq-navy">
            {title}
          </h3>
          <p className="max-w-prose text-[15px] leading-relaxed text-isq-navy/65">
            {description}
          </p>
          <span className="mt-2 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-isq-navy/55 transition-colors duration-500 group-hover:text-isq-red">
            <span
              aria-hidden
              className="block h-px w-6 bg-current transition-[width] duration-700 group-hover:w-14"
            />
            <span>{cta}</span>
            <span
              aria-hidden
              className="text-base transition-transform duration-700 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </article>
      </Tilt>
    </a>
  );
}
