"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

/**
 * Conta de 0 até `value` quando entra na viewport. Usa motion values para
 * evitar re-render por frame (apenas o textContent é atualizado).
 */
export default function StatCounter({
  value,
  suffix = "+",
  className,
  duration = 2.2,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("pt-BR"));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, value, duration, count, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      <motion.span aria-hidden>{rounded}</motion.span>
      <span aria-hidden>{suffix}</span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
