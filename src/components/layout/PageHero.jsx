import SectionHeading from '../ui/SectionHeading'
import styles from './PageHero.module.css'

/** Cabecera oscura de las páginas internas: eyebrow, título (h1) y descripción. */
export default function PageHero({ eyebrow, title, lead, children }) {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className={`container ${styles.inner}`}>
        <SectionHeading
          as="h1"
          id="page-title"
          eyebrow={eyebrow}
          title={title}
          lead={lead}
          onDark
        />
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </section>
  )
}
