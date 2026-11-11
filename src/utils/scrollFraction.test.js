import { scrollFraction } from './scrollFraction'

describe('scrollFraction', () => {
  const vh = 800

  it('es 0 antes de entrar y 1 al terminar la sección', () => {
    expect(scrollFraction({ top: 300, height: 2400 }, vh)).toBe(0)
    expect(scrollFraction({ top: -1600, height: 2400 }, vh)).toBe(1)
    expect(scrollFraction({ top: -5000, height: 2400 }, vh)).toBe(1)
  })

  it('avanza en proporción al recorrido', () => {
    expect(scrollFraction({ top: -800, height: 2400 }, vh)).toBe(0.5)
  })

  it('no divide entre cero si la sección mide lo mismo que la ventana', () => {
    expect(scrollFraction({ top: 0, height: 800 }, vh)).toBe(1)
    expect(scrollFraction({ top: 10, height: 800 }, vh)).toBe(0)
  })
})
