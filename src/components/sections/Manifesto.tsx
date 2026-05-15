"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const lineMaskVariants: Variants = {
  hidden: {},
  visible: {},
};

const lineInnerVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

function Line({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.span
      variants={lineMaskVariants}
      className="relative block overflow-hidden pb-[0.08em] leading-[0.98]"
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

export default function Manifesto() {
  const t = useTranslations("manifesto");

  return (
    <section
      aria-label="Manifesto"
      className="relative isolate overflow-hidden bg-isq-off py-[clamp(4.5rem,10vw,8rem)] text-isq-navy"
    >
      {/* Hairline superior — divisor sutil que sinaliza nova seção sem
          quebrar a continuidade off-white com o hero */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] origin-left bg-isq-navy/10"
      />

      <Container className="relative">
        <div className="grid grid-cols-12 gap-y-12">
          {/* Rail blueprint à esquerda — continuidade com o overlay técnico do hero */}
          <div className="col-span-12 lg:col-span-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUpVariants}
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="col-span-12 lg:col-span-10 lg:pl-4"
          >
            {/* Meta editorial top-right — preenche o canto vazio acima do headline */}
            <div className="mb-4 hidden items-baseline justify-end gap-2 lg:flex">
              <span aria-hidden className="h-px w-10 bg-isq-navy/20" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-isq-navy/45">
                {t("meta")}
              </span>
            </div>

            <h2 className="font-serif tracking-[-0.02em] text-[clamp(2.25rem,6vw,6rem)] leading-[1.02]">
              <Line className="font-sans font-extralight text-isq-navy/45">
                {t("line1")}{" "}
                <em className="font-serif italic font-normal text-isq-navy">
                  {t("line1Emph")}
                </em>
              </Line>
              <Line className="font-sans font-extralight text-isq-navy/45">
                {t("line2")}{" "}
                <em className="font-serif italic font-normal text-isq-navy">
                  {t("line2Emph")}
                </em>
              </Line>
              <Line className="font-sans font-extralight text-isq-navy/45">
                {t("line3")}{" "}
                <strong className="font-sans font-semibold text-isq-navy">
                  {t("line3Emph")}
                </strong>
              </Line>
              <Line className="font-sans font-extralight text-isq-navy/45">
                {t("line4")}{" "}
                <strong className="font-sans font-semibold text-isq-red">
                  {t("line4Emph")}
                </strong>
              </Line>
            </h2>

            {/* Assinatura editorial */}
            <motion.div
              variants={fadeUpVariants}
              className="mt-10 flex max-w-2xl items-start gap-5 lg:mt-14"
            >
              <span
                aria-hidden
                className="mt-3 h-px w-12 shrink-0 bg-isq-navy/30"
              />
              <p className="font-serif italic text-base text-isq-navy/65 sm:text-lg">
                {t("signature")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
