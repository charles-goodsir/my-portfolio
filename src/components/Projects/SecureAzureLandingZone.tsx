import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import installImg from '../../assets/SecureAzureLandingZone/SALZ1.webp'
import validateImg from '../../assets/SecureAzureLandingZone/SALZ4.webp'
import securityScanImg from '../../assets/SecureAzureLandingZone/SALZ6.webp'

const technologies = ['Terraform', 'Azure DevOps', 'Azure', 'tfsec', 'YAML']

const images = [
  {
    src: installImg,
    alt: 'Azure DevOps pipeline run showing Terraform installed cleanly on the agent',
    width: 2358,
    height: 1474,
    caption:
      'The Validate stage installing Terraform on the pipeline agent, after chasing an interactive-prompt hang and a stray leftover directory',
  },
  {
    src: validateImg,
    alt: 'Azure DevOps pipeline run showing the Validate stage passing end to end',
    width: 1592,
    height: 1090,
    caption:
      'Validate stage complete: install Terraform → fmt -check → init -backend=false → validate',
  },
  {
    src: securityScanImg,
    alt: 'Azure DevOps pipeline run showing the SecurityScan stage running tfsec',
    width: 2290,
    height: 1424,
    caption: 'SecurityScan stage running tfsec, gated on Validate passing first',
  },
]

function SecureAzureLandingZone() {
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
            <h1 className="text-4xl font-bold text-ink">
              Secure Azure Landing Zone
            </h1>
            <span className="inline-block bg-warn/10 text-warn px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
              Ongoing
            </span>
          </div>
          <p className="text-xl text-ink-muted mb-6">
            A Terraform-managed Azure landing zone, built pipeline-first: an
            Azure DevOps pipeline that validates and security-scans the
            Terraform before any real infrastructure goes in.
          </p>
          <p className="text-xl text-ink-muted mb-6">
            The pipeline is the part that's built right now - Validate and
            SecurityScan stages both run clean end to end. The landing zone
            resources themselves are still TODO comments in main.tf. This
            page will grow as that changes; the CyberDiary has the day-by-day
            version in the meantime.
          </p>

          {/* Technologies */}
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

          {/* Project Links */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/diary?vuln=Secure%20Azure%20Landing%20Zone"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              Full write-up in the CyberDiary
            </Link>
            <a
              href="https://github.com/charles-goodsir/secure-azure-landing-zone"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-card px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-300 font-semibold"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* About */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-ink-muted mb-4">
              Everything in the AppSec Homelab was stood up manually, then
              wrapped in CI/CD after the fact. For this one I wanted the
              opposite order: the pipeline first, so every piece of
              infrastructure that goes in from here on is validated and
              scanned before it ever reaches Azure, not audited afterward.
            </p>
            <p className="text-ink-muted mb-4">
              The Validate stage installs Terraform on the agent, runs{' '}
              <code>terraform fmt -check</code>, then{' '}
              <code>terraform init -backend=false</code> and{' '}
              <code>terraform validate</code> - deliberately without a
              backend, since the remote state config isn't written yet and
              validation only needs providers resolved. The SecurityScan
              stage runs after Validate passes, using tfsec over Checkov for
              being a single purpose-built binary rather than a heavier
              multi-cloud scanner.
            </p>
            <p className="text-ink-muted">
              Neither stage has caught a real finding yet, because there's
              nothing real to catch: <code>main.tf</code> is still just TODO
              comments. That's an honest gap, not a hidden one - the
              mechanism is proven, and it starts earning its keep the moment
              actual <code>azurerm_*</code> resources go in.
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
                Validate Stage
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Terraform installed via curl + unzip, not the marketplace task</li>
                <li>• terraform fmt -check -diff</li>
                <li>• terraform init -backend=false</li>
                <li>• terraform validate</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                SecurityScan Stage
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• tfsec, gated on Validate passing first (dependsOn)</li>
                <li>• Chosen over Checkov for being purpose-built for Azure IaC</li>
                <li>• Not yet checking anything real - main.tf has no resource blocks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Real Bugs Along the Way
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Terraform install hung on an unanswered overwrite prompt, no stdin on a hosted agent</li>
                <li>• A stray leftover directory from a failed run blocked the next install</li>
                <li>• The install script's own cleanup once deleted my checked-out terraform/ source folder</li>
                <li>• A missing line break in a script: | block merged two shell commands into one</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Setup
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Separate Azure DevOps org from the Azure Portal account the resources will live in</li>
                <li>• No remote state backend yet - backend.tf is still a TODO</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Status</h2>
          <p className="text-ink-muted">
            Active. Next is writing the actual landing zone resources into{' '}
            <code>main.tf</code> - so Validate and tfsec finally have
            something real to check - followed by a remote state backend.
          </p>
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

export default SecureAzureLandingZone
