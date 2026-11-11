import { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import Providers from './providers'
import AppRouter from '../routing/AppRouter'
import ErrorBoundary from '../components/layout/ErrorBoundary'
import PageLoader from '../components/ui/PageLoader'

/** Barrera de último nivel: si una página falla, se muestra un aviso y no una pantalla en blanco. */
function SafeRoutes() {
  const { pathname } = useLocation()
  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense fallback={<PageLoader fullScreen />}>
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <Providers>
      <SafeRoutes />
    </Providers>
  )
}
