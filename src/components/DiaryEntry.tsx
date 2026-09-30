import { Link, useParams } from 'react-router'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import DiaryArticle from './DiaryArticle'
import NotFound from './NotFound'

function DiaryEntry() {
  const { entryId } = useParams()
  const entry = cyberDiaryEntries.find((e) => e.id === entryId)

  if (!entry) return <NotFound />

  return (
    <section className="max-w-[45rem] mx-auto py-16 px-4">
      <Link
        to={`/diary?project=${encodeURIComponent(entry.category)}`}
        className="mb-8 inline-flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
      >
        ← {entry.category}
      </Link>
      <DiaryArticle entry={entry} titleAs="h1" />
    </section>
  )
}

export default DiaryEntry
