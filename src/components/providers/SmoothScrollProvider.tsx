"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Altura do header fixo (72px) + folga; o alvo do âncora para logo abaixo dele.
const HEADER_OFFSET = 80;

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Navegação por âncora fluida: clicar num link #secao desliza (Lenis) em vez
    // do "pulo" nativo, respeitando o offset do header fixo. Links cujo alvo não
    // existe caem no comportamento nativo (no-op) sem travar a navegação.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href*="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      // Só âncoras da mesma página.
      if (anchor.pathname !== window.location.pathname || anchor.origin !== window.location.origin)
        return;
      const hash = anchor.hash;
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_OFFSET });
      // Mantém o hash na URL (acessibilidade / compartilhável) sem re-scroll nativo.
      if (window.history.replaceState) window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
