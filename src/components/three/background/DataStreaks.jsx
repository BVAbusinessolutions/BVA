import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { seededRandom } from '../../../lib/three/playGeometry'

const COUNT = 18
const SPAN = 60

function createStreaks() {
  const random = seededRandom(5)
  return Array.from({ length: COUNT }, () => ({
    y: (random() - 0.5) * 30,
    z: 1 + random() * 1.5,
    speed: 0.02 + random() * 0.05,
    offset: random(),
    length: 1.2 + random() * 2.4,
  }))
}

/** Trazos de luz que viajan sobre el paisaje, como datos en movimiento. Una sola malla instanciada. */
export default function DataStreaks({ reduced }) {
  const mesh = useRef()
  const streaks = useMemo(createStreaks, [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const time = reduced ? 0 : state.clock.elapsedTime
    streaks.forEach((streak, index) => {
      const travel = (time * streak.speed + streak.offset) % 1
      dummy.position.set(travel * SPAN - SPAN / 2, streak.y, streak.z)
      dummy.scale.set(streak.length, 1, 1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 0.03, 0.03]} />
      <meshBasicMaterial
        color="#7A95FF"
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}
