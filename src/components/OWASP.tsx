import { Link, useParams } from 'react-router'
import { owaspTop10, type OwaspRisk } from '../data/owaspTop10'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import NotFound from './NotFound'
import SectionHeader from './ui/SectionHeader'

const progressStyles: Record<string, string> = {
  'Not started': 'bg-sunken text-ink-muted',
  Planned: 'bg-sunken text-ink-muted',
  'In progress': 'bg-warn/10 text-warn',
  Completed: 'bg-success/10 text-success',
}

// Top edge and status text colours for the overview tiles.
const progressBorders: Record<string, string> = {
  'Not started': 'border-t-line',
  Planned: 'border-t-line',
  'In progress': 'border-t-warn',
  Completed: 'border-t-success',
}

const progressText: Record<string, string> = {
  'Not started': 'text-ink-muted',
  Planned: 'text-ink-muted',
  'In progress': 'text-warn',
  Completed: 'text-success',
}

const riskId = (risk: OwaspRisk) => risk.rank.slice(0, 3).toLowerCase()

const notebookOf = (entryId: string) =>
  cyberDiaryEntries.find((e) => e.id === entryId)?.category

function ProgressBadge({ progress }: { progress?: OwaspRisk['progress'] }) {
  if (!progress) return null
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
        progressStyles[progress] ?? progressStyles['Not started']
      }`}
    >
      {progress}
    </span>
  )
}

function BulletList({
  title,
  items,
  muted = false,
}: {
  title: string
  items?: string[]
  muted?: boolean
}) {
  if (!items?.length) return null
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
        {title}
      </h2>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-ink-muted text-sm flex items-start">
            <span
              className={`mr-2 mt-0.5 shrink-0 ${muted ? 'text-ink-muted' : 'text-primary'}`}
            >
              {muted ? '○' : '•'}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function OwaspTop10() {
  const { riskId: id } = useParams()

  if (id) {
    const risk = owaspTop10.find((r) => riskId(r) === id)
    return risk ? <RiskPage risk={risk} /> : <NotFound />
  }

  const counts = (['Completed', 'In progress', 'Planned'] as const)
    .map((p) => [p, owaspTop10.filter((r) => r.progress === p).length] as const)
    .filter(([, n]) => n > 0)
    .map(([p, n]) => `${n} ${p.toLowerCase()}`)
    .join(' · ')

  return (
    <section id="owasp-top-10" className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader
        title="OWASP Top 10 (2025)"
        intro="The ten most critical web application security risks, and how far I've got with each one."
      />

      <p className="text-sm text-ink-muted mb-4">{counts}</p>

      <ul className="grid sm:grid-cols-2 gap-4">
        {owaspTop10.map((risk) => (
          <li key={risk.rank}>
            <Link
              to={`/owasp/${riskId(risk)}`}
              className={`flex flex-col h-full bg-card border border-line border-t-4 ${
                progressBorders[risk.progress ?? 'Not started']
              } rounded-lg shadow-card px-5 py-4 hover:border-primary transition-colors duration-200`}
            >
              <span className="font-mono text-sm text-ink-muted">
                {risk.rank.slice(0, 3)}
              </span>
              <span className="text-lg font-semibold text-ink leading-snug mt-1 hyphens-auto">
                {risk.title}
              </span>
              <span
                className={`mt-auto pt-3 text-sm font-medium ${
                  progressText[risk.progress ?? 'Not started']
                }`}
              >
                {risk.progress ?? 'Not started'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RiskPage({ risk }: { risk: OwaspRisk }) {
  return (
    <section className="max-w-[45rem] mx-auto py-16 px-4">
      <Link
        to="/owasp"
        className="mb-8 inline-flex items-center text-primary hover:underline underline-offset-2"
      >
        ← OWASP Top 10
      </Link>

      <header className="mb-10">
        <p className="flex items-center gap-2">
          <span className="font-mono text-sm text-ink-muted">{risk.rank}</span>
          <ProgressBadge progress={risk.progress} />
        </p>
        <h1 className="text-3xl font-semibold text-ink mt-2">{risk.title}</h1>
        <p className="mt-3 text-lg text-ink-muted max-w-[60ch]">
          {risk.summary}
        </p>
      </header>

      <div className="space-y-8">
        <BulletList title="What I've done" items={risk.done} />
        <BulletList title="Next" items={risk.next} muted />

        {risk.relatedDiaryLinks && risk.relatedDiaryLinks.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
              In my Lab Notes
            </h2>
            <ul className="divide-y divide-line border-y border-line">
              {risk.relatedDiaryLinks.map((link) => (
                <li key={link.entryId} className="py-3">
                  <Link
                    to={`/diary/${link.entryId}`}
                    className="text-sm font-medium text-ink hover:text-primary hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                  {notebookOf(link.entryId) && (
                    <p className="text-xs text-ink-muted mt-0.5">
                      {notebookOf(link.entryId)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
            Why it matters
          </h2>
          <p className="text-ink-muted text-sm leading-relaxed">
            {risk.whyItMatters}
          </p>
        </div>

        {risk.tools.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide mr-2">
              Tools
            </span>
            {risk.tools.map((tool) => (
              <span
                key={tool}
                className="inline-block bg-sunken text-ink-muted px-2 py-0.5 rounded text-xs mr-1.5 mb-1"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default OwaspTop10
