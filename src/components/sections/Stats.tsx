"use client";

import { motion, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import StatCounter from "@/components/stats/StatCounter";
import GptwSeal from "@/components/brand/GptwSeal";

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
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

export default function Stats() {
  const t = useTranslations("stats");
  const items = t.raw("items") as Record<
    "years" | "services" | "people",
    { value: number; suffix: string; label: string }
  >;

  return (
    <section
      aria-label="Em números"
      className="relative isolate overflow-hidden bg-isq-off pt-[clamp(7rem,14vw,12rem)] pb-[clamp(6rem,12vw,10rem)]"
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
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeVariants}
              className="max-w-3xl font-serif text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.18] tracking-[-0.01em] text-isq-navy/80"
            >
              {t("lead")}
            </motion.p>
          </div>
        </div>

        {/* Big numbers */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="mt-[clamp(4rem,10vw,8rem)] grid grid-cols-12 gap-x-8 gap-y-16"
        >
          {(["years", "services", "people"] as const).map((key, idx) => {
            const it = items[key];
            return (
              <motion.div
                key={key}
                variants={fadeVariants}
                className={[
                  "col-span-12 sm:col-span-6 lg:col-span-4",
                  idx === 1 && "lg:mt-12",
                  idx === 2 && "lg:mt-6",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-6 h-1.5 w-1.5 shrink-0 rotate-45 bg-isq-red"
                  />
                  <div className="flex flex-col">
                    <StatCounter
                      value={it.value}
                      suffix={it.suffix}
                      className="font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.9] tracking-[-0.04em] text-isq-navy"
                    />
                    <span className="mt-5 max-w-[22ch] text-sm uppercase leading-snug tracking-[0.18em] text-isq-navy/55">
                      {it.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust markers row — footnote textual + selo Great Place to Work */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeVariants}
          className="mt-[clamp(4rem,8vw,6rem)] grid grid-cols-12 gap-x-8 gap-y-8 border-t border-isq-navy/10 pt-10"
        >
          <p className="col-span-12 flex items-start gap-4 text-xs uppercase tracking-[0.22em] text-isq-navy/55 sm:text-[13px] lg:col-span-8">
            <span
              aria-hidden
              className="mt-2 h-px w-8 shrink-0 bg-isq-navy/30"
            />
            <span>{t("footnote")}</span>
          </p>
          <div className="col-span-12 flex items-center lg:col-span-4 lg:justify-end">
            <GptwSeal size={60} />
          </div>
        </motion.div>
      </Container>

      {/* "04" decorativo no canto inferior esquerdo */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-2vw] left-[-1vw] select-none font-serif text-[20vw] leading-none text-isq-navy/[0.04]"
      >
        04
      </span>
    </section>
  );
}
