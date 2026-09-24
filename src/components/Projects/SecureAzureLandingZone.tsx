import { Link } from 'react-router'
import ScreenshotFigure from '../ui/ScreenshotFigure'
import pipelineGreenImg from '../../assets/SecureAzureLandingZone/SALZ12.webp'
import trivyReportImg from '../../assets/SecureAzureLandingZone/SALZ14.webp'
import activityLogImg from '../../assets/SecureAzureLandingZone/SALZ13.webp'
import validateImg from '../../assets/SecureAzureLandingZone/SALZ4.webp'

const technologies = ['Terraform', 'Azure DevOps', 'Azure', 'Trivy', 'OIDC', 'YAML']

const images = [
  {
    src: pipelineGreenImg,
    alt: 'Azure DevOps pipeline with Validate, Security Scan, Terraform Plan, and Terraform Apply stages all passing',
    width: 2200,
    height: 396,
    caption:
      'The full pipeline green for the first time: Validate, Security Scan, Plan (publishing the plan artifact), and Apply after one approval check',
  },
  {
    src: trivyReportImg,
    alt: 'Trivy report summary showing four misconfigurations in main.tf, led by a critical finding for missing network rules',
    width: 1400,
    height: 879,
    caption:
      "Trivy's first scan of main.tf: four storage account misconfigurations tfsec had passed, led by a CRITICAL for no network rules",
  },
  {
    src: activityLogImg,
    alt: 'Azure activity log for the salz-rg resource group listing the create and update operations from the first deployment',
    width: 1696,
    height: 1440,
    caption:
      "salz-rg's activity log after the first Apply: the creates and updates Terraform ran, alongside Azure Policy audit events",
  },
  {
    src: validateImg,
    alt: 'Azure DevOps pipeline run showing the Validate stage passing end to end',
    width: 1592,
    height: 1090,
    caption:
      'The Validate stage: install Terraform → fmt -check → init -backend=false → validate',
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
            Azure DevOps pipeline that validates, security-scans, plans, and
            waits for a human approval before any infrastructure changes.
          </p>
          <p className="text-xl text-ink-muted mb-6">
            The pipeline runs end to end and the first resources are live in
            Azure: a resource group, a VNet and subnet behind a deny-by-default
            NSG, a storage account, and a Key Vault. Nothing deploys until
            Trivy passes the Terraform. The CyberDiary has the day-by-day
            version, bugs included.
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
              Everything in the AppSec Homelab was stood up by hand, then
              wrapped in CI/CD afterwards. For this one I built the pipeline
              first, so every piece of infrastructure gets validated and
              scanned before it reaches Azure.
            </p>
            <p className="text-ink-muted mb-4">
              The pipeline has four stages. Validate runs{' '}
              <code>terraform fmt -check</code>, <code>init</code>, and{' '}
              <code>validate</code>. Security Scan runs Trivy, pinned to
              v0.74.0 and checked against its release checksum. Plan runs
              against remote state and publishes the plan file as an
              artifact. Apply is a deployment job on a production Environment
              with an approval check, and it deploys that exact plan instead
              of re-planning.
            </p>
            <p className="text-ink-muted">
              The pipeline authenticates to Azure with workload identity
              federation, so each run gets a short-lived OIDC token and no
              client secret is stored anywhere. The scan stage has earned its
              place already: it blocked the first deployment over a Key Vault
              with no network ACL, and after I swapped tfsec for Trivy it
              found four storage account problems tfsec had passed.
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
              <h3 className="text-lg font-semibold text-ink mb-3">Pipeline</h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• Validate: fmt -check, init, validate</li>
                <li>• Security Scan: Trivy v0.74.0, checksum-verified, with set -euo pipefail so a failed check stops the install</li>
                <li>• Plan: remote state in a separate rg-tfstate storage account, created by hand with az cli; plan published as an artifact</li>
                <li>• Apply: manual approval gate, then deploys the approved plan</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Infrastructure (live in salz-rg)
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• VNet and subnet, with an NSG relying on Azure&apos;s implicit deny-all</li>
                <li>• Storage account: TLS 1.2 minimum, HTTPS-only, no public access, network_rules deny default, infrastructure encryption</li>
                <li>• Key Vault: RBAC authorization, purge protection, 7-day soft delete, network ACL deny default</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Findings Fixed
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• tfsec: Key Vault with no network ACL (CRITICAL) and no soft delete retention set (MEDIUM)</li>
                <li>• Trivy: four storage account findings. Two fixed, two accepted with written #trivy:ignore reasons</li>
                <li>• Replaced an unpinned curl | bash tfsec install with a checksum-verified Trivy release</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink mb-3">
                Real Bugs Along the Way
              </h3>
              <ul className="space-y-2 text-ink-muted">
                <li>• The install script&apos;s cleanup deleted my checked-out terraform/ source folder</li>
                <li>• AzureCLI@2&apos;s login didn&apos;t carry over to Terraform&apos;s azurerm provider, fixed by exporting the ARM_* OIDC variables</li>
                <li>• Deployment jobs don&apos;t auto-checkout the source repo the way regular jobs do</li>
                <li>• A storage account replace failed halfway: Azure rejected the new account name 6 seconds after Terraform deleted the old one</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-card border border-line rounded-lg shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-ink mb-6">Status</h2>
          <p className="text-ink-muted">
            Active. The pipeline and first resources are done. Two known gaps
            remain: everything is hardcoded until I write{' '}
            <code>variables.tf</code>, and logging still needs diagnostic
            settings sent to Log Analytics, which is also the proper fix for
            the Storage Analytics finding I accepted for now.
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
