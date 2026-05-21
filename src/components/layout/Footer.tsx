import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import IsqLogo from "@/components/ui/IsqLogo";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-isq-navy text-isq-off">
      {/* Notch curvo no topo — referência à "gaveta" do site do Lando */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-12 bg-isq-navy"
        style={{
          clipPath:
            "path('M0 48 L0 24 Q 50% -16, 100% 24 L 100% 48 Z')",
        }}
      />
      <Container className="relative pt-24 pb-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <IsqLogo className="h-12 w-12 text-isq-red" />
            <p className="max-w-sm text-sm leading-relaxed text-isq-grey-soft">
              {t("address")}
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <a
                href={`tel:${t("phone").replace(/\D/g, "")}`}
                className="text-isq-off hover:text-isq-red"
              >
                {t("phone")}
              </a>
              <a
                href={`mailto:${t("email")}`}
                className="text-isq-off hover:text-isq-red"
              >
                {t("email")}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/isq-brasil/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ISQ Brasil no LinkedIn"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-isq-off transition-[color,border-color,background-color] duration-300 hover:border-isq-red hover:bg-isq-red hover:text-isq-off"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[18px] w-[18px]"
                >
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
            </div>
          </div>

          <nav
            aria-label="rodapé"
            className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm uppercase tracking-[0.14em] sm:grid-cols-3"
          >
            <a className="text-isq-grey-soft hover:text-isq-red" href="#solucoes">
              {tNav("solutions")}
            </a>
            <a className="text-isq-grey-soft hover:text-isq-red" href="#servicos">
              {tNav("services")}
            </a>
            <a className="text-isq-grey-soft hover:text-isq-red" href="#insights">
              {tNav("insights")}
            </a>
            <a className="text-isq-grey-soft hover:text-isq-red" href="#sobre">
              {tNav("about")}
            </a>
            <a className="text-isq-grey-soft hover:text-isq-red" href="#contato">
              {tNav("contact")}
            </a>
            <a className="text-isq-grey-soft hover:text-isq-red" href="#academy">
              {tNav("academy")}
            </a>
            <a
              className="text-isq-grey-soft hover:text-isq-red"
              href="#sustentabilidade"
            >
              {tNav("sustainability")}
            </a>
            <a
              className="text-isq-grey-soft hover:text-isq-red"
              href="#ouvidoria"
            >
              {tNav("ombudsman")}
            </a>
            <a className="text-isq-grey-soft hover:text-isq-red" href="#blog">
              {tNav("blog")}
            </a>
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-isq-grey-soft sm:flex-row sm:items-center">
          <p>{t("rights", { year })}</p>
          <a href="#privacy" className="hover:text-isq-red">
            {t("privacy")}
          </a>
        </div>
      </Container>
    </footer>
  );
}
