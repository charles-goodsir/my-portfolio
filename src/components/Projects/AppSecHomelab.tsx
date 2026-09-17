import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import pipelineImg from '../../assets/Homelab/HomeLabCICD1.webp'
import terraformImg from '../../assets/Homelab/HomeLabTerraform1.webp'
import activityLogImg from '../../assets/Homelab/HomeLabTerraform2.webp'
import xssImg from '../../assets/Homelab/HomeLabXSS3.webp'

const technologies = [
  'ASP.NET Core 8',
  'React',
  'Docker',
  'GitHub Actions',
  'Semgrep',
  'gitleaks',
  'Trivy',
  'OWASP ZAP',
  'Terraform',
  'Azure',
]

const images = [
  {
    src: pipelineImg,
    alt: 'GitHub Actions pipeline graph showing parallel security jobs feeding a staged deployment gate',
    width: 2854,
    height: 1566,
    caption: 'The staged CI/CD pipeline: parallel security jobs, staging, and a required-reviewer gate before production',
  },
  {
    src: xssImg,
    alt: 'Illustration of the product search XSS payload executing as real HTML',
    width: 1340,
    height: 1620,
    caption: 'One of four seeded vulnerabilities - found, exploited, fixed, and re-tested',
  },
  {
    src: terraformImg,
    alt: 'Azure portal showing a storage account created by Terraform',
    width: 2864,
    height: 1454,
    caption: 'The storage account Terraform stood up in Azure (since torn down with terraform destroy)',
  },
  {
    src: activityLogImg,
    alt: 'Azure activity log showing the resource creation operations Terraform ran',
    width: 1674,
    height: 1414,
    caption: 'The Azure activity log confirming what Terraform actually did',
  },
]

function AppSecHomelab() {
  return (
    <section className="bg-page py-16 px-4">
      <div className="max-w-[45rem] mx-auto">
        {/* Back Button */}
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

        {/* Project Header */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ink">AppSec Homelab</h1>
            <span className="inline-block bg-warn/10 text-warn px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Ongoing
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            A deliberately vulnerable ASP.NET Core / React app that I built,
            broke, fixed, and wrapped in a real DevSecOps pipeline - SAST,
            secrets scanning, SCA, container scanning, DAST, a staged
            deployment gate, and now a first piece of Terraform-managed
            infrastructure on Azure.
          </p>
          <p className="text-xl text-ink-muted mb-6">
            This is still active work, not a finished case study. The CyberDiary
            has the day-by-day version - what broke, what I got wrong first,
            and how each fix was verified.
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-3 mb-8">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project Links */}
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/charles-goodsir/appsec-homelab"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View the repo
            </a>
            <Link
              to="/diary?vuln=AppSec%20Homelab"
              className="border border-line text-ink px-6 py-3 rounded-lg hover:bg-sunken transition-colors duration-300 font-semibold"
            >
              Full write-up in the CyberDiary
            </Link>
            <Link
              to="/owasp"
              className="border border-line text-ink px-6 py-3 rounded-lg hover:bg-sunken transition-colors duration-300 font-semibold"
            >
              OWASP Top 10 progress
            </Link>
          </div>
        </div>

        {/* About */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              I built this app myself and seeded it with real bug classes -
              SQL injection in two places, reflected XSS, and plaintext
              password storage - specifically so I would have a codebase I
              understand completely to practise finding and fixing
              vulnerabilities in, rather than only ever reading about them in
              PortSwigger labs.
            </p>
            <p className="text-ink-muted mb-4">
              It runs on a mini PC on my home network, deployed via Docker
              Compose and, as of this month, via a GitHub Actions pipeline
              with a real deployment gate: a required human approval before
              anything reaches the &quot;production&quot; environment.
            </p>
            <p className="text-ink-muted">
              The goal throughout has been honesty over polish. The
              repo&apos;s README tracks every seeded vulnerability with its
              actual status, and a documented Semgrep false negative (it
              catches one SQLi but misses a structurally identical one) stays
              in the write-up as a known gap rather than something quietly
              patched over to make the pipeline look cleaner than it is.
            </p>
          </div>
        </div>

        {/* What's built so far */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            What&apos;s Built So Far
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Seeded Vulnerabilities - all four fixed
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• SQL injection login bypass (AuthController.cs)</li>
                <li>• SQL injection in product search (ProductsController.cs)</li>
                <li>• Reflected XSS in the product search result</li>
                <li>• Plaintext password storage, now salted PBKDF2 hashing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                CI/CD Security Pipeline
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• SAST (Semgrep) and secrets scanning (gitleaks)</li>
                <li>• Dependency scanning (dotnet/npm audit) + Dependabot</li>
                <li>• Container scanning (Trivy), report-only pending a baseline</li>
                <li>• DAST (OWASP ZAP) over SSH against the LAN-only mini PC</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Deployment Gate
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• SHA-pinned GitHub Actions, kept current via Dependabot</li>
                <li>• Least-privilege permissions per job</li>
                <li>• Required-reviewer approval before the production stage</li>
                <li>• Nightly scheduled scan, plus a pass/fail run summary</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Infrastructure as Code
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• First Terraform deployment: a resource group and storage account on Azure</li>
                <li>• Authenticated via Azure CLI, no hardcoded credentials</li>
                <li>• Reviewed with terraform plan before anything was created</li>
                <li>• Torn down with terraform destroy once captured for the write-up</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Next</h2>
          <ul className="space-y-2 text-ink-muted">
            <li>• Dependency and container scanning results triaged, then Trivy tightened from report-only</li>
            <li>• More OWASP Top 10 categories closed out against this app (see the OWASP progress page)</li>
            <li>• A self-hosted runner on the mini PC, so DAST doesn&apos;t have to piggyback on the deploy SSH connection</li>
          </ul>
        </div>

        {/* Screenshots */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image) => (
              <ScreenshotFigure
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                caption={image.caption}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppSecHomelab
