"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * InspectionPart — o objeto-assinatura do Hero.
 *
 * Um corpo-de-prova metálico (aço escovado) com um cordão de solda no meio,
 * percorrido por um anel de varredura vermelho (linguagem de ensaio
 * não-destrutivo). Onde o anel passa, uma **malha técnica (wireframe) é
 * revelada** sob o aço — a "inspeção tornada visível": do material físico
 * → à verificação técnica. O anel sobe e desce enquanto o conjunto gira.
 *
 * A revelação usa um ShaderMaterial wireframe cujo alpha é uma banda em
 * torno de uScanY (a posição do anel), atualizada por frame.
 */

const STEEL = "#9aa5b1";
const WELD = "#b9bfc6";
const SCAN = "#d60000";
const EDGE = "#dad7cf";

const TRAVEL = 1.35; // amplitude do anel de varredura ao longo de Y

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
    float a = smoothstep(uBand, 0.0, d); // 1 no anel, 0 fora da banda
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export default function InspectionPart() {
  const group = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Group>(null);
  const scanMat = useRef<THREE.MeshStandardMaterial>(null);

  // Material wireframe revelado pela varredura. Uniforms num ref estável
  // para o useFrame poder atualizá-los sem recriar o material.
  const wireUniforms = useRef({
    uScanY: { value: 0 },
    uBand: { value: 0.5 },
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
        // depthTest (padrão) oculta as linhas de trás atrás do aço (não é
        // x-ray) e blending normal evita o overdraw acumulado do additive —
        // bem mais leve no GPU.
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.22; // rotação institucional lenta
    }
    // varredura suave (ease senoidal) de baixo a cima e volta
    const scanY = Math.sin(t * 0.85) * TRAVEL;
    if (scan.current) scan.current.position.y = scanY;
    wireUniforms.current.uScanY.value = scanY; // banda do wireframe segue o anel
    if (scanMat.current) {
      scanMat.current.emissiveIntensity = 2.4 + Math.sin(t * 5.5) * 0.6;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.45}>
      <group ref={group} rotation={[0.14, 0, 0.16]}>
        {/* Corpo-de-prova: cilindro de aço escovado */}
        <mesh>
          <cylinderGeometry args={[0.92, 0.92, 3.2, 72, 1]} />
          <meshStandardMaterial
            color={STEEL}
            metalness={0.96}
            roughness={0.3}
            envMapIntensity={1.1}
          />
          {/* Edges: aros crisp no topo/base — leitura de blueprint */}
          <Edges threshold={20} color={EDGE} />
        </mesh>

        {/* Malha técnica revelada na banda do anel (só a face frontal) */}
        <mesh material={wireMat}>
          <cylinderGeometry args={[0.94, 0.94, 3.2, 36, 10, true]} />
        </mesh>

        {/* Cordão de solda no centro (mais rugoso/fosco que o aço) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.935, 0.072, 18, 80]} />
          <meshStandardMaterial
            color={WELD}
            metalness={0.78}
            roughness={0.62}
            envMapIntensity={0.9}
          />
        </mesh>

        {/* Anel de varredura (vermelho ISQ, emissivo) — sobe e desce */}
        <group ref={scan}>
          {/* núcleo nítido */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.99, 0.016, 12, 96]} />
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
          {/* halo aditivo — fake-bloom sem postprocessing */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.015, 0.07, 12, 96]} />
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
