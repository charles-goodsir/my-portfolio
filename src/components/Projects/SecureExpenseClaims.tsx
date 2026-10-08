import { Link } from 'react-router'

const technologies = [
  '.NET 10',
  'ASP.NET Core',
  'React',
  'TypeScript',
  'Vite',
  'PostgreSQL',
  'Docker',
  'EF Core',
  'xUnit',
  'Testcontainers',
  'GitHub Actions',
  'Azure',
  'Terraform',
  'Entra ID',
  'STRIDE',
]

function SecureExpenseClaims() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        {/* Back Button */}
        <Link
          to="/projects"
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
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ink">
              Secure Expense Claims
            </h1>
            <span className="inline-block bg-warn/10 text-warn px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              In progress
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            An expense claims app on Azure: employees submit claims with
            receipts, managers approve them, and finance pays them. I&apos;m
            building it, then hardening, attacking and monitoring it.
          </p>
          <p className="text-xl text-ink-muted mb-6">
            It joins my two previous projects: the AppSec Homelab was an app
            with a security pipeline, and the Secure Azure Landing Zone was
            locked-down Azure infrastructure. My Lab Notes have the day-by-day
            version, bugs included.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="border border-line bg-sunken text-ink-muted px-3 py-1.5 rounded-md font-mono text-xs"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project Links */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/diary?project=Secure%20Expense%20Claims"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              Full write-up in my Lab Notes
            </Link>
            <a
              href="https://github.com/charles-goodsir/secure-expense-claims"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* About */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              I picked expense claims because money, approvals and file uploads
              give me real access-control rules to break later, which a CRUD
              demo wouldn&apos;t.
            </p>
            <p className="text-ink-muted">
              Before any app code, I wrote a STRIDE threat model: 6 assets, 5
              trust boundaries and 24 threats, each tied to a control and the
              phase that builds it. A manager must not approve their own claim,
              and a request for someone else&apos;s claim returns 404 rather
              than 403, so claim IDs can&apos;t be enumerated.
            </p>
          </div>
        </div>

        {/* What's built so far */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            What&apos;s Built So Far
          </h2>
          <ul className="space-y-2 text-ink-muted">
            <li>
              • STRIDE threat model with a planned control and phase for every
              threat
            </li>
            <li>
              • CI on every PR: tests, gitleaks, Semgrep, Trivy on both images,
              NuGet and npm audit, and actionlint, all required on main. Each
              check has been seen failing on a real or planted problem
            </li>
            <li>
              • Ownership checks inside the query that loads a claim, so another
              user&apos;s claim returns 404 and unknown JSON fields are rejected
            </li>
            <li>
              • Submit, approve, reject and pay, with separation of duties and
              an audit row written in the same transaction as each change
            </li>
            <li>
              • Receipt uploads checked by their first bytes, capped at 5 MB and
              downloadable only by people who can see the claim
            </li>
            <li>
              • Generic error responses with a trace ID, and a per-user rate
              limit
            </li>
            <li>
              • An Admin role that can change reporting lines but can&apos;t
              approve or pay, with every change audited
            </li>
            <li>
              • A React frontend for each role, with a development-only sign-in
              that a test proves is off in Production
            </li>
            <li>
              • The whole app in Docker Compose, with nginx as the only way in
            </li>
            <li>
              • Integration tests against real Postgres and Azurite in
              containers
            </li>
            <li>
              • Terraform deploys from GitHub Actions with OIDC and no secrets:
              a read-only identity plans on PRs, and a deploy identity only gets
              a token inside an approval-gated environment
            </li>
            <li>
              • The API in Azure Container Apps, pinned to the digest of an
              image Trivy scanned, with Postgres and storage on private
              networking and no keys or passwords
            </li>
            <li>
              • A database role for the API that can only read and insert audit
              rows, so the database refuses edits to the audit trail
            </li>
            <li>
              • A weekly drift check that passes when the environment is torn
              down and went red on a tag added in the portal
            </li>
            <li>
              • App roles held in Entra ID, and seven bad-token tests that each
              fail when their check is switched off
            </li>
          </ul>
        </div>

        {/* Status */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Status</h2>
          <p className="text-ink-muted">
            In progress. Phase 0 (threat model, CI and required checks), Phase 1
            (the app in Docker Compose behind nginx) and Phase 2 (deployment to
            Azure through Terraform) are done. Phase 3 is replacing the
            development sign-in with Entra ID: the app roles and token checks
            are in.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SecureExpenseClaims
