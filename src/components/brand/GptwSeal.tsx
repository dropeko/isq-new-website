import Image from "next/image";

type Props = {
  href?: string;
  className?: string;
  size?: number;
  label?: string;
  caption?: string;
  /** Stack horizontal (selo + texto lado-a-lado) ou vertical (selo em cima) */
  orientation?: "horizontal" | "vertical";
  /** Cor do texto conforme o fundo da seção. */
  tone?: "light" | "dark";
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
  size = 110,
  label = "Selo · Brasil",
  caption = "Great Place to Work · Certificada 2025/26",
  orientation = "vertical",
  tone = "light",
}: Props) {
  const isVertical = orientation === "vertical";
  const captionColor = tone === "dark" ? "text-isq-off" : "text-isq-navy";

  const inner = (
    <span
      className={[
        "group inline-flex",
        isVertical ? "flex-col items-start gap-4" : "items-center gap-5",
        className ?? "",
      ].join(" ")}
    >
      <Image
        src="/brand/gptw-certified.svg"
        alt="Selo Great Place to Work — Certificada Mar/2025 a Mar/2026 — Brasil"
        width={size}
        height={Math.round((size * 311) / 220)}
        priority={false}
        className="shrink-0 transition-transform duration-500 group-hover:-translate-y-1"
      />
      <span className="flex flex-col gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-isq-red">
          {label}
        </span>
        <span className={`text-sm font-medium leading-snug ${captionColor} transition-colors duration-500 group-hover:text-isq-red sm:text-[15px]`}>
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
