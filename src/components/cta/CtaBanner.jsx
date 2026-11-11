import Button from '../ui/Button'
import VideoBackdrop from '../ui/VideoBackdrop'
import { VIDEOS } from '../../config/videos'
import { PATHS } from '../../routing/paths'
import { cta } from '../../content/es'
import styles from './CtaBanner.module.css'

/** Banda de cierre con llamado a la acción, para las páginas internas. */
export default function CtaBanner() {
  return (
    <section className={styles.banner} aria-labelledby="cta-title">
      <VideoBackdrop video={VIDEOS.cta} veil="center" />
      <div className={`container ${styles.inner}`}>
        <div>
          <h2 id="cta-title" className={styles.title}>
            {cta.title}
          </h2>
          <p className={styles.lead}>{cta.lead}</p>
        </div>
        <Button to={PATHS.contact}>{cta.button}</Button>
      </div>
    </section>
  )
}
