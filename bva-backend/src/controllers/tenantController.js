import { Tenant } from '../models/Tenant.js'
import { HttpError } from '../utils/httpError.js'

/**
 * GET /api/tenants/:slug/theme — marca pública del negocio para la web (marca blanca).
 * Es lo que consume src/services/tenantService.js del frontend. Solo datos visuales.
 */
export async function getTheme(req, res) {
  const tenant = await Tenant.findActiveBySlug(req.params.slug)
  if (!tenant) throw new HttpError(404, 'Negocio no encontrado')
  res.set('Cache-Control', 'public, max-age=300')
  res.json({
    slug: tenant.slug,
    name: tenant.name,
    primaryColor: tenant.primary_color,
    logoUrl: tenant.logo_url,
  })
}
