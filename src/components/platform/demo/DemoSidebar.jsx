import { memo } from 'react'
import { platform } from '../../../content/es'
import styles from './PlatformDemo.module.css'

/** Menú lateral; el ítem activo sigue a la acción de la demo. */
function DemoSidebarBase({ active }) {
  return (
    <div className={styles.sidebar}>
      {platform.demo.menu.map((item, index) => (
        <span
          key={item}
          className={`${styles.menuItem} ${index === active ? styles.menuActive : ''}`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

const DemoSidebar = memo(DemoSidebarBase)
export default DemoSidebar
