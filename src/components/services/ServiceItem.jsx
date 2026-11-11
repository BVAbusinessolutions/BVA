import { memo } from 'react'
import PlayMarker from '../ui/PlayMarker'
import styles from './Services.module.css'

/** Un servicio: nombre, descripción, ejemplos y, si se pide, lista de detalles. */
function ServiceItemBase({ item, detailed }) {
  return (
    <li id={item.id} className={styles.item}>
      <PlayMarker tone="line" className={styles.marker} />
      <h3 className={styles.name}>{item.name}</h3>
      <p className={styles.text}>{item.text}</p>
      <p className={styles.examples}>{item.examples}</p>
      {detailed && item.details?.length > 0 && (
        <ul className={styles.details}>
          {item.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
    </li>
  )
}

const ServiceItem = memo(ServiceItemBase)
export default ServiceItem
