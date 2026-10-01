// Checks the content data and the wiring the UI relies on but TypeScript can't see.
// Run: npm test  (Node 24's built-in runner; it strips the TS types itself)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { cyberDiaryEntries } from '../src/data/cyberDiaryEntries.ts'
import { owaspTop10 } from '../src/data/owaspTop10.ts'

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const ids = cyberDiaryEntries.map((e) => e.id)

test('diary entry ids are unique', () => {
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
  assert.deepEqual(dupes, [])
})

test('diary dates are YYYY-MM-DD and the file is newest first', () => {
  // Lab Notes, "Start here", the Home page and the notebook covers read the
  // file in order and never sort it.
  for (const e of cyberDiaryEntries)
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/, e.id)
  cyberDiaryEntries.forEach((e, i) => {
    if (i > 0)
      assert.ok(
        e.date <= cyberDiaryEntries[i - 1].date,
        `${e.id} is newer than the entry above it`,
      )
  })
})

test('every screenshot path exists and is in a folder the glob loads', () => {
  const globbed = [
    ...read('src/components/diaryAssets.ts').matchAll(
      /'\.\.\/assets\/([^/]+)\/\*\.webp'/g,
    ),
  ].map((m) => m[1])
  for (const e of cyberDiaryEntries) {
    const shots = [
      ...(e.screenshots ?? []),
      ...(e.labs ?? []).flatMap((l) => l.screenshots ?? []),
    ]
    for (const shot of shots) {
      assert.ok(
        existsSync(new URL(`../src/assets/${shot}`, import.meta.url)),
        `${e.id}: ${shot} missing`,
      )
      assert.ok(
        shot.endsWith('.webp') && globbed.includes(shot.split('/')[0]),
        `${e.id}: ${shot} is not loaded by diaryAssets.ts`,
      )
    }
  }
})

test('every lab script is registered in scriptMap', () => {
  const assets = read('src/components/diaryAssets.ts')
  for (const e of cyberDiaryEntries)
    for (const lab of e.labs ?? [])
      if (lab.script)
        assert.ok(assets.includes(`'${lab.script}':`), `${e.id}: ${lab.script}`)
})

test('every notebook has a hover description', () => {
  const diary = read('src/components/CyberDiary.tsx')
  for (const category of new Set(cyberDiaryEntries.map((e) => e.category)))
    assert.ok(
      diary.includes(`'${category}':`),
      `add '${category}' to descriptions in CyberDiary.tsx`,
    )
})

test('OWASP risks are A01 to A10 and link to real diary entries', () => {
  assert.deepEqual(
    owaspTop10.map((r) => r.rank.slice(0, 3)),
    ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10'],
  )
  for (const r of owaspTop10)
    for (const link of r.relatedDiaryLinks ?? [])
      assert.ok(ids.includes(link.entryId), `${r.rank}: ${link.entryId}`)
})

test('every nav page has a route, and a flag shape and hologram in the CTF map', () => {
  const nav = read('src/components/ui/navItems.ts')
  const app = read('src/App.tsx')
  const flag = read('src/components/Play/Flag.tsx')
  const flags = read('src/components/Play/flags.ts')
  const routes = [...nav.matchAll(/to: '([^']+)'/g)].map((m) => m[1])
  assert.ok(routes.length > 1, 'no nav routes found')
  for (const to of routes.filter((r) => r !== '/')) {
    assert.ok(
      app.includes(`path="${to.slice(1)}"`),
      `${to} has no route in App.tsx`,
    )
    assert.ok(
      flag.includes(`case '${to}':`),
      `${to} has no shape in Play/Flag.tsx`,
    )
    assert.ok(
      flags.includes(`'${to}':`),
      `${to} has no hologram text in Play/flags.ts`,
    )
  }
})
