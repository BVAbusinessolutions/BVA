import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import TextInput from '../ui/TextInput'
import TextArea from '../ui/TextArea'
import Checkbox from '../ui/Checkbox'
import StatusMessage from '../ui/StatusMessage'
import { useContactForm } from '../../hooks/useContactForm'
import { PATHS } from '../../routing/paths'
import { SITE } from '../../config/site'
import { contact } from '../../content/es'
import formStyles from '../ui/Form.module.css'
import styles from './ContactForm.module.css'

const { form: text } = contact

const STATUS_TONE = { sent: 'ok', simulated: 'neutral', error: 'error' }

function statusText(status) {
  if (status === 'sent') return text.sent
  if (status === 'simulated') return text.simulated
  if (status === 'error') return `${text.error} También puedes escribirnos a ${SITE.email}.`
  return ''
}

/** Formulario de contacto: la lógica vive en useContactForm; aquí solo se muestra. */
export default function ContactForm() {
  const { values, errors, status, handleChange, handleSubmit } = useContactForm()
  const sending = status === 'sending'

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <TextInput
          id="contacto-name"
          name="name"
          label={text.name}
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <TextInput
          id="contacto-email"
          name="email"
          type="email"
          label={text.email}
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>

      <div className={styles.row}>
        <TextInput
          id="contacto-whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          label={text.whatsapp}
          autoComplete="tel"
          value={values.whatsapp}
          onChange={handleChange}
          error={errors.whatsapp}
        />
        <TextInput
          id="contacto-business"
          name="business"
          label={text.business}
          value={values.business}
          onChange={handleChange}
        />
      </div>

      <TextArea
        id="contacto-message"
        name="message"
        label={text.message}
        value={values.message}
        onChange={handleChange}
        error={errors.message}
        required
      />

      {/* Campo trampa para bots: las personas no lo ven ni lo pueden enfocar. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contacto-website">No llenar este campo</label>
        <input
          id="contacto-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={handleChange}
        />
      </div>

      <Checkbox
        id="contacto-consent"
        name="consent"
        label={text.consent}
        help={text.purpose}
        error={errors.consent}
        checked={values.consent}
        onChange={handleChange}
      >
        <Link to={PATHS.privacy} className={formStyles.link}>
          {text.privacyLink}
        </Link>
      </Checkbox>

      <div className={styles.footer}>
        <Button type="submit" disabled={sending}>
          {sending ? text.sending : text.submit}
        </Button>
        <StatusMessage tone={STATUS_TONE[status] ?? 'neutral'}>{statusText(status)}</StatusMessage>
      </div>
    </form>
  )
}
