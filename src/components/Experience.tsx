interface TimelineItem {
  kind: 'Work' | 'Certification' | 'Education'
  title: string
  org: string
  location?: string
  dates: string
  /** Work shows its first two; everything else sits behind "More". */
  points: string[]
  technologies?: string[]
}

// Newest first, ongoing work at the top.
const timeline: TimelineItem[] = [
  {
    kind: 'Work',
    title: 'Application Engineer - Finance Domain',
    org: 'Datacom Solutions',
    location: 'Auckland, New Zealand',
    dates: 'Sep 2021 - Present',
    points: [
      'Helped cut configuration defect rates by ~30% by standardising testing',
      'Cleared roughly 500 defects in a week-long team bug smash',
      "Built local council environments with .NET tooling and exported their configuration as JSON for the pipeline that builds each council's cloud environment. I watch each run to catch configuration that breaks the build",
      'Delivered CRM/ERP applications for councils in NZ and Australia',
      'Authored YAML-driven test-data configuration in Azure DevOps, layered on an existing C# codebase, to provision cross-referenced data for local and cloud environments at build time',
      'Ran planning sessions and live demos for a new enterprise finance module across 3 councils',
      'Turned business requirements into configuration, working with BAs and clients',
      'Wrote Confluence documentation for releases and onboarding, and led weekly CRM/ERP training sessions',
      'Mentored associate analysts one-on-one',
    ],
    technologies: [
      '.NET',
      'JSON',
      'Azure DevOps',
      'YAML',
      'Git',
      'Confluence',
    ],
  },
  {
    kind: 'Certification',
    title: 'CompTIA Security+ (SY0-701)',
    org: 'CompTIA',
    dates: 'Jul 2026',
    points: [
      'Exam domains: general security concepts; threats, vulnerabilities, and mitigations; security architecture; security operations; and security program management and oversight',
    ],
  },
  {
    kind: 'Education',
    title: 'Level 6 in Applied Software Development',
    org: 'Dev Academy Aotearoa',
    location: 'Auckland, New Zealand',
    dates: 'Jul 2024 - Dec 2024',
    points: [
      'A 17-week, Level 6 full-stack diploma covering JavaScript, TypeScript, React, Node.js, and databases',
      'Learned through daily pair programming and agile team projects',
      'Led a team to build and deploy a full-stack app',
    ],
  },
  {
    kind: 'Work',
    title: 'Service Desk Analyst',
    org: 'Datacom Solutions',
    location: 'Wellington, New Zealand',
    dates: 'Sep 2020 - Sep 2021',
    points: [
      'Resolved 200+ IT incidents a month for the Ministry of Business, Innovation and Employment, with first-call resolution above 80%',
      'Cut repeat support volume by 25% by spotting recurring issues and writing knowledge-base articles the wider team adopted',
      'Triaged critical infrastructure incidents (network access, identity management, remote desktop) and escalated them to specialist teams within SLA',
    ],
  },
  {
    kind: 'Education',
    title:
      'Bachelor of Arts, History, International Relations, Political Science',
    org: 'Victoria University of Wellington',
    location: 'Wellington, New Zealand',
    dates: 'Feb 2017 - Jan 2020',
    points: [
      'Studied history, international relations, and political science over three years',
      'Wrote research essays built on primary sources, to deadline',
    ],
  },
]

// Work shows its top two points; education and certifications show none.
const shownFor = (item: TimelineItem) => (item.kind === 'Work' ? 2 : 0)

function PointList({ points }: { points: string[] }) {
  return (
    <ul className="space-y-1.5">
      {points.map((point) => (
        <li key={point} className="text-ink-muted text-sm flex items-start">
          <span className="text-primary mr-2 mt-0.5 shrink-0">•</span>
          {point}
        </li>
      ))}
    </ul>
  )
}

function Experience() {
  return (
    <section id="experience" className="mt-16">
      <h2 className="text-2xl font-semibold text-ink mb-8">
        Experience &amp; Education
      </h2>

      <ol className="border-l-2 border-line ml-1.5 space-y-8">
        {timeline.map((item) => (
          <li key={item.title} className="relative pl-6">
            <span
              aria-hidden="true"
              className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-4 ring-page ${
                item.kind === 'Work' ? 'bg-primary' : 'bg-success'
              }`}
            />
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {item.dates} · {item.kind}
            </p>
            <h3 className="text-lg font-bold text-ink mt-1">{item.title}</h3>
            <p className="text-sm text-ink-muted mb-3">
              {item.org}
              {item.location && ` · ${item.location}`}
            </p>

            <PointList points={item.points.slice(0, shownFor(item))} />
            {item.points.length > shownFor(item) && (
              <details className="mt-2 group">
                <summary className="text-sm text-primary font-medium cursor-pointer hover:underline underline-offset-2 list-none [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">More</span>
                  <span className="hidden group-open:inline">Less</span>
                </summary>
                <div className="mt-1.5">
                  <PointList points={item.points.slice(shownFor(item))} />
                </div>
              </details>
            )}

            {item.technologies && (
              <p className="text-xs text-ink-muted mt-3">
                {item.technologies.join(' · ')}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Experience
