// Builds the "Learning the OWASP Top 10" artifact from the portfolio's own
// data files, so the published page can't drift from the site.
// Run: node scripts/build_owasp_artifact.mjs  (Node 24 strips the TS types on import)
// Then republish the printed file to the existing artifact URL (see memory / README).
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { owaspTop10 } from '../src/data/owaspTop10.ts'
import { cyberDiaryEntries } from '../src/data/cyberDiaryEntries.ts'

const SITE = 'https://charlesgoodsir.com'
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = (p) => (p ?? 'Not started').toLowerCase().replace(/\s+/g, '-')
const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const entries = new Map(cyberDiaryEntries.map((e) => [e.id, e]))
const count = (p) => owaspTop10.filter((r) => r.progress === p).length
const inProgress = count('In progress')
const planned = count('Planned')
const completed = count('Completed')
const linkedIds = new Set(owaspTop10.flatMap((r) => (r.relatedDiaryLinks ?? []).map((l) => l.entryId)))
const updated = fmtDate(new Date().toISOString().slice(0, 10))

const risk = (r) => {
  const isNew = r.summary.startsWith('New in 2025.')
  const summary = isNew ? r.summary.replace(/^New in 2025\.\s*/, '') : r.summary
  const [code, year] = r.rank.split(':')
  const logged = (r.relatedDiaryLinks ?? [])
    .map((l) => {
      const e = entries.get(l.entryId)
      if (!e) return ''
      return `<a class="logged__item" href="${SITE}/#/diary/${esc(e.id)}">
                <b>${esc(e.title)}</b>
                <span>CyberDiary &middot; ${fmtDate(e.date)}${e.milestone ? ' &middot; milestone' : ''}</span>
              </a>`
    })
    .join('')
  return `
    <li class="risk">
      <div class="risk__rank">${esc(code)}<small>:${esc(year)}</small></div>
      <div class="risk__main">
        <div class="risk__head">
          <h3>${esc(r.title)}</h3>
          <div class="badges">
            <span class="pill pill--${slug(r.progress)}">${esc(r.progress ?? 'Not started')}</span>
            ${isNew ? '<span class="pill pill--new">New in 2025</span>' : ''}
          </div>
        </div>
        <div class="field">
          <p class="field__label">What it is</p>
          <p>${esc(summary)}</p>
        </div>
        <div class="field">
          <p class="field__label">Why it matters</p>
          <p>${esc(r.whyItMatters)}</p>
        </div>
        <div class="field">
          <p class="field__label">How I'm learning it</p>
          <ul>${r.howToLearnIt.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        </div>
        <div class="field">
          <p class="field__label">Tools</p>
          <div class="chips">${r.tools.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        </div>
        ${logged ? `<div class="field"><p class="field__label">Logged in the CyberDiary</p><div class="logged">${logged}</div></div>` : ''}
      </div>
    </li>`
}

