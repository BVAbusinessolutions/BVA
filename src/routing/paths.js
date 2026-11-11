// Única fuente de verdad para las URLs del sitio. Cambia una ruta aquí y no en cada <Link>.
export const PATHS = Object.freeze({
  home: '/',
  services: '/servicios',
  platform: '/plataforma',
  contact: '/contacto',
  privacy: '/privacidad',
})

/** Anclas de las secciones de la portada (/#proceso, /#negocios…). */
export const HOME_ANCHORS = Object.freeze({
  services: 'servicios',
  process: 'proceso',
  platform: 'plataforma',
  industries: 'negocios',
  contact: 'contacto',
})

/** Ruta a una sección de la portada: toAnchor('proceso') -> "/#proceso" */
export const toAnchor = (anchor) => `${PATHS.home}#${anchor}`
