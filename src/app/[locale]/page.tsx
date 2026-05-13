import { setRequestLocale } from "next-intl/server";
import Container from "@/components/ui/Container";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative">
      {/* Marcador visual da Fase 0 — substituído pela Hero real na Fase 1.1 */}
      <section className="relative min-h-[100svh] pt-[120px] pb-[var(--section-py)]">
        <Container className="relative">
          <span className="block text-xs uppercase tracking-[0.28em] text-isq-red">
            Fase 0 · design system ativo
          </span>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">
            <em className="italic">Engenharia</em>{" "}
            <span className="font-light text-isq-navy/70">que sustenta a</span>{" "}
            <strong className="font-semibold">confiança</strong>{" "}
            <span className="font-light text-isq-navy/70">da indústria.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-isq-navy/70">
            <em>Onde a precisão</em> encontra a inspeção, a certificação e a
            inovação — há mais de 50 anos.
          </p>
        </Container>
      </section>
    </div>
  );
}
