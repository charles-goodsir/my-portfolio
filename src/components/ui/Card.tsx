import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface CardProps {
  children: ReactNode
  /** When set, the whole card is a link. */
  to?: string
  className?: string
}

const base =
  'block bg-card border border-line rounded-lg shadow-card p-6'

function Card({ children, to, className = '' }: CardProps) {
  if (to) {
    return (
      <Link
        to={to}
        className={`${base} transition-colors hover:border-primary ${className}`}
      >
        {children}
      </Link>
    )
  }
  return <div className={`${base} ${className}`}>{children}</div>
}

export default Card
