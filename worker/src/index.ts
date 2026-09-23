export interface Env {
  VISITS: KVNamespace
  ALLOWED_ORIGIN: string
  RATE_LIMITER: RateLimit
}

// Production origin plus localhost dev ports, so `npm run dev` works
// against the live Worker without needing a second deployed copy.
const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

function corsHeaders(requestOrigin: string | null, env: Env): HeadersInit {
  const allowed =
    requestOrigin &&
    (requestOrigin === env.ALLOWED_ORIGIN || DEV_ORIGINS.includes(requestOrigin))
      ? requestOrigin
      : env.ALLOWED_ORIGIN
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

// Counts reset every 14 days: keys are bucketed by period, and old buckets
// expire on their own once nothing writes to them.
const PERIOD_MS = 14 * 24 * 60 * 60 * 1000
const TTL_SECONDS = 15 * 24 * 60 * 60

function currentPeriod(): number {
  return Math.floor(Date.now() / PERIOD_MS)
}

// ponytail: KV has no atomic increment, so this is read-then-write - a lost
// update under concurrent requests. Fine at personal-portfolio traffic;
// move to Durable Objects if this ever needs to be exact under load.
async function increment(kv: KVNamespace, key: string): Promise<void> {
  const current = parseInt((await kv.get(key)) ?? '0', 10)
  await kv.put(key, String(current + 1), { expirationTtl: TTL_SECONDS })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = corsHeaders(request.headers.get('Origin'), env)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
    const prefix = `visits:${currentPeriod()}`

    if (url.pathname === '/visit' && request.method === 'POST') {
      const { success } = await env.RATE_LIMITER.limit({ key: `visit:${ip}` })
      if (!success) {
        return new Response('Rate limit exceeded', { status: 429, headers })
      }
      const country = request.headers.get('CF-IPCountry') ?? 'XX'
      await Promise.all([
        increment(env.VISITS, `${prefix}:total`),
        increment(env.VISITS, `${prefix}:country:${country}`),
      ])
      return new Response(null, { status: 204, headers })
    }

    if (url.pathname === '/stats' && request.method === 'GET') {
      const { success } = await env.RATE_LIMITER.limit({ key: `stats:${ip}` })
      if (!success) {
        return new Response('Rate limit exceeded', { status: 429, headers })
      }
      const total = parseInt(
        (await env.VISITS.get(`${prefix}:total`)) ?? '0',
        10,
      )
      const list = await env.VISITS.list({ prefix: `${prefix}:country:` })
      const byCountry: Record<string, number> = {}
      for (const key of list.keys) {
        const code = key.name.replace(`${prefix}:country:`, '')
        byCountry[code] = parseInt((await env.VISITS.get(key.name)) ?? '0', 10)
      }
      return new Response(JSON.stringify({ total, byCountry }), {
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not found', { status: 404, headers })
  },
}
