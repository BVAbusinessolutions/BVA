import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Marca como activo el paso que está en el centro de la pantalla.
 * La persona controla el ritmo con su propio scroll.
 */
export function useActiveStep(count) {
  const [activeStep, setActiveStep] = useState(0)
  const elements = useRef([])

  const registerStep = useCallback(
    (index) => (element) => {
      elements.current[index] = element
    },
    [],
  )

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = elements.current.indexOf(entry.target)
            if (index >= 0) setActiveStep(index)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    elements.current.slice(0, count).forEach((element) => element && observer.observe(element))
    return () => observer.disconnect()
  }, [count])

  return { activeStep, registerStep }
}
