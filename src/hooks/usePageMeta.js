import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE } from '../config/site'

const DEFAULT_TITLE = `${SITE.name} · ${SITE.tagline.replace(/\.$/, '')}`
const DEFAULT_DESCRIPTION =
  'Páginas web, automatización e inteligencia artificial para pymes y empresarios de Costa Rica.'

/** Crea o actualiza una etiqueta <meta>/<link> del <head> (las de index.html se reutilizan). */
function setHeadTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const meta = (key, value, attr = 'name') =>
  setHeadTag(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement('meta')
      m.setAttribute(attr, key)
      return m
    },
    'content',
    value,
  )

/**
 * Título, descripción, URL canónica y Open Graph por página (SPA): los buscadores y el historial
 * del navegador ven el título correcto de cada sección. `noindex` para páginas que no deben indexarse.
 */
export function usePageMeta({ title, description = DEFAULT_DESCRIPTION, noindex = false } = {}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE.shortName}` : DEFAULT_TITLE
    document.title = fullTitle
    meta('description', description)
    meta('robots', noindex ? 'noindex, follow' : 'index, follow')
    meta('og:title', fullTitle, 'property')
    meta('og:description', description, 'property')
    if (SITE.url) {
      const url = `${SITE.url}${pathname}`
      meta('og:url', url, 'property')
      setHeadTag(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement('link')
          l.rel = 'canonical'
          return l
        },
        'href',
        url,
      )
    }
  }, [title, description, noindex, pathname])
}
