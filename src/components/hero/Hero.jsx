import LazyScene from '../three/LazyScene'
import Logo from '../brand/Logo'
import HeroCopy from './HeroCopy'
import ScrollVideoHero from './ScrollVideoHero'
import VideoBackdrop from '../ui/VideoBackdrop'
import { VIDEOS } from '../../config/videos'
import { HERO_VIDEO } from '../../config/site'
import { hero } from '../../content/es'
import styles from './Hero.module.css'

const loadLogoScene = () => import('../three/scenes/LogoScene')
const sectionProps = { id: 'inicio', 'aria-labelledby': 'hero-title' }

/**
 * Portada. Con VITE_HERO_VIDEO_URL muestra el video controlado por scroll;
 * sin él, el logo en 3D (o el SVG mientras carga).
 */
export default function Hero() {
  if (HERO_VIDEO.src) {
    return (
      <ScrollVideoHero
        src={HERO_VIDEO.src}
        poster={HERO_VIDEO.poster}
        label={hero.videoLabel}
        {...sectionProps}
      >
        <div className={`container ${styles.grid}`}>
          <HeroCopy />
        </div>
      </ScrollVideoHero>
    )
  }

  return (
    <section className={styles.hero} {...sectionProps}>
      <VideoBackdrop video={VIDEOS.hero} veil="left" />
      <div className={`container ${styles.grid}`}>
        <HeroCopy />
        <LazyScene
          loader={loadLogoScene}
          label={hero.sceneLabel}
          className={styles.scene}
          fallback={
            <div className={styles.fallback}>
              <Logo size={260} tone="light" />
            </div>
          }
        />
      </div>
    </section>
  )
}
