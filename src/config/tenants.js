/**
 * Marcas de ejemplo mientras no exista el backend. Simulan la respuesta de
 * GET /api/tenants/:slug/theme. Cambia VITE_TENANT_SLUG para probar otra marca.
 */
export const MOCK_TENANTS = Object.freeze({
  bva: { slug: 'bva', name: 'BVA Business Solutions', primaryColor: '#2F5BFF', logoUrl: null },
  'clinica-vida': {
    slug: 'clinica-vida',
    name: 'Clínica Vida',
    primaryColor: '#14B8A6',
    logoUrl: null,
  },
  'cabinas-arenal': {
    slug: 'cabinas-arenal',
    name: 'Cabinas Arenal',
    primaryColor: '#F97316',
    logoUrl: null,
  },
})

export const DEFAULT_TENANT_SLUG = import.meta.env.VITE_TENANT_SLUG || 'bva'
