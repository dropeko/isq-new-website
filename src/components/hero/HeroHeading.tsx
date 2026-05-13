"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.06,
    },
  },
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Word({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden pb-[0.12em] align-baseline leading-[0.95]">
      <motion.span
        variants={wordVariants}
        className="inline-block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroHeading() {
  const t = useTranslations("hero");

  return (
    <div className="flex flex-col gap-10">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="block text-[11px] font-medium uppercase tracking-[0.32em] text-isq-red"
      >
        {t("eyebrow")}
      </motion.span>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="font-serif text-[clamp(2.75rem,7.2vw,7rem)] leading-[0.95] tracking-[-0.02em] text-isq-navy"
      >
        <span className="block">
          <Word>
            <em className="italic font-light">{t("title.part1")}</em>
          </Word>
        </span>
        <span className="block font-sans font-extralight text-isq-navy/55">
          <Word>{t("title.part2")}</Word>
        </span>
        <span className="block font-sans font-semibold text-isq-navy">
          <Word>{t("title.part3")}</Word>{" "}
          <Word>
            <span className="font-extralight text-isq-navy/55">
              {t("title.part4")}
            </span>
          </Word>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl font-sans text-base leading-relaxed text-isq-navy/70 sm:text-lg"
      >
        <em className="italic">{t("subtitle.part1")}</em>{" "}
        <span className="font-medium text-isq-navy">{t("subtitle.part2")}</span>
        <span className="text-isq-navy/70">{t("subtitle.part3")}</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center gap-5"
      >
        <a
          href="#contato"
          className="group inline-flex items-center gap-3 rounded-full bg-isq-navy px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-isq-off transition-[transform,background] duration-500 hover:-translate-y-0.5 hover:bg-isq-red"
        >
          {t("cta")}
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
        <span className="text-xs uppercase tracking-[0.24em] text-isq-navy/50">
          {t("scroll")}
        </span>
      </motion.div>
    </div>
  );
}
