import { getJson } from './httpClient'
import { MOCK_TENANTS } from '../config/tenants'

const API_URL = (import.meta.env.VITE_TENANT_API_URL ?? '').replace(/\/+$/, '')
const MOCK_DELAY_MS = 150

/**
 * Configuración visual del cliente (tenant): { slug, name, primaryColor, logoUrl }.
 * Con VITE_TENANT_API_URL la pide al backend; sin ella, simula la respuesta.
 * Es información pública de marca: no lleva tokens ni datos privados.
 * @param {string} slug
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function fetchTenantTheme(slug, { signal } = {}) {
  if (API_URL) {
    return getJson(`${API_URL}/tenants/${encodeURIComponent(slug)}/theme`, { signal })
  }
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
  return MOCK_TENANTS[slug] ?? MOCK_TENANTS.bva
}
