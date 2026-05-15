"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import FrontEntry from "@/components/fronts/FrontEntry";
import { photoCredits } from "@/data/photoCredits";

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Fronts (Fase 1.4) — substitui os 3 cards do site atual (Soluções Setoriais
 * / Serviços Técnicos / Formação) por entradas editoriais full-width que
 * invertem cor no hover (off-white → navy).
 *
 * As entradas vivem fora do Container (full-bleed) para a inversão de fundo
 * tomar toda a largura da viewport — referência direta às listas "ON TRACK /
 * OFF TRACK / CALENDAR" do site do Lando.
 */
export default function Fronts() {
  const t = useTranslations("fronts");
  const items = t.raw("items") as Record<
    string,
    {
      number: string;
      kicker: string;
      title: string;
      description: string;
      cta: string;
    }
  >;

  return (
    <section
      aria-label="Três frentes"
      className="relative isolate overflow-hidden bg-isq-off pt-[clamp(4.5rem,8vw,7rem)] pb-0"
    >
      {/* Hairline superior */}
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

      {/* Lista full-bleed — fora do Container para a inversão tomar toda a largura.
          Top hairline aqui marca o início do bloco interativo. */}
      <div className="mt-[clamp(3rem,5vw,4.5rem)] border-t border-isq-navy/15">
        <FrontEntry
          number={items.sectorSolutions.number}
          kicker={items.sectorSolutions.kicker}
          title={items.sectorSolutions.title}
          description={items.sectorSolutions.description}
          cta={items.sectorSolutions.cta}
          href="#solucoes"
          photo={photoCredits.frontsSolutions}
        />
        <FrontEntry
          number={items.technicalServices.number}
          kicker={items.technicalServices.kicker}
          title={items.technicalServices.title}
          description={items.technicalServices.description}
          cta={items.technicalServices.cta}
          href="#servicos"
          photo={photoCredits.frontsServices}
        />
        <FrontEntry
          number={items.academy.number}
          kicker={items.academy.kicker}
          title={items.academy.title}
          description={items.academy.description}
          cta={items.academy.cta}
          href="#academy"
          photo={photoCredits.frontsAcademy}
        />
      </div>

      {/* "03" decorativo no canto inferior direito */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-2vw] right-[-1vw] select-none font-serif text-[20vw] leading-none text-isq-navy/[0.04]"
      >
        03
      </span>
    </section>
  );
}
