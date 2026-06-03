"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
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

type FanPosition = { x: number; y: number; rotate: number; baseZ: number };

/**
 * Posições do leque — pivot é o canto inferior central de cada carta
 * (transform-origin 50% 100%), simulando uma mão segurando cartas. O eixo
 * Y das laterais é maior para criar a curva natural do arco.
 */
const FAN_POSITIONS: FanPosition[] = [
  { x: -210, y: 40, rotate: -10, baseZ: 1 },
  { x: 0, y: 0, rotate: 0, baseZ: 2 },
  { x: 210, y: 40, rotate: 10, baseZ: 1 },
];

/**
 * Fronts (n.03) — "mão de cartas".
 *
 * Substitui o pinned horizontal anterior por um leque de 3 cartas no
 * centro da viewport. As cartas entram em cascata (efeito "dealing")
 * e descansam em formação de leque. No hover, a carta apontada se
 * destaca: roda para vertical, sobe e ganha sombra forte — como puxar
 * uma carta da mão para examiná-la.
 *
 * Mobile: cartas empilhadas verticalmente (mesmo CardBody, sem fan).
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

  return (
    <section
      aria-label="Três frentes"
      className="relative isolate overflow-hidden bg-isq-off pt-[clamp(4.5rem,8vw,7rem)] pb-[clamp(4rem,7vw,6rem)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] bg-isq-navy/10"
      />

      <Container>
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 lg:col-span-2">
            <motion.span
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeVariants}
              className="block text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red"
            >
              {t("section")}
            </motion.span>
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

      {/* Desktop: leque de cartas */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
        }}
        className="relative mx-auto mt-[clamp(3rem,6vw,5rem)] hidden h-[640px] w-full max-w-[1200px] lg:block"
      >
        <div className="absolute inset-x-0 bottom-12 flex justify-center">
          {fronts.map((f, i) => (
            <FanCard key={f.number} front={f} position={FAN_POSITIONS[i]} />
          ))}
        </div>
      </motion.div>

      {/* Mobile: cards empilhadas */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="mt-[clamp(3rem,6vw,5rem)] flex flex-col items-center gap-6 px-[var(--container-px)] lg:hidden"
      >
        {fronts.map((f) => (
          <StackCard key={f.number} front={f} />
        ))}
      </motion.div>
    </section>
  );
}

function FanCard({
  front,
  position,
}: {
  front: Front;
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
    <motion.a
      href={front.href}
      variants={variants}
      whileHover={{
        y: position.y - 64,
        rotate: 0,
        scale: 1.04,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{
        transformOrigin: "50% 100%",
        zIndex: position.baseZ,
        left: "50%",
        marginLeft: "-9rem", // metade da largura (18rem)
      }}
      className="group absolute bottom-0 block w-[18rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-isq-red focus-visible:ring-offset-2 focus-visible:ring-offset-isq-off hover:z-20"
    >
      <CardBody front={front} />
    </motion.a>
  );
}

function StackCard({ front }: { front: Front }) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.a
      href={front.href}
      variants={variants}
      className="group block w-full max-w-[22rem]"
    >
      <CardBody front={front} />
    </motion.a>
  );
}

function CardBody({ front }: { front: Front }) {
  return (
    <article className="relative flex aspect-[7/10] flex-col overflow-hidden rounded-[3px] border border-isq-navy/10 bg-isq-paper shadow-[0_8px_28px_-12px_rgba(11,22,35,0.22)] transition-shadow duration-500 group-hover:shadow-[0_30px_64px_-16px_rgba(11,22,35,0.42)]">
      {/* Top bar — número à esquerda, kicker à direita (formato de carta) */}
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="font-serif text-xs italic tracking-tight text-isq-red">
          n.{front.number}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-isq-navy/45">
          {front.kicker}
        </span>
      </header>

      {/* Hairline divider */}
      <span
        aria-hidden
        className="mx-5 mt-4 block h-px bg-isq-navy/12"
      />

      {/* Photo */}
      <div className="relative mx-5 mt-4 aspect-[4/3] overflow-hidden rounded-[2px] bg-isq-navy/5">
        <Image
          src={front.photo.src}
          alt={front.photo.alt}
          fill
          sizes="(min-width: 1024px) 18rem, 22rem"
          className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      {/* Title + CTA */}
      <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-5">
        <h3 className="font-serif text-[clamp(1.15rem,1.4vw,1.5rem)] leading-[1.12] tracking-[-0.01em] text-isq-navy">
          {front.title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-isq-navy/55 transition-colors duration-500 group-hover:text-isq-red">
          <span
            aria-hidden
            className="block h-px w-6 bg-current transition-[width] duration-700 group-hover:w-10"
          />
          <span>{front.cta}</span>
          <span
            aria-hidden
            className="text-sm transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </article>
  );
}
