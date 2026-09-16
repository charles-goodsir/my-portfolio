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
      'Once the homelab app exists, map out its role-based permissions and try to break out of the lowest-privilege role',
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
      'Still not started: information disclosure / directory listing labs, and a config audit of the mini PC itself against CIS Benchmarks',
    ],
    tools: ['OWASP ZAP', 'Nmap', 'Nikto', 'CIS-CAT'],
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
    ],
  },
  {
    rank: 'A03:2025',
    title: 'Software Supply Chain Failures',
    progress: 'In progress',
    summary:
      'New in 2025. Risks introduced through third-party dependencies, build pipelines, and CI/CD tooling - compromised packages, unsigned artifacts, and weak build integrity.',
    whyItMatters:
      'Directly relevant to your homelab pipeline - this is exactly what Dependency-Check/Snyk (SCA) and gitleaks are there to catch before a bad dependency or leaked secret reaches production.',
    howToLearnIt: [
      "Ran Semgrep against my own homelab's GitHub Actions workflow and it flagged the checkout action using a mutable @v4 tag rather than a pinned commit SHA - a real, unprompted example of exactly this risk category",
      'Rebuilt the whole pipeline around it: every GitHub Action pinned to a full commit SHA, with Dependabot on the github-actions ecosystem so the pins still get bumped, just via a reviewed PR instead of a silent tag move',
      'Added dependency scanning for both halves of the app - dotnet list package --vulnerable --include-transitive for NuGet, npm audit --audit-level=high for the frontend - plus Dependabot on both ecosystems',
      'Added Trivy container scanning of both Docker images, left report-only until I have a baseline to triage against',
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
      'PortSwigger labs on JWT attacks are still not started - a lot of crypto failures show up in token handling, and that is the piece still missing here',
    ],
    tools: ['Burp Suite (JWT Editor extension)', 'gitleaks', 'testssl.sh'],
    relatedDiaryLinks: [
      {
        label: 'Fixing plaintext password storage',
        entryId: 'appsec-homelab-entry-16-plaintext-password-fix',
        vulnType: 'Cryptographic Failures',
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
    progress: 'Planned',
    summary:
      'Missing or ineffective control design at the architecture level - a flaw that exists even if implemented perfectly, because the design itself never accounted for the threat.',
    whyItMatters:
      'This is the one that separates "finding bugs" from "AppSec engineering" - it is about threat modelling before code is written, not just scanning after the fact.',
    howToLearnIt: [
      'Learn a lightweight threat modelling method (STRIDE is a good starting point)',
      "Read OWASP's Application Security Verification Standard (ASVS) design-level requirements",
      'Once the homelab app is designed, practice writing a one-page threat model for it before building',
    ],
    tools: ['STRIDE', 'OWASP Threat Dragon', 'OWASP ASVS'],
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
      "Next: JWT-specific labs, and reviewing the homelab app's own auth flow against OWASP's Authentication Cheat Sheet",
    ],
    tools: ['Burp Suite (Intruder, on Pro)', 'Hydra (lab environments only)'],
    relatedDiaryLinks: [
      {
        label: 'Authentication labs 1-5',
        entryId: 'portswigger-auth-labs-1-5',
        vulnType: 'Authentication',
      },
    ],
  },
  {
    rank: 'A08:2025',
    title: 'Software or Data Integrity Failures',
    progress: 'Planned',
    summary:
      'Code and infrastructure that does not verify integrity - insecure deserialization, auto-update mechanisms pulling unsigned code, or CI/CD pipelines without integrity checks.',
    whyItMatters:
      'Overlaps with A03 (Supply Chain) but focuses more on runtime trust - e.g. does your app verify the things it loads or deserializes are what they claim to be.',
    howToLearnIt: [
      'PortSwigger: Insecure Deserialization learning path - not started yet',
      'Learn how signed commits and artifact signing (e.g. Sigstore/cosign) fit into a CI/CD pipeline',
      'Once the homelab pipeline is built, check whether it verifies build artifacts before deployment',
    ],
    tools: ['PortSwigger labs', 'Sigstore/cosign'],
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
      'Once the homelab app exists, set up centralized logging for it - even something simple like a local ELK/Loki stack',
      'Define what "suspicious" looks like for the app (failed logins, repeated 403s) and plan to alert on it',
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
      'Once the homelab app exists, deliberately break it in unusual ways (malformed input, network drops mid-request) and check what gets exposed',
      'Review error handling patterns in .NET/C# for stack traces leaking into production responses',
    ],
    tools: ['OWASP ZAP fuzzer', 'Burp Suite'],
  },
]
