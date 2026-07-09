"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import IsqLogo from "@/components/ui/IsqLogo";
import { clsx } from "clsx";

export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        // Sem backdrop-blur: blur em header fixo re-borra o fundo a cada frame
        // de scroll = trava. Fundo quase-sólido tem custo ~zero.
        scrolled
          ? "border-b border-isq-navy/10 bg-isq-off/95"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[110rem] items-center justify-between px-[var(--container-px)]">
        <Link
          href="/"
          aria-label="ISQ Brasil"
          className="flex items-center gap-3 text-isq-red transition-opacity hover:opacity-80"
        >
          <IsqLogo className="h-9 w-9" />
          <span className="sr-only">ISQ Brasil</span>
        </Link>

        <nav
          aria-label="primária"
          className="hidden items-center gap-9 text-[13px] uppercase tracking-[0.14em] text-isq-navy/80 lg:flex"
        >
          <a className="hover:text-isq-red" href="#solucoes">
            {t("solutions")}
          </a>
          <a className="hover:text-isq-red" href="#servicos">
            {t("services")}
          </a>
          <a className="hover:text-isq-red" href="#insights">
            {t("insights")}
          </a>
          <a className="hover:text-isq-red" href="#sobre">
            {t("about")}
          </a>
          <a className="hover:text-isq-red" href="#contato">
            {t("contact")}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contato"
            className="group hidden items-center gap-2 rounded-full bg-isq-red px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            {t("workWithUs")}
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <button
            type="button"
            aria-label={t("menu")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-isq-navy/15 text-isq-navy transition-colors hover:border-isq-navy/40 lg:hidden"
          >
            <span className="block h-px w-5 bg-current shadow-[0_-5px_0_currentColor,0_5px_0_currentColor]" />
          </button>
        </div>
      </div>
    </header>
  );
}
