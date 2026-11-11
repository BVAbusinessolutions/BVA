import Button from '../ui/Button'
import { PATHS } from '../../routing/paths'
import { hero } from '../../content/es'
import styles from './Hero.module.css'

/** Texto de la portada: titular en dos líneas, lead y botones. */
export default function HeroCopy() {
  const [first, middle, accent] = hero.title
  return (
    <div className={styles.copy}>
      <h1 id="hero-title" className={styles.title}>
        <span className={styles.line}>{first}</span>
        <span className={styles.line}>
          {middle} <span className={styles.accent}>{accent}</span>
        </span>
      </h1>
      <p className={styles.lead}>{hero.lead}</p>
      <div className={styles.actions}>
        <Button to={PATHS.contact}>{hero.primaryCta}</Button>
        <Button to={PATHS.services} variant="secondary" onDark>
          {hero.secondaryCta}
        </Button>
      </div>
    </div>
  )
}
