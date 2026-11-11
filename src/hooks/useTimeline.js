import { useEffect, useState } from 'react'

/**
 * Reproduce una lista de cuadros en bucle, como un video: cada cuadro dura `frame.duration` ms.
 * Con `playing` en false se pausa en el cuadro actual (fuera de pantalla no gasta nada).
 * @param {{ duration: number }[]} frames
 * @param {{ playing: boolean }} options
 * @returns {number} índice del cuadro actual
 */
export function useTimeline(frames, { playing }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!playing) return undefined
    const id = setTimeout(
      () => setIndex((current) => (current + 1) % frames.length),
      frames[index].duration,
    )
    return () => clearTimeout(id)
  }, [playing, index, frames])

  return index
}
