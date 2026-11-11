import { createContext, useContext, useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'
const MotionContext = createContext(false)

/**
 * Un solo oyente de "reducir movimiento" para todo el sitio (antes cada escena creaba el suyo).
 * Las escenas 3D y las animaciones leen el valor con useReducedMotion().
 */
export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(QUERY).matches),
  )

  useEffect(() => {
    const media = window.matchMedia?.(QUERY)
    if (!media) return undefined
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return <MotionContext.Provider value={reduced}>{children}</MotionContext.Provider>
}

/** true si la persona pidió reducir el movimiento en su sistema. */
export const useReducedMotion = () => useContext(MotionContext)
