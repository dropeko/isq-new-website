import Image from "next/image";

type Props = {
  href?: string;
  className?: string;
  size?: number;
  label?: string;
  caption?: string;
};

/**
 * Selo "Great Place to Work · Certificada" — usado como trust marker.
 * O SVG salvo em /public/brand/ já vem cortado para mostrar só o selo
 * (sem o QR code, irrelevante na web).
 *
 * `href` deve apontar para a página de verificação no GPTW Brasil quando
 * disponível; enquanto não houver, fica como link inerte com aria-disabled.
 */
export default function GptwSeal({
  href,
  className,
  size = 56,
  label = "Selo",
  caption = "Great Place to Work · Certificada 2025/26",
}: Props) {
  const inner = (
    <span className={`group inline-flex items-center gap-4 ${className ?? ""}`}>
      <Image
        src="/brand/gptw-certified.svg"
        alt="Selo Great Place to Work — Certificada Mar/2025 a Mar/2026 — Brasil"
        width={size}
        height={Math.round((size * 311) / 220)}
        priority={false}
        className="shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5"
      />
      <span className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.32em] text-isq-navy/45">
          {label}
        </span>
        <span className="text-sm font-medium leading-snug text-isq-navy transition-colors duration-500 group-hover:text-isq-red">
          {caption}
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} — ${caption}`}
        className="inline-block"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
