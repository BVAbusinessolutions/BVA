import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { range } from '../../../lib/three/easing'
import { FRAME, PHASES } from '../../../lib/three/buildLayout'
import { seededRandom } from '../../../lib/three/playGeometry'

const COUNT = 48
const TRAVEL = 4

function createParticles() {
  const random = seededRandom(9)
  return Array.from({ length: COUNT }, () => {
    const direction = new THREE.Vector3(random() - 0.5, random() - 0.5, 0.4 + random()).normalize()
    return {
      origin: new THREE.Vector3(
        (random() - 0.5) * FRAME.width * 0.9,
        (random() - 0.5) * FRAME.height * 0.8,
        0.1,
      ),
      direction,
      speed: 0.25 + random() * 0.35,
      offset: random(),
    }
  })
}

/** Datos que salen de la página publicada: una sola malla instanciada (un solo dibujo en la GPU). */
export default function DataParticles({ progress }) {
  const mesh = useRef()
  const particles = useMemo(createParticles, [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const launch = range(progress.current, ...PHASES.launch)
    mesh.current.visible = launch > 0.01
    if (!mesh.current.visible) return
    const time = state.clock.elapsedTime
    particles.forEach((particle, index) => {
      const travel = (time * particle.speed + particle.offset) % 1
      dummy.position.copy(particle.origin).addScaledVector(particle.direction, travel * TRAVEL)
      dummy.scale.setScalar(launch * (1 - travel) * 0.05 + 0.0001)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} visible={false}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color="#7A95FF" />
    </instancedMesh>
  )
}
