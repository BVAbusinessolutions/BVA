import { forwardRef, memo } from 'react'
import styles from './Process.module.css'

/** Un paso del proceso: número, nombre y descripción. */
const ProcessStep = memo(
  forwardRef(function ProcessStep({ index, step, active }, ref) {
    return (
      <li
        ref={ref}
        className={`${styles.step} ${active ? styles.active : ''}`}
        aria-current={active ? 'step' : undefined}
      >
        <span className={styles.number} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 className={styles.stepName}>{step.name}</h3>
          <p className={styles.stepText}>{step.text}</p>
        </div>
      </li>
    )
  }),
)

export default ProcessStep
