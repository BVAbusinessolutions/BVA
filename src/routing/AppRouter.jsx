import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import { PATHS } from './paths'
import { lazyWithRetry } from './lazyWithRetry'

// Cada página se descarga solo cuando se visita: la portada no carga el código de las demás.
const HomePage = lazyWithRetry(() => import('../pages/HomePage'))
const ServicesPage = lazyWithRetry(() => import('../pages/ServicesPage'))
const PlatformPage = lazyWithRetry(() => import('../pages/PlatformPage'))
const ContactPage = lazyWithRetry(() => import('../pages/ContactPage'))
const PrivacyPage = lazyWithRetry(() => import('../pages/PrivacyPage'))
const NotFoundPage = lazyWithRetry(() => import('../pages/NotFoundPage'))

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={PATHS.home} element={<HomePage />} />
        <Route path={PATHS.services} element={<ServicesPage />} />
        <Route path={PATHS.platform} element={<PlatformPage />} />
        <Route path={PATHS.contact} element={<ContactPage />} />
        <Route path={PATHS.privacy} element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
