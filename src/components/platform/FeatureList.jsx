import { memo } from 'react'
import styles from './Platform.module.css'

function Feature({ feature }) {
  return (
    <li className={styles.feature}>
      <h3 className={styles.featureName}>{feature.name}</h3>
      <p className={styles.featureText}>{feature.text}</p>
    </li>
  )
}

/** Los módulos de la plataforma en cuatro columnas. */
function FeatureListBase({ features }) {
  return (
    <ul className={styles.features}>
      {features.map((feature) => (
        <Feature key={feature.name} feature={feature} />
      ))}
    </ul>
  )
}

const FeatureList = memo(FeatureListBase)
export default FeatureList
