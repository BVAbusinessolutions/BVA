import Logo from '../components/brand/Logo'
import Button from '../components/ui/Button'
import { usePageMeta } from '../hooks/usePageMeta'
import { PATHS } from '../routing/paths'
import { pages } from '../content/es'
import styles from './NotFoundPage.module.css'

const text = pages.notFound

export default function NotFoundPage() {
  usePageMeta({ title: text.title, noindex: true })
  return (
    <section className={styles.page} aria-labelledby="notfound-title">
      <div className={`container ${styles.inner}`}>
        <Logo size={96} tone="light" />
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 id="notfound-title" className={styles.title}>
          {text.heading}
        </h1>
        <p className={styles.text}>{text.text}</p>
        <div className={styles.actions}>
          <Button to={PATHS.home}>{text.home}</Button>
          <Button to={PATHS.contact} variant="secondary" onDark>
            {text.contact}
          </Button>
        </div>
      </div>
    </section>
  )
}
