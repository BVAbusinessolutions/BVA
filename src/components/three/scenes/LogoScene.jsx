import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import {
  LOGO_SCALE,
  LOWER_PLAY,
  UPPER_PLAY,
  createPlayGeometry,
} from '../../../lib/three/playGeometry'

const DEPTH = 0.55
const PRESS_EVERY = 6 // segundos entre cada "play"
const easeOutCubic = (x) => 1 - (1 - x) ** 3

function BrandMaterial({ color }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.28}
      metalness={0.05}
      clearcoat={1}
      clearcoatRoughness={0.18}
    />
  )
}

function PlayPrism({ points, color }) {
  const geometry = useMemo(() => createPlayGeometry(points, { depth: DEPTH }), [points])
  return (
    <mesh geometry={geometry}>
      <BrandMaterial color={color} />
    </mesh>
  )
}

function LogoModel({ reduced }) {
  const group = useRef()
  const lowerPlay = useRef()
  const startedAt = useRef(null)

  useFrame((state, delta) => {
    const model = group.current
    if (!model || !lowerPlay.current) return
    const time = state.clock.elapsedTime
    if (startedAt.current === null) startedAt.current = time
    const local = time - startedAt.current

    if (reduced) {
      model.rotation.set(-0.08, -0.35, 0)
      lowerPlay.current.position.x = 0
      return
    }

    // El logo sigue suavemente al puntero
    const targetY = -0.35 + state.pointer.x * 0.45 + Math.sin(time * 0.4) * 0.08
    const targetX = -0.08 - state.pointer.y * 0.25
    model.rotation.y = THREE.MathUtils.damp(model.rotation.y, targetY, 3, delta)
    model.rotation.x = THREE.MathUtils.damp(model.rotation.x, targetX, 3, delta)
    model.position.y = Math.sin(time * 0.8) * 0.06

    // El play azul entra al cargar y luego se "presiona" cada pocos segundos
    let offset = 0
    if (local < 1.1) {
      offset = (1 - easeOutCubic(local / 1.1)) * -1.4
    } else {
      const cycle = (local - 1.1) % PRESS_EVERY
      if (cycle < 0.4) offset = -Math.sin((cycle / 0.4) * Math.PI) * 0.16
    }
    lowerPlay.current.position.x = offset
  })

  return (
    <group ref={group} rotation={[-0.08, -0.35, 0]}>
      <RoundedBox
        args={[9 * LOGO_SCALE, 44 * LOGO_SCALE, DEPTH + 0.12]}
        radius={0.07}
        smoothness={4}
        position={[-13.5 * LOGO_SCALE, 0, 0]}
      >
        <BrandMaterial color="#F4F4F5" />
      </RoundedBox>
      <PlayPrism points={UPPER_PLAY} color="#F4F4F5" />
      <group ref={lowerPlay}>
        <PlayPrism points={LOWER_PLAY} color="#2F5BFF" />
      </group>
    </group>
  )
}

export default function LogoScene({ active, reduced }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.2], fov: 35 }}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <directionalLight position={[-4, -2, 2]} intensity={0.9} color="#7A95FF" />
      <pointLight position={[0, 0, -3]} intensity={6} color="#2F5BFF" distance={8} />
      <LogoModel reduced={reduced} />
    </Canvas>
  )
}
