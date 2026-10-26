import { Link } from 'react-router'

const technologies = [
  'Python',
  'FastAPI',
  'YAML',
  'pytest',
  'Ruff',
  'gitleaks',
  'pip-audit',
  'Microsoft Graph',
  'GitHub Actions',
  'ISO 27001',
  'UK GDPR',
]

const levels = [
  { name: 'Small office: access control and incidents', status: 'Graded B' },
  {
    name: 'Ashgrove Dental: access, incidents and suppliers',
    status: '7 of 8 planted gaps caught',
  },
  {
    name: 'Marlow & Finch: supplier risk (ISO 27001)',
    status: 'Built, not attempted',
  },
  { name: 'Kestrel Pay: full ISO 27001 gap assessment', status: 'In progress' },
  { name: 'SOC 2, continuity, cloud and a capstone', status: 'Planned' },
]

const linkClass =
  'bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold'

function GrcAssessor() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        <Link
          to="/projects"
          className="mb-8 flex items-center text-primary hover:underline underline-offset-2 transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ink">
              GRC Assessor Practice
            </h1>
            <span className="inline-block bg-warn/10 text-warn px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              In progress
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            Gap assessments of fictional companies, and grc-lite, the
            compliance-as-code tool that Claude built to run them.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="border border-line bg-sunken text-ink-muted px-3 py-1.5 rounded-md font-mono text-xs"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/diary?project=GRC" className={linkClass}>
              Assessment write-ups
            </Link>
            <Link to="/diary?project=GRC%20Lite" className={linkClass}>
              grc-lite build notes
            </Link>
            <a
              href="https://github.com/charles-goodsir/grc-assessor-practice"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Practice on GitHub
            </a>
            <a
              href="https://github.com/charles-goodsir/grc-lite"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              grc-lite on GitHub
            </a>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              Each level is a fictional company with a scope, a data room of its
              own policies and evidence, and a sealed answer key. I play the
              assessor. I pull testable rules out of the policies, test them
              against the evidence, ask the client for what is missing, and
              write rated findings. Then I am graded against the key: caught,
              missed, or rated too high or low.
            </p>
            <p className="text-ink-muted">
              grc-lite is the tool around that work. Criteria, evidence,
              findings, requests and risks live as YAML files in Git. A command
              line validates them and builds a report, a collector reads Entra
              ID for evidence, and a local web app lets me work through a level
              and track my grading over time. Every company, person and dataset
              is invented.
            </p>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Who Did What</h2>
          <div className="grid gap-6 sm:grid-cols-2 text-ink-muted">
            <div>
              <h3 className="font-semibold text-ink mb-2">The assessments</h3>
              <p>
                Mine. I read the policies, test the evidence, choose and rate
                the findings, and take the grading. The write-ups are in my Lab
                Notes under GRC.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-2">The tool</h3>
              <p>
                Claude wrote the code, commits and pull requests for grc-lite. I
                set the goals, reviewed the work and decided what to build next.
                Its build notes are under GRC Lite.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Levels</h2>
          <ul className="divide-y divide-line border-y border-line">
            {levels.map((level) => (
              <li
                key={level.name}
                className="py-3 flex flex-wrap justify-between gap-2 text-ink-muted"
              >
                <span>{level.name}</span>
                <span className="text-ink font-medium">{level.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            What&apos;s Built So Far
          </h2>
          <ul className="space-y-2 text-ink-muted">
            <li>
              • Six required checks on every pull request: pytest on three
              Python versions, ruff, pip-audit and a gitleaks scan, each proved
              by making it fail
            </li>
            <li>
              • A validator that rejects unknown fields, broken references and
              incomplete findings, and a report built from the same files
            </li>
            <li>
              • Entra ID collectors for leavers and administrator MFA that keep
              account names out of the public repo, with the safety controls
              broken on purpose to check a test notices
            </li>
            <li>
              • A local study app bound to 127.0.0.1, with a Host check, a
              startup token and a strict Content-Security-Policy, where over
              forty deliberate breaks found three checks that proved nothing
            </li>
            <li>
              • Grading import, a mistake log and a progress view across levels
            </li>
          </ul>
        </div>

        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Known limits</h2>
          <p className="text-ink-muted">
            The lock after a level is submitted and the rule that hides the
            answer key are commitments to myself, not security controls, because
            deleting a file undoes them. The Entra collectors have only run
            against fixtures, so the Graph response shapes follow the
            documentation and are unproven against a real tenant. The sealed
            answer keys stay out of the public repository so the exercises
            remain blind.
          </p>
        </div>
      </div>
    </section>
  )
}

export default GrcAssessor
