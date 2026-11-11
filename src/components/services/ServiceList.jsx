import ServiceItem from './ServiceItem'
import styles from './Services.module.css'

/** Lista de servicios. Con `detailed` muestra también los puntos de cada uno (página /servicios). */
export default function ServiceList({ items, detailed = false }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <ServiceItem key={item.id} item={item} detailed={detailed} />
      ))}
    </ul>
  )
}
