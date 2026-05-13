import { clsx } from "clsx";
import type { ElementType, HTMLAttributes } from "react";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
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
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      {...rest}
      className={clsx(
        "mx-auto w-full",
        size === "narrow" && "max-w-5xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[110rem]",
        "px-[var(--container-px)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
