import { memo } from 'react'
import { platform } from '../../../content/es'
import styles from './PlatformDemo.module.css'

const { demo } = platform

/** Tarjeta en vivo: entra en "Nuevos" y se desliza de columna en columna hasta cerrarse. */
function LiveCard({ column, done }) {
  const visible = column !== null
  return (
    <span
      className={`${styles.card} ${styles.liveCard} ${visible ? styles.liveVisible : ''} ${done ? styles.liveDone : ''}`}
      style={{ '--col': visible ? column : 0 }}
    >
      <span className={styles.cardLine} />
      <strong>{demo.liveCard.name}</strong>
      <span className={styles.cardDetail}>{done ? demo.liveCard.done : demo.liveCard.detail}</span>
    </span>
  )
}

/** Tablero de ventas tipo kanban. */
function DemoBoardBase({ column, done }) {
  return (
    <div className={styles.board}>
      {demo.columns.map((item) => (
        <div key={item.title} className={styles.column}>
          <span className={styles.columnTitle}>{item.title}</span>
          {item.cards.map((card) => (
            <span key={card} className={styles.card}>
              <span className={styles.cardLine} />
              {card}
            </span>
          ))}
        </div>
      ))}
      <LiveCard column={column} done={done} />
    </div>
  )
}

const DemoBoard = memo(DemoBoardBase)
export default DemoBoard
