"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * PillarsConverge — transição de fronteira BESPOKE da n.01 → n.02.
 *
 * Em vez de repetir o scan horizontal do Hero (o ScanDivider genérico que
 * fecha as outras fronteiras), aqui a inspeção CHEGA e se RAMIFICA: uma cabeça
 * de varredura vermelha corre a hairline e "trava" no centro (nó que acende com
 * brilho — eco do anel do Hero); do ponto de trava, quatro linhas de medição se
 * abrem em leque até quatro marcas-datum (losangos vermelhos — eco do losango
 * das cartas). É o prenúncio dos 4 pilares que as cartas materializam logo
 * abaixo: um único fio (o raciocínio da n.01) que se ramifica em 4 (o que
 * entregamos). Mesmo DNA do Hero, gesto novo, motivado pelo conteúdo.
 *
 * Só transform/opacity/pathLength. Em prefers-reduced-motion: estado final
 * estático (hairline + leque + datums), sem movimento.
 */

const NODE = { x: 240, y: 10 };
// x dos 4 datums — leque com externos mais abertos (ecoa FAN_POSITIONS ±19vw/±6.5vw)
const ENDS = [150, 208, 272, 330];
const END_Y = 78;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_BACK: [number, number, number, number] = [0.34, 1.4, 0.64, 1];

const svgParent: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.85, staggerChildren: 0.09 } },
};

const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: EASE_OUT },
      opacity: { duration: 0.15 },
    },
  },
};

const popMark: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_BACK },
  },
};

const NAVY_LINE = "rgba(11,22,35,0.22)";
const NAVY_TICK = "rgba(11,22,35,0.3)";
const RED = "#D60000";

/** Geometria compartilhada entre a versão animada e a estática. */
function Marks({ centerOrigin = true }: { centerOrigin?: boolean }) {
  const originStyle = centerOrigin
    ? ({ transformBox: "fill-box", transformOrigin: "center" } as const)
    : undefined;
  return (
    <>
      {ENDS.map((x, i) => (
        <motion.line
          key={`l${i}`}
          x1={NODE.x}
          y1={NODE.y}
          x2={x}
          y2={END_Y}
          stroke={i === 1 || i === 2 ? "rgba(11,22,35,0.3)" : NAVY_LINE}
          strokeWidth="1"
          variants={drawLine}
        />
      ))}
      {ENDS.map((x, i) => (
        <motion.g key={`m${i}`} variants={popMark} style={originStyle}>
          <line
            x1={x - 7}
            y1={END_Y}
            x2={x + 7}
            y2={END_Y}
            stroke={NAVY_TICK}
            strokeWidth="1"
          />
          <rect
            x={x - 3}
            y={END_Y - 3}
            width="6"
            height="6"
            transform={`rotate(45 ${x} ${END_Y})`}
            fill={RED}
          />
        </motion.g>
      ))}
    </>
  );
}

export default function PillarsConverge() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
      >
        <div className="mx-auto h-px w-full max-w-[110rem] bg-isq-navy/12" />
        <svg
          width="480"
          height="92"
          viewBox="0 0 480 92"
          fill="none"
          className="mx-auto block h-[clamp(58px,6.5vw,84px)] w-auto opacity-70"
        >
          <circle cx={NODE.x} cy={NODE.y} r="2.5" fill={RED} />
          {ENDS.map((x, i) => (
            <line
              key={i}
              x1={NODE.x}
              y1={NODE.y}
              x2={x}
              y2={END_Y}
              stroke={NAVY_LINE}
              strokeWidth="1"
            />
          ))}
          {ENDS.map((x, i) => (
            <g key={`m${i}`}>
              <line
                x1={x - 7}
                y1={END_Y}
                x2={x + 7}
                y2={END_Y}
                stroke={NAVY_TICK}
                strokeWidth="1"
              />
              <rect
                x={x - 3}
                y={END_Y - 3}
                width="6"
                height="6"
                transform={`rotate(45 ${x} ${END_Y})`}
                fill={RED}
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden"
    >
      {/* Hairline full-width que se desenha + cabeça de varredura que trava no centro */}
      <div className="relative mx-auto h-px w-full max-w-[110rem] overflow-hidden">
        <motion.span
          className="absolute inset-0 block origin-left bg-isq-navy/12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        />
        {/* Corre da esquerda, desacelera e "trava" perto do centro, some ao ramificar */}
        <motion.span
          className="absolute left-0 top-0 block h-px w-[18%] bg-gradient-to-r from-transparent via-isq-red to-transparent will-change-transform"
          style={{ boxShadow: "0 0 10px 1px rgba(214,0,0,0.55)" }}
          initial={{ x: "-120%", opacity: 0 }}
          whileInView={{ x: ["-120%", "228%", "228%"], opacity: [0, 1, 0] }}
          viewport={{ once: true, amount: 0 }}
          transition={{
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.72, 1],
          }}
        />
      </div>

      {/* Gesto de ramificação — centralizado, atrás do conteúdo */}
      <motion.svg
        variants={svgParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
        width="480"
        height="92"
        viewBox="0 0 480 92"
        fill="none"
        className="mx-auto block h-[clamp(58px,6.5vw,84px)] w-auto"
      >
        {/* Nó central — acende quando a varredura trava */}
        <motion.g
          variants={popMark}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle
            cx={NODE.x}
            cy={NODE.y}
            r="3"
            fill={RED}
            style={{ filter: "drop-shadow(0 0 5px rgba(214,0,0,0.6))" }}
          />
        </motion.g>
        <Marks />
      </motion.svg>
    </div>
  );
}
