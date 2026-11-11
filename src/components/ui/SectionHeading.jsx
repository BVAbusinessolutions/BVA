import styles from './SectionHeading.module.css'

/**
 * Título de sección consistente: eyebrow opcional, título (h2 por defecto) y descripción.
 * `onDark` para secciones con fondo oscuro. `id` va en el título para aria-labelledby.
 */
export default function SectionHeading({
  as: Tag = 'h2',
  id,
  eyebrow,
  title,
  lead,
  onDark = false,
  size = 'xl',
  className = '',
}) {
  const classes = [styles.heading, onDark ? styles.onDark : '', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Tag id={id} className={size === 'lg' ? styles.titleLg : styles.titleXl}>
        {title}
      </Tag>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  )
}
