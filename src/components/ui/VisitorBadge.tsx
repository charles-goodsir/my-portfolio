import { Link } from 'react-router'
import { useVisitorStats } from '../useVisitorStats'

function VisitorBadge() {
  const stats = useVisitorStats()

  return (
    <Link
      to="/visitors"
      className="fixed bottom-4 right-4 z-10 flex items-center gap-1.5 bg-card border border-line rounded-full shadow-card px-3 py-1.5 text-xs text-ink-muted hover:border-primary hover:text-primary transition-colors"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"
        />
      </svg>
      {stats ? `${stats.total} visitors` : '···'}
    </Link>
  )
}

export default VisitorBadge
