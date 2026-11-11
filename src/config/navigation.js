import { HOME_ANCHORS, PATHS, toAnchor } from '../routing/paths'

/** Navegación principal (misma en escritorio y móvil). */
export const MAIN_LINKS = Object.freeze([
  { to: PATHS.services, label: 'Qué hacemos' },
  { to: toAnchor(HOME_ANCHORS.process), label: 'Cómo trabajamos' },
  { to: PATHS.platform, label: 'Plataforma' },
  { to: toAnchor(HOME_ANCHORS.industries), label: 'Para quién' },
])

/** Enlaces del pie de página. */
export const FOOTER_LINKS = Object.freeze([
  { to: PATHS.home, label: 'Inicio' },
  { to: PATHS.services, label: 'Qué hacemos' },
  { to: PATHS.platform, label: 'Plataforma' },
  { to: PATHS.contact, label: 'Contacto' },
  { to: PATHS.privacy, label: 'Política de privacidad' },
])
