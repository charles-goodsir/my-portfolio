import { useEffect, useState } from 'react'

const WORKER_URL = 'https://visitor-map.charlesgoodsirportfolio.workers.dev'
const VISITED_KEY = 'visitor-map-counted'

export interface VisitorStats {
  total: number
  byCountry: Record<string, number>
}

export function useVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null)

  useEffect(() => {
    async function run() {
      if (!localStorage.getItem(VISITED_KEY)) {
        try {
          await fetch(`${WORKER_URL}/visit`, { method: 'POST' })
          localStorage.setItem(VISITED_KEY, '1')
        } catch {
          // Worker unreachable - skip silently, no user-facing error.
        }
      }
      try {
        const res = await fetch(`${WORKER_URL}/stats`)
        setStats(await res.json())
      } catch {
        // Fail silently - caller renders its empty/loading state instead.
      }
    }
    run()
  }, [])

  return stats
}
