import PlayMarker from '../../ui/PlayMarker'
import { platform } from '../../../content/es'
import styles from './PlatformDemo.module.css'

/** Notificación automática que entra por la derecha en su cuadro. */
export default function DemoToast({ index, frameKey }) {
  if (index === null) return null
  return (
    <span key={frameKey} className={styles.toast}>
      <PlayMarker size="sm" />
      {platform.demo.toasts[index]}
    </span>
  )
}
