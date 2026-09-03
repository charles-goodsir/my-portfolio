import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary'

interface CommonProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

interface AsButton extends CommonProps {
  as?: 'button'
  type?: 'button' | 'submit'
  onClick?: () => void
}

interface AsLink extends CommonProps {
  as: 'link'
  to: string
}

interface AsAnchor extends CommonProps {
  as: 'a'
  href: string
}

type ButtonProps = AsButton | AsLink | AsAnchor

const styles: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  secondary: 'border border-primary text-primary hover:bg-primary/10',
}

const base =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-colors'

function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props
  const cls = `${base} ${styles[variant]} ${className}`

  if (props.as === 'link') {
    return (
      <Link to={props.to} className={cls}>
        {children}
      </Link>
    )
  }
  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {children}
      </a>
    )
  }
  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={cls}>
      {children}
    </button>
  )
}

export default Button
