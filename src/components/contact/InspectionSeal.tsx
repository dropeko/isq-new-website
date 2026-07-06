"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE, DUR } from "@/lib/motion";

/**
 * InspectionSeal — o emblema-fecho da n.06 ("vamos conversar").
 *
 * Um selo de certificação técnico que se desenha ao entrar na viewport
 * (anéis, escala de mostrador, texto circular) com um arco de varredura
 * vermelho orbitando e a marca ISQ no centro. Bookend do Hero/intro: a
 * abertura revela a logo, o fecho a certifica.
 *
 * Só transform/opacity/pathLength. Em prefers-reduced-motion: selo estático
 * já desenhado, sem rotação.
 */

const CENTER = 150;

// Escala do mostrador — coordenadas PRÉ-COMPUTADAS e ARREDONDADAS. Evita
// mismatch de hidratação: floats de Math.cos/sin diferem no último dígito
// entre SSR e cliente; arredondar a 2 casas garante strings idênticas.
const rnd = (n: number) => Math.round(n * 100) / 100;
const TICKS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const long = i % 12 === 0;
  const r2 = long ? 88 : 94;
  return {
    x1: rnd(CENTER + 100 * Math.cos(a)),
    y1: rnd(CENTER + 100 * Math.sin(a)),
    x2: rnd(CENTER + r2 * Math.cos(a)),
    y2: rnd(CENTER + r2 * Math.sin(a)),
    long,
  };
});

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: EASE.inOut, delay: 0.1 + i * 0.14 },
      opacity: { duration: 0.4, delay: 0.1 + i * 0.14 },
    },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: 0.5 + i * 0.12, ease: "easeOut" },
  }),
};

export default function InspectionSeal() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
      <motion.svg
        viewBox="0 0 300 300"
        className="h-full w-full text-isq-off"
        fill="none"
        initial={reduce ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <defs>
          {/* Caminho circular para o texto do selo (r=118) */}
          <path
            id="sealTextPath"
            d="M 150,32 A 118,118 0 1,1 149.9,32"
          />
        </defs>

        {/* Anéis concêntricos (desenham) */}
        <motion.circle
          cx={CENTER} cy={CENTER} r={138}
          stroke="currentColor" strokeOpacity={0.5} strokeWidth={1}
          variants={draw} custom={0}
        />
        <motion.circle
          cx={CENTER} cy={CENTER} r={100}
          stroke="currentColor" strokeOpacity={0.32} strokeWidth={1}
          variants={draw} custom={1}
        />
        <motion.circle
          cx={CENTER} cy={CENTER} r={72}
          stroke="currentColor" strokeOpacity={0.22} strokeWidth={1}
          variants={draw} custom={2}
        />

        {/* Grupo giratório: texto circular + escala de mostrador */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          <motion.text
            variants={fade}
            custom={0}
            fontSize={9}
            letterSpacing={2.4}
            fill="currentColor"
            fillOpacity={0.62}
            className="font-sans uppercase"
          >
            <textPath href="#sealTextPath" startOffset="0%">
              INSPEÇÃO · ENSAIOS · CERTIFICAÇÃO · ISQ BRASIL ·
            </textPath>
          </motion.text>

          {/* Escala tipo mostrador: ticks (longos a cada 90°) */}
          <motion.g variants={fade} custom={1}>
            {TICKS.map((tk, i) => (
              <line
                key={i}
                x1={tk.x1}
                y1={tk.y1}
                x2={tk.x2}
                y2={tk.y2}
                stroke="currentColor"
                strokeOpacity={tk.long ? 0.55 : 0.28}
                strokeWidth={tk.long ? 1.4 : 0.8}
              />
            ))}
          </motion.g>
        </motion.g>

        {/* Arco de varredura vermelho — orbita continuamente */}
        <motion.g
          style={{ transformOrigin: "150px 150px" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <motion.path
            d="M 150,50 A 100,100 0 0,1 236.6,100"
            stroke="var(--color-isq-red)"
            strokeWidth={2.5}
            strokeLinecap="round"
            variants={draw}
            custom={3}
          />
        </motion.g>

        {/* Crosshair + ponto central */}
        <motion.g variants={fade} custom={2}>
          <line
            x1={CENTER} y1={122} x2={CENTER} y2={178}
            stroke="currentColor" strokeOpacity={0.25}
            strokeWidth={0.6} strokeDasharray="2 3"
          />
          <line
            x1={122} y1={CENTER} x2={178} y2={CENTER}
            stroke="currentColor" strokeOpacity={0.25}
            strokeWidth={0.6} strokeDasharray="2 3"
          />
        </motion.g>

        {/* Marcador diamante vermelho no topo (12h) */}
        <motion.rect
          x={144} y={18} width={12} height={12}
          rx={1.5}
          fill="var(--color-isq-red)"
          transform="rotate(45 150 24)"
          variants={fade}
          custom={3}
        />
      </motion.svg>

      {/* Marca ISQ no centro (fade+scale) — bookend da intro */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: DUR.reveal, delay: 0.95, ease: EASE.out }}
      >
        <div className="relative h-[24%] w-[24%]">
          <Image
            src="/brand/isq-logo.svg"
            alt=""
            fill
            sizes="120px"
            className="object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
}
