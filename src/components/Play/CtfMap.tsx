import { Canvas } from '@react-three/fiber'
import { Grid } from '@react-three/drei'

const MAP_SIZE = 40

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
      </Canvas>
    </div>
  )
}

export default CtfMap
