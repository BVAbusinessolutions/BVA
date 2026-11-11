import { Link } from 'react-router-dom'
import PageHero from '../components/layout/PageHero'
import { usePageMeta } from '../hooks/usePageMeta'
import { PATHS } from '../routing/paths'
import { pages, privacy } from '../content/es'
import styles from './PrivacyPage.module.css'

/** /privacidad: política de privacidad (borrador hasta que la revise un abogado). */
export default function PrivacyPage() {
  usePageMeta({ title: pages.privacy.title, description: pages.privacy.description, noindex: true })
  return (
    <>
      <PageHero eyebrow="Legal" title={pages.privacy.title} lead={privacy.updatedAt} />
      <article className={`container ${styles.article}`}>
        <p className={styles.draft}>
          <strong>Borrador para revisión.</strong> {privacy.draftNotice}
        </p>
        {privacy.sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.title}>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <p>
          <Link to={PATHS.home}>Volver al inicio</Link>
        </p>
      </article>
    </>
  )
}
