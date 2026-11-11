import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'
import PlatformDemo from './demo/PlatformDemo'
import FeatureList from './FeatureList'
import { HOME_ANCHORS, PATHS } from '../../routing/paths'
import { platform } from '../../content/es'
import styles from './Platform.module.css'

/** "Tu negocio en una sola pantalla": la plataforma funcionando de fondo, con el texto encima. */
export default function PlatformSection({ headingAs = 'h2' }) {
  return (
    <section
      id={HOME_ANCHORS.platform}
      className={styles.section}
      aria-labelledby="plataforma-title"
    >
      <PlatformDemo label={platform.sceneLabel} />
      <div className={styles.veil} aria-hidden="true" />

      <div className={`container ${styles.head}`}>
        <SectionHeading
          as={headingAs}
          id="plataforma-title"
          eyebrow={platform.eyebrow}
          title={platform.title}
          className={styles.title}
          onDark
        />
        <div className={styles.intro}>
          <p className={styles.lead}>{platform.lead}</p>
          <Button to={PATHS.contact} variant="secondary" onDark>
            {platform.cta}
          </Button>
        </div>
      </div>

      <div className={styles.window} />

      <div className={`container ${styles.footer}`}>
        <FeatureList features={platform.features} />
      </div>
    </section>
  )
}
