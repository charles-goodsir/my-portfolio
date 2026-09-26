// The flags themselves (built from the site nav), what each one's hologram
// says, and remembering which ones you've captured
import { Vector3 } from 'three'
import { navItems } from '../ui/navItems'
import { cyberDiaryEntries } from '../../data/cyberDiaryEntries'
import { FLAG_RING_RADIUS } from './constants'

// Captured flags are remembered for this browser tab, so they stay cyan after
// you visit a page and come back. Storage can be blocked (private mode,
// strict settings), so every read and write is wrapped and fails quietly
const STORAGE_KEY = 'ctf-captured'

export function loadCaptured(): string[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function saveCaptured(routes: string[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(routes))
  } catch {
    // Storage blocked: the tracker just won't survive a page change
  }
}

const latestEntry = [...cyberDiaryEntries].sort((a, b) => b.date.localeCompare(a.date))[0]

// What each flag's hologram says. Diary numbers come from the real data
const previews: Record<string, string> = {
  '/about': "My story and the roles I'm targeting. CV download.",
  '/experience': 'Software Application Engineer at Datacom since 2021. Education and certifications.',
  '/projects': 'AppSec homelab, a secure Azure landing zone, and earlier web builds.',
  '/diary': `${cyberDiaryEntries.length} entries. Latest: ${latestEntry.title}`,
  '/owasp': 'My notes on each of the 10 risks.',
  '/contact': 'Email, LinkedIn and GitHub.',
}

// Every nav page except Home becomes a flag, spaced evenly round a circle
export const flags = navItems
  .filter((item) => item.to !== '/')
  .map((item, i, all) => {
    const angle = (i / all.length) * Math.PI * 2
    const position = new Vector3(Math.sin(angle), 0, -Math.cos(angle)).multiplyScalar(
      FLAG_RING_RADIUS,
    )
    return {
      ...item,
      preview: previews[item.to] ?? '',
      position,
    }
  })

export type MapFlag = (typeof flags)[number]
