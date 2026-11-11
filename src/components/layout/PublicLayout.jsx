import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import ErrorBoundary from './ErrorBoundary'
import PageLoader from '../ui/PageLoader'
import WhatsAppButton from '../contact/WhatsAppButton'
import SiteBackground from '../three/SiteBackground'
import { useHashScroll } from '../../hooks/useHashScroll'
import styles from './PublicLayout.module.css'

/** Encabezado, contenido de la ruta y pie de página. Si una página falla, el resto sigue visible. */
export default function PublicLayout() {
  const { pathname } = useLocation()
  useHashScroll() // enlaces con ancla (/#proceso): desplazamiento al destino

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteBackground />
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className={styles.main}>
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageLoader page />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  )
}
