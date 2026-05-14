"use client";

import { motion } from "motion/react";
import { clsx } from "clsx";

type PillarCardProps = {
  number: string;
  title: string;
  description: string;
  className?: string;
};

export default function PillarCard({
  number,
  title,
  description,
  className,
}: PillarCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "group relative flex flex-col gap-7 pt-6",
        className,
      )}
    >
      {/* Top rail — número + hairline + losango (vira vermelho no hover) */}
      <div className="flex items-center gap-4">
        <span className="font-serif text-sm italic tracking-tight text-isq-red">
          n.{number}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 origin-left bg-isq-navy/15 transition-colors duration-500 group-hover:bg-isq-navy/35"
        />
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rotate-45 bg-isq-navy/25 transition-colors duration-500 group-hover:bg-isq-red"
        />
      </div>

      {/* Title — mistura tipográfica editorial */}
      <h3 className="font-serif text-[clamp(1.5rem,2.6vw,2.75rem)] leading-[1.04] tracking-[-0.015em] text-isq-navy">
        {title}
      </h3>

      {/* Description */}
      <p className="max-w-prose text-base leading-relaxed text-isq-navy/65 sm:text-[17px]">
        {description}
      </p>

      {/* Bottom-right — seta técnica que avança no hover */}
      <span
        aria-hidden
        className="mt-2 flex items-center gap-3 self-end text-[11px] uppercase tracking-[0.28em] text-isq-navy/40 transition-colors duration-500 group-hover:text-isq-red"
      >
        <span className="h-px w-6 bg-current transition-[width] duration-500 group-hover:w-10" />
        <span>↗</span>
      </span>
    </motion.article>
  );
}
