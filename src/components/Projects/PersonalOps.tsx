import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import firewallImg from '../../assets/PersonalOps/PO1.webp'
import notesImg from '../../assets/PersonalOps/PO6.webp'
import maskingImg from '../../assets/PersonalOps/PO7.webp'
import hardeningImg from '../../assets/PersonalOps/PO11.webp'

const images = [
  {
    src: maskingImg,
    alt: 'Vitest output with two digest tests failing after the masking was removed, showing a Ticketmaster payee with its digits left in',
    width: 1004,
    height: 1122,
    caption:
      'Claude removed the masking on purpose and two tests failed, which proved the digest test was checking something real.',
  },
  {
    src: firewallImg,
    alt: 'ufw after.rules showing a DOCKER-USER chain that returns only ports 8080 and 3000 from the local network and drops the rest',
    width: 1156,
    height: 298,
    caption:
      'The DOCKER-USER chain I had forgotten, which was what blocked my laptop from the MCP port.',
  },
  {
    src: notesImg,
    alt: 'Claude Code answering a question about my notes by calling the personal-ops server and citing the note file it came from',
    width: 1194,
    height: 1072,
    caption:
      'Claude answering from my own notes through the MCP server, with the source file cited.',
  },
  {
    src: hardeningImg,
    alt: 'Terminal on the mini PC showing cups, cups-browsed and ModemManager disabled and inactive, and the unattended-upgrades log listing the Ubuntu security origin',
    width: 1232,
    height: 526,
    caption:
      'Unused services disabled, and the Ubuntu security origin confirmed in the update log.',
  },
]

const technologies = [
  'TypeScript',
  'MCP',
  'PostgreSQL',
  'pgvector',
  'Ollama',
  'Claude API',
  'Docker Compose',
  'Telegram',
  'ufw',
  'GitHub Actions',
  'Claude Code',
  'Claude API',
]

function PersonalOps() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
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

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ink">
              Personal Ops Platform
            </h1>
            <span className="inline-block bg-warn/10 text-warn px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              In progress
            </span>
            <span className="inline-block bg-primary/10 text-primary px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Built with Claude
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            A self-hosted platform on my home mini PC that lets Claude work with
            my notes and my bank transactions through an MCP server, without the
            raw data leaving my hardware.
          </p>

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

          <div className="flex flex-wrap gap-4">
            <Link
              to="/diary?project=Personal%20Ops%20Platform"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              Full write-up of the build
            </Link>
            <a
              href="https://github.com/charles-goodsir/personal-ops-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              Giving an AI model access to personal data raises one question at
              every step: what leaves the machine? Claude built this to answer
              it in code, to my brief. The server runs on a mini PC at home,
              notes are embedded with a local model, and the finance agent only
              sees masked descriptions and aggregates.
            </p>
            <p className="text-ink-muted">
              Each control has a test, and Claude has broken most of them to
              watch the test fail. Real data found gaps that fixtures never did,
              such as a card number mask that let the last four digits through.
            </p>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            What&apos;s Built So Far
          </h2>
          <ul className="space-y-2 text-ink-muted">
            <li>
              • A TypeScript monorepo with Postgres and pgvector, and an MCP
              server over HTTP with bearer token auth, token rotation and a Host
              allowlist
            </li>
            <li>
              • gitleaks pre-commit, CI on every PR, and a Docker Compose
              deployment behind a firewall rule that only allows the local
              network
            </li>
            <li>
              • Notes search with embeddings from a local Ollama model, so notes
              are never sent to a hosted API, and answers cite the file they
              came from
            </li>
            <li>
              • Bank transactions synced from Akahu with no account numbers
              stored, categorised by my rules first and Claude Haiku second
            </li>
            <li>
              • Descriptions masked before they leave the box, and a weekly
              Telegram summary built only from aggregates, with a test that
              fails if the masking is removed
            </li>
            <li>
              • Nightly database backups, and a host hardened with unused
              services disabled and a port scan from another machine
            </li>
            <li>
              • Job heartbeats, a /status command and a watchdog that alerts
              when a background job goes stale, proved by backdating a real
              heartbeat
            </li>
            <li>
              • A read-only dashboard on its own Postgres role, with 31 attack
              tests and a live retest on the mini PC
            </li>
            <li>
              • Pending card charges kept in their own table and shown as an
              estimate, while alerts and the payday plan read settled spending
              only
            </li>
            <li>
              • Images built and scanned in CI, signed with keyless cosign, and
              deployed only after the mini PC verifies the signature, with a
              rollback if the services don&apos;t stay up
            </li>
            <li>
              • A payday plan that sends once even across a restart, checks
              every setting before saving any, and alerts at 80% and 100% of
              spending
            </li>
          </ul>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Known limits</h2>
          <p className="text-ink-muted">
            The watchdog runs on the same box and sends through Telegram, so an
            outside check on Healthchecks.io emails me if either goes down. The
            disk is not encrypted, which I decided against for now because
            tokens can be revoked and it would mean a reinstall. That decision
            is written down in the repo.
          </p>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mt-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image) => (
              <ScreenshotFigure
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                caption={image.caption}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalOps
