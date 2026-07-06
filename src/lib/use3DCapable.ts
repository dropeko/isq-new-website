"use client";

import { useEffect, useState } from "react";

/**
 * Detecção de WebGL — cacheada no módulo (roda no máximo 1x por page load,
 * mesmo com Hero + ImageBreak chamando o hook, e sobrevive a HMR) e o
 * contexto de teste é LIBERADO imediatamente (WEBGL_lose_context).
 *
 * Sem isso, cada chamada/HMR criava um contexto WebGL descartável que nunca
 * era solto; somados aos contextos reais (Hero + Break), estouravam o limite
 * do navegador (~16) e faziam o browser descartar as cenas reais — as
 * animações "sumiam".
 */
let cachedWebGL: boolean | null = null;

function detectWebGL(): boolean {
  if (cachedWebGL !== null) return cachedWebGL;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    cachedWebGL = !!gl;
    // Libera o contexto de detecção na hora — não deixa acumular.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cachedWebGL = false;
  }
  return cachedWebGL;
}

/**
 * Decide se uma cena WebGL deve rodar: só desktop, com WebGL e sem
 * prefers-reduced-motion. Reativo a mudanças de viewport e de preferência
 * de movimento. Fora disso, o componente deve renderizar um fallback
 * estático/leve (LCP/SEO/mobile).
 *
 * Compartilhado por HeroVisual e ImageBreak.
 */
export function use3DCapable() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const webgl = detectWebGL();

    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMQ = window.matchMedia("(min-width: 1024px)");

    const evaluate = () =>
      setEnabled(webgl && widthMQ.matches && !motionMQ.matches);

    evaluate();
    motionMQ.addEventListener("change", evaluate);
    widthMQ.addEventListener("change", evaluate);
    return () => {
      motionMQ.removeEventListener("change", evaluate);
      widthMQ.removeEventListener("change", evaluate);
    };
  }, []);

  return enabled;
}
