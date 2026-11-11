import LazyScene from '../three/LazyScene'
import SectionHeading from '../ui/SectionHeading'
import ProcessSteps from './ProcessSteps'
import { useActiveStep } from '../../hooks/useActiveStep'
import { HOME_ANCHORS } from '../../routing/paths'
import { workProcess as content } from '../../content/es'
import styles from './Process.module.css'

const loadBuildScene = () => import('../three/scenes/SiteBuildScene')

/** Sección "Cómo trabajamos": modelo 3D de una web que se arma, fijo a la izquierda y pasos a la derecha. */
export default function ProcessSection() {
  const { activeStep, registerStep } = useActiveStep(content.steps.length)

  return (
    <section id={HOME_ANCHORS.process} className={styles.section} aria-labelledby="proceso-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.sceneColumn}>
          <LazyScene
            loader={loadBuildScene}
            label={content.sceneLabel}
            className={styles.scene}
            sceneProps={{ activeStep }}
          />
        </div>

        <div className={styles.content}>
          <SectionHeading
            id="proceso-title"
            eyebrow={content.eyebrow}
            title={content.title}
            lead={content.lead}
            onDark
          />
          <ProcessSteps steps={content.steps} activeStep={activeStep} registerStep={registerStep} />
        </div>
      </div>
    </section>
  )
}
