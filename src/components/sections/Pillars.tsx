"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import PillarCard from "@/components/pillars/PillarCard";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const lineMaskVariants: Variants = { hidden: {}, visible: {} };

const lineInnerVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function LeadLine({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      variants={lineMaskVariants}
      className="relative block overflow-hidden pb-[0.06em] leading-[0.98]"
    >
      <motion.span
        variants={lineInnerVariants}
        className={`inline-block will-change-transform ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

type ItemEntry = { number: string; title: string; description: string };

/**
 * Pillars — pinned horizontal scroll (rodada 2 do tratamento de animação).
 *
 * Comportamento:
 *  - lg+ : a seção tem altura 260vh; o painel interno fica sticky no topo
 *    enquanto a trilha de 4 cards é translatada horizontalmente proporcional
 *    ao scroll vertical. Implementa o "scroll horizontal dentro do vertical".
 *  - <lg : mantém o grid scattered original (vertical), sem pin.
 *
 * A distância horizontal (maxX) é medida no mount + resize a partir da
 * largura real da trilha, evitando hardcode de vw que quebra em viewports
 * intermediárias.
 */
export default function Pillars() {
  const t = useTranslations("pillars");
  const items = t.raw("items") as Record<string, ItemEntry>;
  const cardOrder: ItemEntry[] = [
    items.marketAccess,
    items.safety,
    items.innovation,
    items.reputation,
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // maxX como motion value para que useTransform reaja sem stale closure
  const maxX = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      if (mq.matches && trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewport = window.innerWidth;
        maxX.set(Math.max(0, trackWidth - viewport));
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

    // Refaz medição após fontes carregarem (clamp+font metrics afetam scrollWidth)
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

  // Reserva ~10% iniciais para o header entrar antes de começar o scrub
  // horizontal, e ~5% finais para "respiro" antes da próxima seção.
  const x = useTransform(
    [scrollYProgress, maxX],
    ([p, m]) => {
      const eased = Math.max(0, Math.min(1, ((p as number) - 0.08) / 0.82));
      return -(m as number) * eased;
    },
  );

  // Indicador de progresso (barra inferior) — sinaliza ao usuário que ele
  // está dentro de um scrub horizontal e ainda há cards
  const progressScale = useTransform(scrollYProgress, [0.08, 0.9], [0, 1], {
    clamp: true,
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Pilares"
      className="relative bg-isq-off lg:h-[260vh]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] bg-isq-navy/10"
      />

      {/* Painel sticky no desktop, fluxo natural no mobile */}
      <div className="relative py-[clamp(3.5rem,7vw,5.5rem)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden lg:py-0">
        {/* Header — eyebrow + h2 */}
        <Container>
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 lg:col-span-2">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="block text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red"
              >
                {t("section")}
              </motion.span>
            </div>

            <div className="col-span-12 lg:col-span-10 lg:pl-4">
              <div className="mb-4 hidden items-baseline justify-end gap-2 lg:flex">
                <span aria-hidden className="h-px w-10 bg-isq-navy/20" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                  {t("meta")}
                </span>
              </div>

              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="font-serif tracking-[-0.02em] text-[clamp(1.75rem,4.4vw,4rem)] leading-[1.04] text-isq-navy"
              >
                <LeadLine className="font-sans font-extralight text-isq-navy/45">
                  {t("lead.part1")}{" "}
                  <em className="font-serif italic font-normal text-isq-navy">
                    {t("lead.part2")}
                  </em>
                </LeadLine>
                <LeadLine className="font-sans font-extralight text-isq-navy/45">
                  {t("lead.part3")}{" "}
                  <strong className="font-sans font-semibold text-isq-navy">
                    {t("lead.part4")}
                  </strong>
                </LeadLine>
              </motion.h2>
            </div>
          </div>
        </Container>

        {/* Mobile (lg:hidden) — grid scattered original */}
        <Container className="lg:hidden">
          <div className="mt-[clamp(2rem,4.5vw,3.5rem)] grid grid-cols-12 gap-x-8 gap-y-10">
            <PillarCard
              number={cardOrder[0].number}
              title={cardOrder[0].title}
              description={cardOrder[0].description}
              className="col-span-12"
            />
            <PillarCard
              number={cardOrder[1].number}
              title={cardOrder[1].title}
              description={cardOrder[1].description}
              className="col-span-12"
            />
            <PillarCard
              number={cardOrder[2].number}
              title={cardOrder[2].title}
              description={cardOrder[2].description}
              className="col-span-12"
            />
            <PillarCard
              number={cardOrder[3].number}
              title={cardOrder[3].title}
              description={cardOrder[3].description}
              className="col-span-12"
            />
          </div>
        </Container>

        {/* Desktop (hidden lg:flex) — trilha horizontal scrubada */}
        <div className="relative mt-12 hidden lg:block">
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex w-max items-stretch gap-[clamp(2rem,3vw,3.5rem)] pl-[var(--container-px)] pr-[12vw] will-change-transform"
            >
              {cardOrder.map((item, i) => (
                <PinnedPillar
                  key={item.number}
                  index={i}
                  total={cardOrder.length}
                  scrollYProgress={scrollYProgress}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </motion.div>
          </div>

          {/* Trilho de progresso — fica no rodapé do painel */}
          <div className="mx-auto mt-12 flex max-w-[110rem] items-center gap-4 px-[var(--container-px)]">
            <span className="text-[10px] uppercase tracking-[0.32em] text-isq-navy/45">
              01 / {String(cardOrder.length).padStart(2, "0")}
            </span>
            <div className="relative h-px flex-1 bg-isq-navy/15">
              <motion.span
                aria-hidden
                style={{ scaleX: progressScale, transformOrigin: "left center" }}
                className="absolute inset-0 block h-px bg-isq-navy/70"
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.32em] text-isq-navy/45">
              {String(cardOrder.length).padStart(2, "0")} / {String(cardOrder.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}

/**
 * Card individual da trilha pinned. Tem reveal próprio atrelado a uma
 * janela do scrollYProgress global da seção — cada card "acende" quando
 * está prestes a entrar no centro do viewport durante o scrub.
 */
function PinnedPillar({
  index,
  total,
  scrollYProgress,
  number,
  title,
  description,
}: {
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  number: string;
  title: string;
  description: string;
}) {
  // O scrub ocupa [0.08, 0.9] do progresso. Divide essa janela entre cards
  // com sobreposição: cada card acende ~30% antes de chegar ao centro.
  const span = (0.9 - 0.08) / total;
  const start = 0.08 + span * index - 0.06;
  const end = 0.08 + span * (index + 1) - 0.1;
  const safeStart = Math.max(0, start);
  const safeEnd = Math.min(1, Math.max(safeStart + 0.01, end));

  const opacity = useTransform(
    scrollYProgress,
    [safeStart, (safeStart + safeEnd) / 2],
    [0.25, 1],
    { clamp: true },
  );
  const yShift = useTransform(
    scrollYProgress,
    [safeStart, (safeStart + safeEnd) / 2],
    [40, 0],
    { clamp: true },
  );

  return (
    <motion.div
      style={{ opacity, y: yShift }}
      className="shrink-0 will-change-transform w-[clamp(20rem,32vw,30rem)]"
    >
      <PillarCardStatic
        number={number}
        title={title}
        description={description}
      />
    </motion.div>
  );
}

/**
 * Versão "pura" do PillarCard (sem whileInView), porque dentro da trilha
 * horizontal o IntersectionObserver compete com o transform x e cria
 * piscadas. O reveal aqui é controlado pelo PinnedPillar acima.
 */
function PillarCardStatic({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group relative flex flex-col gap-7 pt-6">
      <div className="flex items-center gap-4">
        <span className="font-serif text-sm italic tracking-tight text-isq-red">
          n.{number}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 origin-left bg-isq-navy/15 transition-colors duration-500 group-hover:bg-isq-navy/35"
        />
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rotate-45 bg-isq-navy/25 transition-colors duration-500 group-hover:bg-isq-red"
        />
      </div>

      <h3 className="font-serif text-[clamp(1.5rem,2.6vw,2.75rem)] leading-[1.04] tracking-[-0.015em] text-isq-navy">
        {title}
      </h3>

      <p className="max-w-prose text-base leading-relaxed text-isq-navy/65 sm:text-[17px]">
        {description}
      </p>

      <span
        aria-hidden
        className="mt-2 flex items-center gap-3 self-end text-[11px] uppercase tracking-[0.28em] text-isq-navy/40 transition-colors duration-500 group-hover:text-isq-red"
      >
        <span className="h-px w-6 bg-current transition-[width] duration-500 group-hover:w-10" />
        <span>↗</span>
      </span>
    </article>
  );
}
