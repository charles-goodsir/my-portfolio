import type { ReactNode } from 'react'

interface ProseProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper for verbatim body copy: sets a readable measure and paragraph rhythm.
 * Replaces the ad-hoc `prose prose-lg` classes (Tailwind Typography isn't installed).
 */
function Prose({ children, className = '' }: ProseProps) {
  return (
    <div
      className={`max-w-[65ch] text-ink [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p]:leading-relaxed ${className}`}
    >
      {children}
    </div>
  )
}

export default Prose
