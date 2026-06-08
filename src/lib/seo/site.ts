/**
 * Constantes centrais de SEO — uma fonte única para a URL canônica
 * do site, evitando duplicação entre sitemap, robots, JSON-LD e
 * metadata.
 *
 * Caso o domínio mude (ex: durante stage/preview), basta atualizar
 * aqui. Em produção pode-se sobrescrever via NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://isqbrasil.com.br";

export const SITE_NAME = "ISQ Brasil";
