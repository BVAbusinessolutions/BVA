import styles from './PlatformDemo.module.css'

/** Puntero que se desliza entre los elementos; al hacer clic deja una onda. */
export default function DemoCursor({ position, click, frameKey }) {
  const [x, y] = position
  return (
    <span className={styles.cursor} style={{ left: `${x}%`, top: `${y}%` }}>
      {click && <span key={frameKey} className={styles.ripple} />}
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M5 3l14 8-6.2 1.6L10 19z"
          fill="#FFFFFF"
          stroke="#0A0A0B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
