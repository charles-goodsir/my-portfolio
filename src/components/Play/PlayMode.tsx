import { lazy, Suspense, useEffect, useState } from 'react'
import { navItems } from '../ui/navItems'
import { reduceMotion } from './motion'
// Self-hosted fonts, bundled with the site instead of fetched from Google:
// no third-party request, nothing sent about the visitor. Only the small
// @font-face rules load up front. Browsers download a font file the first
// time text actually uses it, which only happens on /play
import '@fontsource/vt323/latin-400.css' // boot screen
import '@fontsource/share-tech-mono/latin-400.css' // HUD

// The 3D map (and Three.js) only downloads when someone opens /play.
// This file stays small so the boot screen shows instantly while that happens
const CtfMap = lazy(() => import('./CtfMap'))

const BOOT_TEXT = [
  'INITIALISING GRID...',
  'MEMORY CHECK: 640K OK',
  'LOADING RENDERER...',
  '[####################] 100%',
  'USER: GUEST',
  `${navItems.length - 1} FLAGS DETECTED`,
  'CAPTURE A FLAG TO ENTER',
]
  .map((line) => `> ${line}`)
  .join('\n')

// 80s-terminal pacing: each kind of character types at its own speed,
// so dots tick out one by one, the # bar fills, and lines pause between
function delayFor(char: string) {
  if (char === '\n') return 400 // "processing" before the next line
  if (char === '.') return 200
  if (char === '#') return 70
  return 30 + Math.random() * 20 // slight stutter, like an old terminal
}

// Kept separate from PlayMode so typing (a re-render per character) doesn't
// re-render the 3D map as well
function BootScreen({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [typed, setTyped] = useState(reduceMotion ? BOOT_TEXT.length : 0)
  const done = ready && typed >= BOOT_TEXT.length

  // Tell the map the screen is clearing, so the camera fly-in can start
  useEffect(() => {
    if (done) onDone()
  }, [done, onDone])

  // Type one more character, waiting as long as that character asks for
  useEffect(() => {
    if (typed >= BOOT_TEXT.length) return
    const timer = setTimeout(() => setTyped(typed + 1), delayFor(BOOT_TEXT[typed]))
    return () => clearTimeout(timer)
  }, [typed])

  // Any key skips the typing too, for keyboard users
  useEffect(() => {
    const skip = () => setTyped(BOOT_TEXT.length)
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [])

  return (
    // Click to skip the typing. Once done it fades out and lets clicks through
    <div
      onClick={() => setTyped(BOOT_TEXT.length)}
      className={`absolute inset-0 z-10 flex items-center justify-center bg-black transition-opacity duration-500 ${
        done ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      {/* Hidden from screen readers, which would read it a letter at a time */}
      <pre
        aria-hidden
        className="min-w-[30ch] font-['VT323',monospace] text-xl leading-snug text-[#2dd4bf] [text-shadow:0_0_8px_#2dd4bf]"
      >
        {BOOT_TEXT.slice(0, typed)}
        <span className="animate-pulse">█</span>
      </pre>
      <p className="absolute bottom-6 font-['VT323',monospace] text-base text-[#94a3b8]">
        Click or press any key to skip
      </p>
      <p role="status" className="sr-only">
        {done ? '' : 'Loading the map'}
      </p>
    </div>
  )
}

function PlayMode() {
  const [ready, setReady] = useState(false)
  const [booted, setBooted] = useState(false)

  return (
    <div className="relative h-screen w-screen bg-black">
      <Suspense fallback={null}>
        <CtfMap booted={booted} onReady={() => setReady(true)} />
      </Suspense>
      <BootScreen ready={ready} onDone={() => setBooted(true)} />
    </div>
  )
}

export default PlayMode
