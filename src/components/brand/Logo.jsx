import { memo } from 'react'

/**
 * Isotipo de BVA: una B formada por una base y dos botones de play.
 * `tone="dark"` para fondos claros, `tone="light"` para fondos oscuros.
 * Con `title` es una imagen accesible; sin él es decorativo.
 */
function LogoBase({ size = 32, tone = 'dark', title, className }) {
  const base = tone === 'light' ? '#FFFFFF' : '#0A0A0B'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x="12" y="10" width="9" height="44" rx="3" fill={base} />
      <path
        d="M21 10 L44 21 L21 32 Z"
        fill={base}
        stroke={base}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M21 32 L49 43 L21 54 Z"
        fill="#2F5BFF"
        stroke="#2F5BFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const Logo = memo(LogoBase)
export default Logo
