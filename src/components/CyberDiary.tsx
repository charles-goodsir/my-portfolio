import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import DiaryArticle from './DiaryArticle'
import SectionHeader from './ui/SectionHeader'

function CyberDiary() {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedVulnTypes = useMemo(() => {
    const raw = searchParams.get('vuln')
    return raw ? raw.split(',').filter(Boolean) : []
  }, [searchParams])

  const milestoneOnly = searchParams.get('milestone') === '1'

  const setSelected = (next: string[]) => {
    const params: Record<string, string> = {}
    if (next.length) params.vuln = next.join(',')
    if (milestoneOnly) params.milestone = '1'
    setSearchParams(params, { replace: true })
  }

  const toggleMilestoneOnly = () => {
    const params: Record<string, string> = {}
    if (selectedVulnTypes.length) params.vuln = selectedVulnTypes.join(',')
    if (!milestoneOnly) params.milestone = '1'
    setSearchParams(params, { replace: true })
  }

  const toggleVulnType = (vulnType: string) => {
    if (vulnType === 'All') {
      setSelected([])
      return
    }
    setSelected(
      selectedVulnTypes.includes(vulnType)
        ? selectedVulnTypes.filter((v) => v !== vulnType)
        : [...selectedVulnTypes, vulnType],
    )
  }

  const vulnTypesList = useMemo(() => {
    const unique = [
      ...new Set(cyberDiaryEntries.flatMap((entry) => entry.vulnTypes)),
    ]
    return ['All', ...unique]
  }, [])

  const entries = useMemo(() => {
    const filtered = cyberDiaryEntries
      .filter(
        (entry) =>
          selectedVulnTypes.length === 0 ||
          entry.vulnTypes.some((vt) => selectedVulnTypes.includes(vt)),
      )
      .filter((entry) => !milestoneOnly || entry.milestone)

    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [selectedVulnTypes, milestoneOnly])

  return (
    <section id="cyberdiary" className="max-w-[45rem] mx-auto py-16 px-4">
      <SectionHeader
        title="CyberDiary"
        intro="A running log of security labs and practice. Newest entries first."
      />

      <div className="flex flex-wrap gap-2 mb-10">
        {vulnTypesList.map((vulnType) => {
          const isActive =
            vulnType === 'All'
              ? selectedVulnTypes.length === 0
              : selectedVulnTypes.includes(vulnType)

          return (
            <button
              key={vulnType}
              onClick={() => toggleVulnType(vulnType)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-sunken text-ink-muted hover:opacity-80'
              }`}
            >
              {vulnType}
            </button>
          )
        })}
        <button
          onClick={toggleMilestoneOnly}
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
            No entries for this category yet.
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
