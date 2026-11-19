import { Link } from 'react-router-dom'
import PageHero from '../components/layout/PageHero'
import { usePageMeta } from '../hooks/usePageMeta'
import { PATHS } from '../routing/paths'
import { terms } from '../content/es'
import styles from './PrivacyPage.module.css'

/** /terminos: términos y condiciones (borrador hasta que la revise un abogado). */
export default function TermsPage() {
  usePageMeta({
    title: 'Términos y condiciones',
    description: 'Términos y condiciones de uso del sitio y de la plataforma de BVA Business Solutions.',
    noindex: true,
  })
  return (
    <>
      <PageHero eyebrow="Legal" title="Términos y condiciones" lead={terms.updatedAt} />
      <article className={`container ${styles.article}`}>
        <p className={styles.draft}>
          <strong>Borrador para revisión.</strong> {terms.draftNotice}
        </p>
        {terms.sections.map((section) => (
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
