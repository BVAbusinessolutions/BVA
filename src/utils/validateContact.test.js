import { describe, expect, it } from 'vitest'
import { validateContact } from './validateContact'

const valid = {
  name: 'Ana',
  email: 'ana@negocio.com',
  whatsapp: '',
  message: 'Quiero automatizar las citas',
  consent: true,
}

describe('validateContact', () => {
  it('acepta un formulario completo', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('exige el consentimiento (la casilla no viene marcada)', () => {
    expect(validateContact({ ...valid, consent: false })).toHaveProperty('consent')
  })

  it('rechaza correos inválidos', () => {
    expect(validateContact({ ...valid, email: 'ana@' })).toHaveProperty('email')
  })

  it('el WhatsApp es opcional pero, si se escribe, debe ser un número', () => {
    expect(validateContact({ ...valid, whatsapp: 'abc' })).toHaveProperty('whatsapp')
    expect(validateContact({ ...valid, whatsapp: '+506 8888 8888' })).toEqual({})
  })

  it('limita el largo del mensaje', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(2001) })).toHaveProperty('message')
  })
})
