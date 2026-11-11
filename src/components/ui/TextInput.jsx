import { memo } from 'react'
import Field from './Field'
import styles from './Form.module.css'

/** Campo de texto de una línea con etiqueta y error. `error` se anuncia al lector de pantalla. */
function TextInputBase({ id, name, label, error, value, onChange, required, ...rest }) {
  return (
    <Field id={id} label={label} error={error}>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={styles.input}
        {...rest}
      />
    </Field>
  )
}

const TextInput = memo(TextInputBase)
export default TextInput
