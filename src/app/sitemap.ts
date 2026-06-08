import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Sitemap dinâmico — Next.js 15 App Router gera /sitemap.xml a partir
 * deste arquivo automaticamente (convenção de roteamento).
 *
 * Estrutura:
 *  - Uma entrada por locale (pt = raiz, en = /en, es = /es), seguindo
 *    o localePrefix: "as-needed" definido em src/i18n/routing.ts.
 *  - Cada entrada declara `alternates.languages` com TODOS os outros
 *    locales (incluindo x-default) — é assim que o Google entende
 *    que são variantes da mesma página e indexa cada idioma
 *    separadamente sem duplicate content penalty.
 *  - lastModified usa a data do build (Date.now) — pode ser trocado
 *    por uma data do CMS quando houver conteúdo dinâmico.
 *  - Priority: home pt = 1.0 (página principal), variantes = 0.8.
 *  - changeFrequency "monthly" reflete o ritmo de update editorial
 *    esperado pra um site institucional.
 *
 * Quando adicionarmos novas rotas (ex: /solucoes, /servicos, /academy),
 * incluir aqui replicando o padrão de mapping × locales.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Map de cada locale para sua URL canônica. Reutilizado abaixo
  // como `alternates.languages` em cada entrada.
  const languageAlternates = Object.fromEntries(
    routing.locales.map((locale) => [
      locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-ES",
      locale === routing.defaultLocale
        ? `${SITE_URL}/`
        : `${SITE_URL}/${locale}`,
    ]),
  );
  // x-default aponta pro idioma padrão — sinaliza ao Google qual
  // versão servir quando o idioma do usuário não bater com nenhuma.
  languageAlternates["x-default"] = `${SITE_URL}/`;

  return routing.locales.map((locale) => {
    const path =
      locale === routing.defaultLocale ? "/" : `/${locale}`;
    return {
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === routing.defaultLocale ? 1.0 : 0.8,
      alternates: { languages: languageAlternates },
    };
  });
}
