import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Robots.txt dinâmico — Next.js 15 App Router gera /robots.txt
 * a partir deste arquivo automaticamente.
 *
 * Regras:
 *  - allow "/" para todos os user-agents — site público, indexação
 *    irrestrita do conteúdo principal.
 *  - disallow "/api/" e "/_next/" — endpoints internos e assets
 *    bundle do Next.js, não devem ser indexados (geram noise no
 *    Google e podem expor estrutura interna).
 *  - sitemap absoluto pra que os crawlers encontrem o sitemap.xml
 *    independente de qual subdomínio/protocolo estejam acessando.
 *  - host declarado — sinal canônico de qual versão do domínio
 *    (com/sem www, http/https) é a principal.
 *
 * Para bloquear crawlers específicos (ex: bots de IA durante o
 * lançamento), adicionar entradas extras no array `rules`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
