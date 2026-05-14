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

const backdropVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0.92 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
  },
};

/**
 * Clientes (Fase 1.5) — substitui a faixa "clientes" do site antigo.
 * Em vez de logos rasterizados, lista tipográfica com a palavra "Confiança"
 * em Fraunces italic gigante como backdrop diagonal — referência ao
 * "Collabs" verde-limão do site do Lando, traduzido para a linguagem
 * institucional da ISQ.
 *
 * Cada nome alterna entre serif italic e sans semibold, criando um ritmo
 * editorial. Hover destaca em vermelho ISQ.
 */
export default function Clients() {
  const t = useTranslations("clients");
  const names = t.raw("names") as string[];

  return (
    <section
      aria-label="Clientes"
      className="relative isolate overflow-hidden bg-isq-off py-[clamp(7rem,14vw,12rem)]"
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
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeVariants}
              className="mt-8 max-w-2xl text-base leading-relaxed text-isq-navy/65 sm:text-[17px]"
            >
              {t("intro")}
            </motion.p>
          </div>
        </div>

        {/* Lista de clientes com "Confiança" gigante como backdrop */}
        <div className="relative mt-[clamp(4rem,10vw,8rem)]">
          {/* Backdrop word — Fraunces italic gigante, levemente rotacionado */}
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={backdropVariants}
            aria-hidden
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
          >
            <span
              className="block font-serif italic text-isq-red/[0.08]"
              style={{
                fontSize: "clamp(8rem, 22vw, 22rem)",
                lineHeight: "0.9",
                transform: "rotate(-3deg)",
                letterSpacing: "-0.04em",
              }}
            >
              {t("backdrop")}
            </span>
          </motion.span>

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

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-2vw] right-[-1vw] select-none font-serif text-[20vw] leading-none text-isq-navy/[0.04]"
      >
        05
      </span>
    </section>
  );
}
