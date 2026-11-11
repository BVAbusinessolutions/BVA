import ContactSection from '../components/contact/ContactSection'
import { usePageMeta } from '../hooks/usePageMeta'
import { pages } from '../content/es'
import styles from './ContactPage.module.css'

/** /contacto: formulario y datos directos (el título pasa a h1). */
export default function ContactPage() {
  usePageMeta({ title: pages.contact.title, description: pages.contact.description })
  return (
    <div className={styles.page}>
      <ContactSection headingAs="h1" />
    </div>
  )
}
