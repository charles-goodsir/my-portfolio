import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate } from 'react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Edges,
  Grid,
  Html,
  MeshReflectorMaterial,
  PerformanceMonitor,
  Trail,
} from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import {
  AdditiveBlending,
  BackSide,
  Color,
  CylinderGeometry,
  Float32BufferAttribute,
  DoubleSide,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type PerspectiveCamera,
} from 'three'
import { navItems } from '../ui/navItems'
import { cyberDiaryEntries } from '../../data/cyberDiaryEntries'

const MAP_SIZE = 40
const FLAG_RING_RADIUS = 12
const PLAYER_SPEED = 8 // units per second
const PREVIEW_RANGE = 3 // how close the player must get for a flag's hologram to open
const STOP_SHORT = 2 // clicking a flag parks this far in front of it, inside PREVIEW_RANGE
const CAPTURE_SECONDS = 1 // how long the capture effect plays before the page changes
const HOVER_HEIGHT = 0.9 // how high the Bit floats
const RIPPLE_SECONDS = 0.6 // how long the click ring takes to expand and fade
const CAMERA_OFFSET = new Vector3(0, 14, 14) // camera sits this far from the player
// Opening shot: high up on the far side of the arena. After boot the camera
// sweeps from here down to its normal spot, turning to keep the Bit in view
const FLY_IN_START = new Vector3(-24, 30, -16)
const FLY_IN_RATE = 1.5 // lower = slower sweep. The normal follow uses 4
const DIVE_OFFSET = new Vector3(0, 3, 5) // on capture the camera dives to here, relative to the flag
const DIVE_FOV = 85 // lens widens from 50 to this during the dive, for a warp feel
const GLOW_COLOUR = '#e0fbff' // the cyan-white the screen fades to on exit

// Colour channels above 1 are "brighter than white". Bloom only picks up
// pixels above 1, so these glow and everything at or below 1 stays dark
const NEON_CYAN = new Color(0, 2.5, 3)
const DIM_CYAN = new Color(0, 0.25, 0.3)
const NEON_ORANGE = new Color(3, 0.8, 0) // Tron's "other team"
const BEAM_ORANGE = new Color(1, 0.35, 0) // below 1, so the beam stays soft
const BEAM_CYAN = new Color(0, 0.5, 0.6) // a captured flag's beam
const WALL_CYAN = new Color(0, 0.6, 0.7)
const WHITE_HOT = new Color(6, 6, 6) // the flash on capture

// Shared look for the HTML overlays: dark glass panel, glowing cyan text
const HUD_PANEL = 'rounded border border-[#2dd4bf]/40 bg-black/70 font-mono'
const HUD_GLOW = 'text-[#2dd4bf] [text-shadow:0_0_8px_#2dd4bf]'

// Read once on load. If the visitor asked for less motion, the camera jumps instead of gliding
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Captured flags are remembered for this browser tab, so they stay cyan after
// you visit a page and come back. Storage can be blocked (private mode,
// strict settings), so every read and write is wrapped and fails quietly
const STORAGE_KEY = 'ctf-captured'

function loadCaptured(): string[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function saveCaptured(routes: string[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(routes))
  } catch {
    // Storage blocked: the tracker just won't survive a page change
  }
}

// Rendering resolution range. dpr = device pixel ratio: 2 on a retina screen
// means 4 pixels per CSS pixel. No point going above what the screen has
const MIN_DPR = 0.5
const MAX_DPR = Math.min(2, window.devicePixelRatio)

// Reused every frame so we don't create a new vector 60 times a second
const scratch = new Vector3()
const lookTarget = new Vector3() // where the camera is pointing
const lookGoal = new Vector3()

const latestEntry = [...cyberDiaryEntries].sort((a, b) => b.date.localeCompare(a.date))[0]

// What each flag's hologram says. Diary numbers come from the real data
const previews: Record<string, string> = {
  '/about': "My story and the roles I'm targeting. CV download.",
  '/experience': 'Software Application Engineer at Datacom since 2021. Education and certifications.',
  '/projects': 'AppSec homelab, a secure Azure landing zone, and earlier web builds.',
  '/diary': `${cyberDiaryEntries.length} entries. Latest: ${latestEntry.title}`,
  '/owasp': 'My notes on each of the 10 risks.',
  '/contact': 'Email, LinkedIn and GitHub.',
}

// Every nav page except Home becomes a flag, spaced evenly round a circle
const flags = navItems
  .filter((item) => item.to !== '/')
  .map((item, i, all) => {
    const angle = (i / all.length) * Math.PI * 2
    const position = new Vector3(Math.sin(angle), 0, -Math.cos(angle)).multiplyScalar(
      FLAG_RING_RADIUS,
    )
    return {
      ...item,
      preview: previews[item.to] ?? '',
      position,
      // Where the player parks when you click this flag: STOP_SHORT units
      // from the pole, on the side facing the centre of the arena.
      // ponytail: always the inner side, so coming from behind the ring the
      // Bit passes through the pole. Use the player's position if that matters
      approach: position.clone().multiplyScalar((FLAG_RING_RADIUS - STOP_SHORT) / FLAG_RING_RADIUS),
    }
  })

