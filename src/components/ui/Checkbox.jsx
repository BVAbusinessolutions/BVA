import { memo } from 'react'
import styles from './Form.module.css'

/**
 * Casilla con etiqueta, texto de ayuda y error. `children` va después de la etiqueta
 * (p. ej. un enlace a la política de privacidad).
 */
function CheckboxBase({ id, name, label, help, error, checked, onChange, children }) {
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={styles.checkboxRow}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={styles.checkbox}
      />
      <div>
        <label htmlFor={id}>{label}</label> {children}
        {help && (
          <p id={`${id}-help`} className={styles.help}>
            {help}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

const Checkbox = memo(CheckboxBase)
export default Checkbox
