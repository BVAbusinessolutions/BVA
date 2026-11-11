import { memo } from 'react'
import { platform } from '../../../content/es'
import styles from './PlatformDemo.module.css'

/** Gráfica de barras de la semana: las barras crecen cuando entran ventas nuevas. */
function DemoChartBase({ bars }) {
  return (
    <div className={styles.chart}>
      <span className={styles.columnTitle}>{platform.demo.chartTitle}</span>
      <div className={styles.bars}>
        {bars.map((height, index) => (
          <span key={platform.demo.days[index]} className={styles.barSlot}>
            <span className={styles.bar} style={{ transform: `scaleY(${height})` }} />
            <span className={styles.day}>{platform.demo.days[index]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const DemoChart = memo(DemoChartBase)
export default DemoChart
