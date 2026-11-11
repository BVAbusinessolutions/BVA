import SectionHeading from '../ui/SectionHeading'
import IndustryCard from './IndustryCard'
import { HOME_ANCHORS } from '../../routing/paths'
import { industries } from '../../content/es'
import styles from './Industries.module.css'

/** Sección "Para quién": tipos de negocio en una cuadrícula con revelado escalonado. */
export default function IndustriesSection() {
  return (
    <section
      id={HOME_ANCHORS.industries}
      className={styles.section}
      aria-labelledby="negocios-title"
    >
      <div className="container">
        <SectionHeading
          id="negocios-title"
          eyebrow={industries.eyebrow}
          title={industries.title}
          lead={industries.lead}
        />
        <ul className={styles.grid}>
          {industries.items.map((item, index) => (
            <IndustryCard key={item.name} item={item} delay={(index % 3) * 60} />
          ))}
        </ul>
      </div>
    </section>
  )
}