type MapFlag = (typeof flags)[number]

function Flag({
  label,
  preview,
  position,
  nearby,
  owned,
  captured,
  onClick,
  onEnter,
}: {
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

  useFrame(({ clock }) => {
    const now = clock.elapsedTime

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

      {/* In range: the label opens into a hologram panel you can click.
          Otherwise just the name */}
      <Html position-y={nearby ? 5 : 3.5} center>
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

// The four arena walls sit on the edges of the floor: [x, z, rotation]
const HALF = MAP_SIZE / 2
const walls: [number, number, number][] = [
  [0, -HALF, 0],
  [0, HALF, 0],
  [-HALF, 0, Math.PI / 2],
  [HALF, 0, Math.PI / 2],
]

function Walls() {
  return walls.map(([x, z, rotation]) => (
    <group key={`${x},${z}`} position={[x, 0, z]} rotation-y={rotation}>
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

function Traffic() {
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
const HORIZON_GLOW = new Color(0, 0.35, 0.45)
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

function Horizon() {
  // A tall open cylinder round the whole world. Its bottom edge is coloured
  // glow and its top edge black, and the GPU blends between them: a gradient
  const glow = useMemo(() => {
    const geometry = new CylinderGeometry(HORIZON_RADIUS, HORIZON_RADIUS, 30, 64, 1, true)
    geometry.translate(0, 15, 0) // sit it on the ground instead of centred on it
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

type RippleState = { position: Vector3; start: number }

// One glowing ring on the floor, reused for every click: each click moves it
// and restarts it. Only one ripple at a time, which is all you ever see anyway
function Ripple({ ripple }: { ripple: RefObject<RippleState> }) {
  const mesh = useRef<Mesh>(null)
  const material = useRef<MeshBasicMaterial>(null)

  useFrame(() => {
    if (!mesh.current || !material.current) return
    const progress = (performance.now() / 1000 - ripple.current.start) / RIPPLE_SECONDS
    mesh.current.visible = progress < 1
    if (progress >= 1) return

    mesh.current.position.copy(ripple.current.position)
    // Grows from small to 2 units wide. Reduced motion: stays put and just fades
    mesh.current.scale.setScalar(reduceMotion ? 1 : 0.2 + progress * 1.8)
    material.current.opacity = 1 - progress
  })

  return (
    // A flat ring, tipped flat like the floor, just above the grid
    <mesh ref={mesh} rotation-x={-Math.PI / 2} visible={false}>
      <ringGeometry args={[0.9, 1, 48]} />
      <meshBasicMaterial
        ref={material}
        color={NEON_CYAN}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function Player({
  target,
  booted,
  captured,
  onNear,
}: {
  target: RefObject<Vector3>
  booted: boolean
  captured: MapFlag | null
  onNear: (flag: MapFlag | null) => void
}) {
  const ref = useRef<Group>(null)
  const flyingIn = useRef(!reduceMotion)
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const near = useRef<MapFlag | null>(null)

  // Runs once per frame. delta = seconds since the last frame
  useFrame(({ camera, clock }, delta) => {
    const player = ref.current
    if (!player) return

    // Step toward the target, or land on it if this step would overshoot
    const toTarget = scratch.copy(target.current).sub(player.position)
    const distance = toTarget.length()
    const step = PLAYER_SPEED * delta
    const moving = distance > step
    if (moving) {
      player.position.addScaledVector(toTarget, step / distance)
      // Turn to face the direction of travel (+z counts as "forward")
      player.rotation.y = Math.atan2(toTarget.x, toTarget.z)
    } else {
      player.position.copy(target.current)
    }

    // Lean into the direction of travel, and ease back upright on stopping
    if (tilt.current) {
      const lean = moving ? 0.4 : 0
      tilt.current.rotation.x += (lean - tilt.current.rotation.x) * (1 - Math.exp(-8 * delta))
      // Gentle hover
      if (!reduceMotion) {
        tilt.current.position.y = HOVER_HEIGHT + Math.sin(clock.elapsedTime * 2) * 0.08
      }
    }

    // Slow spin
    if (spin.current && !reduceMotion) spin.current.rotation.y += delta * 1.2

    // Which flag (if any) is in range? Only tell React when that changes,
    // not 60 times a second
    const flag =
      flags.find((f) => f.position.distanceTo(player.position) < PREVIEW_RANGE) ?? null
    if (flag !== near.current) {
      near.current = flag
      onNear(flag)
    }

    if (captured && !reduceMotion) {
      // Exit dive: swoop at the flag, turn to look at its cloth, widen the lens
      const ease = 1 - Math.exp(-3 * delta)
      camera.position.lerp(scratch.copy(captured.position).add(DIVE_OFFSET), ease)
      lookGoal.copy(captured.position).setY(2.6)
      lookTarget.lerp(lookGoal, ease * 2)
      camera.lookAt(lookTarget)
      const lens = camera as PerspectiveCamera
      lens.fov += (DIVE_FOV - lens.fov) * ease
      lens.updateProjectionMatrix() // fov changes only apply after this
      return
    }

    // Hold the opening shot until the boot screen has cleared
    if (!booted) return

    // Ease the camera toward its spot behind the player, always looking at
    // the player. During the fly-in it eases slower, which makes the sweep
    lookTarget.copy(player.position)
    const cameraGoal = scratch.copy(player.position).add(CAMERA_OFFSET)
    if (reduceMotion) {
      camera.position.copy(cameraGoal)
    } else {
      const rate = flyingIn.current ? FLY_IN_RATE : 4
      camera.position.lerp(cameraGoal, 1 - Math.exp(-rate * delta))
      if (camera.position.distanceTo(cameraGoal) < 0.5) flyingIn.current = false
    }
    camera.lookAt(lookTarget)
  })

  return (
    <group ref={ref} scale={1.5}>
      {/* The Bit, from the 1982 Tron. Three nested groups so each motion
          stays separate: the outer one moves and turns, this one leans and
          hovers, the inner one spins */}
      <group ref={tilt} position-y={HOVER_HEIGHT}>
        <group ref={spin}>
          {/* Shell: a dark, see-through 20-sided crystal with neon edges */}
          <mesh>
            <icosahedronGeometry args={[0.45]} />
            <meshStandardMaterial color="#05080f" transparent opacity={0.6} />
            <Edges color={NEON_CYAN} />
          </mesh>
          {/* Core: a small glowing 8-sided crystal inside */}
          <mesh>
            <octahedronGeometry args={[0.18]} />
            <meshBasicMaterial color={NEON_CYAN} />
          </mesh>
        </group>
      </group>

      {/* Light trail. Trail follows the (invisible) point it wraps,
          here the centre of the Bit */}
      <Trail
        width={1.2}
        length={8}
        color={NEON_CYAN}
        attenuation={(t) => t * t}
      >
        <mesh position-y={HOVER_HEIGHT} />
      </Trail>
    </group>
  )
}

function CtfMap({ booted, onReady }: { booted: boolean; onReady: () => void }) {
  const target = useRef(new Vector3())
  const ripple = useRef<RippleState>({ position: new Vector3(), start: -Infinity })

  // Send the player somewhere and ripple the floor there
  const moveTo = (x: number, z: number) => {
    target.current.set(x, 0, z)
    ripple.current.position.set(x, 0.02, z)
    ripple.current.start = performance.now() / 1000
  }
  const [nearby, setNearby] = useState<MapFlag | null>(null)
  const [captured, setCaptured] = useState<MapFlag | null>(null)
  const [savedRoutes] = useState(loadCaptured) // read once, when the map opens
  const [dpr, setDpr] = useState((MIN_DPR + MAX_DPR) / 2)
  const [lowQuality, setLowQuality] = useState(false)
  const navigate = useNavigate()

  // After a capture, pause a moment so the message is readable, then go
  useEffect(() => {
    if (!captured) return
    saveCaptured([...new Set([...savedRoutes, captured.to])])
    const timer = setTimeout(
      // fromGame tells the page to fade in out of the glow (see RootLayout)
      () => navigate(captured.to, { state: { fromGame: true } }),
      CAPTURE_SECONDS * 1000,
    )
    return () => clearTimeout(timer)
  }, [captured, navigate, savedRoutes])

  // Flags that are yours: saved ones plus the one being captured right now
  const owned = new Set(savedRoutes)
  if (captured) owned.add(captured.to)
  const ownedCount = flags.filter((f) => owned.has(f.to)).length

  // Escape leaves the game. Enter goes into the flag you're next to
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
      if (e.key === 'Enter' && nearby) setCaptured(nearby)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, nearby])

  return (
    // isolate: drei's <Html> labels use huge z-index values. This keeps them
    // stacked inside the map so the boot screen can still cover them
    <div className="relative isolate h-screen w-screen bg-black">
      <Canvas
        dpr={dpr}
        camera={{ position: (reduceMotion ? CAMERA_OFFSET : FLY_IN_START).toArray(), fov: 50 }}
        onCreated={onReady} // WebGL is up: the boot screen can fade out
      >
        {/* Watches the frame rate. factor drifts from 0 (struggling) to 1
            (plenty of headroom) and we map it onto the resolution. If it
            bottoms out, or keeps flip-flopping, turn reflections off for good */}
        <PerformanceMonitor
          onChange={({ factor }) => {
            setDpr(Math.round((MIN_DPR + (MAX_DPR - MIN_DPR) * factor) * 10) / 10)
            // < 0.05 not === 0: stepping down by 0.1 leaves float crumbs like 2.7e-17
            if (factor < 0.05) setLowQuality(true)
          }}
          onFallback={() => setLowQuality(true)}
        />

        <color attach="background" args={['#000000']} />
        {/* Anything past 20 units from the camera fades to black by 50 */}
        <fog attach="fog" args={['#000000', 20, 50]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 5]} intensity={1.2} />

        {/* Ground: a plane lies upright by default, so tip it flat.
            Clicking it sets where the player walks to. */}
        <mesh
          rotation-x={-Math.PI / 2}
          onClick={(e) => moveTo(e.point.x, e.point.z)}
        >
          <planeGeometry args={[MAP_SIZE, MAP_SIZE]} />
          {/* Glossy black floor. Each frame the scene is drawn a second time
              from below, into a 512px texture, and blurred onto the floor.
              The shader does: floor colour × (1 - mirror + reflection × mixStrength),
              so a near-black floor needs a big mixStrength or the
              reflection multiplies down to nothing. Neutral grey so orange
              reflects as well as cyan */}
          {lowQuality ? (
            <meshStandardMaterial color="#020409" />
          ) : (
            <MeshReflectorMaterial
              color="#101010"
              resolution={512}
              blur={[300, 100]} // blur across / along the floor
              mixBlur={1} // how much the blur softens the reflection
              mixStrength={50} // reflection brightness
              mirror={0.5} // 0 = matte, 1 = perfect mirror
              roughness={0.8}
              metalness={0.5}
            />
          )}
        </mesh>

        {/* Grid lines sit just above the ground so they don't flicker */}
        <Grid
          position-y={0.01}
          args={[MAP_SIZE, MAP_SIZE]}
          cellColor={DIM_CYAN}
          sectionColor={NEON_CYAN}
          sectionSize={5}
          fadeDistance={45}
        />

        {flags.map((flag) => (
          <Flag
            key={flag.to}
            label={flag.label}
            preview={flag.preview}
            position={flag.position}
            nearby={nearby === flag}
            owned={owned.has(flag.to)}
            captured={captured === flag}
            // Far away: walk there. Already there: go in
            onClick={() =>
              nearby === flag ? setCaptured(flag) : moveTo(flag.approach.x, flag.approach.z)
            }
            onEnter={() => setCaptured(flag)}
          />
        ))}

        <Walls />

        <Ripple ripple={ripple} />

        <Traffic />

        <Horizon />

        <Player target={target} booted={booted} captured={captured} onNear={setNearby} />

        {/* Bloom runs after the scene is drawn and blurs light out of
            every pixel brighter than the threshold */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
          {/* Darkens the screen corners to pull the eye to the centre */}
          <Vignette offset={0.3} darkness={0.8} />
        </EffectComposer>
      </Canvas>

      <Link
        to="/"
        className={`absolute left-4 top-4 px-3 py-1 text-sm hover:underline ${HUD_PANEL} ${HUD_GLOW}`}
      >
        Exit (Esc)
      </Link>

      <p className={`absolute right-4 top-4 px-3 py-1 text-sm ${HUD_PANEL} ${HUD_GLOW}`}>
        {ownedCount}/{flags.length} captured
      </p>

      {/* Plain links to every page, for keyboard and screen reader users
          or anyone who would rather not play */}
      <nav
        aria-label="Pages"
        className={`absolute bottom-4 left-4 px-3 py-2 text-xs ${HUD_PANEL}`}
      >
        <ul className="space-y-1">
          {flags.map((flag) => (
            <li key={flag.to}>
              <Link to={flag.to} className="text-[#94a3b8] hover:text-[#2dd4bf] hover:underline">
                {flag.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* role="status" makes screen readers announce the capture */}
      <div
        role="status"
        className={`pointer-events-none absolute inset-x-0 top-1/3 text-center font-mono text-2xl ${HUD_GLOW}`}
      >
        {captured && `Flag captured: ${captured.label}`}
        {!captured && nearby && (
          <span className="sr-only">{nearby.label} in range. Press Enter to go in.</span>
        )}
      </div>

      {/* Exit glow: on capture the screen fades to cyan-white over the second
          half of the effect, so the page change happens under it */}
      {!reduceMotion && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity ${
            captured ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundColor: GLOW_COLOUR,
            transitionDuration: `${CAPTURE_SECONDS * 500}ms`,
            transitionDelay: captured ? `${CAPTURE_SECONDS * 500}ms` : '0ms',
          }}
        />
      )}
    </div>
  )
}

export default CtfMap
