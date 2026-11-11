import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BrandLink from '../brand/BrandLink'
import Button from '../ui/Button'
import NavLinks from './NavLinks'
import MenuToggle from './MenuToggle'
import { PATHS } from '../../routing/paths'
import { useScrolled } from '../../hooks/useScrolled'
import styles from './SiteHeader.module.css'

/**
 * Encabezado fijo. Transparente sobre la portada (fondo oscuro) y sólido al desplazarse,
 * al abrir el menú o en cualquier otra página.
 */
export default function SiteHeader() {
  const { pathname } = useLocation()
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])

  // Al cambiar de página el menú móvil se cierra solo.
  useEffect(() => {
    close()
  }, [pathname, close])

  // Escape cierra el menú; al pasar a pantalla ancha también.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && close()
    const wide = window.matchMedia('(min-width: 861px)')
    const onWide = (event) => event.matches && close()
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open, close])

  const solid = scrolled || open || pathname !== PATHS.home

  return (
    <header className={`${styles.header} ${solid ? styles.solid : ''}`}>
      <div className={`container ${styles.bar}`}>
        <BrandLink onClick={close} />
        <MenuToggle open={open} onToggle={toggle} />
        <nav
          id="menu-principal"
          aria-label="Principal"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
        >
          <NavLinks onNavigate={close} />
          <Button to={PATHS.contact} onClick={close} className={styles.cta}>
            Ponlo en marcha
          </Button>
        </nav>
      </div>
    </header>
  )
}