const css = `
  :root {
    --ground: #eceef3; --surface: #ffffff; --ink: #191d2b; --ink-soft: #333a4d;
    --muted: #5a6274; --rule: #d5d9e2; --accent: #6a34cf; --accent-ink: #58239f;
    --s-done: #1f7a4d; --s-active: #b15c05; --s-planned: #4552c4; --s-todo: #7b8393;
    --shadow: 0 1px 2px rgba(20,22,35,.05), 0 14px 34px -18px rgba(20,22,35,.16);
    --measure: 63ch;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --ground: #0f1220; --surface: #171b28; --ink: #e7e9f2; --ink-soft: #c3c8d6;
      --muted: #99a1b4; --rule: #2a3040; --accent: #b499f4; --accent-ink: #c9b6f8;
      --s-done: #46c98a; --s-active: #e0a24a; --s-planned: #8f9bf0; --s-todo: #7d8698;
      --shadow: 0 1px 2px rgba(0,0,0,.3), 0 16px 40px -20px rgba(0,0,0,.6);
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --ground: #0f1220; --surface: #171b28; --ink: #e7e9f2; --ink-soft: #c3c8d6;
    --muted: #99a1b4; --rule: #2a3040; --accent: #b499f4; --accent-ink: #c9b6f8;
    --s-done: #46c98a; --s-active: #e0a24a; --s-planned: #8f9bf0; --s-todo: #7d8698;
    --shadow: 0 1px 2px rgba(0,0,0,.3), 0 16px 40px -20px rgba(0,0,0,.6);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--ground); color: var(--ink);
    font-family: "Newsreader", Georgia, "Times New Roman", serif;
    font-size: 1.0625rem; line-height: 1.62; -webkit-font-smoothing: antialiased;
  }
  .page { max-width: 47rem; margin: 0 auto; padding: clamp(2.5rem,6vw,5rem) clamp(1.15rem,5vw,2.75rem) 4rem; }
  .mono { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
  .masthead { margin-bottom: 3rem; }
  .eyebrow { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .72rem; font-weight: 500;
    letter-spacing: .16em; text-transform: uppercase; color: var(--accent-ink); margin: 0 0 1.1rem; }
  h1 { font-family: "Chivo", "Helvetica Neue", Arial, sans-serif; font-weight: 700;
    font-size: clamp(2.1rem,6vw,3.05rem); line-height: 1.05; letter-spacing: -.018em;
    text-wrap: balance; margin: 0 0 1.15rem; }
  .standfirst { font-size: 1.2rem; line-height: 1.55; color: var(--ink-soft); max-width: var(--measure); margin: 0 0 1.6rem; }
  .meta { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .78rem; line-height: 1.7; color: var(--muted); }
  .meta a, .foot a { color: var(--accent-ink); text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, transparent); }
  .meta a:hover, .foot a:hover { border-bottom-color: var(--accent); }
  .coverage { background: var(--surface); border: 1px solid var(--rule); border-radius: 4px;
    box-shadow: var(--shadow); padding: 1.6rem 1.6rem 1.5rem; margin-bottom: 3.5rem; }
  .coverage h2 { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .72rem; font-weight: 500;
    letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin: 0 0 1.05rem; }
  .bar { display: flex; gap: 3px; margin-bottom: 1rem; }
  .bar__seg { flex: 1; height: 13px; border-radius: 2px; background: var(--seg, var(--s-todo)); transform-origin: left center; }
  .bar__seg[data-status="in-progress"] { --seg: var(--s-active); }
  .bar__seg[data-status="planned"] { --seg: color-mix(in srgb, var(--s-planned) 62%, var(--surface)); }
  .bar__seg[data-status="completed"] { --seg: var(--s-done); }
  .bar__seg[data-status="not-started"] { --seg: color-mix(in srgb, var(--s-todo) 45%, var(--surface)); }
  .legend { display: flex; flex-wrap: wrap; gap: .35rem 1.15rem; font-family: "JetBrains Mono", monospace;
    font-size: .7rem; letter-spacing: .04em; color: var(--muted); }
  .legend span { display: inline-flex; align-items: center; gap: .45rem; }
  .legend i { width: 11px; height: 11px; border-radius: 2px; display: inline-block; }
  .l-active { background: var(--s-active); }
  .l-planned { background: color-mix(in srgb, var(--s-planned) 62%, var(--surface)); }
  .l-done { background: var(--s-done); }
  .stats { display: flex; flex-wrap: wrap; gap: 1.75rem; margin-top: 1.1rem; padding-top: 1.15rem; border-top: 1px solid var(--rule); }
  .stat { display: flex; flex-direction: column; gap: .1rem; }
  .stat__n { font-family: "Chivo", sans-serif; font-weight: 700; font-size: 1.7rem; line-height: 1; font-variant-numeric: tabular-nums; }
  .stat--active .stat__n { color: var(--s-active); }
  .stat--planned .stat__n { color: var(--s-planned); }
  .stat--done .stat__n { color: var(--s-done); }
  .stat--muted .stat__n { color: var(--muted); }
  .stat__label { font-family: "JetBrains Mono", monospace; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .risks { display: flex; flex-direction: column; list-style: none; margin: 0; padding: 0; }
  .risk { display: grid; grid-template-columns: 3.75rem 1fr; gap: .35rem 1.6rem; padding: 2.4rem 0; border-top: 1px solid var(--rule); }
  .risk:first-child { border-top: 0; padding-top: .5rem; }
  .risk__rank { font-family: "JetBrains Mono", ui-monospace, monospace; font-weight: 500; font-size: .95rem;
    color: var(--accent-ink); line-height: 1.3; padding-top: .3rem; }
  .risk__rank small { display: block; font-size: .66rem; color: var(--muted); letter-spacing: .04em; }
  .risk__main { min-width: 0; }
  .risk__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: .6rem .9rem; margin-bottom: 1rem; }
  .risk__head h3 { font-family: "Chivo", "Helvetica Neue", Arial, sans-serif; font-weight: 700; font-size: 1.4rem;
    line-height: 1.15; letter-spacing: -.012em; text-wrap: balance; margin: 0; flex: 1 1 auto; }
  .badges { display: flex; gap: .4rem; flex-wrap: wrap; }
  .pill { font-family: "JetBrains Mono", monospace; font-size: .66rem; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; padding: .28rem .5rem; border-radius: 3px; white-space: nowrap; }
  .pill--in-progress { color: var(--s-active); background: color-mix(in srgb, var(--s-active) 15%, var(--surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--s-active) 35%, transparent); }
  .pill--planned, .pill--not-started { color: var(--s-planned); background: color-mix(in srgb, var(--s-planned) 12%, var(--surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--s-planned) 28%, transparent); }
  .pill--completed { color: var(--s-done); background: color-mix(in srgb, var(--s-done) 13%, var(--surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--s-done) 32%, transparent); }
  .pill--new { color: var(--muted); background: transparent; box-shadow: inset 0 0 0 1px var(--rule); }
  .field { margin-bottom: 1.2rem; }
  .field:last-child { margin-bottom: 0; }
  .field__label { font-family: "JetBrains Mono", monospace; font-size: .67rem; font-weight: 500; letter-spacing: .13em;
    text-transform: uppercase; color: var(--muted); margin: 0 0 .4rem; }
  .field p { margin: 0; max-width: var(--measure); color: var(--ink-soft); }
  .field ul { margin: 0; padding: 0; list-style: none; max-width: var(--measure); }
  .field li { position: relative; padding-left: 1.25rem; margin-bottom: .5rem; color: var(--ink-soft); }
  .field li:last-child { margin-bottom: 0; }
  .field li::before { content: ""; position: absolute; left: .1rem; top: .72em; width: .42rem; height: .42rem;
    border-radius: 1px; background: color-mix(in srgb, var(--accent) 55%, transparent); transform: rotate(45deg); }
  .chips { display: flex; flex-wrap: wrap; gap: .4rem; }
  .chip { font-family: "JetBrains Mono", monospace; font-size: .72rem; color: var(--ink-soft);
    background: color-mix(in srgb, var(--muted) 9%, var(--surface)); border: 1px solid var(--rule); border-radius: 3px; padding: .2rem .5rem; }
  .logged { border-left: 2px solid color-mix(in srgb, var(--accent) 45%, transparent); padding: .1rem 0 .1rem 1rem;
    display: flex; flex-direction: column; gap: .7rem; }
  .logged__item { max-width: var(--measure); color: var(--ink-soft); text-decoration: none; display: block; }
  .logged__item b { font-weight: 500; font-style: italic; border-bottom: 1px solid transparent; }
  .logged__item:hover b { color: var(--accent-ink); border-bottom-color: color-mix(in srgb, var(--accent) 40%, transparent); }
  .logged__item span { display: block; font-family: "JetBrains Mono", monospace; font-size: .68rem; letter-spacing: .04em;
    color: var(--muted); margin-top: .1rem; }
  .foot { margin-top: 3.5rem; padding-top: 1.5rem; border-top: 1px solid var(--rule); font-family: "JetBrains Mono", monospace;
    font-size: .74rem; line-height: 1.7; color: var(--muted); }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }
  @keyframes seg-in { from { transform: scaleX(.001); } to { transform: scaleX(1); } }
  .bar__seg { animation: seg-in .5s cubic-bezier(.2,.7,.3,1) backwards; }
  ${owaspTop10.map((_, i) => `.bar__seg:nth-child(${i + 1}) { animation-delay: ${(i + 1) * 0.05}s; }`).join('\n  ')}
  @media (prefers-reduced-motion: reduce) { .bar__seg { animation: none; } }
  @media (max-width: 34rem) {
    .risk { grid-template-columns: 1fr; gap: .55rem; }
    .risk__rank { padding-top: 0; }
    .risk__rank small { display: inline; margin-left: .15rem; }
  }
`

