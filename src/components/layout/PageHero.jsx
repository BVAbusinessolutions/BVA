import SectionHeading from '../ui/SectionHeading'
import VideoBackdrop from '../ui/VideoBackdrop'
import styles from './PageHero.module.css'

/**
 * Cabecera oscura de las páginas internas: eyebrow, título (h1) y descripción.
 * Con `video` (ver config/videos.js) muestra un video de fondo.
 */
export default function PageHero({ eyebrow, title, lead, video, children }) {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      {video && <VideoBackdrop video={video} veil="left" />}
      <div className={`container ${styles.inner}`}>
        <SectionHeading
          as="h1"
          id="page-title"
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          onDark
        />
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </section>
  )
}
