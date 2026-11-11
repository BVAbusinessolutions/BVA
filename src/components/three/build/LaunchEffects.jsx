import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DataParticles from './DataParticles'
import NotificationChip from './NotificationChip'
import { range } from '../../../lib/three/easing'
import { PHASES } from '../../../lib/three/buildLayout'
import { getGlowTexture } from '../../../lib/three/glowTexture'

/** "Lo ponemos en marcha": brillo detrás de la ventana, onda de lanzamiento, datos y avisos. */
export default function LaunchEffects({ progress }) {
  const glow = useRef()
  const ring = useRef()
  const ringMaterial = useRef()

  useFrame((state) => {
    const launch = range(progress.current, ...PHASES.launch)
    glow.current.opacity = launch * 0.55

    const wave = (state.clock.elapsedTime * 0.45) % 1
    ring.current.visible = launch > 0.01
    ring.current.scale.setScalar(0.6 + wave * 2)
    ringMaterial.current.opacity = launch * (1 - wave) * 0.6
  })

  return (
    <group>
      <sprite position={[0, 0, -0.6]} scale={[8, 6, 1]}>
        <spriteMaterial
          ref={glow}
          map={getGlowTexture()}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh ref={ring} position={[0, 0, 0.2]} visible={false}>
        <ringGeometry args={[1, 1.03, 96]} />
        <meshBasicMaterial
          ref={ringMaterial}
          color="#7A95FF"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <DataParticles progress={progress} />
      <NotificationChip progress={progress} position={[2.35, 1.15, 0.9]} delay={0} />
      <NotificationChip progress={progress} position={[-2.45, -0.95, 1.1]} delay={0.15} />
    </group>
  )
}
