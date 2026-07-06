"use client";

import { useRef } from "react";
import { motion, useScroll, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import ScanDivider from "@/components/ui/ScanDivider";
import ChapterMarker from "@/components/ui/ChapterMarker";
import PillarsDepth from "@/components/pillars/PillarsDepth";
import Tilt from "@/components/ui/Tilt";

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

type PillarItem = { number: string; title: string; description: string };
type FanPosition = { x: string; y: number; rotate: number; baseZ: number };

/**
 * Posições do leque de 4 cartas. Pivot no canto inferior central
 * (transform-origin 50% 100%) — simula uma mão de baralho. As cartas
 * externas têm rotação e Y maiores para criar o arco natural; as
 * internas ficam quase verticais e ligeiramente acima.
 *
 * x usa calc(-50% ± Xvw) para combinar:
 *  · -50% : autocentralização do card (cancela sua própria largura)
 *  · ±Xvw : offset do leque, proporcional à viewport — em telas largas
 *            o leque abre; em telas estreitas, se aperta.
 * Esse padrão evita conflito entre centralização (left:50%) e o
 * offset do leque, e mantém tudo num único motion.div.
 */
const FAN_POSITIONS: FanPosition[] = [
  { x: "calc(-50% - 19vw)", y: 70, rotate: -13, baseZ: 1 },
  { x: "calc(-50% - 6.5vw)", y: 10, rotate: -4.5, baseZ: 2 },
  { x: "calc(-50% + 6.5vw)", y: 10, rotate: 4.5, baseZ: 2 },
  { x: "calc(-50% + 19vw)", y: 70, rotate: 13, baseZ: 1 },
];

/**
 * Pillars (n.02 — "O que entregamos") em formato "mão de cartas".
 *
 * 4 cartas tipográficas (sem foto — pilares são conceituais, não visuais)
 * dispostas em leque no centro da viewport. Entrada em cascata ("dealing"):
 * cartas voam de baixo e descansam em formação. Hover destaca a carta
 * apontada: roda à vertical, sobe e ganha sombra forte — como puxar uma
 * carta da mão para examiná-la.
 *
 * Mobile: empilha as cartas verticalmente (mesmo CardBody, sem leque).
 */
export default function Pillars() {
  const t = useTranslations("pillars");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const items = t.raw("items") as Record<string, PillarItem>;
  const order: PillarItem[] = [
    items.marketAccess,
    items.safety,
    items.innovation,
    items.reputation,
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="Pilares"
      className="relative isolate overflow-hidden bg-isq-off pt-[clamp(4.5rem,8vw,7rem)] pb-[clamp(4rem,7vw,6rem)]"
    >
      <ScanDivider />

      {/* Profundidade em camadas — "pilares" blueprint (parallax + cursor) */}
      <PillarsDepth progress={scrollYProgress} />

      <Container className="relative z-10">
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 lg:col-span-2">
            <ChapterMarker section={t("section")} />
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

      {/* Desktop: leque de 4 cartas. Altura da seção em clamp para
          escalar com viewport — mais baixa que antes (640 fixo) pra dar
          mais protagonismo às cartas. */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
        }}
        className="relative mx-auto mt-[clamp(3rem,6vw,5rem)] hidden h-[clamp(33rem,40vw,38rem)] w-full max-w-[1320px] lg:block"
      >
        {order.map((item, i) => (
          <FanCard key={item.number} item={item} position={FAN_POSITIONS[i]} />
        ))}
      </motion.div>

      {/* Mobile: empilhadas */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="mt-[clamp(3rem,6vw,5rem)] flex flex-col items-center gap-6 px-[var(--container-px)] lg:hidden"
      >
        {order.map((item) => (
          <StackCard key={item.number} item={item} />
        ))}
      </motion.div>
    </section>
  );
}

function FanCard({
  item,
  position,
}: {
  item: PillarItem;
  position: FanPosition;
}) {
  const variants: Variants = {
    hidden: {
      x: position.x,
      y: position.y + 140,
      rotate: position.rotate - 28,
      opacity: 0,
    },
    visible: {
      x: position.x,
      y: position.y,
      rotate: position.rotate,
      opacity: 1,
      transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{
        y: position.y - 56,
        rotate: 0,
        scale: 1.05,
        zIndex: 20,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{
        transformOrigin: "50% 100%",
        zIndex: position.baseZ,
        left: "50%",
      }}
      className="group absolute bottom-16 block w-[clamp(19rem,23vw,23rem)]"
    >
      {/* Tilt em wrapper interno: o motion.div externo segue dono de
          x/y/rotate/scale (leque + hover do Framer); o Tilt só adiciona
          rotateX/Y + glare por dentro — sem conflito de transform. */}
      <Tilt max={5} perspective={1000} glare>
        <CardBody item={item} />
      </Tilt>
    </motion.div>
  );
}

function StackCard({ item }: { item: PillarItem }) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div
      variants={variants}
      className="group block w-full max-w-[22rem]"
    >
      <CardBody item={item} />
    </motion.div>
  );
}

function CardBody({ item }: { item: PillarItem }) {
  return (
    <article className="relative flex aspect-[7/10] flex-col justify-between overflow-hidden rounded-[3px] border border-isq-navy/10 bg-isq-paper p-6 shadow-[0_8px_28px_-12px_rgba(11,22,35,0.22)] transition-shadow duration-500 group-hover:shadow-[0_30px_64px_-16px_rgba(11,22,35,0.42)]">
      {/* Header — número + hairline + diamond */}
      <header className="flex items-center gap-3">
        <span className="font-serif text-xs italic tracking-tight text-isq-red">
          n.{item.number}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-isq-navy/15 transition-colors duration-500 group-hover:bg-isq-navy/35"
        />
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rotate-45 bg-isq-navy/25 transition-colors duration-500 group-hover:bg-isq-red"
        />
      </header>

      {/* Title — bloco visual principal da carta */}
      <h3 className="mt-6 font-serif text-[clamp(1.5rem,1.85vw,1.85rem)] leading-[1.05] tracking-[-0.015em] text-isq-navy">
        {item.title}
      </h3>

      {/* Divisor curto entre title e description */}
      <span
        aria-hidden
        className="mt-5 block h-px w-10 bg-isq-navy/30"
      />

      {/* Description */}
      <p className="mt-4 text-[13.5px] leading-[1.55] text-isq-navy/65">
        {item.description}
      </p>

      {/* Bottom row — espaço respira e arrow no canto */}
      <div className="mt-auto flex items-end justify-end pt-6">
        <span
          aria-hidden
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-isq-navy/40 transition-colors duration-500 group-hover:text-isq-red"
        >
          <span className="block h-px w-6 bg-current transition-[width] duration-700 group-hover:w-10" />
          <span className="text-sm">↗</span>
        </span>
      </div>
    </article>
  );
}
