// The Bit, the camera that follows it, and the ripple where you click
import { useRef, type RefObject } from 'react'
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
  CAMERA_OFFSET,
  DIVE_FOV,
  DIVE_OFFSET,
  FLY_IN_RATE,
  HOVER_HEIGHT,
  LOOK_HEIGHT,
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

export function Player({
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
