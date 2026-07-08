"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import InspectionPart from "./InspectionPart";

/**
 * HeroScene — Canvas WebGL do Hero.
 *
 * Carregado via next/dynamic (ssr:false) só em desktop capaz e sem
 * prefers-reduced-motion (ver HeroVisual). Canvas transparente — o painel
 * navy do HeroVisual entra como fundo. O Environment com Lightformers dá
 * os reflexos no aço sem depender de HDR externo (auto-contido / offline).
 */
export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      // Pausa o loop quando o Hero sai da viewport (economiza GPU no resto
      // da página). "demand" só re-renderiza sob invalidação → useFrame para.
      frameloop={active ? "always" : "demand"}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [2.1, 0.45, 6.7], fov: 32 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#9bb4d6" />

      <Suspense fallback={null}>
        <InspectionPart />

        {/* Ambiente de reflexão — bake estático (frames=1) para performance */}
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#10243b"]} />
          <Lightformer
            intensity={2.2}
            position={[3, 3, 4]}
            scale={[7, 7, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={1.1}
            position={[-4, 1, 2]}
            scale={[4, 7, 1]}
            color="#9bb4d6"
          />
          <Lightformer
            intensity={0.7}
            position={[0, -4, -3]}
            scale={[9, 9, 1]}
            color="#142235"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
