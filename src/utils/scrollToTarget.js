const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Lleva la vista al elemento con ese id y lo resalta un instante.
 * @returns {boolean} false si el elemento todavía no existe (la página puede estar cargando)
 */
export function scrollToTarget(id) {
  const element = document.getElementById(id)
  if (!element) return false
  element.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
  element.classList.add('target-highlight')
  element.addEventListener('animationend', () => element.classList.remove('target-highlight'), {
    once: true,
  })
  return true
}
