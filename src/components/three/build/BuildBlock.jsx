import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easeInOutCubic, range } from '../../../lib/three/easing'
import { PHASES } from '../../../lib/three/buildLayout'

const IDENTITY = new THREE.Quaternion()

/**
 * Un bloque de la página. En "Diseñamos" se ve solo su contorno en su lugar (plano);
 * en "Lo construimos" la pieza sólida vuela desde lejos, gira y encaja.
 */
export default function BuildBlock({ block, progress }) {
  const mesh = useRef()
  const material = useRef()
  const outline = useRef()
  const outlineMaterial = useRef()

  const geometry = useMemo(() => new THREE.BoxGeometry(block.w, block.h, block.depth), [block])
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])
  const from = useMemo(() => new THREE.Vector3(...block.from), [block])
  const to = useMemo(() => new THREE.Vector3(...block.to), [block])
  const fromRotation = useMemo(
    () => new THREE.Quaternion().setFromEuler(new THREE.Euler(...block.fromRotation)),
    [block],
  )

  useFrame((state) => {
    const p = progress.current
    const start = PHASES.buildStart + block.order * PHASES.buildGap
    const t = easeInOutCubic(range(p, start, start + PHASES.buildLength))

    mesh.current.visible = t > 0.001
    mesh.current.position.lerpVectors(from, to, t)
    mesh.current.quaternion.slerpQuaternions(fromRotation, IDENTITY, t)
    material.current.opacity = Math.min(1, t * 1.4)

    if (block.cta) {
      const launch = range(p, ...PHASES.launch)
      const pulse = (Math.sin(state.clock.elapsedTime * 4) + 1) / 2
      material.current.emissiveIntensity = launch * (0.4 + pulse * 0.8)
      mesh.current.scale.setScalar(1 + launch * pulse * 0.06)
    }

    const wire = range(p, ...PHASES.blueprintIn) * (1 - range(p, ...PHASES.blueprintOut))
    outline.current.visible = wire > 0.001
    outlineMaterial.current.opacity = wire * 0.9
  })

  return (
    <>
      <mesh ref={mesh} geometry={geometry} visible={false}>
        <meshStandardMaterial
          ref={material}
          color={block.color}
          emissive={block.color}
          emissiveIntensity={0}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0}
        />
      </mesh>
      <lineSegments ref={outline} geometry={edges} position={block.to} visible={false}>
        <lineBasicMaterial ref={outlineMaterial} color="#7A95FF" transparent opacity={0} />
      </lineSegments>
    </>
  )
}
