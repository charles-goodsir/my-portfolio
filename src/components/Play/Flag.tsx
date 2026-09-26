import { useRef, type ReactNode } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { Edges, Html } from '@react-three/drei'
import {
  AdditiveBlending,
  Shape,
  type Color,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type Vector3,
} from 'three'
import {
  BEAM_CYAN,
  BEAM_ORANGE,
  CAPTURE_SECONDS,
  HUD_GLOW,
  HUD_PANEL,
  NEON_CYAN,
  NEON_ORANGE,
  WHITE_HOT,
} from './constants'
import { reduceMotion } from './motion'

// One piece of a hologram symbol: a barely-there fill with glowing edges.
// children is the shape, e.g. <boxGeometry />
function HoloPart({
  color,
  children,
  ...meshProps
}: { color: Color; children: ReactNode } & ThreeElements['mesh']) {
  return (
    <mesh {...meshProps}>
      {children}
      <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      <Edges color={color} />
    </mesh>
  )
}

// Flat outlines, extruded a little so they have edges to trace
const shieldShape = new Shape()
  .moveTo(0, 0.4)
  .lineTo(0.3, 0.3)
  .lineTo(0.3, 0)
  .quadraticCurveTo(0.3, -0.3, 0, -0.45)
  .quadraticCurveTo(-0.3, -0.3, -0.3, 0)
  .lineTo(-0.3, 0.3)
  .closePath()
const envelopeFlap = new Shape()
  .moveTo(-0.35, 0.225)
  .lineTo(0.35, 0.225)
  .lineTo(0, -0.05)
  .closePath()
const thin = { depth: 0.05, bevelEnabled: false }

