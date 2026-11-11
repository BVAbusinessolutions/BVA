import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { scrollToTarget } from '../utils/scrollToTarget'

const MAX_WAIT_MS = 3000 // la página de destino puede estar descargándose (carga diferida)

/**
 * Enlaces internos con ancla (p. ej. /#proceso): al llegar, lleva la vista al destino y lo resalta.
 * Espera a que la página termine de montar antes de rendirse.
 * Sin ancla, cada página nueva empieza arriba; con Atrás/Adelante el navegador restaura la posición.
 */
export function useHashScroll() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1))
    if (!id) {
      if (navigationType !== 'POP') window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return undefined
    }
    const started = performance.now()
    let frame = 0
    const attempt = () => {
      if (scrollToTarget(id) || performance.now() - started > MAX_WAIT_MS) return
      frame = requestAnimationFrame(attempt)
    }
    frame = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key, navigationType])
}
