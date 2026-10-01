import { cyberDiaryEntries } from '../data/cyberDiaryEntries'
import sqliSolver from '../assets/LabScripts/sqli_solver.py?raw'
import lab12Script from '../assets/LabScripts/lab12.py?raw'
import lab14Script from '../assets/LabScripts/lab14.py?raw'

export const scriptMap: Record<string, string> = {
  'LabScripts/sqli_solver.py': sqliSolver,
  'LabScripts/lab12.py': lab12Script,
  'LabScripts/lab14.py': lab14Script,
}

const screenshotModules = import.meta.glob(
  [
    '../assets/Burp/*.webp',
    '../assets/Homelab/*.webp',
    '../assets/SecureAzureLandingZone/*.webp',
    '../assets/CTFMap/*.webp',
  ],
  { eager: true, import: 'default' },
) as Record<string, string>

export function resolveScreenshot(screenshot?: string) {
  if (!screenshot) return undefined
  return screenshotModules[`../assets/${screenshot}`]
}

export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-NZ', options)
}

// Dev only: a bad path or a folder missing from the glob above hides the image
// silently, so list every one at startup.
if (import.meta.env.DEV) {
  for (const entry of cyberDiaryEntries) {
    const shots = [...(entry.screenshots ?? [])]
    const scripts: (string | undefined)[] = []
    for (const lab of entry.labs ?? []) {
      shots.push(...(lab.screenshots ?? []))
      scripts.push(lab.script)
    }
    for (const shot of shots) {
      if (!resolveScreenshot(shot)) {
        console.warn(
          `[diary] ${entry.id}: screenshot '${shot}' not found. Check the path, the .webp extension, and the glob in diaryAssets.ts.`,
        )
      }
    }
    for (const script of scripts) {
      if (script && !scriptMap[script]) {
        console.warn(
          `[diary] ${entry.id}: script '${script}' is not in scriptMap in diaryAssets.ts.`,
        )
      }
    }
  }
}
