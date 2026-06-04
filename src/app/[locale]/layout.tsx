import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ScrollTriggerProvider from "@/components/providers/ScrollTriggerProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IntroScreen from "@/components/intro/IntroScreen";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");
  const localeMap: Record<string, string> = {
    pt: "pt_BR",
    en: "en_US",
    es: "es_ES",
  };
  return {
    title,
    description,
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: {
        "pt-BR": "/",
        "en-US": "/en",
        "es-ES": "/es",
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "ISQ Brasil",
      locale: localeMap[locale] ?? "pt_BR",
      url: locale === routing.defaultLocale ? "/" : `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-isq-navy focus:px-5 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.2em] focus:text-isq-off"
        >
          {locale === "en" ? "Skip to content" : locale === "es" ? "Saltar al contenido" : "Pular para o conteúdo"}
        </a>
        <OrganizationJsonLd />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ScrollTriggerProvider>
            <SmoothScrollProvider>
              <IntroScreen />
              <Header />
              <main id="main">{children}</main>
              <Footer />
            </SmoothScrollProvider>
          </ScrollTriggerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
