import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { easeOutBack, range } from '../../../lib/three/easing'
import { PHASES } from '../../../lib/three/buildLayout'

const TYPING_DOTS = [-0.2, 0, 0.2]

/** "Conversamos": dos burbujas de chat frente a la ventana; una está escribiendo. */
export default function ChatBubbles({ progress }) {
  const group = useRef()
  const dots = useRef([])

  useFrame((state) => {
    const show = 1 - range(progress.current, ...PHASES.chatOut)
    const time = state.clock.elapsedTime
    group.current.visible = show > 0.001
    group.current.scale.setScalar(Math.max(0.0001, easeOutBack(show)))
    group.current.position.y = Math.sin(time * 1.2) * 0.06
    dots.current.forEach((dot, index) => {
      if (dot) dot.position.y = Math.max(0, Math.sin(time * 6 - index * 0.7)) * 0.06
    })
  })

  return (
    <group ref={group}>
      <group position={[-1.15, 0.65, 1.3]} rotation={[0, 0.25, 0]}>
        <RoundedBox args={[1.6, 0.55, 0.12]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial color="#F4F4F5" roughness={0.3} clearcoat={1} />
        </RoundedBox>
        <mesh position={[-0.15, 0.08, 0.065]}>
          <boxGeometry args={[1.1, 0.07, 0.01]} />
          <meshBasicMaterial color="#a1a1aa" />
        </mesh>
        <mesh position={[-0.35, -0.08, 0.065]}>
          <boxGeometry args={[0.7, 0.07, 0.01]} />
          <meshBasicMaterial color="#a1a1aa" />
        </mesh>
      </group>

      <group position={[1.05, -0.25, 1.6]} rotation={[0, -0.25, 0]}>
        <RoundedBox args={[1.1, 0.45, 0.12]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial color="#2F5BFF" roughness={0.3} clearcoat={1} />
        </RoundedBox>
        {TYPING_DOTS.map((x, index) => (
          <mesh
            key={x}
            ref={(element) => {
              dots.current[index] = element
            }}
            position={[x, 0, 0.08]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
