// The static world: arena walls, traffic on the grid, and the stadium
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MAP_SIZE, NEON_CYAN, NEON_ORANGE, WALL_CYAN } from './constants'
import { reduceMotion } from './device'

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

// Each loop runs wall to wall. Streaks fade in over the first STREAK_FADE
// units and out over the last, so they appear out of and vanish into the
// grid instead of driving off it
const STREAK_LOOP = MAP_SIZE
const STREAK_LENGTH = 3
const STREAK_FADE = 4

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

      // How far the streak's leading tip is from the nearest wall, as a 0 → 1 fade
      const gap = HALF - (Math.abs(along) + STREAK_LENGTH / 2)
      const material = mesh.material as MeshBasicMaterial
      material.opacity = Math.min(Math.max(gap / STREAK_FADE, 0), 1)
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
      <meshBasicMaterial color={streak.color} transparent depthWrite={false} />
    </mesh>
  ))
}

// The stadium, after the disc-game arena in Tron: Legacy. Stepped black tiers
// rise on all four sides, each step with a lit front edge and a crowd of small
// lights on top. It starts far enough out that the chase camera (15 units
// behind the Bit) never ends up inside the stands
const STAND_START = HALF + 16
const TIERS = 8
const STEP_DEPTH = 2 // how deep each step is
const STEP_RISE = 1.5 // how much higher each step is than the one in front
const BLACK = new Color(0, 0, 0)
const TIER_EDGE = new Color(0, 0.5, 0.6) // below 1, so the step edges don't bloom
const CROWD_COLOURS = [
  new Color(0, 0.7, 0.9), // most of the crowd
  new Color(1, 0.45, 0.1), // some orange
  new Color(0.8, 0.8, 0.8), // a few white
]
const CROWD_PER_UNIT = 1 // seats per unit of step length
const FLICKERS_PER_FRAME = 40

const tiers = Array.from({ length: TIERS }, (_, i) => ({
  distance: STAND_START + i * STEP_DEPTH, // from the centre to the front of this step
  height: (i + 1) * STEP_RISE,
}))

// The four sides of a square ring: which way it faces, and whether it runs
// along z (east and west) rather than x (north and south)
const sides = [
  { x: 0, z: -1, alongZ: false },
  { x: 0, z: 1, alongZ: false },
  { x: -1, z: 0, alongZ: true },
  { x: 1, z: 0, alongZ: true },
]

// One light per person, scattered over the top of every step, with some
// empty seats. Built once, as plain number arrays for the GPU
function buildCrowd() {
  const positions: number[] = []
  const colours: number[] = []
  for (const { distance, height } of tiers) {
    for (const side of sides) {
      const length = 2 * distance
      for (let seat = 0; seat < length * CROWD_PER_UNIT; seat++) {
        if (Math.random() < 0.25) continue // empty seat
        const along = (Math.random() - 0.5) * length
        const depth = distance + Math.random() * STEP_DEPTH
        if (side.alongZ) positions.push(side.x * depth, height + 0.3, along)
        else positions.push(along, height + 0.3, side.z * depth)
        const pick = Math.random()
        const colour = CROWD_COLOURS[pick < 0.7 ? 0 : pick < 0.9 ? 1 : 2]
        colours.push(colour.r, colour.g, colour.b)
      }
    }
  }
  return { positions, colours }
}

// Every step block, and every edge strip, merged into one geometry each. 64
// separate meshes become 2, which saves 128 draw calls a frame (each one is
// drawn twice because of the reflective floor). The strips carry their colour
// per vertex, so the dim step edges and the glowing rim can share one mesh
function buildStands() {
  const blocks: BoxGeometry[] = []
  const edges: BoxGeometry[] = []
  tiers.forEach(({ distance, height }, tier) => {
    for (const side of sides) {
      const depthCentre = distance + STEP_DEPTH / 2
      const span = 2 * (distance + STEP_DEPTH) // long enough to meet the next side at the corners

      // The step itself: a solid black block down to the ground
      const block = side.alongZ
        ? new BoxGeometry(STEP_DEPTH, height, span).translate(side.x * depthCentre, height / 2, 0)
        : new BoxGeometry(span, height, STEP_DEPTH).translate(0, height / 2, side.z * depthCentre)
      blocks.push(block)

      // Lit strip along its front edge. The top step's edge is the rim: that one glows
      const edge = side.alongZ
        ? new BoxGeometry(0.08, 0.08, 2 * distance).translate(side.x * distance, height, 0)
        : new BoxGeometry(2 * distance, 0.08, 0.08).translate(0, height, side.z * distance)
      const colour = tier === TIERS - 1 ? NEON_CYAN : TIER_EDGE
      const vertices = edge.attributes.position.count
      edge.setAttribute(
        'color',
        new Float32BufferAttribute(Array.from({ length: vertices }, () => [colour.r, colour.g, colour.b]).flat(), 3),
      )
      edges.push(edge)
    }
  })
  const merged = { blocks: mergeGeometries(blocks), edges: mergeGeometries(edges) }
  for (const piece of [...blocks, ...edges]) piece.dispose() // the merged copies are all that's needed
  return merged
}

