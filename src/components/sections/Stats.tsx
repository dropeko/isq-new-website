"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
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

/**
 * Stats — números scrubados pelo scroll. Substitui o burst de 2.2s (que
 * disparava ao entrar 50% no viewport) por um tick contínuo: cada número
 * "sobe" enquanto o usuário rola pela seção, em janelas escalonadas.
 *
 * Resultado: dá ao bloco a mesma sensação cinematográfica do manifesto e
 * dos pilares — você "controla" o ritmo dos números com a roda.
 */
export default function Stats() {
  const t = useTranslations("stats");
  const items = t.raw("items") as Record<
    "years" | "services" | "people",
    { value: number; suffix: string; label: string }
  >;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Janelas escalonadas dentro do progresso visível da seção. Cada número
  // tem seu próprio ramp-up, criando cascata sem snap.
  const yearsValue = useTransform(
    scrollYProgress,
    [0.18, 0.5],
    [0, items.years.value],
    { clamp: true },
  );
  const servicesValue = useTransform(
    scrollYProgress,
    [0.26, 0.58],
    [0, items.services.value],
    { clamp: true },
  );
  const peopleValue = useTransform(
    scrollYProgress,
    [0.34, 0.66],
    [0, items.people.value],
    { clamp: true },
  );

  const sources = { years: yearsValue, services: servicesValue, people: peopleValue };

  return (
    <section
      ref={sectionRef}
      aria-label="Em números"
      className="relative isolate overflow-hidden bg-isq-off pt-[clamp(4.5rem,9vw,7.5rem)] pb-[clamp(4rem,8vw,6.5rem)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto block h-px w-full max-w-[110rem] bg-isq-navy/10"
      />

      <Container>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeVariants}
          className="block text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red"
        >
          {t("section")}
        </motion.span>

        {/* Big numbers — sem stagger/whileInView agora; cada item revela
            naturalmente conforme o número começa a subir */}
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-12 gap-x-8 gap-y-12">
          {(["years", "services", "people"] as const).map((key, idx) => {
            const it = items[key];
            return (
              <div
                key={key}
                className={[
                  "col-span-12 sm:col-span-6 lg:col-span-4",
                  idx === 1 && "lg:mt-8",
                  idx === 2 && "lg:mt-4",
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
                      source={sources[key]}
                      className="font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.9] tracking-[-0.04em] text-isq-navy"
                    />
                    <span className="mt-5 max-w-[22ch] text-sm uppercase leading-snug tracking-[0.18em] text-isq-navy/55">
                      {it.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeVariants}
          className="mt-[clamp(3rem,5vw,4.5rem)] grid grid-cols-12 gap-x-8 gap-y-6 border-t border-isq-navy/10 pt-8"
        >
          <p className="col-span-12 flex items-start gap-4 text-xs uppercase tracking-[0.22em] text-isq-navy/55 sm:text-[13px] lg:col-span-8">
            <span
              aria-hidden
              className="mt-2 h-px w-8 shrink-0 bg-isq-navy/30"
            />
            <span>{t("footnote")}</span>
          </p>
          <div className="col-span-12 flex items-start lg:col-span-4 lg:justify-end">
            <GptwSeal />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
