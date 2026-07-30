export interface OwaspRisk {
  rank: string
  title: string
  summary: string
  whyItMatters: string
  howToLearnIt: string[]
  tools: string[]
  relatedDiaryVulnType?: string
}

export const owaspTop10: OwaspRisk[] = [
  {
    rank: 'A01:2025',
    title: 'Broken Access Control',
    summary:
      'The application fails to properly enforce what an authenticated user is allowed to do or see, letting them act outside their intended permissions.',
    whyItMatters:
      'Consistently the #1 risk by occurrence. Covers IDOR, privilege escalation, and forced browsing - and now absorbs SSRF, since coercing a server into an unauthorised request is fundamentally an access control failure.',
    howToLearnIt: [
      'PortSwigger: Access Control and Server-Side Request Forgery learning paths',
      'Practice IDOR by tampering with object IDs in Burp Repeater on the labs',
      'Map out role-based permissions on a test app and try to break out of the lowest-privilege role',
    ],
    tools: ['Burp Suite', 'Burp Repeater', 'Autorize (Burp extension)'],
  },
  {
    rank: 'A02:2025',
    title: 'Security Misconfiguration',
    summary:
      'Insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages that leak information.',
    whyItMatters:
      'Easy to introduce and easy to miss - a single unhardened default (default creds, an open S3 bucket, debug mode left on in prod) can undo otherwise solid code.',
    howToLearnIt: [
      'Run a config audit on your own homelab app: check default credentials, exposed admin panels, and verbose error pages',
      'PortSwigger labs on information disclosure and directory listing',
      'Get familiar with CIS Benchmarks for whatever OS/cloud platform you deploy to',
    ],
    tools: ['OWASP ZAP', 'Nmap', 'Nikto', 'CIS-CAT'],
  },
  {
    rank: 'A03:2025',
    title: 'Software Supply Chain Failures',
    summary:
      'New in 2025. Risks introduced through third-party dependencies, build pipelines, and CI/CD tooling - compromised packages, unsigned artifacts, and weak build integrity.',
    whyItMatters:
      'Directly relevant to your homelab pipeline - this is exactly what Dependency-Check/Snyk (SCA) and gitleaks are there to catch before a bad dependency or leaked secret reaches production.',
    howToLearnIt: [
      'Wire Dependency-Check or Snyk into your CI/CD pipeline if not already gating builds on it',
      'Learn what an SBOM (Software Bill of Materials) is and generate one for your homelab app',
      'Read up on real supply-chain incidents (e.g. compromised npm/PyPI packages) to understand the attack pattern',
    ],
    tools: ['OWASP Dependency-Check', 'Snyk', 'gitleaks', 'Syft/SBOM tooling'],
  },
  {
    rank: 'A04:2025',
    title: 'Cryptographic Failures',
    summary:
      'Sensitive data exposed due to missing or weak encryption, in transit or at rest - weak algorithms, hardcoded keys, or plaintext storage of things like passwords or tokens.',
    whyItMatters:
      "Was previously ranked #2 in 2021 (as 'Sensitive Data Exposure'/'Cryptographic Failures'). Still a top cause of major breaches when it goes wrong.",
    howToLearnIt: [
      'PortSwigger labs on JWT attacks - a lot of crypto failures show up in token handling',
      'Learn the difference between encoding, hashing, and encryption, and when to use each',
      'Check your homelab app for hardcoded secrets or weak hashing (e.g. unsalted MD5/SHA1 for passwords) - gitleaks helps here too',
    ],
    tools: ['Burp Suite (JWT Editor extension)', 'gitleaks', 'testssl.sh'],
  },
  {
    rank: 'A05:2025',
    title: 'Injection',
    summary:
      'Untrusted data is sent to an interpreter as part of a command or query, letting an attacker alter its intended behaviour - covers SQL injection, XSS, command injection, and similar.',
    whyItMatters:
      'The category you already have the most hands-on depth in from the PortSwigger SQL injection path and the XSS path you just started - this is your strongest talking point in interviews right now.',
    howToLearnIt: [
      'Continue the PortSwigger XSS path (stored, DOM-based) after finishing reflected',
      'Move on to Command Injection and NoSQL Injection labs once XSS is done',
      'Add a Semgrep rule set for injection patterns to your homelab pipeline and see what it flags in your own vulnerable app',
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
    summary:
      'Missing or ineffective control design at the architecture level - a flaw that exists even if implemented perfectly, because the design itself never accounted for the threat.',
    whyItMatters:
      'This is the one that separates "finding bugs" from "AppSec engineering" - it is about threat modelling before code is written, not just scanning after the fact.',
    howToLearnIt: [
      'Learn a lightweight threat modelling method (STRIDE is a good starting point) and apply it to your own homelab app design',
      "Read OWASP's Application Security Verification Standard (ASVS) design-level requirements",
      'Practice writing a one-page threat model for a feature before building it',
    ],
    tools: ['STRIDE', 'OWASP Threat Dragon', 'OWASP ASVS'],
  },
  {
    rank: 'A07:2025',
    title: 'Authentication Failures',
    summary:
      "Weaknesses in how an application confirms a user's identity - weak password policies, session fixation, credential stuffing exposure, missing MFA.",
    whyItMatters:
      'Ties directly into your Security+ material on identity and access management, and is one of the highest-value areas to get hands-on with since login flows are everywhere.',
    howToLearnIt: [
      'PortSwigger: Authentication learning path (password reset flaws, 2FA bypass, brute-force protection)',
      'Practice testing login flows for account lockout, rate limiting, and password reset token predictability',
      "Review your own homelab app's auth flow against OWASP's Authentication Cheat Sheet",
    ],
    tools: ['Burp Suite (Intruder, on Pro)', 'Hydra (lab environments only)'],
  },
  {
    rank: 'A08:2025',
    title: 'Software or Data Integrity Failures',
    summary:
      'Code and infrastructure that does not verify integrity - insecure deserialization, auto-update mechanisms pulling unsigned code, or CI/CD pipelines without integrity checks.',
    whyItMatters:
      'Overlaps with A03 (Supply Chain) but focuses more on runtime trust - e.g. does your app verify the things it loads or deserializes are what they claim to be.',
    howToLearnIt: [
      'PortSwigger: Insecure Deserialization learning path',
      'Learn how signed commits and artifact signing (e.g. Sigstore/cosign) fit into a CI/CD pipeline',
      'Review whether your homelab pipeline verifies build artifacts before deployment',
    ],
    tools: ['PortSwigger labs', 'Sigstore/cosign'],
  },
  {
    rank: 'A09:2025',
    title: 'Security Logging and Alerting Failures',
    summary:
      'Insufficient logging, monitoring, and alerting means breaches go undetected for longer - or are detected only after significant damage is done.',
    whyItMatters:
      "Consistently under-invested in relative to prevention, but it's what determines whether an incident is caught in minutes or months.",
    howToLearnIt: [
      'Set up centralized logging for your homelab app (even something simple like shipping logs to a local ELK/Loki stack)',
      'Define what "suspicious" looks like for your app (failed logins, repeated 403s) and alert on it',
      "Read OWASP's Logging Cheat Sheet for what should and shouldn't be logged",
    ],
    tools: ['ELK Stack', 'Grafana Loki', 'OWASP Logging Cheat Sheet'],
  },
  {
    rank: 'A10:2025',
    title: 'Mishandling of Exceptional Conditions',
    summary:
      'New in 2025. Covers unhandled errors, inconsistent error handling, and edge cases that leak information or leave the application in an insecure state.',
    whyItMatters:
      'A newer, more precise framing of issues that used to be scattered across other categories - error messages leaking stack traces, or a failed operation leaving data half-written.',
    howToLearnIt: [
      'Deliberately break your homelab app in unusual ways (malformed input, network drops mid-request) and check what gets exposed or left inconsistent',
      'Review error handling in your .NET/C# code for stack traces leaking into production responses',
      "Practice fuzzing an endpoint with Burp Intruder-style payloads (or ZAP's fuzzer on Community Edition) to surface unhandled cases",
    ],
    tools: ['OWASP ZAP fuzzer', 'Burp Suite'],
  },
]
