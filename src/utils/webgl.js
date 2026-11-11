let supported = null

/** true si el navegador puede crear un contexto WebGL. En pruebas (jsdom) siempre es false. */
export function hasWebGL() {
  if (supported !== null) return supported
  if (typeof window === 'undefined' || typeof window.WebGLRenderingContext === 'undefined') {
    supported = false
    return supported
  }
  try {
    const canvas = document.createElement('canvas')
    supported = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    supported = false
  }
  return supported
}
