import { buildAccentPalette, contrastRatio, parseHex, safeLogoUrl, DARK_BASE } from './accentColor'

const base = parseHex(DARK_BASE)
const ratio = (hex) => contrastRatio(parseHex(hex), base)

describe('buildAccentPalette', () => {
  it('mantiene el azul de BVA tal cual porque ya contrasta', () => {
    expect(buildAccentPalette('#2F5BFF')['--accent']).toBe('#2f5bff')
  })

  it('aclara un color de cliente demasiado oscuro hasta que se vea sobre el negro', () => {
    const palette = buildAccentPalette('#1a0f3d')
    expect(ratio(palette['--accent'])).toBeGreaterThanOrEqual(3)
    expect(ratio(palette['--accent-soft'])).toBeGreaterThanOrEqual(4.5)
  })

  it('elige texto oscuro encima de un acento claro', () => {
    expect(buildAccentPalette('#ffd60a')['--accent-contrast']).toBe(DARK_BASE)
    expect(buildAccentPalette('#2f5bff')['--accent-contrast']).toBe('#ffffff')
  })

  it('usa el color de BVA si el del cliente no es válido', () => {
    expect(buildAccentPalette('red; background: white')['--accent']).toBe('#2f5bff')
  })

  it('nunca toca el fondo', () => {
    expect(Object.keys(buildAccentPalette('#ff0066'))).not.toContain('--ink')
  })
})

describe('safeLogoUrl', () => {
  it('acepta https y rutas propias, rechaza el resto', () => {
    expect(safeLogoUrl('https://cdn.bva.cr/logo.svg')).toBe('https://cdn.bva.cr/logo.svg')
    expect(safeLogoUrl('/img/logo.svg')).toBe('/img/logo.svg')
    expect(safeLogoUrl('javascript:alert(1)')).toBeNull()
    expect(safeLogoUrl('http://inseguro.com/logo.png')).toBeNull()
    expect(safeLogoUrl('//otro-sitio.com/logo.png')).toBeNull()
  })
})
