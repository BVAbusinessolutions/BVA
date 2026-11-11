import { memo } from 'react'
import { SITE, whatsappLabel, whatsappUrl } from '../../config/site'
import { contact } from '../../content/es'
import styles from './Contact.module.css'

/** Correo y WhatsApp directos, para quien prefiere no llenar el formulario. */
function ContactDirectBase() {
  return (
    <div className={styles.direct}>
      <p className={styles.directTitle}>{contact.directTitle}</p>
      <ul className={styles.directList}>
        <li>
          Correo: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </li>
        <li>
          WhatsApp:{' '}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            {whatsappLabel()}
          </a>
        </li>
      </ul>
    </div>
  )
}

const ContactDirect = memo(ContactDirectBase)
export default ContactDirect
