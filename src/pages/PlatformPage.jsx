import PlatformSection from '../components/platform/PlatformSection'
import CtaBanner from '../components/cta/CtaBanner'
import { usePageMeta } from '../hooks/usePageMeta'
import { pages } from '../content/es'
import styles from './PlatformPage.module.css'

/** /plataforma: la sección de la plataforma como página propia (el título pasa a h1). */
export default function PlatformPage() {
  usePageMeta({ title: pages.platform.title, description: pages.platform.description })
  return (
    <div className={styles.page}>
      <PlatformSection headingAs="h1" />
      <CtaBanner />
    </div>
  )
}
