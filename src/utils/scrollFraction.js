/**
 * Fracción (0..1) recorrida de una sección alta con contenido "sticky".
 * 0 = la parte superior de la sección toca el borde superior de la ventana.
 * 1 = la parte inferior de la sección toca el borde inferior de la ventana.
 * @param {{ top: number, height: number }} rect resultado de getBoundingClientRect()
 * @param {number} viewportHeight alto visible de la ventana
 */
export function scrollFraction(rect, viewportHeight) {
  const travel = rect.height - viewportHeight
  if (travel <= 0) return rect.top <= 0 ? 1 : 0
  return clamp01(-rect.top / travel)
}

export const clamp01 = (value) => Math.min(1, Math.max(0, value))
