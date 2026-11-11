import styles from './Form.module.css'

/** Etiqueta + control + mensaje de error, con el id enlazado para lectores de pantalla. */
export default function Field({ id, label, error, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
