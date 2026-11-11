import { memo } from 'react'
import Field from './Field'
import styles from './Form.module.css'

/** Área de texto con etiqueta y error. */
function TextAreaBase({ id, name, label, error, value, onChange, rows = 4, required, ...rest }) {
  return (
    <Field id={id} label={label} error={error}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${styles.input} ${styles.textarea}`}
        {...rest}
      />
    </Field>
  )
}

const TextArea = memo(TextAreaBase)
export default TextArea
