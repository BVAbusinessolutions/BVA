import { Link } from 'react-router-dom'
import { PATHS } from '../../routing/paths'
import { SITE } from '../../config/site'
import Logo from './Logo'
import styles from './BrandLink.module.css'

/** Logo + nombre, enlazados al inicio. `tone="light"` sobre fondos oscuros. */
export default function BrandLink({ size = 30, tone = 'light', showFullName = false, onClick }) {
  return (
    <Link to={PATHS.home} className={styles.brand} onClick={onClick}>
      <Logo size={size} tone={tone} />
      <span className={styles.name}>{showFullName ? SITE.name : SITE.shortName}</span>
      {!showFullName && <span className="visually-hidden">Business Solutions, ir al inicio</span>}
    </Link>
  )
}
