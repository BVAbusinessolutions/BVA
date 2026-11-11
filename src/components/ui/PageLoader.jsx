import styles from './PageLoader.module.css'

/**
 * Carga de página: esqueleto con la forma típica (título + tarjetas) para que el contenido no "salte".
 * `fullScreen` (arranque de la app) centra un indicador; `page` añade el contenedor y márgenes.
 */
export default function PageLoader({ fullScreen = false, page = false }) {
  if (fullScreen) {
    return (
      <div role="status" className={styles.fullScreen}>
        <span className={styles.spinner} aria-hidden="true" />
        <span className="visually-hidden">Cargando</span>
      </div>
    )
  }
  return (
    <div role="status" className={`${styles.page} ${page ? 'container' : ''}`}>
      <span className="visually-hidden">Cargando</span>
      <div className={`skeleton ${styles.eyebrow}`} aria-hidden="true" />
      <div className={`skeleton ${styles.title}`} aria-hidden="true" />
      <div className={`skeleton ${styles.lead}`} aria-hidden="true" />
      <div className={styles.cards} aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`skeleton ${styles.card}`} />
        ))}
      </div>
    </div>
  )
}
