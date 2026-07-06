"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * BreakPart — versão "faixa horizontal" do objeto de inspeção do Hero.
 *
 * Um trecho de pipeline de aço escovado (com 3 juntas soldadas) deitado na
 * horizontal, percorrido por um anel de varredura vermelho que revela a malha
 * técnica na banda por onde passa (mesmo shader do Hero). Gira lentamente no
 * próprio eixo para "vida" contínua. Composição pensada para o formato largo
 * e baixo do break entre Manifesto e Pilares.
 *
 * Truque de orientação: tudo é construído no eixo local Y (como no Hero) e o
 * grupo externo é rotacionado ~90° em Z para deitar na horizontal. Assim o
 * shader continua usando `position.y` (o eixo do tubo) e o giro no eixo Y
 * (interno) preserva esse Y — mantendo a banda de varredura alinhada.
 */

const STEEL = "#9aa5b1";
const WELD = "#b9bfc6";
const SCAN = "#d60000";
const EDGE = "#dad7cf";

const HALF = 3.25; // meia-altura do tubo (comprimento total 6.5)
const TRAVEL = 2.8; // amplitude do anel ao longo do eixo
const WELDS = [-1.9, 0, 1.9]; // posições das juntas soldadas

const WIRE_VERT = /* glsl */ `
  varying float vY;
  void main() {
    vY = position.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const WIRE_FRAG = /* glsl */ `
  uniform float uScanY;
  uniform float uBand;
  uniform vec3 uColor;
  varying float vY;
  void main() {
    float d = abs(vY - uScanY);
    float a = smoothstep(uBand, 0.0, d);
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export default function BreakPart() {
  const spin = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Group>(null);
  const scanMat = useRef<THREE.MeshStandardMaterial>(null);

  const wireUniforms = useRef({
    uScanY: { value: 0 },
    uBand: { value: 0.55 },
    uColor: { value: new THREE.Color("#e3ecf5") },
  });
  const wireMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: wireUniforms.current,
        vertexShader: WIRE_VERT,
        fragmentShader: WIRE_FRAG,
        wireframe: true,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (spin.current) spin.current.rotation.y = t * 0.16; // gira no eixo do tubo
    const scanY = Math.sin(t * 0.5) * TRAVEL; // varredura lenta ao longo do tubo
    if (scan.current) scan.current.position.y = scanY;
    wireUniforms.current.uScanY.value = scanY;
    if (scanMat.current) {
      scanMat.current.emissiveIntensity = 2.4 + Math.sin(t * 5.5) * 0.6;
    }
  });

  return (
    <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.35}>
      {/* deita o conjunto na horizontal (+ leve inclinação para profundidade) */}
      <group rotation={[0.16, 0, Math.PI / 2 + 0.05]}>
        {/* gira no próprio eixo (preserva o Y local usado pelo shader/scan) */}
        <group ref={spin}>
          {/* Tubo de aço */}
          <mesh>
            <cylinderGeometry args={[0.66, 0.66, HALF * 2, 64, 1]} />
            <meshStandardMaterial
              color={STEEL}
              metalness={0.96}
              roughness={0.3}
              envMapIntensity={1.1}
            />
            <Edges threshold={20} color={EDGE} />
          </mesh>

          {/* Malha técnica revelada na banda do anel (face frontal) */}
          <mesh material={wireMat}>
            <cylinderGeometry args={[0.68, 0.68, HALF * 2, 40, 26, true]} />
          </mesh>

          {/* Juntas soldadas */}
          {WELDS.map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.675, 0.055, 16, 72]} />
              <meshStandardMaterial
                color={WELD}
                metalness={0.78}
                roughness={0.62}
                envMapIntensity={0.9}
              />
            </mesh>
          ))}
        </group>

        {/* Anel de varredura — corre ao longo do tubo (eixo Y local) */}
        <group ref={scan}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.014, 12, 96]} />
            <meshStandardMaterial
              ref={scanMat}
              color={SCAN}
              emissive={SCAN}
              emissiveIntensity={2.4}
              metalness={0}
              roughness={0.4}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.74, 0.06, 12, 96]} />
            <meshBasicMaterial
              color={SCAN}
              transparent
              opacity={0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
