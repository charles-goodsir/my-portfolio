import { Canvas } from '@react-three/fiber'
import { Grid, Html } from '@react-three/drei'
import { navItems } from '../ui/navItems'

const MAP_SIZE = 40
const FLAG_RING_RADIUS = 12

// Every nav page except Home becomes a flag, spaced evenly round a circle
const flags = navItems
  .filter((item) => item.to !== '/')
  .map((item, i, all) => {
    const angle = (i / all.length) * Math.PI * 2
    return {
      ...item,
      position: [
        Math.sin(angle) * FLAG_RING_RADIUS,
        0,
        -Math.cos(angle) * FLAG_RING_RADIUS,
      ] as [number, number, number],
    }
  })

function Flag({
  label,
  position,
}: {
  label: string
  position: [number, number, number]
}) {
  return (
    <group position={position}>
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

function CtfMap() {
  return (
    <div className="h-screen w-screen bg-[#0b1120]">
      <Canvas camera={{ position: [0, 14, 14], fov: 50 }}>
        <color attach="background" args={['#0b1120']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 5]} intensity={1.2} />

        {/* Ground: a plane lies upright by default, so tip it flat */}
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[MAP_SIZE, MAP_SIZE]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        {/* Grid lines sit just above the ground so they don't flicker */}
        <Grid
          position-y={0.01}
          args={[MAP_SIZE, MAP_SIZE]}
          cellColor="#1e293b"
          sectionColor="#2dd4bf"
          sectionSize={5}
          fadeDistance={45}
        />

        {flags.map((flag) => (
          <Flag key={flag.to} label={flag.label} position={flag.position} />
        ))}
      </Canvas>
    </div>
  )
}

export default CtfMap
