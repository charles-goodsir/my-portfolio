export interface OwaspRisk {
  rank: string
  title: string
  summary: string
  whyItMatters: string
  howToLearnIt: string[]
  tools: string[]
  relatedDiaryVulnType?: string
  progress?: 'Not started' | 'Planned' | 'In progress' | 'Completed'
  relatedDiaryLinks?: { label: string; entryId: string; vulnType: string }[]
}

export const owaspTop10: OwaspRisk[] = [
  {
    rank: 'A01:2025',
    title: 'Broken Access Control',
    progress: 'Planned',
    summary:
      'The application fails to properly enforce what an authenticated user is allowed to do or see, letting them act outside their intended permissions.',
    whyItMatters:
      'Consistently the #1 risk by occurrence. Covers IDOR, privilege escalation, and forced browsing - and now absorbs SSRF, since coercing a server into an unauthorised request is fundamentally an access control failure.',
    howToLearnIt: [
      "PortSwigger's Access Control and Server-Side Request Forgery learning paths - next up, not started yet",
      'Practice IDOR by tampering with object IDs directly in the PortSwigger labs via Burp Repeater',
      "Test the homelab app's two seeded accounts (administrator and wiener) against each other to see whether one can act as the other - not started yet",
    ],
    tools: ['Burp Suite', 'Burp Repeater', 'Autorize (Burp extension)'],
  },
  {
    rank: 'A02:2025',
    title: 'Security Misconfiguration',
    progress: 'In progress',
    summary:
      'Insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages that leak information.',
    whyItMatters:
      'Easy to introduce and easy to miss - a single unhardened default (default creds, an open S3 bucket, debug mode left on in prod) can undo otherwise solid code.',
    howToLearnIt: [
      'Ran three rounds of OWASP ZAP baseline scans against the homelab app, fixing missing security headers between each: 8 warnings down to 3, 59 passes up to 64',
      'Added CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, and the cross-origin isolation headers to the nginx config, one round at a time, re-scanning after each fix',
      'Left one CSP directive as a documented trade-off (unsafe-inline for styles) rather than chasing a zero-warning scan - noted directly in the nginx config comments',
      'Wrote secure defaults into the landing zone Terraform instead of accepting provider defaults: TLS 1.2 minimum, HTTPS-only and no public network access on the storage account, and a deny-by-default NSG on the subnet',
      'tfsec caught a real misconfiguration in my own Terraform: a Key Vault with no network ACL (CRITICAL). I fixed it with network_acls default_action = "Deny" instead of suppressing the finding, and the pipeline would not deploy until it passed',
      'Semgrep flagged the homelab Dockerfile running as root, and I switched the container to a non-root user',
      'Switching scanners to Trivy found four storage account misconfigurations tfsec had passed. I fixed two (a network_rules deny default, infrastructure encryption) and accepted two with written #trivy:ignore reasons (GRS replication on an empty account, and queue-only Storage Analytics logging)',
      'Still not started: information disclosure / directory listing labs, and a config audit of the mini PC itself against CIS Benchmarks',
    ],
    tools: ['OWASP ZAP', 'Trivy', 'Semgrep', 'Nmap', 'Nikto', 'CIS-CAT'],
    relatedDiaryLinks: [
      {
        label: 'First ZAP baseline scan',
        entryId: 'appsec-homelab-entry-9-first-zap-scan',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'ZAP remediation, final round',
        entryId: 'appsec-homelab-entry-10-zap-remediation-final',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'Landing zone Terraform: secure defaults, tfsec findings',
        entryId: 'secure-azure-landing-zone-entry-7-main-tf-resource-by-resource',
        vulnType: 'Secure Azure Landing Zone',
      },
      {
        label: 'Fixing the tfsec findings, first deployment',
        entryId: 'secure-azure-landing-zone-entry-8-tfsec-fixes-first-apply',
        vulnType: 'Secure Azure Landing Zone',
      },
      {
        label: 'Semgrep: Dockerfile running as root',
        entryId: 'appsec-homelab-entry-21-azure-pipelines-lan-self-hosted-agent',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'Trivy: storage account findings tfsec missed',
        entryId: 'secure-azure-landing-zone-entry-9-tfsec-to-trivy',
        vulnType: 'Secure Azure Landing Zone',
      },
    ],
  },
  {
    rank: 'A03:2025',
    title: 'Software Supply Chain Failures',
    progress: 'In progress',
    summary:
      'New in 2025. Risks introduced through third-party dependencies, build pipelines, and CI/CD tooling - compromised packages, unsigned artifacts, and weak build integrity.',
    whyItMatters:
      'Directly relevant to my homelab pipeline: dependency scanning (dotnet list package --vulnerable, npm audit, Dependabot) and gitleaks are there to catch a bad dependency or leaked secret before it reaches production.',
    howToLearnIt: [
      "Ran Semgrep against my own homelab's GitHub Actions workflow and it flagged the checkout action using a mutable @v4 tag rather than a pinned commit SHA - a real, unprompted example of exactly this risk category",
      'Rebuilt the whole pipeline around it: every GitHub Action pinned to a full commit SHA, with Dependabot on the github-actions ecosystem so the pins still get bumped, just via a reviewed PR instead of a silent tag move',
      'Added dependency scanning for both halves of the app - dotnet list package --vulnerable --include-transitive for NuGet, npm audit --audit-level=high for the frontend - plus Dependabot on both ecosystems',
      'Added Trivy container scanning of both Docker images, left report-only until I have a baseline to triage against',
      'The dependency scan caught a high-severity vulnerability in a transitive package, SQLitePCLRaw.lib.e_sqlite3, pulled in via Microsoft.EntityFrameworkCore.Sqlite, and I fixed it directly',
      'Found Dependabot had been failing silently for weeks: 12 fix branches existed with no PRs, because the repo blocked Actions from creating pull requests. I fixed the permission and deleted the stale branches so Dependabot rebuilt them as real PRs',
      'Added a Dependabot cooldown period (a Semgrep finding) and update grouping, so weekly runs open one PR per ecosystem',
      "Closed a shortcut I'd flagged: the landing zone pipeline installed tfsec by piping an unpinned script into bash. Replaced it with Trivy pinned to v0.74.0 and verified against the release's SHA-256 checksum, with set -euo pipefail so a failed check actually stops the install",
      'Still open: no SBOM generated for the app yet',
    ],
    tools: ['Dependabot', 'Trivy', 'gitleaks', 'Syft/SBOM tooling'],
    relatedDiaryLinks: [
      {
        label: 'AppSec Homelab',
        entryId: 'appsec-homelab-entry-4-first-pipeline-run',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'Full CI/CD security pipeline',
        entryId: 'appsec-homelab-entry-14-cicd-pipeline',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'Dependabot gap and a transitive vulnerability',
        entryId: 'appsec-homelab-entry-20-azure-pipelines-migration-dependabot-gap',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'Swapping tfsec for a checksum-verified Trivy',
        entryId: 'secure-azure-landing-zone-entry-9-tfsec-to-trivy',
        vulnType: 'Secure Azure Landing Zone',
      },
    ],
  },
  {
    rank: 'A04:2025',
    title: 'Cryptographic Failures',
    progress: 'Completed',
    summary:
      'Sensitive data exposed due to missing or weak encryption, in transit or at rest - weak algorithms, hardcoded keys, or plaintext storage of things like passwords or tokens.',
    whyItMatters:
      "Was previously ranked #2 in 2021 (as 'Sensitive Data Exposure'/'Cryptographic Failures'). Still a top cause of major breaches when it goes wrong.",
    howToLearnIt: [
      'Found and fixed the last of the four seeded homelab vulnerabilities: the User model stored passwords as plain strings, checked with a raw SQL equality comparison',
      "Rewrote it around Microsoft.AspNetCore.Identity's PasswordHasher<User> for salted PBKDF2 hashing, looking up by username only and verifying the hash in C# instead of comparing plaintext in the query",
      'Re-tested after the fix: correct login still works, a wrong password fails, and the raw table now stores hashed blobs instead of admin123 and peter in plain text',
      'In the landing zone Terraform, enforced TLS 1.2 minimum and HTTPS-only on the storage account, and enabled Key Vault purge protection with 7-day soft delete so deleted secrets stay recoverable',
      'PortSwigger labs on JWT attacks are still not started - a lot of crypto failures show up in token handling, and that is the piece still missing here',
    ],
    tools: ['Burp Suite (JWT Editor extension)', 'gitleaks', 'testssl.sh'],
    relatedDiaryLinks: [
      {
        label: 'Fixing plaintext password storage',
        entryId: 'appsec-homelab-entry-16-plaintext-password-fix',
        vulnType: 'Cryptographic Failures',
      },
      {
        label: 'Landing zone: TLS and Key Vault settings',
        entryId: 'secure-azure-landing-zone-entry-7-main-tf-resource-by-resource',
        vulnType: 'Secure Azure Landing Zone',
      },
    ],
  },
  {
    rank: 'A05:2025',
    title: 'Injection',
    progress: 'Completed',
    summary:
      'Untrusted data is sent to an interpreter as part of a command or query, letting an attacker alter its intended behaviour - covers SQL injection, XSS, command injection, and similar.',
    whyItMatters:
      'The category I have the most hands-on depth in, from the PortSwigger SQL injection and XSS paths and from finding and fixing both bug classes in my own app - this is my strongest talking point in interviews right now.',
    howToLearnIt: [
      'Completed the PortSwigger SQL injection path (Community Edition - 2 labs remain blocked behind Burp Pro/Collaborator)',
      'Completed the PortSwigger XSS path, including the expert-level AngularJS sandbox escapes and CSP bypasses (3 labs remain blocked behind Pro or a lab-state issue)',
      'Built a deliberately vulnerable .NET/React app, reproduced the SQL injection login bypass and reflected XSS in my own code, then fixed both with parameterized queries and JSX text interpolation, and re-tested each fix against the original exploit',
      "Wired Semgrep into a GitHub Actions pipeline - it correctly caught the seeded ProductsController.cs SQLi but not the structurally identical one in AuthController.cs, traced to the rule not treating [FromBody]-bound objects as a tainted source, documented as a known false negative",
      'Moved on to the Authentication path next rather than Command/NoSQL injection - higher priority given how much of it maps to real login-flow bugs',
    ],
    tools: [
      'Burp Suite',
      'Semgrep',
      'sqlmap (for understanding, use ethically)',
    ],
    relatedDiaryLinks: [
      {
        label: 'SQL Injection labs',
        entryId: 'portswigger-sqli-path-complete',
        vulnType: 'SQL Injection',
      },
      {
        label: 'XSS path complete',
        entryId: 'portswigger-xss-labs-25-30',
        vulnType: 'XSS',
      },
      {
        label: 'Homelab: login bypass exploit and fix',
        entryId: 'appsec-homelab-entry-11-login-bypass-fix',
        vulnType: 'SQL Injection',
      },
      {
        label: 'Homelab: XSS exploit and fix',
        entryId: 'appsec-homelab-entry-13-product-search-xss-fix',
        vulnType: 'XSS',
      },
    ],
  },
  {
    rank: 'A06:2025',
    title: 'Insecure Design',
    progress: 'In progress',
    summary:
      'Missing or ineffective control design at the architecture level - a flaw that exists even if implemented perfectly, because the design itself never accounted for the threat.',
    whyItMatters:
      'This is the one that separates "finding bugs" from "AppSec engineering" - it is about threat modelling before code is written, not just scanning after the fact.',
    howToLearnIt: [
      'Wrote a lightweight risk assessment of the whole homelab (mini PC, app, pipeline, repo) mapped to NIST CSF 2.0, listing the real gaps - no patch cadence, no network segmentation, no recovery process - instead of padding them out',
      'For the visitor map, set the privacy boundary before writing any code: country-level aggregates only, no IP ever stored. Then wrote a risk assessment of the finished feature, which led to adding a rate limit',
      "Still not done: a STRIDE threat model written before a build, and reading OWASP's ASVS design-level requirements",
    ],
    tools: ['STRIDE', 'OWASP Threat Dragon', 'OWASP ASVS', 'NIST CSF 2.0'],
    relatedDiaryLinks: [
      {
        label: 'Homelab risk assessment (NIST CSF)',
        entryId: 'appsec-homelab-entry-17-risk-assessment',
        vulnType: 'AppSec Homelab',
      },
      {
        label: 'Visitor map: privacy boundary and risk assessment',
        entryId: 'visitor-map-entry-1-build-and-rate-limit',
        vulnType: 'Visitor Map',
      },
    ],
  },
  {
    rank: 'A07:2025',
    title: 'Authentication Failures',
    progress: 'In progress',
    summary:
      "Weaknesses in how an application confirms a user's identity - weak password policies, session fixation, credential stuffing exposure, missing MFA.",
    whyItMatters:
      'Ties directly into my Security+ material on identity and access management, and is one of the highest-value areas to get hands-on with since login flows are everywhere.',
    howToLearnIt: [
      'Started the PortSwigger Authentication path: username enumeration by response text, by a subtly different error message (Intruder grep-extract), and by response timing',
      'Bypassed a 2FA flow by navigating straight to the post-login page without completing the second factor',
      'Exploited a password-reset flaw where the reset token was not bound to the account it was issued for, replaying it in Repeater against a different username',
      'Defeated an account lockout by spoofing X-Forwarded-For so each login attempt looked like a new IP',
      'On the pipeline side, the landing zone authenticates to Azure with workload identity federation (OIDC): a short-lived federated token per run instead of a stored client secret',
      "Next: JWT-specific labs, and reviewing the homelab app's own auth flow against OWASP's Authentication Cheat Sheet",
    ],
    tools: ['Burp Suite (Intruder, on Pro)', 'Hydra (lab environments only)'],
    relatedDiaryLinks: [
      {
        label: 'Authentication labs 1-5',
        entryId: 'portswigger-auth-labs-1-5',
        vulnType: 'Authentication',
      },
      {
        label: 'Landing zone: OIDC pipeline auth',
        entryId: 'secure-azure-landing-zone-entry-5-plan-stage-oidc-auth',
        vulnType: 'Secure Azure Landing Zone',
      },
    ],
  },
  {
    rank: 'A08:2025',
    title: 'Software or Data Integrity Failures',
    progress: 'In progress',
    summary:
      'Code and infrastructure that does not verify integrity - insecure deserialization, auto-update mechanisms pulling unsigned code, or CI/CD pipelines without integrity checks.',
    whyItMatters:
      'Overlaps with A03 (Supply Chain) but focuses more on runtime trust - e.g. does your app verify the things it loads or deserializes are what they claim to be.',
    howToLearnIt: [
      'The landing zone pipeline publishes the terraform plan as an artifact, and Apply deploys that exact plan after a manual approval gate instead of re-planning, so what ships is what someone reviewed',
      'Every homelab GitHub Action is pinned to a full commit SHA, so a moved tag cannot swap in different code (more under A03)',
      'Still not started: the PortSwigger Insecure Deserialization path, and artifact signing with Sigstore/cosign',
    ],
    tools: ['PortSwigger labs', 'Sigstore/cosign', 'Azure DevOps approvals'],
    relatedDiaryLinks: [
      {
        label: 'Landing zone: Apply stage and approval gate',
        entryId: 'secure-azure-landing-zone-entry-6-apply-stage-deployment-jobs',
        vulnType: 'Secure Azure Landing Zone',
      },
    ],
  },
  {
    rank: 'A09:2025',
    title: 'Security Logging and Alerting Failures',
    progress: 'Planned',
    summary:
      'Insufficient logging, monitoring, and alerting means breaches go undetected for longer - or are detected only after significant damage is done.',
    whyItMatters:
      "Consistently under-invested in relative to prevention, but it's what determines whether an incident is caught in minutes or months.",
    howToLearnIt: [
      "Read OWASP's Logging Cheat Sheet for what should and shouldn't be logged",
      'Set up centralized logging for the homelab app, even something simple like a local Loki stack - not started yet',
      'Define what "suspicious" looks like for the app (failed logins, repeated 403s) and plan to alert on it',
      'Both risk assessments so far (the homelab and the visitor map) list detection as a gap: nothing I have built alerts on unusual traffic yet',
    ],
    tools: ['ELK Stack', 'Grafana Loki', 'OWASP Logging Cheat Sheet'],
  },
  {
    rank: 'A10:2025',
    title: 'Mishandling of Exceptional Conditions',
    progress: 'Planned',
    summary:
      'New in 2025. Covers unhandled errors, inconsistent error handling, and edge cases that leak information or leave the application in an insecure state.',
    whyItMatters:
      'A newer, more precise framing of issues that used to be scattered across other categories - error messages leaking stack traces, or a failed operation leaving data half-written.',
    howToLearnIt: [
      "Practice fuzzing an endpoint with Burp Intruder-style payloads (or ZAP's fuzzer) in the PortSwigger labs",
      'Break the homelab app on purpose (malformed input, network drops mid-request) and check what it exposes - not started yet',
      'Review error handling patterns in .NET/C# for stack traces leaking into production responses',
    ],
    tools: ['OWASP ZAP fuzzer', 'Burp Suite'],
  },
]
