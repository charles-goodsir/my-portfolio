import sqliSolver from '../assets/LabScripts/sqli_solver.py?raw'
import lab12Script from '../assets/LabScripts/lab12.py?raw'
import lab14Script from '../assets/LabScripts/lab14.py?raw'

export const scriptMap: Record<string, string> = {
  'LabScripts/sqli_solver.py': sqliSolver,
  'LabScripts/lab12.py': lab12Script,
  'LabScripts/lab14.py': lab14Script,
}

const screenshotModules = import.meta.glob(
  ['../assets/Burp/*.webp', '../assets/Homelab/*.webp'],
  { eager: true, import: 'default' },
) as Record<string, string>

export function resolveScreenshot(screenshot?: string) {
  if (!screenshot) return undefined
  return screenshotModules[`../assets/${screenshot}`]
}

export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
