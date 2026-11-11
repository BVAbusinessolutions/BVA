import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createSmallPlayGeometry, seededRandom } from '../../../lib/three/playGeometry'

const COUNT_WHITE = 26
const COUNT_BLUE = 10

function createItems(count, seed) {
  const random = seededRandom(seed)
  return Array.from({ length: count }, () => ({
    position: [(random() - 0.5) * 18, (random() - 0.5) * 9, -1 - random() * 7],
    rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI],
    speed: 0.15 + random() * 0.35,
    scale: 0.6 + random() * 0.9,
  }))
}

function PlayField({ count, seed, color, opacity, animate }) {
  const mesh = useRef()
  const geometry = useMemo(() => createSmallPlayGeometry(), [])
  const items = useMemo(() => createItems(count, seed), [count, seed])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const place = (time) => {
    if (!mesh.current) return
    items.forEach((item, index) => {
      const [x, y, z] = item.position
      dummy.position.set(x, y + Math.sin(time * item.speed + index) * 0.25, z)
      dummy.rotation.set(
        item.rotation[0] + time * item.speed * 0.6,
        item.rotation[1] + time * item.speed,
        item.rotation[2],
      )
      dummy.scale.setScalar(item.scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }

  useLayoutEffect(() => place(0))
  useFrame((state) => {
    if (animate) place(state.clock.elapsedTime)
  })

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]}>
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.35} />
    </instancedMesh>
  )
}

export default function PlayFieldScene({ active }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <PlayField count={COUNT_WHITE} seed={7} color="#F4F4F5" opacity={0.16} animate={active} />
      <PlayField count={COUNT_BLUE} seed={21} color="#2F5BFF" opacity={0.85} animate={active} />
    </Canvas>
  )
}
