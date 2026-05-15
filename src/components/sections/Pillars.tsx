"use client";

import { motion, type Variants } from "motion/react";
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

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
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

/**
 * Pillars (Fase 1.3) — substitui o bloco "O QUE FAZEMOS" do site atual.
 * Layout intencionalmente assimétrico: cada card tem col-span e offset
 * vertical próprios, criando uma leitura "scattered" estilo Lando, mas
 * com a linguagem técnica/institucional da ISQ.
 */
export default function Pillars() {
  const t = useTranslations("pillars");
  const items = t.raw("items") as Record<
    string,
    { number: string; title: string; description: string }
  >;

  return (
    <section
      aria-label="Pilares"
      className="relative isolate overflow-hidden bg-isq-off py-[clamp(4.5rem,9vw,7.5rem)]"
    >
      {/* Hairline superior — divisor sutil entre seções off-white */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] bg-isq-navy/10"
      />

      <Container>
        {/* Intro */}
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
            {/* Meta editorial top-right */}
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
              className="font-serif tracking-[-0.02em] text-[clamp(2rem,5.4vw,5.25rem)] leading-[1.02] text-isq-navy"
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

        {/* 4 cards scattered — col-span e offsets diferentes por item */}
        <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-12 gap-x-8 gap-y-12 lg:gap-y-14">
          <PillarCard
            number={items.marketAccess.number}
            title={items.marketAccess.title}
            description={items.marketAccess.description}
            className="col-span-12 lg:col-span-6"
          />
          <PillarCard
            number={items.safety.number}
            title={items.safety.title}
            description={items.safety.description}
            className="col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-12"
          />
          <PillarCard
            number={items.innovation.number}
            title={items.innovation.title}
            description={items.innovation.description}
            className="col-span-12 lg:col-span-6 lg:col-start-1 lg:mt-6"
          />
          <PillarCard
            number={items.reputation.number}
            title={items.reputation.title}
            description={items.reputation.description}
            className="col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-16"
          />
        </div>
      </Container>

      {/* "02" decorativo gigante no canto inferior esquerdo (alterna com o "01"
          do manifesto para criar ritmo de revista técnica) */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-2vw] left-[-1vw] select-none font-serif text-[20vw] leading-none text-isq-navy/[0.04]"
      >
        02
      </span>
    </section>
  );
}
