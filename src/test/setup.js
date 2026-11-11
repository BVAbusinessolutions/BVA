import '@testing-library/jest-dom/vitest'

// jsdom no trae IntersectionObserver: en las pruebas nada "entra en pantalla",
// así las escenas 3D no se cargan y no hace falta WebGL.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver = NoopIntersectionObserver
window.scrollTo = () => {}
