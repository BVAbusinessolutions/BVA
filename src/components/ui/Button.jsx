import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

/**
 * Botón accesible con los estilos de marca y área táctil mínima de 48 px.
 * Con `to` se renderiza como enlace interno (React Router); con `href`, como enlace externo;
 * sin ninguno, como <button>. `onDark` ajusta la variante secundaria sobre fondos oscuros.
 */
const Button = forwardRef(function Button(
  { to, href, variant = 'primary', onDark = false, className = '', children, ...rest },
  ref,
) {
  const classes = [styles.button, styles[variant], onDark ? styles.onDark : '', className]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={classes} {...rest}>
      {children}
    </button>
  )
})

export default Button
