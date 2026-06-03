"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import HeroHeading from "@/components/hero/HeroHeading";
import HeroVisual from "@/components/hero/HeroVisual";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const headingY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  return (
    <section
      ref={ref}
      aria-label="Hero"
      className="relative isolate overflow-hidden pt-[clamp(5.5rem,8vw,6.5rem)] pb-[clamp(3.5rem,7vw,6rem)]"
    >
      <div className="mx-auto grid max-w-[110rem] grid-cols-1 gap-12 px-[var(--container-px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          style={{ y: headingY, opacity: fade }}
          className="flex items-center will-change-transform"
        >
          <HeroHeading />
        </motion.div>
        <motion.div
          style={{ y: visualY }}
          className="flex items-center will-change-transform"
        >
          <HeroVisual />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <span className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-isq-navy/40">
          <span aria-hidden className="h-10 w-px bg-isq-navy/30" />
        </span>
      </div>
    </section>
  );
}
