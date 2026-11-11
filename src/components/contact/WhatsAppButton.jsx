import { useLocation } from 'react-router-dom'
import { whatsappUrl } from '../../config/site'
import { PATHS } from '../../routing/paths'
import styles from './WhatsAppButton.module.css'

/** Botón flotante para escribir por WhatsApp. No aparece en /contacto, donde ya están los datos. */
export default function WhatsAppButton() {
  const { pathname } = useLocation()
  if (pathname === PATHS.contact) return null

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Escríbenos por WhatsApp (se abre en otra pestaña)"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6A.5.5 0 0 1 5 19.2V16a2.5 2.5 0 0 1-1-2V5.5Z"
          fill="currentColor"
        />
      </svg>
      <span className={styles.label}>WhatsApp</span>
    </a>
  )
}
