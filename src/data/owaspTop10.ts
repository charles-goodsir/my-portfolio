export interface OwaspRisk {
  rank: string
  title: string
  summary: string
  whyItMatters: string
  howToLearnIt: string[]
  tools: string[]
  relatedDiaryVulnType?: string
  progress?: 'Not started' | 'Planned' | 'In progress' | 'Completed'
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
    progress: 'Planned',
    summary:
      'Insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages that leak information.',
    whyItMatters:
      'Easy to introduce and easy to miss - a single unhardened default (default creds, an open S3 bucket, debug mode left on in prod) can undo otherwise solid code.',
    howToLearnIt: [
      'PortSwigger labs on information disclosure and directory listing - not started yet',
      'Once the homelab app is built, run a config audit on it: default credentials, exposed admin panels, verbose error pages',
      'Get familiar with CIS Benchmarks for whatever OS/cloud platform I end up deploying to',
    ],
    tools: ['OWASP ZAP', 'Nmap', 'Nikto', 'CIS-CAT'],
  },
  {
    rank: 'A03:2025',
    title: 'Software Supply Chain Failures',
    progress: 'Planned',
    summary:
      'New in 2025. Risks introduced through third-party dependencies, build pipelines, and CI/CD tooling - compromised packages, unsigned artifacts, and weak build integrity.',
    whyItMatters:
      'Directly relevant to your homelab pipeline - this is exactly what Dependency-Check/Snyk (SCA) and gitleaks are there to catch before a bad dependency or leaked secret reaches production.',
    howToLearnIt: [
      'Homelab CI/CD pipeline is planned but not built yet - once it exists, wire in Dependency-Check or Snyk to gate builds',
      'Learn what an SBOM (Software Bill of Materials) is, and generate one once the homelab app exists',
      'Read up on real supply-chain incidents (e.g. compromised npm/PyPI packages) to understand the attack pattern',
    ],
    tools: ['OWASP Dependency-Check', 'Snyk', 'gitleaks', 'Syft/SBOM tooling'],
  },
  {
    rank: 'A04:2025',
    title: 'Cryptographic Failures',
    progress: 'Planned',
    summary:
      'Sensitive data exposed due to missing or weak encryption, in transit or at rest - weak algorithms, hardcoded keys, or plaintext storage of things like passwords or tokens.',
    whyItMatters:
      "Was previously ranked #2 in 2021 (as 'Sensitive Data Exposure'/'Cryptographic Failures'). Still a top cause of major breaches when it goes wrong.",
    howToLearnIt: [
      'PortSwigger labs on JWT attacks - not started yet, a lot of crypto failures show up in token handling',
      'Learn the difference between encoding, hashing, and encryption, and when to use each',
      'Once the homelab app exists, check it for hardcoded secrets or weak hashing - gitleaks can help here',
    ],
    tools: ['Burp Suite (JWT Editor extension)', 'gitleaks', 'testssl.sh'],
  },
  {
    rank: 'A05:2025',
    title: 'Injection',
    progress: 'In progress',
    summary:
      'Untrusted data is sent to an interpreter as part of a command or query, letting an attacker alter its intended behaviour - covers SQL injection, XSS, command injection, and similar.',
    whyItMatters:
      'The category you already have the most hands-on depth in from the PortSwigger SQL injection path and the XSS path you just started - this is your strongest talking point in interviews right now.',
    howToLearnIt: [
      'Completed the PortSwigger SQL injection path (15 of 17 labs - 2 remain blocked behind Burp Pro)',
      'Currently working through the PortSwigger XSS path',
      'Planning to move on to Command Injection and NoSQL Injection labs after XSS',
      'Once the homelab pipeline exists, add a Semgrep rule set for injection patterns and see what it flags',
    ],
    tools: [
      'Burp Suite',
      'Semgrep',
      'sqlmap (for understanding, use ethically)',
    ],
    relatedDiaryVulnType: 'SQL Injection',
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
    progress: 'Planned',
    summary:
      "Weaknesses in how an application confirms a user's identity - weak password policies, session fixation, credential stuffing exposure, missing MFA.",
    whyItMatters:
      'Ties directly into your Security+ material on identity and access management, and is one of the highest-value areas to get hands-on with since login flows are everywhere.',
    howToLearnIt: [
      'PortSwigger: Authentication learning path - not started yet (password reset flaws, 2FA bypass, brute-force protection)',
      'Practice testing login flows for account lockout, rate limiting, and password reset token predictability on the labs',
      "Once the homelab app has an auth flow, review it against OWASP's Authentication Cheat Sheet",
    ],
    tools: ['Burp Suite (Intruder, on Pro)', 'Hydra (lab environments only)'],
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
