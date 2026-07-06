"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import BreakPart from "./BreakPart";

/**
 * BreakScene — Canvas WebGL da faixa entre Manifesto e Pilares.
 *
 * Canvas transparente sobre o painel navy do ImageBreak. Câmera enquadrando
 * um pipeline horizontal. Montado só quando a seção entra na viewport (ver
 * ImageBreak) para não manter dois canvases pesados sempre renderizando.
 */
export default function BreakScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      // pausa o loop quando a faixa sai da viewport (economiza GPU)
      frameloop={active ? "always" : "demand"}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 5.6], fov: 30 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 5]} intensity={1.3} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} color="#9bb4d6" />

      <Suspense fallback={null}>
        <BreakPart />

        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#10243b"]} />
          <Lightformer
            intensity={2.2}
            position={[3, 3, 4]}
            scale={[8, 6, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={1.1}
            position={[-4, 1, 2]}
            scale={[6, 6, 1]}
            color="#9bb4d6"
          />
          <Lightformer
            intensity={0.7}
            position={[0, -4, -3]}
            scale={[10, 8, 1]}
            color="#142235"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
