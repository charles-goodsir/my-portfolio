import { useEffect, useState } from 'react'

const WORKER_URL = 'https://visitor-map.charlesgoodsirportfolio.workers.dev'
const VISITED_KEY = 'visitor-map-counted'
// Matches the Worker's 14-day reset, so returning visitors count again.
const RECOUNT_MS = 14 * 24 * 60 * 60 * 1000

export interface VisitorStats {
  total: number
  byCountry: Record<string, number>
}

export function useVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null)

  useEffect(() => {
    async function run() {
      const lastCounted = Number(localStorage.getItem(VISITED_KEY))
      if (!lastCounted || Date.now() - lastCounted > RECOUNT_MS) {
        try {
          await fetch(`${WORKER_URL}/visit`, { method: 'POST' })
          localStorage.setItem(VISITED_KEY, String(Date.now()))
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
