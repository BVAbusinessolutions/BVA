import Hero from '../components/hero/Hero'
import ServicesSection from '../components/services/ServicesSection'
import ProcessSection from '../components/process/ProcessSection'
import PlatformSection from '../components/platform/PlatformSection'
import IndustriesSection from '../components/industries/IndustriesSection'
import ContactSection from '../components/contact/ContactSection'
import { usePageMeta } from '../hooks/usePageMeta'
import { pages } from '../content/es'

/** Portada: todas las secciones en orden. Las escenas 3D cargan al acercarse a cada una. */
export default function HomePage() {
  usePageMeta({ description: pages.home.description })
  return (
    <>
      <Hero />
      <ServicesSection />
      <ProcessSection />
      <PlatformSection />
      <IndustriesSection />
      <ContactSection />
    </>
  )
}
