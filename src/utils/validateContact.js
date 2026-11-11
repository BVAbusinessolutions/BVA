const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Valida el formulario de contacto. El servidor (n8n) debe validar de nuevo.
 * @param {{ name: string, email: string, whatsapp?: string, message: string, consent: boolean }} values
 * @returns {Record<string, string>} errores por campo; vacío si todo está bien
 */
export function validateContact(values) {
  const errors = {}
  const name = values.name?.trim() ?? ''
  const email = values.email?.trim() ?? ''
  const message = values.message?.trim() ?? ''
  const whatsapp = values.whatsapp?.trim() ?? ''

  if (name.length < 2) errors.name = 'Escribe tu nombre.'
  if (!EMAIL_PATTERN.test(email))
    errors.email = 'Escribe un correo válido, por ejemplo nombre@negocio.com.'
  if (whatsapp && !/^[+\d\s-]{8,16}$/.test(whatsapp)) {
    errors.whatsapp = 'Escribe solo números, por ejemplo 8888 8888.'
  }
  if (message.length < 10) errors.message = 'Cuéntanos un poco más (al menos 10 caracteres).'
  if (message.length > 2000) errors.message = 'El mensaje es muy largo (máximo 2000 caracteres).'
  if (!values.consent) errors.consent = 'Necesitamos tu autorización para responderte.'

  return errors
}
