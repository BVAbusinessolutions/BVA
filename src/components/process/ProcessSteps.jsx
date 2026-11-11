import ProcessStep from './ProcessStep'
import styles from './Process.module.css'

/** Lista ordenada de pasos; el activo se resalta según el scroll. */
export default function ProcessSteps({ steps, activeStep, registerStep }) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <ProcessStep
          key={step.name}
          ref={registerStep(index)}
          index={index}
          step={step}
          active={index === activeStep}
        />
      ))}
    </ol>
  )
}
