import { Link, useSearchParams } from 'react-router'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import { formatDate } from './diaryAssets'
import SectionHeader from './ui/SectionHeader'

// One notebook per project, ordered by latest entry; the data file is newest first.
const notebooks = [
  ...new Set(cyberDiaryEntries.map((entry) => entry.category)),
].map((name) => ({
  name,
  entries: cyberDiaryEntries.filter((entry) => entry.category === name),
}))

// Latest milestone from each notebook, or its latest entry until it has one.
const highlights = notebooks.map(
  (n) => n.entries.find((entry) => entry.milestone) ?? n.entries[0],
)

// Cover colours cycle through this list; fixed, so white text stays readable in both themes.
const covers = [
  'bg-teal-800',
  'bg-indigo-800',
  'bg-rose-900',
  'bg-amber-800',
  'bg-sky-800',
  'bg-emerald-800',
  'bg-violet-800',
  'bg-red-800',
  'bg-cyan-800',
  'bg-fuchsia-800',
  'bg-lime-800',
  'bg-blue-800',
  'bg-orange-800',
  'bg-purple-800',
  'bg-green-800',
  'bg-pink-800',
  'bg-yellow-800',
  'bg-slate-700',
  'bg-indigo-900',
  'bg-emerald-900',
  'bg-stone-700',
  'bg-sky-900',
  'bg-violet-900',
  'bg-orange-900',
  'bg-zinc-700',
]

// Shown on hover/focus over a book and as the notebook page intro.
const descriptions: Record<string, string> = {
  'Secure Azure Landing Zone':
    'Terraform on Azure, shipped through a gated pipeline',
  'AppSec Homelab': 'A .NET/React app I seeded with bugs, then fixed',
  'PortSwigger Labs': 'Burp labs: SQL injection, XSS and authentication',
  'Portfolio Site': 'The visitor map and CTF mode on this site',
  'Secure Expense Claims':
    'An expense app on Azure, threat-modelled, attacked and monitored',
  'Personal Ops Platform':
    'A self-hosted MCP server and database on my home mini PC',
}

const entryCount = (n: number) => `${n} ${n === 1 ? 'entry' : 'entries'}`

function CyberDiary() {
  const [searchParams] = useSearchParams()
  const project = searchParams.get('project')

  if (project) {
    const notebook = notebooks.find((n) => n.name === project)

    return (
      <section id="cyberdiary" className="max-w-180 mx-auto py-16 px-4">
        <Link
          to="/diary"
          className="mb-8 inline-flex items-center text-primary hover:underline underline-offset-2"
        >
          ← All notebooks
        </Link>
        {notebook ? (
          <>
            <SectionHeader
              title={notebook.name}
              intro={[
                descriptions[notebook.name],
                entryCount(notebook.entries.length),
              ]
                .filter(Boolean)
                .join('. ')}
            />
            <ul className="divide-y divide-line border-y border-line">
              {notebook.entries.map((entry) => (
                <li key={entry.id} className="py-4">
                  <Link
                    to={`/diary/${entry.id}`}
                    className="font-medium text-ink hover:text-primary hover:underline underline-offset-2"
                  >
                    {entry.title}
                  </Link>
                  <p className="text-xs text-ink-muted mt-1">
                    <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                    {entry.milestone && (
                      <span className="ml-2 text-success font-semibold">
                        ✓ Milestone
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-muted mt-1.5 line-clamp-2">
                    {entry.body.at(-1) ?? entry.workedOn[0]}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-ink-muted text-center py-12">
            No notebook called “{project}”.
          </p>
        )}
      </section>
    )
  }

  return (
    <section id="cyberdiary" className="max-w-180 mx-auto py-16 px-4">
      <SectionHeader
        title="Lab Notes"
        intro="A running log of security labs and practice, one notebook per project."
      />

      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
        {notebooks.map((n, i) => (
          <li key={n.name} className="group relative">
            <Link
              to={`/diary?project=${encodeURIComponent(n.name)}`}
              aria-describedby={
                descriptions[n.name] ? `notebook-desc-${i}` : undefined
              }
              className={`relative flex flex-col aspect-3/4 ${covers[i % covers.length]} text-white rounded-l-sm rounded-r-md pl-6 pr-3 py-4 shadow-[3px_3px_0_0_#f8fafc,4px_4px_0_0_#cbd5e1,6px_6px_0_0_#f8fafc,7px_7px_0_0_#cbd5e1] motion-safe:transition-transform duration-200 hover:-translate-y-1`}
            >
              {/* Spine */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-3 bg-black/30 rounded-l-sm border-r border-white/20"
              />
              <span className="mt-4 min-h-14 flex items-center justify-center bg-[#fdfbf5] text-slate-900 rounded-sm px-2 py-2 text-center shadow-sm">
                <span className="text-sm font-semibold leading-snug">
                  {n.name}
                </span>
              </span>
              <span className="mt-auto text-xs text-white/85 leading-relaxed">
                {entryCount(n.entries.length)}
                <br />
                Latest{' '}
                <time dateTime={n.entries[0].date}>
                  {formatDate(n.entries[0].date, {
                    day: 'numeric',
                    month: 'short',
                  })}
                </time>
              </span>
            </Link>
            {descriptions[n.name] && (
              <span
                id={`notebook-desc-${i}`}
                role="tooltip"
                className="pointer-events-none absolute left-0 right-0 top-full z-10 mt-4 bg-card border border-line rounded-lg shadow-card px-3 py-2 text-sm text-ink-muted leading-snug opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible motion-safe:transition-opacity duration-200"
              >
                {descriptions[n.name]}
              </span>
            )}
          </li>
        ))}
      </ul>

      {highlights.length > 0 && (
        <nav
          aria-labelledby="diary-highlights"
          className="mt-12 bg-card border border-line rounded-lg px-6 py-5"
        >
          <h2
            id="diary-highlights"
            className="text-sm font-semibold text-ink uppercase tracking-wide mb-3"
          >
            Start here
          </h2>
          <ul className="space-y-3">
            {highlights.map((entry) => (
              <li key={entry.id}>
                <Link
                  to={`/diary/${entry.id}`}
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  {entry.title}
                </Link>
                <p className="text-xs text-ink-muted mt-0.5">
                  {entry.category} · {formatDate(entry.date)}
                </p>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  )
}

export default CyberDiary
