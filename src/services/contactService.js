import { postJson } from './httpClient'
import { SITE } from '../config/site'

const WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL

/**
 * Envía la solicitud de contacto al webhook de n8n.
 * Sin URL configurada, en desarrollo simula el envío para poder probar la interfaz.
 * @param {{ name: string, email: string, whatsapp: string, business: string, message: string }} data
 * @returns {Promise<{ simulated: boolean }>}
 */
export async function sendContactRequest(data) {
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    whatsapp: data.whatsapp.trim() || null,
    business: data.business.trim() || null,
    message: data.message.trim(),
    consent: {
      accepted: true,
      at: new Date().toISOString(),
      policyVersion: SITE.privacyVersion,
    },
    source: 'web-bva',
  }

  if (!WEBHOOK_URL) {
    if (import.meta.env.DEV) {
      console.info('[contacto] Sin VITE_CONTACT_WEBHOOK_URL: envío simulado.', payload)
      await new Promise((resolve) => setTimeout(resolve, 700))
      return { simulated: true }
    }
    throw new Error('Falta configurar VITE_CONTACT_WEBHOOK_URL')
  }

  await postJson(WEBHOOK_URL, payload)
  return { simulated: false }
}
