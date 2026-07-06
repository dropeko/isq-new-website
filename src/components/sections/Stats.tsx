"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import ScanDivider from "@/components/ui/ScanDivider";
import ChapterMarker from "@/components/ui/ChapterMarker";
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

const GRID =
  "repeating-linear-gradient(0deg, rgba(227,236,245,0.5) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(227,236,245,0.5) 0 1px, transparent 1px 34px)";

/**
 * Stats — o "momento dark" do site (n.04). Fundo navy profundo full-bleed,
 * números grandes brilhando em claro (energia de title card) e profundidade
 * via parallax: uma camada de fundo (grade técnica + o "04" fantasma) scrolla
 * em ritmo diferente do conteúdo. Contraste dramático cercado por seções
 * claras (Frentes/Clientes) — quebra o editorial claro com peso cinematográfico.
 *
 * Números continuam scrubados pelo scroll (cascata sem snap).
 */
export default function Stats() {
  const t = useTranslations("stats");
  const reduce = useReducedMotion();
  const items = t.raw("items") as Record<
    "years" | "services" | "people",
    { value: number; suffix: string; label: string }
  >;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Contadores scrubados (janelas escalonadas).
  const yearsValue = useTransform(scrollYProgress, [0.18, 0.4], [0, items.years.value], { clamp: true });
  const servicesValue = useTransform(scrollYProgress, [0.24, 0.46], [0, items.services.value], { clamp: true });
  const peopleValue = useTransform(scrollYProgress, [0.3, 0.52], [0, items.people.value], { clamp: true });
  const sources = { years: yearsValue, services: servicesValue, people: peopleValue };

  // Parallax de profundidade — grade e número-fantasma em ritmos diferentes.
  const gridY = useTransform(scrollYProgress, [0, 1], ["-3%", "6%"]);
  const numY = useTransform(scrollYProgress, [0, 1], ["12%", "-14%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="Em números"
      className="relative isolate overflow-hidden pt-[clamp(4.5rem,9vw,7.5rem)] pb-[clamp(4rem,8vw,6.5rem)] text-isq-off"
      style={{
        background:
          "radial-gradient(130% 90% at 50% 22%, #16273d 0%, #0b1623 55%, #060b13 100%)",
      }}
    >
      <ScanDivider tone="dark" />

      {/* Profundidade — grade técnica (camada distante) */}
      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : gridY, backgroundImage: GRID, backgroundPosition: "center" }}
        className="pointer-events-none absolute inset-[-8%] opacity-[0.05]"
      />

      {/* Profundidade — número-fantasma "04" (parallax mais forte) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[4%] top-1/2 -translate-y-1/2 select-none"
      >
        <motion.span
          style={{ y: reduce ? 0 : numY }}
          className="block font-serif text-[34vw] leading-[0.8] tracking-[-0.04em] text-isq-off/[0.035]"
        >
          04
        </motion.span>
      </div>

      <Container className="relative">
        <ChapterMarker section={t("section")} tone="dark" />

        {/* Big numbers */}
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
                      className="font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.9] tracking-[-0.04em] text-isq-off"
                    />
                    <span className="mt-5 max-w-[22ch] text-sm uppercase leading-snug tracking-[0.18em] text-isq-off/55">
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
          className="mt-[clamp(3rem,5vw,4.5rem)] grid grid-cols-12 gap-x-8 gap-y-6 border-t border-isq-off/15 pt-8"
        >
          <p className="col-span-12 flex items-start gap-4 text-xs uppercase tracking-[0.22em] text-isq-off/55 sm:text-[13px] lg:col-span-8">
            <span
              aria-hidden
              className="mt-2 h-px w-8 shrink-0 bg-isq-off/30"
            />
            <span>{t("footnote")}</span>
          </p>
          <div className="col-span-12 flex items-start lg:col-span-4 lg:justify-end">
            <GptwSeal tone="dark" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
