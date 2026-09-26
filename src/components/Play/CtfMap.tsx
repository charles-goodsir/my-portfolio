import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Canvas } from '@react-three/fiber'
import { Grid, MeshReflectorMaterial, PerformanceMonitor } from '@react-three/drei'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Scanline,
  Vignette,
} from '@react-three/postprocessing'
import { Vector3 } from 'three'
import {
  CAMERA_OFFSET,
  CAPTURE_SECONDS,
  DIM_CYAN,
  FLY_IN_START,
  FRINGE_OFFSET,
  GLOW_COLOUR,
  HUD_FONT,
  HUD_GLOW,
  HUD_PANEL,
  MAP_SIZE,
  NEON_CYAN,
} from './constants'
import { flags, loadCaptured, saveCaptured, type MapFlag } from './flags'
import Flag from './Flag'
import { Player, Ripple, type RippleState } from './Player'
import { Horizon, Traffic, Walls } from './Scenery'
import { reduceMotion } from './motion'

// Rendering resolution range. dpr = device pixel ratio: 2 on a retina screen
// means 4 pixels per CSS pixel. No point going above what the screen has
const MIN_DPR = 0.5
const MAX_DPR = Math.min(2, window.devicePixelRatio)

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
        {/* Anything past 30 units from the camera fades to black by 70.
            Far enough that flags across the arena stay visible from low down */}
        <fog attach="fog" args={['#000000', 30, 70]} />
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
          fadeDistance={70}
        />

        {flags.map((flag) => (
          <Flag
            key={flag.to}
            route={flag.to}
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
          {/* Colour fringing: red and blue split slightly apart, like an old
              lens. radialModulation keeps the centre clean, fringing only
              towards the edges */}
          <ChromaticAberration
            offset={FRINGE_OFFSET}
            radialModulation
            modulationOffset={0.4}
          />
          {/* Horizontal lines like a CRT monitor */}
          <Scanline density={1.5} opacity={0.08} />
          {/* Film grain. premultiply scales it by the pixel's brightness, so
              black stays black and only lit areas get grain. The grain
              changes every frame, so it's off for reduced motion */}
          <Noise premultiply opacity={reduceMotion ? 0 : 0.3} />
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
        className={`pointer-events-none absolute inset-x-0 top-1/3 text-center text-2xl ${HUD_FONT} ${HUD_GLOW}`}
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
