import { memo } from 'react'
import Reveal from '../ui/Reveal'
import styles from './Industries.module.css'

/** Un tipo de negocio con su ejemplo de automatización. */
function IndustryCardBase({ item, delay = 0 }) {
  return (
    <Reveal as="li" delay={delay} className={styles.item}>
      <h3 className={styles.name}>{item.name}</h3>
      <p className={styles.text}>{item.text}</p>
    </Reveal>
  )
}

const IndustryCard = memo(IndustryCardBase)
export default IndustryCard
