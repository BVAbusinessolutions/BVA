import { useEffect, useRef, useState } from 'react'

/**
 * Observa si un elemento está cerca o dentro de la pantalla.
 * @param {{ rootMargin?: string, once?: boolean }} options
 * @returns {[import('react').RefObject, boolean]}
 */
export function useInView({ rootMargin = '0px', once = false } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [ref, inView]
}
