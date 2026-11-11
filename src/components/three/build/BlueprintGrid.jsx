import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { range } from '../../../lib/three/easing'
import { PHASES } from '../../../lib/three/buildLayout'

/** "Diseñamos la solución": cuadrícula de plano técnico detrás de la ventana. */
export default function BlueprintGrid({ progress }) {
  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(9, 24, '#2F5BFF', '#2F5BFF')
    helper.material.transparent = true
    helper.material.depthWrite = false
    helper.material.opacity = 0.08
    helper.rotation.x = Math.PI / 2
    helper.position.z = -0.45
    return helper
  }, [])

  useFrame(() => {
    const p = progress.current
    const blueprint = range(p, ...PHASES.blueprintIn) * (1 - range(p, ...PHASES.blueprintOut))
    grid.material.opacity = 0.06 + blueprint * 0.45
  })

  return <primitive object={grid} />
}
