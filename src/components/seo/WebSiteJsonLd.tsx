import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * JSON-LD WebSite schema — emparelha com Organization e descreve o
 * site em si (vs a entidade jurídica). Ajuda o Google a:
 *  - Compor o "Knowledge Panel" e o card de SERP com nome correto
 *    (`name` + `alternateName` ensina ao Google os termos válidos
 *    pra identificar a marca).
 *  - Cross-reference com OrganizationJsonLd via `publisher.@id`,
 *    formando um grafo coerente em vez de dois nós isolados.
 *  - Declarar os idiomas suportados (`inLanguage`) — reforça as
 *    indicações de hreflang do sitemap.
 *
 * SearchAction não está incluído porque o site ainda não tem um
 * endpoint de busca interna. Sem implementação real, o Google não
 * exibe o "sitelinks search box" de qualquer forma — e declarar
 * uma URL de busca que não funciona seria ruído. Quando houver
 * `/busca?q={query}`, adicionar:
 *
 *   potentialAction: {
 *     "@type": "SearchAction",
 *     target: { "@type": "EntryPoint",
 *       urlTemplate: `${SITE_URL}/busca?q={search_term_string}` },
 *     "query-input": "required name=search_term_string"
 *   }
 */
export default function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: [
      "ISQ",
      "Instituto de Soldadura e Qualidade",
      "ISQ Brasil",
    ],
    url: SITE_URL,
    inLanguage: ["pt-BR", "en-US", "es-ES"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
