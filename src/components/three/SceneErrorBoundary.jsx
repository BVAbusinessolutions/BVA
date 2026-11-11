import { Component } from 'react'

/** Si el navegador no soporta WebGL, muestra el contenido de respaldo en vez de romper la página. */
export default class SceneErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('[3D] Escena desactivada:', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
