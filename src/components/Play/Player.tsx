// The Bit, the camera that follows it, and the ripple where you click
import { useEffect, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Trail } from '@react-three/drei'
import {
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type PerspectiveCamera,
} from 'three'
import {
  ANOMALY_POSITION,
  ANOMALY_RANGE,
  CAMERA_OFFSET,
  DIVE_FOV,
  DIVE_OFFSET,
  FLY_IN_RATE,
  HOVER_HEIGHT,
  LOOK_HEIGHT,
  MAP_SIZE,
  NEON_CYAN,
  PLAYER_SPEED,
  PREVIEW_RANGE,
  RIPPLE_SECONDS,
} from './constants'
import { flags, type MapFlag } from './flags'
import { reduceMotion } from './motion'

// Reused every frame so we don't create a new vector 60 times a second
const scratch = new Vector3()
const lookTarget = new Vector3() // where the camera is pointing
const lookGoal = new Vector3()

export type RippleState = { position: Vector3; start: number }

// One glowing ring on the floor, reused for every click: each click moves it
// and restarts it. Only one ripple at a time, which is all you ever see anyway
export function Ripple({ ripple }: { ripple: RefObject<RippleState> }) {
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

// Keyboard driving. Directions are fixed to the screen, which works because
// the camera never turns. e.code is the physical key, so WASD stays in the
// same place on AZERTY and other layouts. Values are [x, z]
const KEY_DIRECTIONS: Record<string, [number, number]> = {
  KeyW: [0, -1],
  ArrowUp: [0, -1],
  KeyS: [0, 1],
  ArrowDown: [0, 1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
}

// Keep the Bit (and anywhere it's heading) a unit inside the walls
const EDGE = MAP_SIZE / 2 - 1
const ARENA_MIN = new Vector3(-EDGE, 0, -EDGE)
const ARENA_MAX = new Vector3(EDGE, 0, EDGE)
const keyDirection = new Vector3()

export function Player({
  target,
  booted,
  captured,
  onNear,
  onAnomaly,
  position,
}: {
  target: RefObject<Vector3>
  booted: boolean
  captured: MapFlag | null
  onNear: (flag: MapFlag | null) => void
  onAnomaly: (inRange: boolean) => void
  position: RefObject<Vector3> // kept up to date with where the Bit is, for CtfMap
}) {
  const ref = useRef<Group>(null)
  const flyingIn = useRef(!reduceMotion)
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const near = useRef<MapFlag | null>(null)
  const atAnomaly = useRef(false)
  const heldKeys = useRef(new Set<string>())

  // Track which driving keys are held down
  useEffect(() => {
    const held = heldKeys.current
    const down = (e: KeyboardEvent) => {
      if (!(e.code in KEY_DIRECTIONS)) return
      e.preventDefault() // stop arrow keys scrolling the page
      held.add(e.code)
    }
    const up = (e: KeyboardEvent) => held.delete(e.code)
    // Switching tabs mid-press means the key-up never arrives. Without this
    // the Bit would keep driving on its own when you come back
    const clear = () => held.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])

  // Runs once per frame. delta = seconds since the last frame
  useFrame(({ camera, clock }, delta) => {
    const player = ref.current
    if (!player) return

    // Keyboard: while keys are held, keep the target one unit ahead in that
    // direction. That replaces any click target, and the normal movement below
    // does the rest (speed, turning, leaning). Let go and the Bit coasts that
    // last unit and stops. Diagonals are normalised so they aren't faster
    keyDirection.set(0, 0, 0)
    if (booted && !captured) {
      for (const code of heldKeys.current) {
        const [x, z] = KEY_DIRECTIONS[code]
        keyDirection.x += x
        keyDirection.z += z
      }
    }
    if (keyDirection.lengthSq() > 0) {
      target.current.copy(player.position).add(keyDirection.normalize())
    }
    target.current.clamp(ARENA_MIN, ARENA_MAX)

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

    position.current.copy(player.position)

    // Which flag (if any) is in range? Only tell React when that changes,
    // not 60 times a second
    const flag =
      flags.find((f) => f.position.distanceTo(player.position) < PREVIEW_RANGE) ?? null
    if (flag !== near.current) {
      near.current = flag
      onNear(flag)
    }

    // Same for the hidden anomaly
    const inRange = player.position.distanceTo(ANOMALY_POSITION) < ANOMALY_RANGE
    if (inRange !== atAnomaly.current) {
      atAnomaly.current = inRange
      onAnomaly(inRange)
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

    // Ease the camera toward its spot behind the player, always looking just
    // above the player. During the fly-in it eases slower, which makes the sweep
    lookTarget.set(player.position.x, LOOK_HEIGHT, player.position.z)
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
