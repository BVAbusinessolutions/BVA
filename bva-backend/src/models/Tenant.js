import { pool } from '../config/db.js'

/** Tenants (cada pyme cliente). Consultas parametrizadas, igual que en User. */
export function createTenantModel(db) {
  async function findActiveBySlug(slug) {
    const [rows] = await db.execute(
      `SELECT id, slug, name, primary_color, logo_url, status FROM tenants
       WHERE slug = ? AND status IN ('trial', 'active') LIMIT 1`,
      [String(slug ?? '')],
    )
    return rows[0] ?? null
  }
  return Object.freeze({ findActiveBySlug })
}

export const Tenant = createTenantModel(pool)
export default Tenant
