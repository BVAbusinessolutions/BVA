import { useRef } from 'react'
import { useReducedMotion } from '../../context/MotionContext'
import { useScrollVideo } from '../../hooks/useScrollVideo'
import styles from './ScrollVideoHero.module.css'

/**
 * Portada con video de fondo que avanza y retrocede con el scroll.
 * La sección mide varias pantallas de alto; el video y el contenido quedan fijos ("sticky")
 * mientras se recorre, y el scroll decide en qué segundo del video estamos.
 * Con "reducir movimiento" el video no se mueve y se muestra el póster.
 *
 * @param {{ src: string, poster?: string, label: string, children: import('react').ReactNode }} props
 *   label describe el video para lectores de pantalla; children es el contenido encima.
 */
export default function ScrollVideoHero({ src, poster, label, children, ...sectionProps }) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  useScrollVideo(sectionRef, videoRef, { enabled: !reduced })

  return (
    <section ref={sectionRef} className={styles.track} {...sectionProps}>
      <div className={styles.stage}>
        <video
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster}
          muted
          playsInline
          preload={reduced ? 'none' : 'auto'}
          aria-label={label}
        />
        <div className={styles.veil} aria-hidden="true" />
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  )
}
