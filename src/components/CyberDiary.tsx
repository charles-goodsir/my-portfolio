import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import DiaryArticle from './DiaryArticle'
import SectionHeader from './ui/SectionHeader'

function CyberDiary() {
  const [searchParams, setSearchParams] = useSearchParams()

  const project = searchParams.get('project')
  const milestoneOnly = searchParams.get('milestone') === '1'

  const setFilters = (nextProject: string | null, nextMilestone: boolean) => {
    const params: Record<string, string> = {}
    if (nextProject) params.project = nextProject
    if (nextMilestone) params.milestone = '1'
    setSearchParams(params, { replace: true })
  }

  const projects = useMemo(
    () => [...new Set(cyberDiaryEntries.map((entry) => entry.category))],
    [],
  )

  const entries = useMemo(() => {
    const filtered = cyberDiaryEntries
      .filter((entry) => !project || entry.category === project)
      .filter((entry) => !milestoneOnly || entry.milestone)

    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [project, milestoneOnly])

  return (
    <section id="cyberdiary" className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader
        title="CyberDiary"
        intro="A running log of security labs and practice. Newest entries first."
      />

      <div className="flex flex-wrap gap-2 mb-10">
        {['All', ...projects].map((name) => {
          const isActive = name === 'All' ? !project : project === name

          return (
            <button
              key={name}
              onClick={() =>
                setFilters(name === 'All' ? null : name, milestoneOnly)
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-sunken text-ink-muted hover:opacity-80'
              }`}
            >
              {name}
            </button>
          )
        })}
        <button
          onClick={() => setFilters(project, !milestoneOnly)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            milestoneOnly
              ? 'bg-primary text-on-primary'
              : 'bg-sunken text-ink-muted hover:opacity-80'
          }`}
        >
          Milestones
        </button>
      </div>

      <div className="space-y-10">
        {entries.length === 0 ? (
          <p className="text-ink-muted text-center py-12">
            No entries for this filter yet.
          </p>
        ) : (
          entries.map((entry) => (
            <DiaryArticle key={entry.id} entry={entry} linked />
          ))
        )}
      </div>
    </section>
  )
}

export default CyberDiary
