import LazyScene from '../three/LazyScene'
import Logo from '../brand/Logo'
import HeroCopy from './HeroCopy'
import { hero } from '../../content/es'
import styles from './Hero.module.css'

const loadLogoScene = () => import('../three/scenes/LogoScene')

/** Portada: titular, llamados a la acción y el logo en 3D (o el SVG mientras carga). */
export default function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
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
