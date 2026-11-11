import { useInView } from '../../hooks/useInView'

/** Muestra su contenido con un revelado corto cuando entra en pantalla (solo opacity y transform). */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -10% 0px', once: true })
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
