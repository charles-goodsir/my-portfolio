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
    company: 'DATACOM SOLUTIONS (NZ)',
    location: 'Auckland, New Zealand',
    duration: 'Sept 2021 - Current',
    description: [
      'Designed, coded/configured, tested, and delivered enterprise CRM/ERP applications across multiple NZ and Australian regions, working within Azure DevOps CI/CD pipelines from commit through to production release',
      'Built automation test suites using Gherkin/BDD scripts to validate end-to-end business logic - the same systematic verification mindset (input validation, edge cases, expected vs. actual behaviour) used in security testing',
      'Partnered with BAs, developers, configurators, product managers, and clients across cross-functional teams to turn business requirements into secure, maintainable configuration',
      'Automated manual workflows for local government councils using in-house tooling, reducing risk from manual data handling',
      'Diagnosed and remodelled system configuration through root-cause analysis, cutting one job’s runtime from 2.5 minutes to 20 seconds',
      'Authored technical documentation in Confluence to support internal releases and onboarding, and led weekly CRM/ERP overview and training sessions',
      'Mentored associate analysts on delivery practice with ongoing one-on-one guidance',
    ],
    technologies: [
      'GitHub',
      'JSON',
      'Azure DevOps',
      'CI/CD Pipelines',
      'GIT',
      'YAML',
      'Automation Testing',
      'Confluence',
      'Agile Methodology',
    ],
  },
  {
    title: 'Service Desk Analyst',
    company: 'DATACOM SOLUTIONS (NZ)',
    location: 'Wellington, New Zealand',
    duration: 'Sept 2020 to Sept 2021',
    description: [
      'Provided first-line technical support for the Ministry of Business, Innovation and Employment, accurately logging and verifying case details for every call',
      'Investigated, resolved, and escalated issues raised via phone, email, and callback within SLA windows - early exposure to structured incident handling and prioritisation',
      'Escalated to the right specialist teams when outside first-line scope, and shared resolutions across sites to prevent repeat tickets',
      'Built a foundation in clear, calm communication under pressure, which carries directly into reporting vulnerabilities and incidents to non-technical stakeholders',
    ],
    technologies: [
      'Customer Support',
      'Problem Resolution',
      'Documentation',
      'Communication',
      'Ticketing Systems',
    ],
  },
]

function Experience() {
  return (
    <section id="experience" className="max-w-[45rem] mx-auto py-16 px-4">
      <h1 className="text-3xl font-semibold text-ink mb-8">
        Professional Experience
      </h1>

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
          </div>
        ))}
      </div>

      {/* Skills Translation Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-ink mb-6">
          Why I'm Ready for Application Security &amp; DevSecOps Roles
        </h2>
        <div className="bg-sunken rounded-lg shadow-card p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-ink mb-4">
                Security Foundation
              </h4>
              <ul className="space-y-2 text-ink-muted">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>CompTIA Security+ (SY0-701):</strong> Certified in
                    July 2026, covering threats, vulnerabilities, identity,
                    risk, and secure operations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>AppSec homelab:</strong> Building a
                    vulnerable-by-design .NET/React app wired into a CI/CD
                    security pipeline (Semgrep SAST, OWASP Dependency-Check/Snyk
                    SCA, OWASP ZAP DAST, gitleaks secret scanning), self-hosted
                    on Ubuntu Server.{' '}
                    <strong>
                      Plans have been laid out and initial setup is in progress.
                    </strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>Hands-on offensive practice:</strong> Working
                    through PortSwigger's Web Security Academy with Burp Suite -
                    SQL injection labs completed and documented, more in
                    progress
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>Code-level fluency:</strong> 4+ years of production
                    .NET/C# and TypeScript/React means I can read and reason
                    about the code I'd be securing, not just the vulnerability
                    class
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-ink mb-4">
                Engineering Foundation
              </h4>
              <ul className="space-y-2 text-ink-muted">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>CI/CD & release delivery:</strong> Version control,
                    pipelines, and release management across GitHub and Azure
                    DevOps for multi-region enterprise systems
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>Full-stack ownership:</strong> Independently shipped
                    Detour (React Native, TypeScript, Supabase), live on the App
                    Store - end-to-end ownership from UI to auth and data layer
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>Systematic testing mindset:</strong> BDD/Gherkin
                    automation experience translates directly into writing and
                    validating security test cases
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span>
                    <strong>Cross-functional delivery:</strong> Proven at
                    translating business requirements into working, documented
                    solutions across BAs, developers, and product teams
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg border border-line">
            <p className="text-ink-muted text-center font-medium">
              <strong>
                Full-stack training at Dev Academy Aotearoa, CompTIA Security+,
                a self-directed AppSec homelab, and Web Security Academy
                practice
              </strong>{' '}
              all point at the same target: Application Security Engineer,
              Product Security Engineer, and DevSecOps Engineer roles, where
              years of shipping production code do the work that security
              theory on its own cannot.
            </p>
          </div>
        </div>
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
                <h4 className="text-xl font-bold text-ink">
                  CompTIA Security+ (SY0-701)
                </h4>
                <p className="text-lg text-success font-semibold">
                  CompTIA · Certified
                </p>
                <p className="text-ink-muted">Jul 2026</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                  Jul 2026
                </span>
              </div>
            </div>
            <p className="text-ink-muted">
              Covers threats, vulnerabilities, identity, risk, and secure
              operations, complementing hands-on software and enterprise IT
              work.
            </p>
          </div>

          <div className="bg-card border border-line rounded-lg shadow-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-ink">
                  Level 6 in Applied Software Development
                </h4>
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
                <h4 className="text-xl font-bold text-ink">
                  Bachelor of Arts, History, International Relations, Political
                  Science
                </h4>
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
