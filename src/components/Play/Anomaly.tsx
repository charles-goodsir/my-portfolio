// Phase 7: a real hidden flag. A small dark cube in the south-east corner
// with faint red edges. Drive up to it and the flag string appears
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html } from '@react-three/drei'
import type { Mesh } from 'three'
import { ANOMALY_POSITION, ANOMALY_RED, HUD_PANEL } from './constants'
import { reduceMotion } from './device'

// Base64, so searching the page's code for "flag{" finds nothing.
// Spotting and decoding this is a fair way to solve it too
const HIDDEN_FLAG = atob('ZmxhZ3tmMWdodF9mMHJfdGgzX3VzM3JzfQ==')

export function Anomaly({ revealed }: { revealed: boolean }) {
  const cube = useRef<Mesh>(null)

  // Tumbles slowly on two axes, unlike anything else on the map
  useFrame((_, delta) => {
    if (!cube.current || reduceMotion) return
    cube.current.rotation.x += delta * 0.7
    cube.current.rotation.y += delta * 0.5
  })

  return (
    <group position={ANOMALY_POSITION}>
      <mesh ref={cube} position-y={0.8}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial color="#000000" />
        <Edges color={ANOMALY_RED} />
      </mesh>

      {revealed && (
        <Html position-y={2.4} center>
          {/* Selectable so it can be copied. Stopping the pointer events keeps
              a click-and-drag here from also moving the Bit away */}
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className={`animate-fade-in select-text whitespace-nowrap px-3 py-2 text-sm text-[#ff4d6d] [text-shadow:0_0_8px_#ff4d6d] ${HUD_PANEL}`}
          >
            {HIDDEN_FLAG}
          </div>
        </Html>
      )}
    </group>
  )
}
