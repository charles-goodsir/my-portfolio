import type { ReactNode } from 'react'

type Variant = 'neutral' | 'primary' | 'success' | 'warn'

interface TagProps {
  children: ReactNode
  variant?: Variant
}

const styles: Record<Variant, string> = {
  neutral: 'bg-sunken text-ink-muted',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warn: 'bg-warn/10 text-warn',
}

function Tag({ children, variant = 'neutral' }: TagProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

export default Tag
