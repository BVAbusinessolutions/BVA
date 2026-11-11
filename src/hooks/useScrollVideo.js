import { useEffect } from 'react'
import { scrollFraction } from '../utils/scrollFraction'

/** Suavizado por cuadro: 1 = salto directo; valores bajos = más inercia. */
const EASE = 0.18
/** Diferencia mínima (en segundos) para pedir otro salto al video. */
const MIN_STEP = 1 / 60

/**
 * Vincula el `currentTime` de un <video> al avance del scroll dentro de una sección.
 *
 * Rendimiento:
 * - El evento de scroll es pasivo y solo marca un objetivo; nada se mide dentro de él.
 * - Un único requestAnimationFrame mide, suaviza y mueve el video. Se detiene solo cuando
 *   el video alcanza el objetivo, así que con la página quieta no se gasta CPU.
 * - Solo se pide un salto nuevo cuando el anterior terminó (`video.seeking`), para no
 *   saturar el decodificador.
 *
 * Para que el avance se vea fluido, el video debe tener un fotograma clave en cada cuadro:
 *   ffmpeg -i in.mp4 -an -vf scale=1600:-2 -c:v libx264 -g 1 -crf 26 -movflags +faststart out.mp4
 *
 * @param {import('react').RefObject<HTMLElement>} sectionRef sección alta que define el recorrido
 * @param {import('react').RefObject<HTMLVideoElement>} videoRef video que se controla
 * @param {{ enabled?: boolean }} [options] false con "reducir movimiento": el video queda quieto
 */
export function useScrollVideo(sectionRef, videoRef, { enabled = true } = {}) {
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!enabled || !section || !video) return undefined

    let frame = 0
    let current = 0

    const tick = () => {
      frame = 0
      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) return

      const target = scrollFraction(section.getBoundingClientRect(), window.innerHeight)
      current += (target - current) * EASE
      if (Math.abs(target - current) < 0.001) current = target

      const time = current * duration
      if (!video.seeking && Math.abs(video.currentTime - time) > MIN_STEP) {
        video.currentTime = time
      }
      if (current !== target || video.seeking) frame = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    video.pause()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    video.addEventListener('loadedmetadata', schedule)
    schedule()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      video.removeEventListener('loadedmetadata', schedule)
    }
  }, [sectionRef, videoRef, enabled])
}
