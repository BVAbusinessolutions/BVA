import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

const isChunkError = (err) =>
  /dynamically imported module|Failed to fetch|Importing a module script failed|ChunkLoadError/i.test(
    err?.message ?? '',
  )

/**
 * Atrapa errores de una pantalla para que no quede en blanco. `resetKey` (la ruta actual)
 * lo reinicia al navegar a otra página. Con `silent`, una pieza auxiliar que falla
 * simplemente no se muestra y el resto del sitio sigue.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ui] pantalla con error', error, info?.componentStack)
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey)
      this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.silent) return null
    const chunk = isChunkError(error)
    return (
      <div role="alert" className={`container ${styles.wrap}`}>
        <div className={styles.box}>
          <h1 className={styles.title}>
            {chunk ? 'Hay una versión nueva del sitio' : 'Esta pantalla tuvo un problema'}
          </h1>
          <p className={styles.text}>
            {chunk
              ? 'Recarga la página para descargarla.'
              : 'Intenta de nuevo; si sigue pasando, escríbenos y lo revisamos.'}
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => (chunk ? window.location.reload() : this.setState({ error: null }))}
            >
              {chunk ? 'Recargar' : 'Intentar de nuevo'}
            </button>
            <a href="/" className={styles.secondary}>
              Ir al inicio
            </a>
          </div>
        </div>
      </div>
    )
  }
}
