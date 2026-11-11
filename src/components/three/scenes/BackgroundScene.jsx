import { Canvas } from '@react-three/fiber'
import WaveField from '../background/WaveField'
import DataStreaks from '../background/DataStreaks'
import GlowLights from '../background/GlowLights'

/**
 * Fondo animado de todo el sitio: un paisaje de datos en ondas, trazos de luz que lo recorren
 * y halos azules. Canvas opaco (más barato de componer) y resolución limitada para cuidar la batería.
 */
export default function BackgroundScene({ reduced }) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 12], fov: 50 }}
      frameloop={reduced ? 'demand' : 'always'}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor('#0a0a0b')}
    >
      <GlowLights />
      <group rotation={[-1.2, 0, 0]}>
        <WaveField reduced={reduced} />
        <DataStreaks reduced={reduced} />
      </group>
    </Canvas>
  )
}
