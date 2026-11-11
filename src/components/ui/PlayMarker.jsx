import styles from './PlayMarker.module.css'

/** Pequeño triángulo de play de marca (decorativo). `tone="line"` gris, `tone="blue"` azul. */
export default function PlayMarker({ tone = 'blue', size = 'md', className = '' }) {
  return (
    <span
      className={`${styles.marker} ${styles[tone]} ${styles[size]} ${className}`.trim()}
      aria-hidden="true"
    />
  )
}
