import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../context/MotionContext'
import SceneErrorBoundary from './SceneErrorBoundary'

/**
 * Carga una escena 3D solo cuando su sección se acerca a la pantalla.
 * La escena recibe `active` (animar o no) y `reduced` (movimiento reducido).
 * Three.js no entra en el paquete inicial: llega con `loader`.
 *
 * @param {{ loader: () => Promise<{ default: Function }>, label: string, className?: string,
 *   fallback?: import('react').ReactNode, sceneProps?: object }} props
 */
export default function LazyScene({ loader, label, className, fallback = null, sceneProps }) {
  const [ref, inView] = useInView({ rootMargin: '300px 0px' })
  const reduced = useReducedMotion()
  const [Scene, setScene] = useState(null)

  useEffect(() => {
    if (!inView || Scene) return undefined
    let alive = true
    loader()
      .then((module) => {
        if (alive) setScene(() => module.default)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [inView, Scene, loader])

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      {Scene ? (
        <SceneErrorBoundary fallback={fallback}>
          <Scene active={inView && !reduced} reduced={reduced} {...sceneProps} />
        </SceneErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  )
}
