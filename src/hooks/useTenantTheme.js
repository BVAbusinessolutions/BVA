import { useEffect, useMemo, useState } from 'react'
import { fetchTenantTheme } from '../services/tenantService'
import { buildAccentPalette, safeLogoUrl } from '../utils/accentColor'

/**
 * Carga la marca del cliente e inyecta sus variables de acento en <html>.
 * Solo se escriben variables --accent-*: el fondo (--ink) y los textos base no cambian,
 * así el sitio sigue en modo oscuro con cualquier marca. Si la carga falla, queda el
 * acento por defecto de tokens.css.
 * @param {string} slug identificador del cliente
 * @returns {{ tenant: { slug: string, name: string, logoUrl: string | null } | null,
 *   status: 'loading' | 'ready' | 'error' }}
 */
export function useTenantTheme(slug) {
  const [state, setState] = useState({ tenant: null, status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetchTenantTheme(slug, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return
        setState({
          tenant: {
            slug: data.slug,
            name: data.name,
            primaryColor: data.primaryColor,
            logoUrl: safeLogoUrl(data.logoUrl),
          },
          status: 'ready',
        })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ tenant: null, status: 'error' })
      })
    return () => controller.abort()
  }, [slug])

  const primaryColor = state.tenant?.primaryColor
  useEffect(() => {
    if (!primaryColor) return undefined
    const root = document.documentElement.style
    const palette = buildAccentPalette(primaryColor)
    Object.entries(palette).forEach(([name, value]) => root.setProperty(name, value))
    return () => Object.keys(palette).forEach((name) => root.removeProperty(name))
  }, [primaryColor])

  return useMemo(() => state, [state])
}
