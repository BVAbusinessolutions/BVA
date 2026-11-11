import { useEffect, useRef, useState } from 'react'
import { useInView } from './useInView'
import { useReducedMotion } from '../context/MotionContext'

/** true si la persona activó "ahorro de datos" o tiene una conexión muy lenta. */
const prefersLowData = () => {
  const connection = typeof navigator !== 'undefined' ? navigator.connection : undefined
  return Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ''))
}

/** Celulares reciben la versión liviana del video si existe. */
const isSmallScreen = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(max-width: 720px)').matches

/**
 * Estado de un video decorativo de fondo.
 * - No descarga nada hasta que la sección está cerca de la pantalla.
 * - Se reproduce solo mientras se ve y se pausa al salir.
 * - Con "reducir movimiento" o ahorro de datos no se carga: queda el póster o el respaldo.
 * @param {{ src?: string | null, mobileSrc?: string | null } | undefined} video
 * @returns {{ containerRef: import('react').RefObject, videoRef: import('react').RefObject,
 *   src: string | null, status: 'idle' | 'ready' | 'failed', onReady: () => void,
 *   onFail: () => void }}
 */
export function useBackgroundVideo(video) {
  const [containerRef, inView] = useInView({ rootMargin: '200px' })
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const [requested, setRequested] = useState(false)
  const [status, setStatus] = useState('idle')

  const disabled = !video?.src || reduced || prefersLowData()
  if (inView && !requested && !disabled) setRequested(true)

  useEffect(() => {
    const element = videoRef.current
    if (!element || status !== 'ready') return
    if (inView) element.play().catch(() => {})
    else element.pause()
  }, [inView, status])

  const [fullOnly, setFullOnly] = useState(false)
  const mobile = !fullOnly && isSmallScreen() && video?.mobileSrc
  const src = requested ? mobile || video.src : null

  return {
    containerRef,
    videoRef,
    src,
    status: disabled ? 'failed' : status,
    onReady: () => setStatus('ready'),
    // Si falta la versión móvil se intenta con la normal antes de rendirse.
    onFail: () => (mobile ? setFullOnly(true) : setStatus('failed')),
  }
}
