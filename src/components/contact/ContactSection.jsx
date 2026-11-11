import LazyScene from '../three/LazyScene'
import SectionHeading from '../ui/SectionHeading'
import ContactForm from './ContactForm'
import ContactDirect from './ContactDirect'
import { HOME_ANCHORS } from '../../routing/paths'
import { contact } from '../../content/es'
import styles from './Contact.module.css'

const loadPlayField = () => import('../three/scenes/PlayFieldScene')

/** Sección de contacto: texto y datos directos a la izquierda, formulario a la derecha. */
export default function ContactSection({ headingAs = 'h2' }) {
  return (
    <section id={HOME_ANCHORS.contact} className={styles.section} aria-labelledby="contacto-title">
      <LazyScene loader={loadPlayField} label={contact.sceneLabel} className={styles.background} />

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionHeading
            as={headingAs}
            id="contacto-title"
            eyebrow={contact.eyebrow}
            title={contact.title}
            lead={contact.lead}
            size="lg"
            onDark
          />
          <ContactDirect />
        </div>
        <div className={styles.formColumn}>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
