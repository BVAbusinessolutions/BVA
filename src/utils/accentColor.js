/**
 * Paleta de acento para la marca blanca. El fondo SIEMPRE es oscuro (#0A0A0B); el color del
 * cliente solo se usa como acento y se ajusta hasta cumplir contraste WCAG sobre ese fondo.
 */
export const DARK_BASE = '#0a0a0b'
export const FALLBACK_ACCENT = '#2f5bff'

const HEX = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i
const WHITE = [255, 255, 255]
const BLACK = [0, 0, 0]

/** '#2F5BFF' | '2f5bff' | '#25f' → [47, 91, 255]; null si no es un color hex válido. */
export function parseHex(value) {
  const match = typeof value === 'string' ? value.trim().match(HEX) : null
  if (!match) return null
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1]
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

export const toHex = (rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`

const mix = (from, to, amount) => from.map((c, i) => Math.round(c + (to[i] - c) * amount))

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Aclara el color hacia blanco lo mínimo necesario para llegar al contraste pedido. */
function lightenUntil(rgb, base, ratio) {
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mix(rgb, WHITE, step / 20)
    if (contrastRatio(candidate, base) >= ratio) return candidate
  }
  return WHITE
}

/**
 * Variables CSS de acento a partir del color del cliente.
 * - accent: botones y bordes; al menos 3:1 sobre el fondo (WCAG 1.4.11, componentes).
 * - accent-soft: texto destacado; al menos 4.5:1 sobre el fondo (WCAG 1.4.3, texto).
 * - accent-contrast: texto encima del botón (blanco o negro, el que se lea mejor).
 * @param {string} primaryColor color hex del cliente; si no es válido se usa el de BVA
 * @returns {Record<string, string>}
 */
export function buildAccentPalette(primaryColor) {
  const base = parseHex(DARK_BASE)
  const accent = lightenUntil(parseHex(primaryColor) ?? parseHex(FALLBACK_ACCENT), base, 3)
  const soft = lightenUntil(accent, base, 4.5)
  const onAccent = contrastRatio(WHITE, accent) >= contrastRatio(base, accent) ? WHITE : base

  return {
    '--accent': toHex(accent),
    '--accent-strong': toHex(mix(accent, BLACK, 0.15)),
    '--accent-soft': toHex(soft),
    '--accent-contrast': toHex(onAccent),
    '--accent-rgb': accent.join(', '),
  }
}

/** Solo se aceptan logos por https o rutas del mismo sitio (nada de javascript: ni data:). */
export function safeLogoUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    return new URL(value).protocol === 'https:' ? value : null
  } catch {
    return null
  }
}
