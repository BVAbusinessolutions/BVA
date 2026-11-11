import { useEffect, useState } from 'react'

/**
 * true cuando la página se desplazó más de `offset` píxeles.
 * Lee el scroll una vez por fotograma (requestAnimationFrame), no en cada evento.
 */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > offset : false,
  )

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(window.scrollY > offset)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [offset])

  return scrolled
}
