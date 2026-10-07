import { Link, useParams } from 'react-router'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import DiaryArticle from './DiaryArticle'
import NotFound from './NotFound'

function DiaryEntry() {
  const { entryId } = useParams()
  const entry = cyberDiaryEntries.find((e) => e.id === entryId)

  if (!entry) return <NotFound />

  // Entries are stored newest first, so the older entry sits after this one.
  const project = cyberDiaryEntries.filter((e) => e.category === entry.category)
  const index = project.indexOf(entry)
  const previous = project[index + 1]
  const next = project[index - 1]

  return (
    <section className="max-w-[45rem] mx-auto py-16 px-4">
      <Link
        to={`/diary?project=${encodeURIComponent(entry.category)}`}
        className="mb-8 inline-flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
      >
        ← {entry.category}
      </Link>
      <DiaryArticle entry={entry} titleAs="h1" />
      {(previous || next) && (
        <nav aria-label="More entries" className="mt-8 grid grid-cols-2 gap-4">
          {previous && (
            <Link
              to={`/diary/${previous.id}`}
              className="col-start-1 border border-line rounded-lg p-4 hover:border-primary transition-colors duration-300"
            >
              <span className="block text-xs font-semibold text-ink-muted uppercase tracking-wide">
                ← Previous
              </span>
              <span className="block mt-1 text-sm text-ink">
                {previous.title}
              </span>
            </Link>
          )}
          {next && (
            <Link
              to={`/diary/${next.id}`}
              className="col-start-2 border border-line rounded-lg p-4 text-right hover:border-primary transition-colors duration-300"
            >
              <span className="block text-xs font-semibold text-ink-muted uppercase tracking-wide">
                Next →
              </span>
              <span className="block mt-1 text-sm text-ink">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
      <Link
        to={`/diary?project=${encodeURIComponent(entry.category)}`}
        className="mt-6 inline-flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
      >
        ← {entry.category}
      </Link>
    </section>
  )
}

export default DiaryEntry
