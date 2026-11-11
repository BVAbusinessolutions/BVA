import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { easeOutBack, range } from '../../../lib/three/easing'
import { PHASES } from '../../../lib/three/buildLayout'
import { createSmallPlayGeometry } from '../../../lib/three/playGeometry'

/** Aviso flotante ("nuevo cliente", "cita confirmada") que aparece al lanzar. */
export default function NotificationChip({ progress, position, delay = 0 }) {
  const group = useRef()
  const play = useMemo(() => createSmallPlayGeometry(0.16, 0.05), [])
  const [launchStart] = PHASES.launch

  useFrame((state) => {
    const show = range(progress.current, launchStart + delay, launchStart + delay + 0.5)
    group.current.visible = show > 0.001
    group.current.scale.setScalar(Math.max(0.0001, easeOutBack(show)))
    group.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.4 + delay * 10) * 0.06
  })

  return (
    <group ref={group} position={position} rotation={[0, -0.2, 0]} visible={false}>
      <RoundedBox args={[1.05, 0.34, 0.08]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.3} clearcoat={1} />
      </RoundedBox>
      <mesh geometry={play} position={[-0.36, 0, 0.06]}>
        <meshBasicMaterial color="#2F5BFF" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.045]}>
        <boxGeometry args={[0.6, 0.06, 0.01]} />
        <meshBasicMaterial color="#18181b" />
      </mesh>
      <mesh position={[0.02, -0.07, 0.045]}>
        <boxGeometry args={[0.44, 0.05, 0.01]} />
        <meshBasicMaterial color="#a1a1aa" />
      </mesh>
    </group>
  )
}
