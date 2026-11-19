import { Link } from 'react-router-dom'
import BrandLink from '../brand/BrandLink'
import { FOOTER_LINKS } from '../../config/navigation'
import { SITE, whatsappLabel, whatsappUrl } from '../../config/site'
import { footer } from '../../content/es'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <BrandLink size={40} showFullName />
          <p className={styles.tagline}>{SITE.tagline}</p>
        </div>

        <nav aria-label="Enlaces del sitio" className={styles.column}>
          <h2 className={styles.columnTitle}>{footer.columns.site}</h2>
          <ul className={styles.links}>
            {FOOTER_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>{footer.columns.contact}</h2>
          <ul className={styles.links}>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                WhatsApp {whatsappLabel()}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.legal}`}>
        <p>{footer.cookies}</p>
        <p>
          © {year} {SITE.legalName}, {SITE.country}. Todos los derechos reservados. El nombre, logo y contenido del sitio son propiedad de {SITE.legalName}.
        </p>
      </div>
    </footer>
  )
}