// What floats above each flag, built from basic shapes. Anything not listed
// (a page added to the nav later) gets a plain diamond
function symbolFor(route: string, color: Color) {
  switch (route) {
    case '/about': // a person: head and shoulders
      return (
        <>
          <HoloPart color={color} position-y={0.3}>
            <octahedronGeometry args={[0.18]} />
          </HoloPart>
          <HoloPart color={color} position-y={-0.1}>
            <cylinderGeometry args={[0.1, 0.3, 0.4, 6]} />
          </HoloPart>
        </>
      )
    case '/experience': // a briefcase with a handle
      return (
        <>
          <HoloPart color={color}>
            <boxGeometry args={[0.7, 0.45, 0.2]} />
          </HoloPart>
          <HoloPart color={color} position-y={0.28}>
            <boxGeometry args={[0.25, 0.08, 0.08]} />
          </HoloPart>
        </>
      )
    case '/projects': // a stack of blocks
      return (
        <>
          <HoloPart color={color} position={[-0.18, -0.15, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
          </HoloPart>
          <HoloPart color={color} position={[0.18, -0.15, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
          </HoloPart>
          <HoloPart color={color} position={[0, 0.17, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
          </HoloPart>
        </>
      )
    case '/diary': // an open book: two pages hinged at the spine
      return (
        <>
          {[1, -1].map((side) => (
            <group key={side} rotation-y={side * 0.4}>
              <HoloPart color={color} position-x={side * 0.18}>
                <boxGeometry args={[0.35, 0.5, 0.03]} />
              </HoloPart>
            </group>
          ))}
        </>
      )
    case '/owasp': // a shield
      return (
        <HoloPart color={color} position-z={-0.025}>
          <extrudeGeometry args={[shieldShape, thin]} />
        </HoloPart>
      )
    case '/contact': // an envelope with its flap drawn on the front
      return (
        <>
          <HoloPart color={color}>
            <boxGeometry args={[0.7, 0.45, 0.05]} />
          </HoloPart>
          <HoloPart color={color} position-z={0.03}>
            <extrudeGeometry args={[envelopeFlap, { ...thin, depth: 0.01 }]} />
          </HoloPart>
        </>
      )
    default:
      return (
        <HoloPart color={color}>
          <octahedronGeometry args={[0.3]} />
        </HoloPart>
      )
  }
}

function Flag({
  route,
  label,
  preview,
  position,
  nearby,
  owned,
  captured,
  onClick,
  onEnter,
}: {
  route: string
  label: string
  preview: string
  position: Vector3
  nearby: boolean
  owned: boolean // captured at some point this session: shown in cyan
  captured: boolean // being captured right now: plays the flash
  onClick: () => void
  onEnter: () => void
}) {
  const cloth = useRef<Mesh>(null)
  const clothMaterial = useRef<MeshBasicMaterial>(null)
  const beam = useRef<Mesh>(null)
  const beamMaterial = useRef<MeshBasicMaterial>(null)
  const captureStart = useRef<number | null>(null)
  const symbol = useRef<Group>(null)

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime

    // Turn the hologram symbol slowly
    if (symbol.current && !reduceMotion) symbol.current.rotation.y += delta * 0.8

    // Bob the cloth up and down. Offsetting by x means the flags bob out of step
    if (cloth.current && !reduceMotion) {
      cloth.current.position.y = 2.6 + Math.sin(now * 2 + position.x) * 0.1
    }

    if (!captured) return

    // progress runs 0 → 1 over the capture effect
    captureStart.current ??= now
    const progress = Math.min((now - captureStart.current) / CAPTURE_SECONDS, 1)

    // One flash: cloth jumps to white-hot then settles on cyan, the flag is yours.
    // A single flash, never a strobe, which could trigger seizures
    clothMaterial.current?.color.copy(WHITE_HOT).lerp(NEON_CYAN, progress)

    // Beam brightens and widens
    if (beamMaterial.current) beamMaterial.current.opacity = 0.15 + progress * 0.5
    if (beam.current && !reduceMotion) {
      const width = 1 + progress * 3
      beam.current.scale.set(width, 1, width)
    }
  })

  return (
    <group
      position={position}
      onClick={(e) => {
        // Stop the click reaching the ground behind the flag
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Pole: a dark six-sided pylon. Cylinders are centred on their middle,
          so lift by half the height. <Edges> traces the hard edges in neon */}
      <mesh position-y={1.5}>
        <cylinderGeometry args={[0.12, 0.12, 3, 6]} />
        <meshStandardMaterial color="#05080f" />
        <Edges color={NEON_CYAN} />
      </mesh>

      {/* Cloth: a thin glowing box hanging off the top of the pole */}
      <mesh ref={cloth} position={[0.6, 2.6, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshBasicMaterial ref={clothMaterial} color={owned ? NEON_CYAN : NEON_ORANGE} />
      </mesh>

      {/* Beam: a tall, faint, open-ended tube into the sky. Additive blending
          means it brightens whatever is behind it, like real light */}
      <mesh ref={beam} position-y={15}>
        <cylinderGeometry args={[0.3, 0.3, 30, 16, 1, true]} />
        <meshBasicMaterial
          ref={beamMaterial}
          // On capture the beam switches to neon so it blooms
          color={captured ? NEON_CYAN : owned ? BEAM_CYAN : BEAM_ORANGE}
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Hologram symbol above the flag, in the flag's colour */}
      <group ref={symbol} position-y={4.6}>
        {symbolFor(route, owned ? NEON_CYAN : NEON_ORANGE)}
      </group>

      {/* In range: the label opens into a hologram panel you can click.
          Otherwise just the name. The panel floats above the symbol */}
      <Html position-y={nearby ? 6 : 3.5} center>
        {nearby ? (
          <button
            type="button"
            onClick={(e) => {
              // Keep the click from also reaching the 3D scene underneath
              e.stopPropagation()
              onEnter()
            }}
            className={`animate-fade-in block w-56 px-3 py-2 text-left ${HUD_PANEL}`}
          >
            <span className={`block text-sm ${HUD_GLOW}`}>{label}</span>
            <span className="mt-1 block text-xs text-[#94a3b8]">{preview}</span>
            <span className="mt-2 block text-xs text-[#f59e0b]">Enter ↵ or click to go in</span>
          </button>
        ) : (
          <div className={`pointer-events-none whitespace-nowrap px-2 py-0.5 text-xs ${HUD_PANEL} ${HUD_GLOW}`}>
            {label}
            {owned && ' ✓'}
          </div>
        )}
      </Html>
    </group>
  )
}

export default Flag
