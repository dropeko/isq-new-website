"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
  /**
   * Quando fornecido, o contador é controlado externamente (scrubbed) por
   * essa MotionValue numérica (0..value). Substitui a animação interna por
   * viewport.
   */
  source?: MotionValue<number>;
};

/**
 * Conta de 0 até `value` quando entra na viewport. Usa motion values para
 * evitar re-render por frame (apenas o textContent é atualizado).
 *
 * Em modo `source`, o valor é dirigido pelo scroll — útil para o tratamento
 * cinematográfico onde os números sobem conforme o usuário rola, ao invés
 * de dispararem em burst.
 */
export default function StatCounter({
  value,
  suffix = "+",
  className,
  duration = 2.2,
  source,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();

  const internal = useMotionValue(0);
  const driver = source ?? internal;
  const rounded = useTransform(driver, (v) =>
    Math.round(v).toLocaleString("pt-BR"),
  );

  useEffect(() => {
    if (source) return; // scrubado externamente
    if (!inView) return;
    if (reduceMotion) {
      internal.set(value);
      return;
    }
    const controls = animate(internal, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, value, duration, internal, reduceMotion, source]);

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
