import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WAVE_FRAGMENT, WAVE_VERTEX } from '../../../lib/three/waveShader'
import { scrollProgress } from './scrollProgress'

/** Malla de ~24 000 puntos que ondula en la GPU. Al hacer scroll la "cámara" recorre el paisaje. */
export default function WaveField({ reduced }) {
  const group = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uSize: { value: 3.4 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.25) },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color('#2a4bd8') },
      uColorB: { value: new THREE.Color('#a5b8ff') },
    }),
    [],
  )

  useFrame((state, delta) => {
    const scroll = scrollProgress()
    uniforms.uTime.value = reduced ? 0 : state.clock.elapsedTime
    uniforms.uScroll.value = scroll
    const field = group.current
    field.rotation.z = THREE.MathUtils.damp(field.rotation.z, -0.15 + scroll * 0.5, 2, delta)
    field.position.y = THREE.MathUtils.damp(field.position.y, -3 + scroll * 4, 2, delta)
  })

  return (
    <group ref={group} position={[0, -3, -2]} rotation={[0, 0, -0.15]}>
      <points>
        <planeGeometry args={[60, 36, 200, 120]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={WAVE_VERTEX}
          fragmentShader={WAVE_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
