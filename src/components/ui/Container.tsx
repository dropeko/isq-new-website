import { clsx } from "clsx";
import { createElement, type ElementType, type HTMLAttributes } from "react";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  size?: "default" | "narrow" | "wide";
} & HTMLAttributes<HTMLElement>;

export default function Container({
  as,
  className,
  size = "default",
  children,
  ...rest
}: ContainerProps) {
  // createElement (em vez de <Tag />) evita a interseção de props que o R3F v9
  // introduz ao aumentar React.JSX.IntrinsicElements com os elementos three.js
  // — essa interseção colapsaria o tipo de `children` de uma tag polimórfica.
  const Tag: ElementType = as ?? "div";
  return createElement(
    Tag,
    {
      ...rest,
      className: clsx(
        "mx-auto w-full",
        size === "narrow" && "max-w-5xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[110rem]",
        "px-[var(--container-px)]",
        className,
      ),
    },
    children,
  );
}
