import { memo } from 'react'
import { platform } from '../../../content/es'
import styles from './PlatformDemo.module.css'

const colones = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

const format = (value, index) => (index === 2 ? colones.format(value) : String(value))

/** Indicadores: al cambiar un valor, el número entra con un pequeño destello. */
function DemoStatsBase({ values }) {
  return (
    <div className={styles.stats}>
      {platform.demo.stats.map((label, index) => (
        <div key={label} className={styles.stat}>
          <span className={styles.statLabel}>{label}</span>
          <span key={values[index]} className={styles.statValue}>
            {format(values[index], index)}
          </span>
        </div>
      ))}
    </div>
  )
}

const DemoStats = memo(DemoStatsBase)
export default DemoStats