const html = `<title>Learning the OWASP Top 10</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chivo:wght@500;700&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">
<style>${css}</style>

<div class="page">
  <header class="masthead">
    <p class="eyebrow">Application security &middot; learning log</p>
    <h1>Learning the OWASP Top 10</h1>
    <p class="standfirst">
      The ten most critical web application security risks in the 2025 list, and
      where I am on each one: what I've done, what's logged in the CyberDiary,
      and what's next.
    </p>
    <p class="meta">
      Source: OWASP Top 10 (2025)<br>
      Maintained by Charles Goodsir &middot; updated ${updated}<br>
      <a href="${SITE}/#/owasp">charlesgoodsir.com</a>
    </p>
  </header>

  <section class="coverage" aria-label="Coverage summary">
    <h2>Coverage across the ten</h2>
    <div class="bar" role="img" aria-label="${completed} completed, ${inProgress} in progress, ${planned} planned">
      ${owaspTop10.map((r) => `<div class="bar__seg" data-status="${slug(r.progress)}" title="${esc(r.rank.split(':')[0] + ' ' + r.title)}"></div>`).join('')}
    </div>
    <div class="legend">
      <span><i class="l-done"></i> Completed</span>
      <span><i class="l-active"></i> In progress</span>
      <span><i class="l-planned"></i> Planned</span>
    </div>
    <div class="stats">
      <div class="stat stat--done"><span class="stat__n">${completed}</span><span class="stat__label">Completed</span></div>
      <div class="stat stat--active"><span class="stat__n">${inProgress}</span><span class="stat__label">In progress</span></div>
      <div class="stat stat--planned"><span class="stat__n">${planned}</span><span class="stat__label">Planned</span></div>
      <div class="stat stat--muted"><span class="stat__n">${linkedIds.size}</span><span class="stat__label">Diary entries linked</span></div>
    </div>
  </section>

  <ol class="risks">${owaspTop10.map(risk).join('')}
  </ol>

  <footer class="foot">
    Rankings and category names follow the OWASP Top 10 (2025).
    Progress notes are my own and change as the work does.<br>
    Full write-ups live in the <a href="${SITE}/#/diary">CyberDiary</a>.
  </footer>
</div>
`

const out = join(tmpdir(), 'owasp-progress.html')
writeFileSync(out, html)
console.log('wrote', out, `(${completed} completed, ${inProgress} in progress, ${planned} planned, ${linkedIds.size} entries linked)`)
