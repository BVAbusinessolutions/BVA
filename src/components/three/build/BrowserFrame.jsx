import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { range } from '../../../lib/three/easing'
import { FRAME, PHASES } from '../../../lib/three/buildLayout'

const BAR_Y = FRAME.height / 2 - FRAME.barHeight / 2
const BAR_Z = FRAME.depth / 2 + 0.01
const DOT_COLORS = ['#52525b', '#52525b', '#2F5BFF']

/** Ventana del navegador: empieza como un contorno fantasma y se vuelve sólida al diseñar. */
export default function BrowserFrame({ progress }) {
  const body = useRef()
  const outline = useRef()

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(FRAME.width, FRAME.height, FRAME.depth)),
    [],
  )
  // Materiales de la barra superior: se crean una vez y solo cambia su opacidad.
  const barMaterials = useMemo(
    () => ({
      bar: new THREE.MeshBasicMaterial({ color: '#18181b', transparent: true, opacity: 0 }),
      url: new THREE.MeshBasicMaterial({ color: '#27272a', transparent: true, opacity: 0 }),
      dots: DOT_COLORS.map(
        (color) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 }),
      ),
    }),
    [],
  )

  useFrame(() => {
    const p = progress.current
    const solid = range(p, ...PHASES.frameSolid)
    const launch = range(p, ...PHASES.launch)
    body.current.opacity = 0.12 + solid * 0.88
    outline.current.opacity = 0.25 + (1 - solid) * 0.55 + launch * 0.5
    barMaterials.bar.opacity = solid
    barMaterials.url.opacity = solid
    barMaterials.dots.forEach((material) => {
      material.opacity = solid
    })
  })

  return (
    <group>
      <RoundedBox args={[FRAME.width, FRAME.height, FRAME.depth]} radius={0.06} smoothness={3}>
        <meshPhysicalMaterial
          ref={body}
          color="#0d0d10"
          roughness={0.25}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.12}
        />
      </RoundedBox>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={outline} color="#7A95FF" transparent opacity={0.8} />
      </lineSegments>

      <mesh position={[0, BAR_Y, BAR_Z]} material={barMaterials.bar}>
        <planeGeometry args={[FRAME.width - 0.04, FRAME.barHeight]} />
      </mesh>
      {barMaterials.dots.map((material, index) => (
        <mesh
          key={index}
          position={[-1.95 + index * 0.14, BAR_Y, BAR_Z + 0.005]}
          material={material}
        >
          <circleGeometry args={[0.045, 20]} />
        </mesh>
      ))}
      <mesh position={[0.2, BAR_Y, BAR_Z + 0.005]} material={barMaterials.url}>
        <planeGeometry args={[2.2, 0.12]} />
      </mesh>
    </group>
  )
}
