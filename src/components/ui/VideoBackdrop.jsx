import { useBackgroundVideo } from '../../hooks/useBackgroundVideo'
import styles from './VideoBackdrop.module.css'

/**
 * Video decorativo detrás de una sección, con un velo oscuro para que el texto se lea.
 * Va como primer hijo de una sección con position: relative.
 * Si el video no existe, falla o la persona pidió reducir movimiento, muestra `fallback`
 * (por ejemplo la escena 3D que ya tenía la sección).
 *
 * @param {{ video?: { src: string | null, mobileSrc?: string | null, poster?: string },
 *   veil?: 'left' | 'center' | 'bottom', fallback?: import('react').ReactNode }} props
 */
export default function VideoBackdrop({ video, veil = 'left', fallback = null }) {
  const { containerRef, videoRef, src, status, onReady, onFail } = useBackgroundVideo(video)

  if (status === 'failed') return fallback

  return (
    <div ref={containerRef} className={styles.backdrop} aria-hidden="true">
      {src && (
        <video
          ref={videoRef}
          className={`${styles.video} ${status === 'ready' ? styles.visible : ''}`}
          src={src}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlay={onReady}
          onError={onFail}
        />
      )}
      <div className={`${styles.veil} ${styles[veil]}`} />
    </div>
  )
}
