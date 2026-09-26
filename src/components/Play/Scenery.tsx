// The static world: arena walls, traffic on the grid, and the horizon
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  Color,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  type Group,
  type Mesh,
} from 'three'
import { MAP_SIZE, NEON_CYAN, NEON_ORANGE, WALL_CYAN } from './constants'
import { reduceMotion } from './motion'

// The four arena walls sit on the edges of the floor: [x, z, rotation]
const HALF = MAP_SIZE / 2
const walls: [number, number, number][] = [
  [0, -HALF, 0],
  [0, HALF, 0],
  [-HALF, 0, Math.PI / 2],
  [HALF, 0, Math.PI / 2],
]

export function Walls() {
  const refs = useRef<(Group | null)[]>([])

  // The camera sits behind the Bit, so near the edge it can end up outside the
  // arena, looking through a wall. Hide whichever wall it's behind
  useFrame(({ camera }) => {
    walls.forEach(([x, z], i) => {
      const wall = refs.current[i]
      if (!wall) return
      const outside = x === 0 ? Math.sign(z) * camera.position.z > HALF : Math.sign(x) * camera.position.x > HALF
      wall.visible = !outside
    })
  })

  return walls.map(([x, z, rotation], i) => (
    <group
      key={`${x},${z}`}
      ref={(wall) => void (refs.current[i] = wall)}
      position={[x, 0, z]}
      rotation-y={rotation}
    >
      {/* Faint see-through panel, visible from both sides */}
      <mesh position-y={0.75}>
        <planeGeometry args={[MAP_SIZE, 1.5]} />
        <meshBasicMaterial
          color={WALL_CYAN}
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      {/* Glowing rail along the top */}
      <mesh position-y={1.5}>
        <boxGeometry args={[MAP_SIZE, 0.05, 0.05]} />
        <meshBasicMaterial color={NEON_CYAN} />
      </mesh>
    </group>
  ))
}

// Other programs racing along the grid lines, on fixed loops. along = which
// way it travels, line = which grid line it rides, speed in units/second
// (negative = the other way), offset = where on the loop it starts
const streaks = [
  { along: 'x', line: 15, speed: -8, offset: 20, color: NEON_CYAN },
  { along: 'x', line: -5, speed: 12, offset: 30, color: NEON_ORANGE },
  { along: 'x', line: 10, speed: -11, offset: 8, color: NEON_CYAN },
  { along: 'z', line: 15, speed: -12, offset: 35, color: NEON_ORANGE },
  { along: 'z', line: 5, speed: 10, offset: 25, color: NEON_CYAN },
] as const

// Each loop runs from just outside one wall to just outside the other, so
// streaks appear to come in and go out through the walls
const STREAK_LOOP = MAP_SIZE + 2
const STREAK_LENGTH = 3

export function Traffic() {
  const refs = useRef<(Mesh | null)[]>([])

  useFrame(({ clock }) => {
    streaks.forEach((streak, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      // % in JS keeps the sign, so add the loop back on to wrap negatives too
      const travelled = clock.elapsedTime * streak.speed + streak.offset
      const along = (((travelled % STREAK_LOOP) + STREAK_LOOP) % STREAK_LOOP) - STREAK_LOOP / 2
      if (streak.along === 'x') mesh.position.set(along, 0.05, streak.line)
      else mesh.position.set(streak.line, 0.05, along)
    })
  })

  // Ambient motion the visitor didn't cause, so hidden for reduced motion
  if (reduceMotion) return null

  return streaks.map((streak, i) => (
    <mesh key={i} ref={(mesh) => void (refs.current[i] = mesh)}>
      {/* A long thin bar pointing along its direction of travel */}
      <boxGeometry
        args={
          streak.along === 'x'
            ? [STREAK_LENGTH, 0.06, 0.06]
            : [0.06, 0.06, STREAK_LENGTH]
        }
      />
      <meshBasicMaterial color={streak.color} />
    </mesh>
  ))
}

// The world past the walls: a glowing band low on the horizon, and a ring of
// black mountains and towers cut out against it. All of it ignores the fog,
// which would otherwise turn it the same black as the sky
const HORIZON_RADIUS = 80
const SKYLINE_DISTANCE = 70
const HORIZON_GLOW = new Color(0, 0.3, 0.38)
// The glow fades to black this far up. Kept low so the sky above stays black
// and the glow reads as a thin band at the horizon
const GLOW_HEIGHT = 10
const BLACK = new Color(0, 0, 0)

// Worked out from the index, not Math.random, so the skyline is the same on
// every visit. Every third shape is a tower, the rest are four-sided mountains
const skyline = Array.from({ length: 18 }, (_, i) => {
  const tower = i % 3 === 0
  return {
    angle: (i / 18) * Math.PI * 2 + Math.sin(i * 12.9) * 0.15,
    tower,
    height: tower ? 18 + (i % 4) * 4 : 6 + ((i * 7) % 5) * 3,
    width: tower ? 1.5 : 6 + ((i * 3) % 4) * 3,
  }
})

export function Horizon() {
  // A tall open cylinder round the whole world. Its bottom edge is coloured
  // glow and its top edge black, and the GPU blends between them: a gradient
  const glow = useMemo(() => {
    const geometry = new CylinderGeometry(HORIZON_RADIUS, HORIZON_RADIUS, GLOW_HEIGHT, 64, 1, true)
    geometry.translate(0, GLOW_HEIGHT / 2, 0) // sit it on the ground instead of centred on it
    const { position } = geometry.attributes
    const colours: number[] = []
    for (let i = 0; i < position.count; i++) {
      const colour = position.getY(i) < 1 ? HORIZON_GLOW : BLACK
      colours.push(colour.r, colour.g, colour.b)
    }
    geometry.setAttribute('color', new Float32BufferAttribute(colours, 3))
    return geometry
  }, [])

  return (
    <>
      {/* BackSide: we're inside the cylinder, looking at its inner faces */}
      <mesh geometry={glow}>
        <meshBasicMaterial
          vertexColors
          side={BackSide}
          fog={false}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* A thin bright line right on the horizon, which blooms */}
      <mesh position-y={0.1}>
        <cylinderGeometry args={[HORIZON_RADIUS - 0.5, HORIZON_RADIUS - 0.5, 0.15, 64, 1, true]} />
        <meshBasicMaterial color={NEON_CYAN} side={BackSide} fog={false} />
      </mesh>

      {skyline.map(({ angle, tower, height, width }, i) => (
        <group
          key={i}
          position={[Math.sin(angle) * SKYLINE_DISTANCE, 0, Math.cos(angle) * SKYLINE_DISTANCE]}
        >
          <mesh position-y={height / 2}>
            {tower ? (
              <boxGeometry args={[width, height, width]} />
            ) : (
              <coneGeometry args={[width, height, 4]} />
            )}
            <meshBasicMaterial color={BLACK} fog={false} />
          </mesh>
          {/* A small warning light on top of each tower */}
          {tower && (
            <mesh position-y={height + 0.3}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshBasicMaterial color={NEON_ORANGE} fog={false} />
            </mesh>
          )}
        </group>
      ))}
    </>
  )
}
