import styles from './Form.module.css'

/** Mensaje de estado de un formulario, anunciado en vivo a lectores de pantalla. */
export default function StatusMessage({ tone = 'neutral', children }) {
  const toneClass = tone === 'ok' ? styles.statusOk : tone === 'error' ? styles.statusError : ''
  return (
    <p className={`${styles.status} ${toneClass}`} role="status" aria-live="polite">
      {children}
    </p>
  )
}
