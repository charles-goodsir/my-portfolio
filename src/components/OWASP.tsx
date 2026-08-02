import { owaspTop10 } from '../data/owaspTop10'

const progressStyles: Record<string, string> = {
  'Not started': 'bg-gray-100 text-gray-700',
  Planned: 'bg-blue-100 text-blue-800',
  'In progress': 'bg-amber-100 text-amber-800',
  Completed: 'bg-green-100 text-green-800',
}

interface OwaspTop10Props {
  navigateToDiary: (entryId: string, vulnType: string) => void
}
function OwaspTop10({ navigateToDiary }: OwaspTop10Props) {
  return (
    <section id="owasp-top-10" className="max-w-3xl mx-auto py-12 px-4">
      <header className="mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          OWASP Top 10 (2025)
        </h2>
        <p className="text-lg text-gray-600">
          The ten most critical web application security risks, and how I'm
          learning each one.
        </p>
      </header>

      <div className="space-y-8">
        {owaspTop10.map((risk) => (
          <article
            key={risk.rank}
            className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-orange-600"
          >
            <div className="bg-orange-50 border-b border-orange-100 px-6 py-4">
              <span className="inline-block bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
                {risk.rank}
              </span>
              {risk.progress && (
                <span
                  className={`inline-block ml-2 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${progressStyles[risk.progress]}`}
                >
                  {risk.progress}
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                {risk.title}
              </h3>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                  What it is
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {risk.summary}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                  Why it matters
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {risk.whyItMatters}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                  How I'm learning it
                </h4>
                <ul className="space-y-1.5">
                  {risk.howToLearnIt.map((item) => (
                    <li
                      key={item}
                      className="text-gray-700 text-sm flex items-start"
                    >
                      <span className="text-orange-600 mr-2 mt-0.5 shrink-0">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
                    Tools
                  </span>
                  {risk.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1.5 mb-1"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {risk.relatedDiaryLinks && risk.relatedDiaryLinks.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-1">
                  {risk.relatedDiaryLinks.map((link) => (
                    <button
                      key={link.entryId}
                      onClick={() =>
                        navigateToDiary(link.entryId, link.vulnType)
                      }
                      className="text-orange-700 hover:text-orange-900 text-sm font-medium underline underline-offset-2"
                    >
                      See {link.label} →
                    </button>
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
