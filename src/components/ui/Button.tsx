import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary'

interface ButtonProps {
  children: ReactNode
  to: string
  variant?: Variant
  className?: string
}

const styles: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  secondary: 'border border-primary text-primary hover:bg-primary/10',
}

const base =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-colors'

function Button({ children, to, variant = 'primary', className = '' }: ButtonProps) {
  return (
    <Link to={to} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}

export default Button
