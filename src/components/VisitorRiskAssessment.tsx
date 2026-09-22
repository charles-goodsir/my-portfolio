import { Link } from 'react-router'

function VisitorRiskAssessment() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        <Link
          to="/visitors"
          className="mb-8 flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Visitors
        </Link>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h1 className="text-4xl font-bold text-ink mb-4">
            Risk Assessment: Visitor Map
          </h1>
          <p className="text-xl text-ink-muted">
            A lightweight risk assessment of the visitor-counter feature,
            mapped to NIST CSF 2.0's five functions - the same structure used
            for the AppSec Homelab assessment, applied here to the site's
            first real piece of backend infrastructure.
          </p>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-4">Scope</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted">
              Two assets: a Cloudflare Worker (<code>visitor-map</code>)
              exposing <code>POST /visit</code> and{' '}
              <code>GET /stats</code>, and a Cloudflare KV namespace holding
              the counters it reads and writes. The portfolio frontend calls
              both endpoints on page load. Nothing else in the site depends
              on this Worker, and it depends on nothing else in the site -
              it's fully separable from the GitHub Pages deploy.
            </p>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Identify</h2>
          <ul className="space-y-2 text-ink-muted">
            <li>
              • Data handled: a total visit count and a per-country visit
              count. No IP address, no cookie beyond a local dedupe flag that
              never leaves the browser, no per-visitor record of any kind.
            </li>
            <li>
              • Lowest sensitivity tier by design - the whole feature was
              scoped down to country-level aggregates so there would be
              nothing sensitive to protect.
            </li>
            <li>
              • Public surface: two unauthenticated HTTP endpoints, reachable
              by anyone, not just the portfolio's own frontend.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Protect</h2>
          <ul className="space-y-2 text-ink-muted">
            <li>
              • Rate limiting on both endpoints - 10 requests/60s per IP, via
              Cloudflare's native Workers Rate Limiting binding, not a
              hand-rolled counter.
            </li>
            <li>
              • CORS origin allowlist (production domain plus local dev
              ports) rather than a wildcard. This is minor hardening, not
              the control that matters: CORS only restricts browser JS. A
              direct request to the write endpoint was never blocked by it.
            </li>
            <li>
              • Country comes from <code>CF-IPCountry</code>, the rate-limit
              key from <code>CF-Connecting-IP</code> - both edge-injected by
              Cloudflare and stripped/overwritten from any client-supplied
              value, so neither can be spoofed by a request crafted by hand.
            </li>
            <li>
              • No secrets in the repo or the client bundle. The KV
              namespace ID and the CORS origin are committed in plaintext,
              deliberately - neither is a credential, both are meant to be
              public.
            </li>
            <li>
              • Dependency review: both lockfiles (main site and Worker)
              audited clean of any vulnerability that ships - the flagged
              issues elsewhere in the repo are pre-existing, dev-only build
              tooling, unrelated to this feature.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Detect</h2>
          <p className="text-ink-muted">
            No active monitoring or alerting exists beyond the rate limiter
            itself kicking in. Visibility into what's hitting the Worker is
            whatever Cloudflare's own dashboard shows - nothing built here
            watches it. Reasonable for the scale of a personal-portfolio
            counter, and still a real gap.
          </p>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Respond</h2>
          <p className="text-ink-muted">
            The rate limit is the only automated response in place - a 429
            once an IP crosses the threshold, verified with a real test
            (fourteen requests in a row, the eleventh onward returning 429).
            Beyond that, response is manual - check the Cloudflare
            dashboard, redeploy the Worker if something needs to change.
            Nothing pages or alerts without a person already looking.
          </p>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Recover</h2>
          <p className="text-ink-muted">
            No backup exists for the KV counters. If the namespace got
            wiped, the total would reset to zero with no way to reconstruct
            it. That gap stays open on purpose: the data has no value
            beyond the number itself, so losing it costs nothing worth
            building a recovery path for.
          </p>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Known Gaps</h2>
          <ul className="space-y-2 text-ink-muted">
            <li>
              • KV increments are read-then-write, not atomic - a lost
              update is possible under concurrent requests. Self-documented
              in the code with a <code>ponytail:</code> comment. Accepted:
              irrelevant at the traffic this feature actually sees.
            </li>
            <li>
              • The rate limit is per-IP and does nothing against a
              distributed source spread across many addresses. That's not
              built, since the threat model doesn't fit a
              personal-portfolio vanity counter - the cost would outweigh
              anything it protects.
            </li>
            <li>
              • No Detect function beyond the rate limiter, and no automated
              Respond beyond the 429 it returns.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default VisitorRiskAssessment
