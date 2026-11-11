/** Avance del scroll de la página, de 0 (arriba) a 1 (abajo). */
export function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? window.scrollY / max : 0
}
