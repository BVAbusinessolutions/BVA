import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Avance continuo (0 a 3) que persigue suavemente al paso activo del proceso.
 * Se guarda en una ref y se lee en cada fotograma: no provoca renders de React.
 * Con movimiento reducido salta directo al paso.
 */
export function useBuildProgress(activeStep, reduced) {
  const progress = useRef(reduced ? activeStep : 0)
  const invalidate = useThree((state) => state.invalidate)

  // Con frameloop "demand" (fuera de pantalla o movimiento reducido) pide un fotograma al cambiar de paso.
  useEffect(() => {
    invalidate()
  }, [activeStep, invalidate])

  useFrame((_, delta) => {
    progress.current = reduced
      ? activeStep
      : THREE.MathUtils.damp(progress.current, activeStep, 2.2, Math.min(delta, 0.1))
  })

  return progress
}
