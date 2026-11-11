import { memo } from 'react'
import styles from './MenuToggle.module.css'

/** Botón hamburguesa (solo visible en pantallas angostas). */
function MenuToggleBase({ open, onToggle }) {
  return (
    <button
      type="button"
      className={styles.toggle}
      aria-expanded={open}
      aria-controls="menu-principal"
      onClick={onToggle}
    >
      <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`} aria-hidden="true" />
      <span className="visually-hidden">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
    </button>
  )
}

const MenuToggle = memo(MenuToggleBase)
export default MenuToggle
