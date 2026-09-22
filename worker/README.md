# visitor-map worker

Cloudflare Worker backing the portfolio's visitor map (Plan 02). See
`plans/02-visitor-map.md` for the full design.

## One-time setup (needs your Cloudflare account - run these yourself)

```bash
cd worker
npm install
npx wrangler login          # opens your browser, approve there
npx wrangler kv namespace create VISITS
```

The last command prints an `id`. Paste it into `wrangler.toml`, replacing
`REPLACE_ME` in the `[[kv_namespaces]]` block.

## Deploy

```bash
npx wrangler deploy
```

This prints your Worker's URL, something like
`https://visitor-map.<your-subdomain>.workers.dev`. That's the base URL
Phase 2 (frontend wiring) will call.

## Verify (Phase 1 gate)

```bash
curl -i -X POST https://visitor-map.<your-subdomain>.workers.dev/visit
curl -s https://visitor-map.<your-subdomain>.workers.dev/stats
```

Expect `204` from the first call, and the second to return JSON like:

```json
{ "total": 1, "byCountry": { "NZ": 1 } }
```

Run the `POST` a couple more times and confirm `/stats` increments. If
`byCountry` shows an unexpected country, that's `CF-IPCountry` resolving
your actual connection's country - correct behaviour, not a bug.

## Local dev

```bash
npm run dev
```

`wrangler dev` runs the Worker locally against a local KV emulation. Note
`CF-IPCountry` won't be a real country locally the way it is once deployed
(Cloudflare only sets it on requests that actually pass through their edge).
