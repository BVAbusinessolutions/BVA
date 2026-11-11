import { memo } from 'react'
import Logo from '../../brand/Logo'
import { platform } from '../../../content/es'
import styles from './PlatformDemo.module.css'

const { demo } = platform

/** Barra superior: marca, buscador y botón "Nuevo" (se hunde cuando el cursor lo pulsa). */
function DemoTopbarBase({ pressed }) {
  return (
    <div className={styles.topbar}>
      <Logo size={18} tone="light" />
      <span className={styles.product}>{demo.product}</span>
      <span className={styles.search}>{demo.search}</span>
      <span className={`${styles.newButton} ${pressed ? styles.pressed : ''}`}>
        {demo.newButton}
      </span>
    </div>
  )
}

const DemoTopbar = memo(DemoTopbarBase)
export default DemoTopbar
