/**
 * Videos de fondo por sección. Los archivos van en public/video/.
 * Si un archivo no existe, la sección muestra su diseño anterior (fondo 3D o color).
 *
 * Recomendado por video: 10 a 12 s en bucle, sin audio, 1280 px de ancho y menos de 2.5 MB.
 * La versión móvil, de 720 px y menos de 1 MB. Prepararlos con:
 *   ffmpeg -ss 1 -t 12 -i in.mp4 -an -vf scale=1280:-2,fps=24 -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
 *   ffmpeg -ss 1 -t 12 -i in.mp4 -an -vf scale=720:-2,fps=24 -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart hero-mobile.mp4
 *   ffmpeg -i hero.mp4 -frames:v 1 -q:v 5 hero.jpg
 *
 * Origen: Mixkit (mixkit.co), licencia gratuita para uso comercial, sin atribución obligatoria.
 *   hero      "Business people at work meeting"             mixkit.co/free-stock-video/business-people-at-work-meeting-4809/
 *   services  "Person on social media while serving coffee"  mixkit.co/free-stock-video/person-on-social-media-while-serving-coffee-4919/
 *   contact   "Signing a contract"                           mixkit.co/free-stock-video/signing-a-contract-241/
 *   cta       "World map in a digital world"                 mixkit.co/free-stock-video/world-map-in-a-digital-world-12748/
 */
const clip = (name) =>
  Object.freeze({
    src: `/video/${name}.mp4`,
    mobileSrc: `/video/${name}-mobile.mp4`,
    poster: `/video/${name}.jpg`,
  })

export const VIDEOS = Object.freeze({
  /** Portada: equipo de una pyme trabajando con pantallas y datos. */
  hero: clip('hero'),
  /** Servicios: dueña de una cafetería atendiendo sus redes desde el celular. */
  services: clip('services'),
  /** Contacto: firma de un contrato. */
  contact: clip('contact'),
  /** Llamado a la acción: mapa del mundo digital. */
  cta: clip('cta'),
})
