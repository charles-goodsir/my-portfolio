import { useMemo, useState, useEffect } from 'react'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import sqliSolver from '../assets/LabScripts/sqli_solver.py?raw'
import lab12Script from '../assets/LabScripts/lab12.py?raw'
import lab14Script from '../assets/LabScripts/lab14.py?raw'

const scriptMap: Record<string, string> = {
  'LabScripts/sqli_solver.py': sqliSolver,
  'LabScripts/lab12.py': lab12Script,
  'LabScripts/lab14.py': lab14Script,
}

const screenshotModules = import.meta.glob('../assets/Burp/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function resolveScreenshot(screenshot?: string) {
  if (!screenshot) return undefined
  return screenshotModules[`../assets/${screenshot}`]
}

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface CyberDiaryProps {
  scrollToVulnType?: string | null
  onScrollHandled?: () => void
}

function CyberDiary({ scrollToVulnType, onScrollHandled }: CyberDiaryProps) {
  const [activeVulnType, setActiveVulnType] = useState('All')
  const vulnTypes = useMemo(() => {
    const unique = [
      ...new Set(cyberDiaryEntries.map((entry) => entry.vulnType)),
    ]
    return ['All', ...unique]
  }, [])

  useEffect(() => {
    if (!scrollToVulnType) return

    const latestMatch = [...cyberDiaryEntries]
      .filter((entry) => entry.vulnType === scrollToVulnType)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0]

    if (latestMatch) {
      document
        .getElementById(latestMatch.id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    onScrollHandled?.()
  }, [scrollToVulnType, onScrollHandled])

  const entries = useMemo(() => {
    const filtered =
      activeVulnType === 'All'
        ? cyberDiaryEntries
        : cyberDiaryEntries.filter((entry) => entry.vulnType === activeVulnType)

    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [activeVulnType])

  return (
    <section id="cyberdiary" className="max-w-3xl mx-auto py-12 px-4">
      <header className="mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          CyberDiary
        </h2>
        <p className="text-lg text-gray-600">
          A running log of security labs and practice. Newest entries first.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        {vulnTypes.map((vulnType) => (
          <button
            key={vulnType}
            onClick={() => setActiveVulnType(vulnType)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeVulnType === vulnType
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {vulnType}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No entries for this category yet.
          </p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              id={entry.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-violet-50 border-b border-violet-100 px-6 py-4">
                <time
                  dateTime={entry.date}
                  className="text-sm font-medium text-violet-800"
                >
                  {formatDate(entry.date)}
                </time>
                <h3 className="text-xl font-bold text-gray-800 mt-1">
                  {entry.title}
                </h3>
                <span className="inline-block mt-2 bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
                  {entry.category}
                </span>
                {entry.milestone && (
                  <span className="inline-block mt-2 ml-2 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
                    ✓ Path complete
                  </span>
                )}
              </div>

              <div className="px-6 py-5 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-2">
                    What I worked on
                  </h4>
                  <ul className="space-y-1.5">
                    {entry.workedOn.map((item) => (
                      <li
                        key={item}
                        className="text-gray-700 text-sm flex items-start"
                      >
                        <span className="text-violet-600 mr-2 mt-0.5 shrink-0">
                          •
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {entry.body.length > 0 && (
                  <div className="space-y-3">
                    {entry.body.map((paragraph, index) => (
                      <p
                        key={`${entry.id}-body-${index}`}
                        className="text-gray-700 text-sm leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {entry.screenshot &&
                      resolveScreenshot(entry.screenshot) && (
                        <img
                          src={resolveScreenshot(entry.screenshot)}
                          alt={`${entry.title} screenshot`}
                          className="rounded border border-gray-200 max-w-full"
                        />
                      )}
                  </div>
                )}

                {entry.labs && entry.labs.length > 0 && (
                  <div className="space-y-6 pt-1">
                    {entry.labs.map((lab, index) => (
                      <div
                        key={`${entry.id}-lab-${index}`}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <h4 className="bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 border-b border-gray-200">
                          {lab.title}
                        </h4>
                        <div className="px-4 py-3 space-y-3">
                          <ul className="space-y-1.5">
                            {lab.notes.map((note, noteIndex) => (
                              <li
                                key={`${entry.id}-lab-${index}-note-${noteIndex}`}
                                className="text-gray-700 text-sm flex items-start"
                              >
                                <span className="text-violet-600 mr-2 mt-0.5 shrink-0">
                                  •
                                </span>
                                {note}
                              </li>
                            ))}
                          </ul>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                              Solution
                            </p>
                            <pre className="bg-gray-900 text-violet-300 text-xs rounded p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                              {lab.solution}
                            </pre>
                          </div>
                          {lab.screenshot &&
                            resolveScreenshot(lab.screenshot) && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                  Screenshot
                                </p>
                                <img
                                  src={resolveScreenshot(lab.screenshot)}
                                  alt={lab.title}
                                  className="w-full h-auto rounded"
                                />
                              </div>
                            )}
                          {lab.script && scriptMap[lab.script] && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Script
                              </p>
                              <pre className="bg-gray-900 text-violet-300 text-xs rounded p-3 overflow-x-auto whitespace-pre font-mono leading-relaxed">
                                <code>{scriptMap[lab.script]}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(entry.tools?.length || entry.tags?.length) && (
                  <div className="flex flex-wrap gap-4 pt-1">
                    {entry.tools && entry.tools.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
                          Tools
                        </span>
                        {entry.tools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1.5 mb-1"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
                          Tags
                        </span>
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-violet-50 text-violet-800 px-2 py-0.5 rounded text-xs mr-1.5 mb-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {entry.link && (
                  <a
                    href={entry.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-violet-700 hover:text-violet-900 text-sm font-medium underline underline-offset-2"
                  >
                    {entry.link.label} →
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default CyberDiary
