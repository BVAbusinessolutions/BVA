import { memo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MAIN_LINKS } from '../../config/navigation'
import styles from './NavLinks.module.css'

const isAnchor = (to) => to.includes('#')

/** Enlaces de navegación principal. Los de ancla (/#proceso) usan Link; los de página, NavLink. */
function NavLinksBase({ onNavigate }) {
  return (
    <ul className={styles.links}>
      {MAIN_LINKS.map((item) => (
        <li key={item.to}>
          {isAnchor(item.to) ? (
            <Link to={item.to} className={styles.link} onClick={onNavigate}>
              {item.label}
            </Link>
          ) : (
            <NavLink
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              onClick={onNavigate}
            >
              {item.label}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  )
}

const NavLinks = memo(NavLinksBase)
export default NavLinks
