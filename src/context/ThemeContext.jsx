import { createContext, useContext } from 'react'
import { useTenantTheme } from '../hooks/useTenantTheme'
import { DEFAULT_TENANT_SLUG } from '../config/tenants'

const ThemeContext = createContext({ tenant: null, status: 'loading' })

/**
 * Motor de marca blanca: carga la marca del cliente y la aplica como color de acento.
 * El modo oscuro de BVA es fijo; el cliente solo cambia botones, bordes y textos destacados.
 */
export function ThemeProvider({ slug = DEFAULT_TENANT_SLUG, children }) {
  const value = useTenantTheme(slug)
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Marca activa: { tenant: { slug, name, primaryColor, logoUrl } | null, status }. */
export const useTenant = () => useContext(ThemeContext)
