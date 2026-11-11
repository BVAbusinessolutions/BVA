/** Funciones de interpolación para las animaciones 3D. Todas reciben y devuelven valores 0..1. */
export const clamp01 = (x) => Math.min(1, Math.max(0, x))

/** Avance de `value` dentro del tramo [start, end], limitado a 0..1. */
export const range = (value, start, end) => clamp01((value - start) / (end - start))

export const easeOutCubic = (x) => 1 - (1 - x) ** 3

export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)

/** Sale con un pequeño rebote al final. */
export const easeOutBack = (x) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
}
