import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, useNavigate } from 'react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, Html, Trail } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Color, Vector3, type Group } from 'three'
import { navItems } from '../ui/navItems'

const MAP_SIZE = 40
const FLAG_RING_RADIUS = 12
const PLAYER_SPEED = 8 // units per second
const CAPTURE_RANGE = 1.5 // how close the player must get to a flag
const CAMERA_OFFSET = new Vector3(0, 14, 14) // camera sits this far from the player

// Colour channels above 1 are "brighter than white". Bloom only picks up
// pixels above 1, so these glow and everything at or below 1 stays dark
const NEON_CYAN = new Color(0, 2.5, 3)
const DIM_CYAN = new Color(0, 0.25, 0.3)

// Read once on load. If the visitor asked for less motion, the camera jumps instead of gliding
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Reused every frame so we don't create a new vector 60 times a second
const scratch = new Vector3()

// Every nav page except Home becomes a flag, spaced evenly round a circle
const flags = navItems
  .filter((item) => item.to !== '/')
  .map((item, i, all) => {
    const angle = (i / all.length) * Math.PI * 2
    return {
      ...item,
      position: new Vector3(
        Math.sin(angle) * FLAG_RING_RADIUS,
        0,
        -Math.cos(angle) * FLAG_RING_RADIUS,
      ),
    }
  })

type MapFlag = (typeof flags)[number]

function Flag({
  label,
  position,
  onClick,
}: {
  label: string
  position: Vector3
  onClick: () => void
}) {
  return (
    <group
      position={position}
      onClick={(e) => {
        // Stop the click reaching the ground behind the flag
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Pole: cylinders are centred on their middle, so lift by half the height */}
      <mesh position-y={1.5}>
        <cylinderGeometry args={[0.08, 0.08, 3]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Cloth: a thin box hanging off the top of the pole */}
      <mesh position={[0.6, 2.6, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#2dd4bf" />
      </mesh>

      <Html position-y={3.5} center>
        <div className="pointer-events-none whitespace-nowrap rounded bg-[#0b1120]/80 px-2 py-0.5 font-mono text-xs text-[#2dd4bf]">
          {label}
        </div>
      </Html>
    </group>
  )
}

function Player({
  target,
  onCapture,
}: {
  target: RefObject<Vector3>
  onCapture: (flag: MapFlag) => void
}) {
  const ref = useRef<Group>(null)
  const captured = useRef(false)

  // Runs once per frame. delta = seconds since the last frame
  useFrame(({ camera }, delta) => {
    const player = ref.current
    if (!player) return

    // Step toward the target, or land on it if this step would overshoot
    const toTarget = scratch.copy(target.current).sub(player.position)
    const distance = toTarget.length()
    const step = PLAYER_SPEED * delta
    if (distance <= step) {
      player.position.copy(target.current)
    } else {
      player.position.addScaledVector(toTarget, step / distance)
      // Face the direction of travel. The bike is built pointing along +z
      player.rotation.y = Math.atan2(toTarget.x, toTarget.z)
    }

    // Close enough to a flag? Capture it, once
    if (!captured.current) {
      const flag = flags.find(
        (f) => f.position.distanceTo(player.position) < CAPTURE_RANGE,
      )
      if (flag) {
        captured.current = true
        onCapture(flag)
      }
    }

    // Ease the camera toward its spot behind the player
    const cameraGoal = scratch.copy(player.position).add(CAMERA_OFFSET)
    if (reduceMotion) camera.position.copy(cameraGoal)
    else camera.position.lerp(cameraGoal, 1 - Math.exp(-4 * delta))
  })

  return (
    <group ref={ref}>
      {/* Body: a long, low dark box */}
      <mesh position-y={0.35}>
        <boxGeometry args={[0.35, 0.3, 1.3]} />
        <meshStandardMaterial color="#05080f" />
      </mesh>

      {/* Neon stripe along the top */}
      <mesh position-y={0.51}>
        <boxGeometry args={[0.08, 0.02, 1.1]} />
        <meshBasicMaterial color={NEON_CYAN} />
      </mesh>

      {/* Wheels: glowing rings. A torus lies flat facing the camera by
          default, so turn it side-on */}
      {[0.55, -0.55].map((z) => (
        <mesh key={z} position={[0, 0.3, z]} rotation-y={Math.PI / 2}>
          <torusGeometry args={[0.28, 0.05, 8, 24]} />
          <meshBasicMaterial color={NEON_CYAN} />
        </mesh>
      ))}

      {/* Light trail. Trail follows the (invisible) point it wraps,
          here the back of the bike */}
      <Trail
        width={1.2}
        length={8}
        color={NEON_CYAN}
        attenuation={(t) => t * t}
      >
        <mesh position={[0, 0.3, -0.7]} />
      </Trail>
    </group>
  )
}

function CtfMap() {
  const target = useRef(new Vector3())
  const [captured, setCaptured] = useState<MapFlag | null>(null)
  const navigate = useNavigate()

  // After a capture, pause a moment so the message is readable, then go
  useEffect(() => {
    if (!captured) return
    const timer = setTimeout(() => navigate(captured.to), 1000)
    return () => clearTimeout(timer)
  }, [captured, navigate])

  // Escape leaves the game
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="relative h-screen w-screen bg-black">
      <Canvas camera={{ position: CAMERA_OFFSET.toArray(), fov: 50 }}>
        <color attach="background" args={['#000000']} />
        {/* Anything past 20 units from the camera fades to black by 50 */}
        <fog attach="fog" args={['#000000', 20, 50]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 5]} intensity={1.2} />

        {/* Ground: a plane lies upright by default, so tip it flat.
            Clicking it sets where the player walks to. */}
        <mesh
          rotation-x={-Math.PI / 2}
          onClick={(e) => target.current.set(e.point.x, 0, e.point.z)}
        >
          <planeGeometry args={[MAP_SIZE, MAP_SIZE]} />
          <meshStandardMaterial color="#020409" />
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
            position={flag.position}
            onClick={() => target.current.copy(flag.position)}
          />
        ))}

        <Player target={target} onCapture={setCaptured} />

        {/* Bloom runs after the scene is drawn and blurs light out of
            every pixel brighter than the threshold */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <Link
        to="/"
        className="absolute left-4 top-4 rounded bg-[#0b1120]/80 px-3 py-1 font-mono text-sm text-[#2dd4bf] hover:underline"
      >
        Exit (Esc)
      </Link>

      {/* Plain links to every page, for keyboard and screen reader users
          or anyone who would rather not play */}
      <nav
        aria-label="Pages"
        className="absolute bottom-4 left-4 rounded bg-[#0b1120]/80 px-3 py-2 font-mono text-xs"
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
        className="pointer-events-none absolute inset-x-0 top-1/3 text-center font-mono text-2xl text-[#2dd4bf]"
      >
        {captured && `Flag captured: ${captured.label}`}
      </div>
    </div>
  )
}

export default CtfMap
