import { Link } from 'react-router'
import Me from '../assets/MyPic/me.webp'
import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import { owaspTop10 } from '../data/owaspTop10'
import Experience from './Experience'

const CV = `${import.meta.env.BASE_URL}Charles_Goodsir_CV.pdf`

// Worked out from the data so they never go stale.
const DATACOM_START = new Date(2021, 8) // Sep 2021
const years = Math.floor(
  (Date.now() - DATACOM_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
)
const owaspDone = owaspTop10.filter((r) => r.progress === 'Completed').length

const roles = [
  {
    name: 'DevOps / DevSecOps',
    detail: 'security scanning and deployment gates in CI/CD',
  },
  {
    name: 'Application Security',
    detail: 'web app testing, secure code review, and fixing what I find',
  },
  {
    name: 'Security Engineer',
    detail:
      'hardening cloud infrastructure and pipelines, like my Azure landing zone',
  },
  {
    name: 'Junior Cyber Security Engineer',
    detail:
      'security testing and vulnerability management, building on Security+ and my lab work',
  },
]

// Only what the Lab Notes or CV show me using.
const skills = [
  {
    name: 'Security',
    items: [
      'Burp Suite',
      'Semgrep',
      'gitleaks',
      'Trivy',
      'OWASP ZAP',
      'Dependabot',
      'NIST CSF 2.0',
      'CSP & security headers',
    ],
  },
  {
    name: 'Cloud & Infra',
    items: [
      'Azure',
      'Azure DevOps',
      'GitHub Actions',
      'Terraform',
      'Docker',
      'Linux',
      'nginx',
      'Cloudflare Workers',
      'AWS',
      'Git',
    ],
  },
  {
    name: 'Development',
    items: [
      'C# (working knowledge)',
      '.NET',
      'ASP.NET Core',
      'TypeScript',
      'React',
      'React Native',
      'Node.js',
      'Python',
      'SQL',
      'Bash',
    ],
  },
]

const stats: { label: string; value: string; to?: string }[] = [
  { label: 'Application engineering', value: `${years}+ years` },
  { label: 'CompTIA Security+', value: 'Jul 2026' },
  {
    label: 'Lab Notes entries',
    value: String(cyberDiaryEntries.length),
    to: '/diary',
  },
  { label: 'OWASP Top 10 complete', value: `${owaspDone} of 10`, to: '/owasp' },
]

function About() {
  return (
    <section id="about" className="max-w-[45rem] mx-auto py-16 px-4">
      <header className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
        <img
          src={Me}
          alt="Charles Goodsir"
          width={96}
          height={96}
          loading="eager"
          decoding="async"
          className="w-24 h-24 rounded-full object-cover border-2 border-line shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-ink">About Me</h1>
          <p className="text-ink-muted mt-1">
            Application Engineer · Moving into DevSecOps and AppSec
          </p>
          <a
            href={CV}
            download="Charles_Goodsir_CV.pdf"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center mt-3 border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CV
          </a>
        </div>
      </header>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-line rounded-lg px-4 py-3"
          >
            <dt className="text-xs text-ink-muted">{stat.label}</dt>
            <dd className="text-xl font-semibold text-ink mt-0.5">
              {stat.to ? (
                <Link
                  to={stat.to}
                  className="hover:text-primary hover:underline underline-offset-2"
                >
                  {stat.value}
                </Link>
              ) : (
                stat.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="space-y-4 text-ink-muted">
        <p>
          I'm an Application Engineer at Datacom, working on enterprise CRM/ERP
          systems for councils. I build local environments with .NET tooling,
          update their configuration, and export it as JSON. When I commit it, a
          pipeline builds the council's cloud environment from that JSON, and I
          watch the run to make sure my configuration doesn't break it.
        </p>
        <p>
          I'm{' '}
          <strong className="font-semibold text-ink">
            CompTIA Security+ certified
          </strong>
          . Outside work I've built CI/CD pipelines with security gates in my
          own projects, the AppSec homelab and a Secure Azure Landing Zone, and
          I work through PortSwigger's labs in Burp Suite, logging each one in
          my Lab Notes. Application security is my specialty: I want to find a
          flaw in the code, then add the pipeline check that stops it shipping.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 mt-10">
        <div>
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-3">
            Roles I'm targeting
          </h2>
          <ul className="space-y-2 text-sm">
            {roles.map((role) => (
              <li key={role.name}>
                <span className="font-semibold text-ink">{role.name}</span>
                <span className="text-ink-muted"> · {role.detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wide mb-3">
            Skills
          </h2>
          <dl className="space-y-2 text-sm">
            {skills.map((group) => (
              <div key={group.name}>
                <dt className="inline font-semibold text-ink">
                  {group.name}:{' '}
                </dt>
                <dd className="inline text-ink-muted">
                  {group.items.join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Experience />
    </section>
  )
}

export default About
