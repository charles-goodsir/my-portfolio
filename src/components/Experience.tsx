interface ExperienceItem {
  title: string
  company: string
  location: string
  duration: string
  description: string[]
  technologies: string[]
}

const experiences: ExperienceItem[] = [
  {
    title: 'Software Application Engineer - Finance Domain',
    company: 'Datacom Solutions',
    location: 'Auckland, New Zealand',
    duration: 'Sep 2021 - Present',
    description: [
      'Designed, coded/configured, tested, and delivered enterprise CRM/ERP applications across multiple NZ and Australian regions',
      'Worked with C# and YAML in an Azure DevOps environment, including YAML-driven test-data generation that provisions cross-referenced data across local and cloud environments at build time',
      'Built automation test suites in Gherkin/BDD to validate end-to-end business logic, reducing configuration defect rates by ~30% through standardised testing frameworks',
      'Contributed to a week-long bug smash that brought down roughly 500 defects across the product',
      'Ran planning sessions and live demos with customers for new work on an enterprise finance module across 3 councils',
      'Worked with BAs, developers, configurators, product managers, and clients to turn business requirements into configuration',
      'Automated manual workflows for local government councils using in-house tooling, reducing risk from manual data handling',
      'Diagnosed and remodelled system configuration through root-cause analysis, cutting one job’s runtime from 2.5 minutes to 20 seconds',
      'Authored technical documentation in Confluence to support internal releases and onboarding, and led weekly CRM/ERP overview and training sessions',
      'Mentored associate analysts on delivery practice with ongoing one-on-one guidance',
    ],
    technologies: [
      'C#',
      'Azure DevOps',
      'YAML',
      'Git',
      'Gherkin/BDD',
      'Confluence',
    ],
  },
  {
    title: 'Service Desk Analyst',
    company: 'Datacom Solutions',
    location: 'Wellington, New Zealand',
    duration: 'Sep 2020 - Sep 2021',
    description: [
      'Resolved 200+ IT incidents per month across phone, email, and remote sessions for the Ministry of Business, Innovation and Employment, maintaining first-call resolution above 80%',
      'Investigated, resolved, and escalated issues raised via phone, email, and callback within SLA windows',
      'Reduced repeat support volume by 25% by identifying recurring issue patterns and authoring knowledge-base articles adopted across the wider team',
    ],
    technologies: [],
  },
]

function Experience() {
  return (
    <section id="experience" className="mt-16">
      <h2 className="text-2xl font-semibold text-ink mb-6">Experience</h2>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-card border border-line rounded-lg shadow-card p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">{exp.title}</h3>
                <p className="text-lg text-primary font-semibold">
                  {exp.company}
                </p>
                <p className="text-ink-muted">{exp.location}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {exp.duration}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <ul className="space-y-2">
                {exp.description.map((desc, descIndex) => (
                  <li
                    key={descIndex}
                    className="text-ink-muted flex items-start"
                  >
                    <span className="text-primary mr-2 mt-1">•</span>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            {exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-sunken text-ink-muted px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-ink mb-6">
          Education &amp; Certifications
        </h2>
        <div className="space-y-6">
          <div className="bg-card border border-line rounded-lg shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">
                  CompTIA Security+ (SY0-701)
                </h3>
                <p className="text-lg text-success font-semibold">
                  CompTIA · Certified
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                  Jul 2026
                </span>
              </div>
            </div>
            <p className="text-ink-muted">
              Covers threats, vulnerabilities, identity, risk, and secure
              operations.
            </p>
          </div>

          <div className="bg-card border border-line rounded-lg shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">
                  Level 6 in Applied Software Development
                </h3>
                <p className="text-lg text-success font-semibold">
                  Dev Academy Aotearoa
                </p>
                <p className="text-ink-muted">Auckland, New Zealand</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                  Jul 2024 - Dec 2024
                </span>
              </div>
            </div>
            <p className="text-ink-muted">
              17-week full-stack bootcamp: JavaScript, TypeScript, React,
              Node.js, and databases, taught through daily pair programming and
              agile team projects. Led a team to build and deploy a full-stack
              app end to end.
            </p>
          </div>

          <div className="bg-card border border-line rounded-lg shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">
                  Bachelor of Arts, History, International Relations, Political
                  Science
                </h3>
                <p className="text-lg text-success font-semibold">
                  Victoria University of Wellington
                </p>
                <p className="text-ink-muted">Wellington, New Zealand</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                  Feb 2017 - Jan 2020
                </span>
              </div>
            </div>
            <p className="text-ink-muted">
              Three years of history, international relations, and political
              science. Heavy on research, academic writing, and building an
              argument from primary sources under deadline.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
