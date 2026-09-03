import { Link } from 'react-router'
import { owaspTop10 } from '../data/owaspTop10'
import SectionHeader from './ui/SectionHeader'

const progressStyles: Record<string, string> = {
  'Not started': 'bg-sunken text-ink-muted',
  Planned: 'bg-primary/10 text-primary',
  'In progress': 'bg-warn/10 text-warn',
  Completed: 'bg-success/10 text-success',
}

function OwaspTop10() {
  return (
    <section id="owasp-top-10" className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader
        title="OWASP Top 10 (2025)"
        intro="The ten most critical web application security risks, and how I'm learning each one."
      />

      <div className="space-y-8">
        {owaspTop10.map((risk) => (
          <article
            key={risk.rank}
            id={risk.rank.slice(0, 3).toLowerCase()}
            className="bg-card border border-line rounded-lg shadow-card overflow-hidden scroll-mt-24"
          >
            <div className="bg-sunken border-b border-line px-6 py-4">
              <span className="inline-block bg-sunken text-ink-muted px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
                {risk.rank}
              </span>
              {risk.progress && (
                <span
                  className={`inline-block ml-2 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
                    progressStyles[risk.progress] ?? progressStyles['Not started']
                  }`}
                >
                  {risk.progress}
                </span>
              )}
              <h3 className="text-xl font-bold text-ink mt-1">
                {risk.title}
              </h3>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
                  What it is
                </h4>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {risk.summary}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
                  Why it matters
                </h4>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {risk.whyItMatters}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-ink uppercase tracking-wide mb-2">
                  How I'm learning it
                </h4>
                <ul className="space-y-1.5">
                  {risk.howToLearnIt.map((item) => (
                    <li
                      key={item}
                      className="text-ink-muted text-sm flex items-start"
                    >
                      <span className="text-warn mr-2 mt-0.5 shrink-0">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
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
              </div>

              {risk.relatedDiaryLinks && risk.relatedDiaryLinks.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-1">
                  {risk.relatedDiaryLinks.map((link) => (
                    <Link
                      key={link.entryId}
                      to={`/diary/${link.entryId}?vuln=${encodeURIComponent(
                        link.vulnType,
                      )}`}
                      className="text-warn hover:text-warn text-sm font-medium underline underline-offset-2"
                    >
                      See {link.label} →
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default OwaspTop10
