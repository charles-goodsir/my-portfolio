export interface OwaspRisk {
  rank: string
  title: string
  summary: string
  whyItMatters: string
  /** What I've done. */
  done: string[]
  /** What's still to do. */
  next?: string[]
  /** Only tools the diary shows me using for this risk. */
  tools: string[]
  progress?: 'Not started' | 'Planned' | 'In progress' | 'Completed'
  relatedDiaryLinks?: { label: string; entryId: string }[]
}

export const owaspTop10: OwaspRisk[] = [
  {
    rank: 'A01:2025',
    title: 'Broken Access Control',
    progress: 'In progress',
    summary:
      'The application fails to properly enforce what an authenticated user is allowed to do or see, letting them act outside their intended permissions.',
    whyItMatters:
      'Consistently the #1 risk by occurrence. Covers IDOR, privilege escalation, and forced browsing - and now absorbs SSRF, since coercing a server into an unauthorised request is fundamentally an access control failure.',
    done: [
      'In the expense claims API, put the ownership check inside the query that loads the claim, so another user\'s claim returns 404, the same as one that doesn\'t exist. Requests use their own types, and unknown JSON fields are rejected with a 400, so "status":"Approved" can\'t be slipped in. 12 tests cover each allowed and denied case, and removing the owner check fails the cross-user tests',
      "Added the approval workflow with each rule in the query that loads the claim: a manager only finds their direct reports' claims, finance only finds approved ones, and nobody finds their own. I tested self-approval with data that should never exist, a user recorded as their own manager, and removing the check failed that test",
      'Receipt downloads follow the same rules as the claim, reusing the manager and finance queries rather than writing them again. Anyone else gets a 404',
      "Gave the Admin role its own endpoints with no approve or pay permissions, so an admin calling approve gets a 403. Changing someone's manager is tested end to end: the old manager gets a 404 on the claim and the new one can approve it",
      'Moved the expense claims roles into Entra ID as app roles assigned on the enterprise app, with assignment required, so nobody inside the app, Admin included, can change their own role',
      "Found that my own unassigned account could still get a token for the expense claims API, because Entra checks assignment on the app you sign in to and the web app didn't require it. Fixed it twice: the web app now requires assignment, and the API rejects any token with no roles before it creates a user",
      'Attacked the deployed expense claims app with real Entra tokens for each user: 28 access control attacks, including IDOR on claims and receipts, self-approval, smuggled status fields, double payment and forged tokens. All 28 were refused, after I checked the script reported a planted IDOR',
      'Opened a PR adding an Azure Policy assignment through the expense claims pipeline. The plan went green with one to add, and the apply failed with a 403, because the pipeline identity is Contributor and cannot write Microsoft.Authorization. The thing that builds the environment cannot switch off its own guardrails',
      'Gave the personal ops dashboard its own Postgres role, dashboard_ro, with SELECT on four tables. On the live box an INSERT, a DELETE and a read of the rules table were each refused. RESET ROLE does not undo the role but SET ROLE to my own login user does, which I accepted because the dashboard runs fixed queries, and recorded it in an ADR',
    ],
    next: [
      "PortSwigger's Access Control and Server-Side Request Forgery learning paths",
      'Practice IDOR by tampering with object IDs directly in the PortSwigger labs via Burp Repeater',
      "Test the homelab app's two seeded accounts (administrator and wiener) against each other to see whether one can act as the other",
    ],
    tools: ['ASP.NET Core', 'xUnit'],
    relatedDiaryLinks: [
      {
        label: 'Expense claims: claims only their owner can see',
        entryId: 'secure-expense-claims-entry-10-employee-claims',
      },
      {
        label: 'Expense claims: approvals only from the right manager',
        entryId: 'secure-expense-claims-entry-11-approval-workflow',
      },
      {
        label: 'Expense claims: receipt uploads checked by content',
        entryId: 'secure-expense-claims-entry-12-receipt-uploads',
      },
      {
        label: 'Expense claims: an admin who can move people but not money',
        entryId: 'secure-expense-claims-entry-14-admin-and-seed',
      },
      {
        label: 'Expense claims: roles kept where the admin cannot reach them',
        entryId: 'secure-expense-claims-entry-25-roles-live-in-entra',
      },
      {
        label: 'Expense claims: the setting that said nobody else could get in',
        entryId: 'secure-expense-claims-entry-27-assignment-required-wasnt',
      },
      {
        label: 'Expense claims: 28 access control attacks with real tokens',
        entryId: 'secure-expense-claims-entry-29-twenty-eight-attacks',
      },
      {
        label:
          'Expense claims: a pipeline that cannot remove its own guardrails',
        entryId: 'secure-expense-claims-entry-30-azure-policy-guardrails',
      },
      {
        label: 'Personal ops: a read-only dashboard and its database role',
        entryId: 'personal-ops-platform-entry-9-read-only-dashboard',
      },
    ],
  },
  {
    rank: 'A02:2025',
    title: 'Security Misconfiguration',
    progress: 'In progress',
    summary:
      'Insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages that leak information.',
    whyItMatters:
      'Easy to introduce and easy to miss - a single unhardened default (default creds, an open S3 bucket, debug mode left on in prod) can undo otherwise solid code.',
    done: [
      'Ran three rounds of OWASP ZAP baseline scans against the homelab app, fixing missing security headers between each: 8 warnings down to 3, 59 passes up to 64',
      'Added CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, and the cross-origin isolation headers to the nginx config, one round at a time, re-scanning after each fix',
      'Left one CSP directive as a documented trade-off (unsafe-inline for styles) rather than chasing a zero-warning scan - noted directly in the nginx config comments',
      'Wrote secure defaults into the landing zone Terraform instead of accepting provider defaults: TLS 1.2 minimum, HTTPS-only and no public network access on the storage account, and a deny-by-default NSG on the subnet',
      'tfsec caught a real misconfiguration in my own Terraform: a Key Vault with no network ACL (CRITICAL). I fixed it with network_acls default_action = "Deny" instead of suppressing the finding, and the pipeline would not deploy until it passed',
      'Semgrep flagged the homelab Dockerfile running as root, and I switched the container to a non-root user',
      'Switching scanners to Trivy found four storage account misconfigurations tfsec had passed. I fixed two (a network_rules deny default, infrastructure encryption) and accepted two with written #trivy:ignore reasons (GRS replication on an empty account, and queue-only Storage Analytics logging)',
      "The first CI run on the expense claims app failed on three findings. Semgrep flagged the API Dockerfile for having no USER line, and Trivy found HIGH CVEs in both base images. I fixed the pcre2 one with an apk upgrade and accepted the OpenSSL one, which Microsoft hadn't rebuilt yet, with a written reason and an expiry date so the build goes red again if it isn't fixed",
      'Put the expense claims database and receipt storage in Azure with no public path: Postgres in a delegated subnet with Entra-only auth, and storage with account keys disabled and a firewall that returned 403 to my laptop',
      'Added a weekly drift check that plans the expense claims environment with the read-only identity and goes red on any difference. A tag I added in the portal turned it red with exit code 2, and removing the tag turned it green',
      'Registered the expense claims sign-in URL as a single-page app, which uses PKCE and no secret, after the Web platform type broke sign-in with AADSTS9002326. I removed the Web entry so nobody can attach a client secret to it. Review also caught an environment variable name with one underscore instead of two that Terraform accepted as valid',
      "On the mini PC, traced a timeout to a DOCKER-USER chain I'd written months earlier that drops forwarded container traffic except allowed ports. ufw status listed an 8080 rule that wasn't the one letting traffic through, so I read the loaded rules and added a RETURN line for the new port",
      'Assigned eight built-in Azure Policy definitions to the expense claims resource group by hand, ran them in Audit for a clean baseline, then switched seven to Deny (the Entra-only one has no Deny effect). I tried to break each one as Owner in the portal, and every attempt failed with RequestDisallowedByPolicy',
      'Scanned the mini PC from my laptop with nmap and found only SSH and the MCP port. Disabled cups, cups-browsed and ModemManager, deleted an old 892 MB Azure DevOps agent folder, and checked the unattended-upgrades log for the Ubuntu security origin instead of trusting the config',
      'Found that the Healthchecks.io check for the personal ops watchdog was still on its default 1 day period and 1 hour grace, which would have taken about a day to alert. I changed it to 5 minutes with a 10 minute grace and stopped the bot to see the email arrive',
    ],
    next: [
      'Information disclosure / directory listing labs, and a CIS Benchmark audit of the mini PC (so far the host hardening is a port scan and a service review)',
    ],
    tools: ['OWASP ZAP', 'Trivy', 'Semgrep', 'Azure Policy', 'nmap'],
    relatedDiaryLinks: [
      {
        label: 'First ZAP baseline scan',
        entryId: 'appsec-homelab-entry-9-first-zap-scan',
      },
      {
        label: 'ZAP remediation, final round',
        entryId: 'appsec-homelab-entry-10-zap-remediation-final',
      },
      {
        label: 'Landing zone Terraform: secure defaults, tfsec findings',
        entryId:
          'secure-azure-landing-zone-entry-7-main-tf-resource-by-resource',
      },
      {
        label: 'Fixing the tfsec findings, first deployment',
        entryId: 'secure-azure-landing-zone-entry-8-tfsec-fixes-first-apply',
      },
      {
        label: 'Semgrep: Dockerfile running as root',
        entryId:
          'appsec-homelab-entry-21-azure-pipelines-lan-self-hosted-agent',
      },
      {
        label: 'Trivy: storage account findings tfsec missed',
        entryId: 'secure-azure-landing-zone-entry-9-tfsec-to-trivy',
      },
      {
        label: 'Expense claims: Semgrep and Trivy findings on the first CI run',
        entryId: 'secure-expense-claims-entry-2-ci-first-findings',
      },
      {
        label:
          'Expense claims: private Postgres and storage, and a cancelled apply',
        entryId: 'secure-expense-claims-entry-21-drift-and-cancelled-apply',
      },
      {
        label: 'Expense claims: a weekly drift check',
        entryId: 'secure-expense-claims-entry-24-weekly-drift-check',
      },
      {
        label: 'Expense claims: real sign-in in Azure, and the platform type',
        entryId: 'secure-expense-claims-entry-28-entra-sign-in-in-azure',
      },
      {
        label:
          'Personal ops: the firewall rules actually loaded on the mini PC',
        entryId: 'personal-ops-platform-entry-1-mcp-foundation-firewall',
      },
      {
        label: 'Expense claims: Azure Policy guardrails',
        entryId: 'secure-expense-claims-entry-30-azure-policy-guardrails',
      },
      {
        label:
          'Personal ops: hardening the mini PC and a scan that said the host was down',
        entryId: 'personal-ops-platform-entry-4-host-hardening-scan',
      },
      {
        label: 'Personal ops: a monitor schedule left on its defaults',
        entryId: 'personal-ops-platform-entry-7-outside-check-repo-rules',
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
    done: [
      "Ran Semgrep against my own homelab's GitHub Actions workflow and it flagged the checkout action using a mutable @v4 tag rather than a pinned commit SHA - a real, unprompted example of exactly this risk category",
      'Rebuilt the whole pipeline around it: every GitHub Action pinned to a full commit SHA, with Dependabot on the github-actions ecosystem so the pins still get bumped, just via a reviewed PR instead of a silent tag move',
      'Added dependency scanning for both halves of the app - dotnet list package --vulnerable --include-transitive for NuGet, npm audit --audit-level=high for the frontend - plus Dependabot on both ecosystems',
      'Added Trivy container scanning of both Docker images, left report-only until I have a baseline to triage against',
      'The dependency scan caught a high-severity vulnerability in a transitive package, SQLitePCLRaw.lib.e_sqlite3, pulled in via Microsoft.EntityFrameworkCore.Sqlite, and I fixed it directly',
      'Found Dependabot had been failing silently for weeks: 12 fix branches existed with no PRs, because the repo blocked Actions from creating pull requests. I fixed the permission and deleted the stale branches so Dependabot rebuilt them as real PRs',
      'Added a Dependabot cooldown period (a Semgrep finding) and update grouping, so weekly runs open one PR per ecosystem',
      "Closed a shortcut I'd flagged: the landing zone pipeline installed tfsec by piping an unpinned script into bash. Replaced it with Trivy pinned to v0.74.0 and verified against the release's SHA-256 checksum, with set -euo pipefail so a failed check actually stops the install",
      'Gave this portfolio the same supply chain checks: a CI workflow with npm audit and a gitleaks scan, every Action pinned to a full commit SHA, and Dependabot keeping the pins and packages current',
      "Split Dependabot's npm updates so major versions are kept out of the auto-merged PR, after one grouped PR of 16 updates failed npm ci because TypeScript 7 broke typescript-eslint's peer range. Only explicit minor and patch updates auto-merge, and only once CI passes. Majors now come as one grouped PR that I review, after @eslint/js 10 failed on its own because it needed eslint 10 to land with it",
      'In the expense claims app, made NuGet fail the restore on high and critical advisories instead of using dotnet list package --vulnerable, which exits 0 even when it finds something. Tested it by adding System.Text.Json 8.0.4, and the restore failed with NU1903',
      "Watched Dependabot auto-merge a patch update one second after the secret scan passed, while four other checks were still running. Auto-merge waits for required checks, and the ruleset didn't require any yet. All five passed, but nothing would have stopped a failure",
      "When Docker Hub rate-limited and then timed out my CI, I copied the Postgres image by its exact digest to GitHub's own registry, so CI pulls the same bytes with the token every run already has",
    ],
    next: ['Generate an SBOM for the app'],
    tools: ['Dependabot', 'Trivy', 'gitleaks', 'NuGet audit'],
    relatedDiaryLinks: [
      {
        label: 'AppSec Homelab',
        entryId: 'appsec-homelab-entry-4-first-pipeline-run',
      },
      {
        label: 'Full CI/CD security pipeline',
        entryId: 'appsec-homelab-entry-14-cicd-pipeline',
      },
      {
        label: 'Dependabot gap and a transitive vulnerability',
        entryId:
          'appsec-homelab-entry-20-azure-pipelines-migration-dependabot-gap',
      },
      {
        label: 'Swapping tfsec for a checksum-verified Trivy',
        entryId: 'secure-azure-landing-zone-entry-9-tfsec-to-trivy',
      },
      {
        label: 'Portfolio: tests, CI and a gitleaks scan',
        entryId: 'portfolio-site-entry-1-redesign-tests-and-ci',
      },
      {
        label: 'Portfolio: splitting Dependabot majors from auto-merge',
        entryId: 'portfolio-site-entry-2-rulesets-signing-dependabot',
      },
      {
        label: 'Expense claims: NuGet audit and checksum-verified Trivy',
        entryId: 'secure-expense-claims-entry-2-ci-first-findings',
      },
      {
        label: "Expense claims: an auto-merge that didn't wait for CI",
        entryId: 'secure-expense-claims-entry-3-auto-merge-required-checks',
      },
      {
        label: "Personal ops: a CI image copied by digest to GitHub's registry",
        entryId: 'personal-ops-platform-entry-2-local-knowledge-base',
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
    done: [
      'Found and fixed the last of the four seeded homelab vulnerabilities: the User model stored passwords as plain strings, checked with a raw SQL equality comparison',
      "Rewrote it around Microsoft.AspNetCore.Identity's PasswordHasher<User> for salted PBKDF2 hashing, looking up by username only and verifying the hash in C# instead of comparing plaintext in the query",
      'Re-tested after the fix: correct login still works, a wrong password fails, and the raw table now stores hashed blobs instead of admin123 and peter in plain text',
      'In the landing zone Terraform, enforced TLS 1.2 minimum and HTTPS-only on the storage account, and enabled Key Vault purge protection with 7-day soft delete so deleted secrets stay recoverable',
    ],
    next: [
      'PortSwigger labs on JWT attacks. A lot of crypto failures show up in token handling, and that is the piece still missing here',
    ],
    tools: ['gitleaks'],
    relatedDiaryLinks: [
      {
        label: 'Fixing plaintext password storage',
        entryId: 'appsec-homelab-entry-16-plaintext-password-fix',
      },
      {
        label: 'Landing zone: TLS and Key Vault settings',
        entryId:
          'secure-azure-landing-zone-entry-7-main-tf-resource-by-resource',
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
    done: [
      'Completed the PortSwigger SQL injection path (Community Edition - 2 labs remain blocked behind Burp Pro/Collaborator)',
      'Completed the PortSwigger XSS path, including the expert-level AngularJS sandbox escapes and CSP bypasses (3 labs remain blocked behind Pro or a lab-state issue)',
      'Built a vulnerable-by-design .NET/React app, reproduced the SQL injection login bypass and reflected XSS in my own code, then fixed both with parameterized queries and JSX text interpolation, and re-tested each fix against the original exploit',
      'Wired Semgrep into a GitHub Actions pipeline. It caught the seeded ProductsController.cs SQLi and missed the structurally identical one in AuthController.cs. I traced the miss to the rule not treating [FromBody]-bound objects as a tainted source and documented it as a known false negative',
      'Moved on to the Authentication path next rather than Command/NoSQL injection - higher priority given how much of it maps to real login-flow bugs',
      'Planted script tags and attribute breakouts as a merchant name, a category and a budget name in the personal ops dashboard, then fetched the real page over a socket. The test checks that every < on the page opens a tag the page writes. I broke the escaping, then only the quote escaping, then the digit masking, and each one failed its test',
      'Attacking my own MCP server found a newline in a payee that printed a fake transaction row in the tool output, which I fixed and covered with a test',
    ],
    tools: ['Burp Suite', 'Semgrep', 'Vitest'],
    relatedDiaryLinks: [
      {
        label: 'SQL Injection labs',
        entryId: 'portswigger-sqli-path-complete',
      },
      {
        label: 'XSS path complete',
        entryId: 'portswigger-xss-labs-25-30',
      },
      {
        label: 'Homelab: login bypass exploit and fix',
        entryId: 'appsec-homelab-entry-11-login-bypass-fix',
      },
      {
        label: 'Homelab: XSS exploit and fix',
        entryId: 'appsec-homelab-entry-13-product-search-xss-fix',
      },
      {
        label:
          'Personal ops: attack tests for markup injection on the dashboard',
        entryId: 'personal-ops-platform-entry-9-read-only-dashboard',
      },
      {
        label: 'Personal ops: attacking my own MCP server',
        entryId: 'personal-ops-platform-entry-8-attacking-my-own-server',
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
    done: [
      'Wrote a lightweight risk assessment of the whole homelab (mini PC, app, pipeline, repo) mapped to NIST CSF 2.0, listing the real gaps - no patch cadence, no network segmentation, no recovery process - instead of padding them out',
      'For the visitor map, set the privacy boundary before writing any code: country-level aggregates only, no IP ever stored. Then wrote a risk assessment of the finished feature, which led to adding a rate limit',
      'Wrote a STRIDE threat model for the expense claims app before any code: six assets, five trust boundaries and 24 threats, each with the control that addresses it and the phase it lands in. Some of it shaped the data model, like stopping anyone approving their own claim and writing the audit row in the same transaction as the status change',
      'Designed receipt uploads so nothing the uploader chooses is trusted: the file type comes from the first bytes, not the name or Content-Type, the stored name is generated by the server, uploads are capped at 5 MB, and downloads are always attachments. A text file named fake.pdf was refused with a 415',
      'Gave the expense claims API a per-user rate limit of 100 requests a minute, with anonymous callers counted by IP. The test lowers it to 3 and checks a second user still gets through, so it fails if the limiter is removed or if everyone shares one budget',
      'Wrote a threat model for the personal ops MCP server before attacking it: a trust-boundary diagram, four kinds of attacker and 22 STRIDE threats. About 200 attack tests produced 17 findings, none a way in from outside, and I fixed all of them. The worst was a mask that hid card numbers from the output while the search filter still ran on the unmasked text',
      "Wrote the personal ops dashboard's threat model section (D1 to D9) and ADR 11 before any code",
      'Uploaded a receipt made of an EICAR test string behind a %PDF header. The app accepted it four times because it only checks the first bytes, and Defender for Storage tagged it No threats found, because EICAR is only recognised at the start of a file. A plain EICAR file uploaded straight to the container was tagged Malicious',
    ],
    next: [
      "Prove each threat model control in the expense claims app as it's built, and read OWASP's ASVS design-level requirements",
    ],
    tools: ['NIST CSF 2.0', 'STRIDE'],
    relatedDiaryLinks: [
      {
        label: 'Homelab risk assessment (NIST CSF)',
        entryId: 'appsec-homelab-entry-17-risk-assessment',
      },
      {
        label: 'Visitor map: privacy boundary and risk assessment',
        entryId: 'visitor-map-entry-1-build-and-rate-limit',
      },
      {
        label: 'Expense claims: STRIDE threat model before any code',
        entryId: 'secure-expense-claims-entry-1-threat-model-scaffold',
      },
      {
        label: 'Expense claims: receipt uploads checked by content',
        entryId: 'secure-expense-claims-entry-12-receipt-uploads',
      },
      {
        label: 'Expense claims: errors and a per-user rate limit',
        entryId: 'secure-expense-claims-entry-13-errors-and-rate-limits',
      },
      {
        label: 'Personal ops: attacking my own server',
        entryId: 'personal-ops-platform-entry-8-attacking-my-own-server',
      },
      {
        label: 'Personal ops: a read-only dashboard threat model',
        entryId: 'personal-ops-platform-entry-9-read-only-dashboard',
      },
      {
        label:
          'Expense claims: a malware scanner and a receipt that got past it',
        entryId: 'secure-expense-claims-entry-31-defender-malware-scanning',
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
    done: [
      'Started the PortSwigger Authentication path: username enumeration by response text, by a subtly different error message (Intruder grep-extract), and by response timing',
      'Bypassed a 2FA flow by navigating straight to the post-login page without completing the second factor',
      'Exploited a password-reset flaw where the reset token was not bound to the account it was issued for, replaying it in Repeater against a different username',
      'Defeated an account lockout by spoofing X-Forwarded-For so each login attempt looked like a new IP',
      'On the pipeline side, the landing zone authenticates to Azure with workload identity federation (OIDC): a short-lived federated token per run instead of a stored client secret',
      'Added a Development-only sign-in to the expense claims API that trusts user and role headers, so I can test roles before Entra ID is set up. Every other environment gets JWT bearer authentication that rejects everything with a 401. A test runs the app as Production with an admin header and expects a 401, and I checked it catches the mistake by registering the stub everywhere: that test failed',
      "Checked the same thing on the built container image, not just in tests: the API image run as Production returned 401 to an admin's dev headers, while the same headers through Docker Compose (Development) returned 200",
      "Gave the expense claims pipeline two OIDC identities with no secrets: a read-only plan identity for pull requests, and a deploy identity Azure only issues a token to inside an approval-gated GitHub environment. I pointed a PR job at the deploy identity's public client ID on purpose and Azure refused it",
      'Checked the dev sign-in once more on the deployed API in Azure Container Apps: the container logged Hosting environment: Production, and a request with Admin dev headers got 401, the same as no headers',
      'Switched the expense claims API to Entra access tokens, using oid rather than sub as the user ID. Tests reject seven bad tokens (wrong audience, wrong tenant, expired, wrong key, edited roles, alg none, no oid), and I switched each check off in turn to watch its test fail',
      'Gave my self-hosted MCP server bearer token auth that accepts more than one token so I can rotate them, with hashed constant-time compares and a Host allowlist. No token, a wrong token, Basic auth and a spoofed Host got 401, 401, 401 and 403',
    ],
    next: [
      "JWT-specific labs, and reviewing the homelab app's own auth flow against OWASP's Authentication Cheat Sheet",
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Burp Repeater'],
    relatedDiaryLinks: [
      {
        label: 'Authentication labs 1-5',
        entryId: 'portswigger-auth-labs-1-5',
      },
      {
        label: 'Landing zone: OIDC pipeline auth',
        entryId: 'secure-azure-landing-zone-entry-5-plan-stage-oidc-auth',
      },
      {
        label: 'Expense claims: a sign-in that must never reach production',
        entryId: 'secure-expense-claims-entry-9-dev-sign-in',
      },
      {
        label: 'Expense claims: the dev sign-in off in the Production image',
        entryId: 'secure-expense-claims-entry-19-compose-phase-1',
      },
      {
        label:
          'Expense claims: a pipeline identity that can only do what it was given',
        entryId: 'secure-expense-claims-entry-20-pipeline-identity-azure',
      },
      {
        label: 'Expense claims: the dev login headers do nothing in Azure',
        entryId: 'secure-expense-claims-entry-22-digest-deploy-dev-auth-off',
      },
      {
        label: 'Expense claims: breaking each token check to prove it works',
        entryId: 'secure-expense-claims-entry-26-breaking-the-token-checks',
      },
      {
        label: 'Personal ops: bearer token auth on my own MCP server',
        entryId: 'personal-ops-platform-entry-1-mcp-foundation-firewall',
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
    done: [
      'The landing zone pipeline publishes the terraform plan as an artifact, and Apply deploys that exact plan after a manual approval gate instead of re-planning, so what ships is what someone reviewed',
      'Every homelab GitHub Action is pinned to a full commit SHA, so a moved tag cannot swap in different code (more under A03)',
      "Fixed this portfolio's branch rules: required checks had been switched on with an empty list, and Dependabot had a bypass that could push straight to main. One ruleset now requires CI, the secret scan and signed commits on every change to main, and my admin bypass only works through a PR",
      'Set up SSH commit signing with my GitHub key, so GitHub marks my commits Verified and main rejects unsigned ones',
      'Made six CI checks required on the expense claims repo, each tied to the GitHub Actions app so a status with the same name from somewhere else does not count',
      'Added actionlint so the workflow files are checked too, since a misspelled key is still valid YAML. Ran it on a copy of ci.yml with runs-on changed to run-on and it reported 12 errors before I relied on it',
      'Proved the secret scan blocks a merge by opening a PR with a made-up API key. gitleaks failed the required check and the ruleset blocked the merge',
      "Put the expense claims app's money rules in Postgres as well as the API: a check constraint rejects zero or negative amounts, and an xmin concurrency token stops one save overwriting another. Both are proved by integration tests against a real Postgres container, since an in-memory database ignores both",
      "Expense claims images are pushed to GHCR by the same job that scans them with Trivy, only on main, and Terraform deploys the API pinned to the image's sha256 digest, so a moved tag cannot change what runs",
      'Made the personal ops repo public with a ruleset on main: changes need a pull request and the CI check, force pushes and deletion are blocked, and admin bypass works through a PR only. A direct push to main was rejected by GitHub. I did not test the force push and deletion rules separately',
    ],
    next: [
      'The PortSwigger Insecure Deserialization path, and artifact signing with Sigstore/cosign',
    ],
    tools: [
      'Azure DevOps approvals',
      'GitHub rulesets',
      'SSH commit signing',
      'actionlint',
      'gitleaks',
    ],
    relatedDiaryLinks: [
      {
        label: 'Landing zone: Apply stage and approval gate',
        entryId:
          'secure-azure-landing-zone-entry-6-apply-stage-deployment-jobs',
      },
      {
        label: 'Portfolio: branch rules and signed commits',
        entryId: 'portfolio-site-entry-2-rulesets-signing-dependabot',
      },
      {
        label: 'Expense claims: linting the workflows themselves',
        entryId: 'secure-expense-claims-entry-4-actionlint',
      },
      {
        label: 'Expense claims: a required check blocks a fake secret',
        entryId: 'secure-expense-claims-entry-5-gitleaks-proof-phase-0',
      },
      {
        label: 'Expense claims: putting the money rules in the database',
        entryId: 'secure-expense-claims-entry-7-data-model',
      },
      {
        label: 'Expense claims: testing against the real database',
        entryId: 'secure-expense-claims-entry-8-postgres-integration-tests',
      },
      {
        label: 'Expense claims: scanned images deployed by digest',
        entryId: 'secure-expense-claims-entry-22-digest-deploy-dev-auth-off',
      },
      {
        label: 'Personal ops: a ruleset and a push GitHub refused',
        entryId: 'personal-ops-platform-entry-7-outside-check-repo-rules',
      },
    ],
  },
  {
    rank: 'A09:2025',
    title: 'Security Logging and Alerting Failures',
    progress: 'In progress',
    summary:
      'Insufficient logging, monitoring, and alerting means breaches go undetected for longer - or are detected only after significant damage is done.',
    whyItMatters:
      "Consistently under-invested in relative to prevention, but it's what determines whether an incident is caught in minutes or months.",
    done: [
      'Both risk assessments so far (the homelab and the visitor map) list detection as a gap: nothing I have built alerts on unusual traffic yet',
      'The expense claims app writes an audit row for every status change, with who did it from the signed-in identity, in the same transaction as the change. That covers logging the actions that matter, but nothing alerts on them yet',
      "Changing someone's manager writes its own audit row with the old and new manager, because it decides who can approve their money. Audit action names are kept to one word so later detections can search for them exactly",
      "The expense claims API's database role only has SELECT and INSERT on the audit table, so the database refuses edits even if the app tried. A test signs in as that role and checks UPDATE, DELETE and ALTER TABLE all fail",
      'Added job heartbeats and a watchdog to the personal ops platform. Each background job records its last success, and the watchdog sends one Telegram alert per incident when a job goes stale, then an all-clear. I backdated a real heartbeat by 20 hours and the alert arrived about 90 seconds later',
      'Added a check from outside the mini PC: after each good watchdog check the bot pings Healthchecks.io, which emails me when the pings stop. Stopping the bot produced the DOWN email, and starting it again produced the UP email',
      "The personal ops MCP server now writes one audit line for every authenticated request, with the tool and the argument names and never the values. Failed token guesses are logged with the caller's IP and a failure count",
      'Turned on Defender for Storage malware scanning on the expense claims storage account. A plain EICAR file uploaded to the container was tagged Malicious, a high severity alert fired and the notification email arrived',
    ],
    next: [
      "Read OWASP's Logging Cheat Sheet for what should and shouldn't be logged",
      'Set up centralized logging for the homelab app, even something simple like a local Loki stack',
      'Define what "suspicious" looks like for the app (failed logins, repeated 403s) and alert on it',
      'Alert on the expense claims audit actions, which are logged but not watched yet',
    ],
    tools: ['Healthchecks.io', 'Defender for Storage'],
    relatedDiaryLinks: [
      {
        label: 'Expense claims: approvals with an audit row for every change',
        entryId: 'secure-expense-claims-entry-11-approval-workflow',
      },
      {
        label: 'Expense claims: audit rows for reporting-line changes',
        entryId: 'secure-expense-claims-entry-14-admin-and-seed',
      },
      {
        label: 'Expense claims: audit rows the app itself cannot delete',
        entryId:
          'secure-expense-claims-entry-23-database-role-and-access-review',
      },
      {
        label: 'Personal ops: job heartbeats and a watchdog',
        entryId: 'personal-ops-platform-entry-6-job-heartbeats-watchdog',
      },
      {
        label: 'Personal ops: an outside check on the watchdog',
        entryId: 'personal-ops-platform-entry-7-outside-check-repo-rules',
      },
      {
        label: 'Personal ops: audit lines and failed-token logging',
        entryId: 'personal-ops-platform-entry-8-attacking-my-own-server',
      },
      {
        label: 'Expense claims: Defender malware scanning',
        entryId: 'secure-expense-claims-entry-31-defender-malware-scanning',
      },
    ],
  },
  {
    rank: 'A10:2025',
    title: 'Mishandling of Exceptional Conditions',
    progress: 'In progress',
    summary:
      'New in 2025. Covers unhandled errors, inconsistent error handling, and edge cases that leak information or leave the application in an insecure state.',
    whyItMatters:
      'A newer, more precise framing of issues that used to be scattered across other categories - error messages leaking stack traces, or a failed operation leaving data half-written.',
    done: [
      'Forced a real failure in the expense claims API by pointing it at a database port with nothing listening. The response was the Npgsql exception and its stack trace in plain text. Every error now returns a problem-details response with a generic title and a trace ID in every environment, and the stack trace goes only to the server log',
      'My first handler turned a 400 into a 500, because ASP.NET reports a malformed request body in Development by throwing, and the handler caught it like any other error. The mass-assignment test failed, which is how I found it. Bad requests now keep their original status',
    ],
    next: [
      "Practice fuzzing an endpoint with Burp Intruder-style payloads (or ZAP's fuzzer) in the PortSwigger labs",
      'Break the homelab app on purpose (malformed input, network drops mid-request) and check what it exposes',
    ],
    tools: ['ASP.NET Core', 'xUnit'],
    relatedDiaryLinks: [
      {
        label: 'Expense claims: errors that say nothing useful to an attacker',
        entryId: 'secure-expense-claims-entry-13-errors-and-rate-limits',
      },
    ],
  },
]
