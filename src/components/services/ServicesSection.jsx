import SectionHeading from '../ui/SectionHeading'
import ServiceList from './ServiceList'
import { HOME_ANCHORS } from '../../routing/paths'
import { services } from '../../content/es'
import styles from './Services.module.css'

/** Sección "Qué hacemos": título fijo a la izquierda y lista de servicios a la derecha. */
export default function ServicesSection({ detailed = false }) {
  return (
    <section
      id={HOME_ANCHORS.services}
      className={styles.section}
      aria-labelledby="servicios-title"
    >
      <div className={`container ${styles.grid}`}>
        <SectionHeading
          id="servicios-title"
          eyebrow={services.eyebrow}
          title={services.title}
          lead={services.lead}
          className={styles.intro}
        />
        <ServiceList items={services.items} detailed={detailed} />
      </div>
    </section>
  )
}
