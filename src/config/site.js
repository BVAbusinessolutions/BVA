// Datos públicos del sitio. Se configuran con VITE_* en .env (son públicos, no secretos).
// Los valores por defecto son de ejemplo: reemplazarlos por los reales antes de publicar.
const env = import.meta.env

export const SITE = Object.freeze({
  name: 'BVA Business Solutions',
  shortName: 'BVA',
  tagline: 'Tu negocio, en automático.',
  country: 'Costa Rica',
  email: env.VITE_CONTACT_EMAIL ?? 'hola@bva.cr',
  whatsapp: (env.VITE_CONTACT_WHATSAPP ?? '50688888888').replace(/\D/g, ''),
  url: (env.VITE_SITE_URL ?? '').replace(/\/+$/, ''),
  privacyVersion: 'borrador-2026-11',
})

/** Número de WhatsApp con formato legible: +506 8888 8888 */
export const whatsappLabel = (digits = SITE.whatsapp) =>
  digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '+$1 $2 $3')

/** Enlace directo a WhatsApp con un mensaje inicial. */
export const whatsappUrl = (text = 'Hola BVA, quiero automatizar una tarea de mi negocio.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

/**
 * Video de la portada controlado por scroll. Sin URL, la portada usa el logo en 3D.
 * Ejemplo: VITE_HERO_VIDEO_URL=/video/hero.mp4 (archivo en public/video/).
 */
export const HERO_VIDEO = Object.freeze({
  src: env.VITE_HERO_VIDEO_URL || null,
  poster: env.VITE_HERO_VIDEO_POSTER || undefined,
})
