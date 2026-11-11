import DemoTopbar from './DemoTopbar'
import DemoSidebar from './DemoSidebar'
import DemoStats from './DemoStats'
import DemoBoard from './DemoBoard'
import DemoChart from './DemoChart'
import DemoToast from './DemoToast'
import DemoCursor from './DemoCursor'
import { FRAMES, STATIC_FRAME } from './demoScript'
import { useInView } from '../../../hooks/useInView'
import { useTimeline } from '../../../hooks/useTimeline'
import { useReducedMotion } from '../../../context/MotionContext'
import styles from './PlatformDemo.module.css'

/**
 * La plataforma "en funcionamiento", reproducida en bucle como un video de fondo.
 * Solo corre mientras se ve; con "reducir movimiento" queda en un cuadro fijo.
 */
export default function PlatformDemo({ label }) {
  const [ref, inView] = useInView({ rootMargin: '100px 0px' })
  const reduced = useReducedMotion()
  const index = useTimeline(FRAMES, { playing: inView && !reduced })
  const frameIndex = reduced ? STATIC_FRAME : index
  const frame = FRAMES[frameIndex]

  return (
    <div ref={ref} className={styles.stage} role="img" aria-label={label}>
      <div className={styles.window} aria-hidden="true">
        <DemoTopbar pressed={frame.click} />
        <div className={styles.body}>
          <DemoSidebar active={frame.menu} />
          <div className={styles.main}>
            <DemoStats values={frame.stats} />
            <div className={styles.panels}>
              <DemoBoard column={frame.card} done={frame.done} />
              <DemoChart bars={frame.bars} />
            </div>
          </div>
        </div>
        <DemoToast index={frame.toast} frameKey={frameIndex} />
        <DemoCursor position={frame.cursor} click={frame.click} frameKey={frameIndex} />
      </div>
    </div>
  )
}
