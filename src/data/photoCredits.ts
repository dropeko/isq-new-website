/**
 * Créditos das fotos usadas no site (Unsplash + acervo ISQ Brasil).
 * Quando precisar trocar uma foto, atualize o arquivo `public/photos/<file>`
 * E o credit aqui — o componente que renderiza lê automaticamente.
 */
export type PhotoCredit = {
  src: string;
  alt: string;
  photographer: string;
  photographerUrl?: string;
  source: "Unsplash" | "ISQ Brasil";
  sourceUrl?: string;
};

export const photoCredits = {
  breakManifestoPillars: {
    src: "/photos/break-manifesto-pillars.jpg",
    alt: "Vista aérea de uma refinaria de petróleo com tanques de armazenamento e torres de destilação sob céu azul",
    photographer: "Pedro Farto",
    photographerUrl: "https://unsplash.com/pt-br/@farto",
    source: "Unsplash",
    sourceUrl:
      "https://unsplash.com/pt-br/fotografias/barco-branco-e-azul-na-doca-durante-o-dia-JU3wm8Wh7YA",
  },
  frontsSolutions: {
    src: "/photos/fronts-solutions.jpg",
    alt: "Interior de uma usina siderúrgica com fornos em operação e aço fundido em alta temperatura",
    photographer: "Morteza Mohammadi",
    photographerUrl: "https://unsplash.com/pt-br/@morophoto",
    source: "Unsplash",
    sourceUrl:
      "https://unsplash.com/pt-br/fotografias/uma-fabrica-com-muito-aco-sendo-feito-P8jEvckndSE",
  },
  frontsServices: {
    src: "/photos/fronts-services.jpg",
    alt: "Profissional ISQ Brasil de costas observando o mar ao entardecer de um terminal portuário",
    photographer: "Acervo ISQ Brasil",
    source: "ISQ Brasil",
  },
  frontsAcademy: {
    src: "/photos/fronts-academy.jpg",
    alt: "Profissional ISQ Brasil com capacete e cinto de segurança acompanhando trabalho em altura em ambiente portuário",
    photographer: "Acervo ISQ Brasil",
    source: "ISQ Brasil",
  },
  contactSide: {
    src: "/photos/contact-side.jpg",
    alt: "Profissional industrial sorrindo enquanto consulta o celular ao pôr do sol, com tanques e tubulações ao fundo",
    photographer: "Acervo ISQ Brasil",
    source: "ISQ Brasil",
  },
} as const satisfies Record<string, PhotoCredit>;

export type PhotoKey = keyof typeof photoCredits;
