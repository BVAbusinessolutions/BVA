import { lazy, Suspense, useEffect, useState } from 'react'
import SceneErrorBoundary from './SceneErrorBoundary'
import { useReducedMotion } from '../../context/MotionContext'
import { hasWebGL } from '../../utils/webgl'
import styles from './SiteBackground.module.css'

const BackgroundScene = lazy(() => import('./scenes/BackgroundScene'))

/**
 * Fondo 3D fijo detrás de todo el sitio. Se ve a través de las secciones oscuras.
 * Se carga cuando el navegador queda libre, para no retrasar la primera pintura.
 * Sin WebGL queda el degradado de CSS.
 */
export default function SiteBackground() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hasWebGL()) return undefined
    const schedule = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 600))
    const cancel = window.cancelIdleCallback ?? clearTimeout
    const id = schedule(() => setReady(true), { timeout: 2000 })
    return () => cancel(id)
  }, [])

  return (
    <div className={styles.background} aria-hidden="true">
      {ready && (
        <SceneErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <BackgroundScene reduced={reduced} />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </div>
  )
}
