import PageHero from '../components/layout/PageHero'
import Button from '../components/ui/Button'
import ServicesSection from '../components/services/ServicesSection'
import ProcessSection from '../components/process/ProcessSection'
import CtaBanner from '../components/cta/CtaBanner'
import { PATHS } from '../routing/paths'
import { usePageMeta } from '../hooks/usePageMeta'
import { pages, services } from '../content/es'

/** /servicios: cada servicio con sus detalles, el proceso de trabajo y un llamado a la acción. */
export default function ServicesPage() {
  usePageMeta({ title: pages.services.title, description: pages.services.description })
  return (
    <>
      <PageHero
        eyebrow={services.eyebrow}
        title={pages.services.heroTitle}
        lead={pages.services.heroLead}
      >
        <Button to={PATHS.contact}>Ponlo en marcha</Button>
      </PageHero>
      <ServicesSection detailed />
      <ProcessSection />
      <CtaBanner />
    </>
  )
}
