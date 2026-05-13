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
