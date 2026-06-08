import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/**
 * JSON-LD Organization schema para SEO — sinaliza ao Google os dados
 * institucionais da ISQ Brasil. Renderiza um <script type="application/ld+json">
 * estático no head.
 *
 * O `@id` (`${SITE_URL}/#organization`) permite que outros nós do
 * grafo de dados (WebSite, Article, etc) referenciem essa Organization
 * via `{ "@id": ... }` ao invés de duplicar todos os campos.
 */
export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/isq-logo.svg`,
    foundingDate: "1965",
    description:
      "ISQ Brasil — entidade privada, independente e acreditada de engenharia, inspeção, ensaios, certificação, P&D e inovação.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Estados Unidos, 22",
      addressLocality: "Belo Horizonte",
      addressRegion: "MG",
      postalCode: "30315-270",
      addressCountry: "BR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+55-31-9-8303-4733",
        email: "contato@isqbrasil.com.br",
        contactType: "customer service",
        availableLanguage: ["Portuguese", "English", "Spanish"],
      },
    ],
    sameAs: ["https://www.linkedin.com/company/isq-brasil/"],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
