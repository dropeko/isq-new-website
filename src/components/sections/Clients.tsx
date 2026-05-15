"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";

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
 * Clientes — lista tipográfica com alternância de pesos para ritmo editorial.
 * Hover destaca em vermelho ISQ.
 */
export default function Clients() {
  const t = useTranslations("clients");
  const names = t.raw("names") as string[];
  const sectors = t.raw("sectors") as string[];

  return (
    <section
      aria-label="Clientes"
      className="relative isolate overflow-hidden bg-isq-off py-[clamp(4.5rem,9vw,7.5rem)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] bg-isq-navy/10"
      />

      <Container>
        {/* Intro */}
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

            {/* Chips de setor — preenchem o vazio abaixo da headline,
                reforçam o escopo de atuação antes da lista de nomes */}
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

        {/* Lista de clientes */}
        <div className="relative mt-[clamp(3rem,6vw,5rem)]">
          {/* Grid de nomes — alternância de pesos para ritmo editorial */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="relative grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4"
          >
            {names.map((name, i) => (
              <motion.li
                key={name}
                variants={itemVariants}
                className={[
                  "flex items-baseline gap-3 transition-colors duration-500",
                  "text-isq-navy hover:text-isq-red",
                  i % 3 === 0
                    ? "font-serif italic text-[clamp(1.1rem,1.6vw,1.6rem)]"
                    : i % 3 === 1
                      ? "font-sans font-semibold text-[clamp(1rem,1.4vw,1.4rem)] tracking-[-0.005em]"
                      : "font-sans font-light text-[clamp(1rem,1.4vw,1.4rem)] tracking-tight",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className="text-[10px] font-mono text-isq-navy/35"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{name}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
