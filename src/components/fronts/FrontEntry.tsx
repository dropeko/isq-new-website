"use client";

import { motion } from "motion/react";
import { clsx } from "clsx";

type FrontEntryProps = {
  number: string;
  kicker: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
};

/**
 * Entrada editorial full-width — base off-white, vira navy invertido no hover.
 * Bordas hairline em cima e em baixo criam o efeito de "fileira" vertical.
 * Reveal individual via whileInView.
 */
export default function FrontEntry({
  number,
  kicker,
  title,
  description,
  cta,
  href = "#",
}: FrontEntryProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "group relative block border-b border-isq-navy/15",
        "transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-isq-navy",
      )}
    >
      {/* Layer de hover que "sobe" do fundo — animação extra além do bg-color */}
      <span
        aria-hidden
        className={clsx(
          "absolute inset-0 origin-bottom scale-y-0 bg-isq-navy",
          "transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]",
          "group-hover:scale-y-100",
        )}
      />

      <div
        className={clsx(
          "relative mx-auto grid w-full max-w-[110rem] grid-cols-12 items-center",
          "gap-y-4 gap-x-6 px-[var(--container-px)] py-10 sm:py-14 lg:py-16",
        )}
      >
        {/* Kicker */}
        <div className="col-span-12 lg:col-span-2">
          <span
            className={clsx(
              "block text-[10px] font-medium uppercase tracking-[0.32em]",
              "text-isq-red transition-colors duration-700",
              "group-hover:text-isq-red",
            )}
          >
            {kicker}
          </span>
        </div>

        {/* Title */}
        <div className="col-span-12 lg:col-span-6">
          <h3
            className={clsx(
              "font-serif tracking-[-0.015em]",
              "text-[clamp(2rem,4.2vw,4.25rem)] leading-[1.02]",
              "text-isq-navy transition-colors duration-700",
              "group-hover:text-isq-off",
            )}
          >
            {title}
          </h3>
        </div>

        {/* Description */}
        <div className="col-span-12 lg:col-span-3">
          <p
            className={clsx(
              "max-w-prose text-sm leading-relaxed sm:text-[15px]",
              "text-isq-navy/65 transition-colors duration-700",
              "group-hover:text-isq-off/70",
            )}
          >
            {description}
          </p>
        </div>

        {/* CTA */}
        <div className="col-span-12 flex items-center justify-end lg:col-span-1">
          <span
            aria-label={cta}
            className={clsx(
              "inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em]",
              "text-isq-navy/55 transition-colors duration-700",
              "group-hover:text-isq-off",
            )}
          >
            <span
              aria-hidden
              className={clsx(
                "block h-px w-6 bg-current",
                "transition-[width] duration-700",
                "group-hover:w-14",
              )}
            />
            <span
              aria-hidden
              className="text-base transition-transform duration-700 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </motion.a>
  );
}