export function Stadium() {
  const stands = useMemo(buildStands, [])
  const crowd = useMemo(() => {
    const { positions, colours } = buildCrowd()
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colours, 3))
    return { geometry, base: colours } // base: each person's full brightness
  }, [])

  // Built by hand rather than as JSX, so free their GPU memory when the map
  // closes. Otherwise every visit to /play would leave a copy behind
  useEffect(
    () => () => {
      stands.blocks.dispose()
      stands.edges.dispose()
      crowd.geometry.dispose()
    },
    [stands, crowd],
  )

  // Flicker: each frame a few dozen random people dim a little or come back
  // up. Background motion, so off for reduced motion
  useFrame(() => {
    if (reduceMotion) return
    const colour = crowd.geometry.attributes.color
    for (let n = 0; n < FLICKERS_PER_FRAME; n++) {
      const i = Math.floor(Math.random() * colour.count)
      const brightness = 0.3 + Math.random() * 0.7
      colour.setXYZ(
        i,
        crowd.base[i * 3] * brightness,
        crowd.base[i * 3 + 1] * brightness,
        crowd.base[i * 3 + 2] * brightness,
      )
    }
    colour.needsUpdate = true // tell three.js to send the changed colours to the GPU
  })

  return (
    <>
      <mesh geometry={stands.blocks}>
        <meshBasicMaterial color={BLACK} />
      </mesh>
      {/* No fog on the strips, so the far side stays visible */}
      <mesh geometry={stands.edges}>
        <meshBasicMaterial vertexColors fog={false} />
      </mesh>

      <points geometry={crowd.geometry}>
        <pointsMaterial vertexColors size={0.35} sizeAttenuation fog={false} />
      </points>
    </>
  )
}

// Your name in lights above the far (north) stand, built from dots like a
// stadium bulb sign, one light per dot. It sits just above the rim, low enough
// to stay in view along the top of the screen from the chase camera. After the
// boot screen clears it switches on a letter at a time
const SIGN_TEXT = 'CHARLES GOODSIR'
const SIGN_DOT = 0.5 // gap between bulbs
const SIGN_BASE = TIERS * STEP_RISE + 1 // just above the top step
const SIGN_DISTANCE = STAND_START + TIERS * STEP_DEPTH // the back of the stand
const SIGN_COLOUR = new Color(2.2, 3, 3.2) // cyan-white, above 1 so it blooms
const SECONDS_PER_LETTER = 0.12

// 5 × 7 dot patterns for the letters in the sign. # is a bulb. A letter that
// isn't here (or a space) is left blank
const LETTERS: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
}

// Bulb positions, letter by letter. letterEnds[i] is how many bulbs there are
// up to and including letter i, which the switch-on uses
function buildSign() {
  const positions: number[] = []
  const letterEnds: number[] = []
  const columns = SIGN_TEXT.length * 6 - 1 // 5 per letter plus a 1-column gap
  ;[...SIGN_TEXT].forEach((char, letter) => {
    LETTERS[char]?.forEach((row, y) =>
      [...row].forEach((cell, x) => {
        if (cell !== '#') return
        // Centred on x = 0, with row 0 at the top
        positions.push((letter * 6 + x - columns / 2) * SIGN_DOT, (6 - y) * SIGN_DOT, 0)
      }),
    )
    letterEnds.push(positions.length / 3)
  })
  return { positions, letterEnds }
}

export function NameSign({ booted }: { booted: boolean }) {
  const sign = useMemo(() => {
    const { positions, letterEnds } = buildSign()
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setDrawRange(0, 0) // all bulbs off until boot
    return { geometry, letterEnds }
  }, [])
  const switchedOnAt = useRef<number | null>(null)

  // Only draw the bulbs of the letters that are on so far
  useFrame(({ clock }) => {
    if (!booted) return
    switchedOnAt.current ??= clock.elapsedTime
    const lettersOn = reduceMotion
      ? SIGN_TEXT.length
      : Math.floor((clock.elapsedTime - switchedOnAt.current) / SECONDS_PER_LETTER) + 1
    const { letterEnds } = sign
    sign.geometry.setDrawRange(0, letterEnds[Math.min(lettersOn, letterEnds.length) - 1])
  })

  return (
    <points geometry={sign.geometry} position={[0, SIGN_BASE, -SIGN_DISTANCE]}>
      <pointsMaterial color={SIGN_COLOUR} size={0.45} sizeAttenuation fog={false} />
    </points>
  )
}
