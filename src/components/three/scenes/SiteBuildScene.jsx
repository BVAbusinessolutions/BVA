import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import BrowserFrame from '../build/BrowserFrame'
import BuildBlock from '../build/BuildBlock'
import ChatBubbles from '../build/ChatBubbles'
import BlueprintGrid from '../build/BlueprintGrid'
import LaunchEffects from '../build/LaunchEffects'
import { BLOCKS } from '../../../lib/three/buildLayout'
import { range } from '../../../lib/three/easing'
import { useBuildProgress } from '../../../lib/three/useBuildProgress'

/** El modelo gira de un ángulo lateral (conversación) a casi de frente (lanzamiento) y sigue al puntero. */
function BuildModel({ activeStep, reduced, animate }) {
  const group = useRef()
  const progress = useBuildProgress(activeStep, reduced)

  useFrame((state, delta) => {
    const model = group.current
    const advance = range(progress.current, 0, 3)
    const time = animate ? state.clock.elapsedTime : 0
    const follow = reduced ? 0 : 1
    const targetY =
      THREE.MathUtils.lerp(-0.62, -0.2, advance) +
      follow * (state.pointer.x * 0.18 + Math.sin(time * 0.35) * 0.05)
    const targetX = THREE.MathUtils.lerp(0.18, 0.05, advance) - follow * state.pointer.y * 0.1
    model.rotation.y = THREE.MathUtils.damp(model.rotation.y, targetY, 3, delta)
    model.rotation.x = THREE.MathUtils.damp(model.rotation.x, targetX, 3, delta)
    model.position.y = Math.sin(time * 0.7) * 0.05 * follow
  })

  return (
    <group ref={group} rotation={[0.18, -0.62, 0]}>
      <BlueprintGrid progress={progress} />
      <BrowserFrame progress={progress} />
      {BLOCKS.map((block) => (
        <BuildBlock key={block.id} block={block} progress={progress} />
      ))}
      <ChatBubbles progress={progress} />
      <LaunchEffects progress={progress} />
    </group>
  )
}

/** "Así lo ponemos en marcha": una página web que se arma paso a paso al hacer scroll. */
export default function SiteBuildScene({ active, reduced, activeStep = 0 }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.15, 10.5], fov: 35 }}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 6]} intensity={2} />
      <directionalLight position={[-5, -2, 3]} intensity={0.8} color="#7A95FF" />
      <pointLight position={[0, 0, -2.5]} intensity={8} color="#2F5BFF" distance={9} />
      {/* Reflejos de estudio generados en la escena: no descargan ningún archivo. */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer
          form="rect"
          color="#2F5BFF"
          intensity={3}
          position={[-5, 0, 2]}
          scale={[2, 6, 1]}
        />
      </Environment>
      <BuildModel activeStep={activeStep} reduced={reduced} animate={active} />
    </Canvas>
  )
}
