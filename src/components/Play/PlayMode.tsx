import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { navItems } from '../ui/navItems'
import { hasFinePointer, reduceMotion } from './device'
// Self-hosted fonts, bundled with the site instead of fetched from Google:
// no third-party request, nothing sent about the visitor. Only the small
// @font-face rules load up front. Browsers download a font file the first
// time text actually uses it, which only happens on /play
import '@fontsource/vt323/latin-400.css' // boot screen
import '@fontsource/share-tech-mono/latin-400.css' // HUD

// The 3D map (and Three.js) only downloads when someone opens /play.
// This file stays small so the boot screen shows instantly while that happens
const CtfMap = lazy(() => import('./CtfMap'))

// Sound is also only needed here, so it loads on demand too instead of with
// the rest of the site
type Sound = typeof import('./sound')

const BOOT_TEXT = [
  'INITIALISING GRID...',
  'MEMORY CHECK: 640K OK',
  'LOADING RENDERER...',
  '[####################] 100%',
  'USER: GUEST',
  `${navItems.length - 1} FLAGS DETECTED`,
  'ANOMALY IN SE QUADRANT', // hint for the hidden flag (Anomaly.tsx)
  'CAPTURE A FLAG TO ENTER',
]
  .map((line) => `> ${line}`)
  .join('\n')

// Once the last line is typed, the text stays up this long so it can be
// read before the screen fades into the arena
const READ_SECONDS = 3

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
function BootScreen({
  ready,
  sound,
  onDone,
}: {
  ready: boolean
  sound: Sound | null // null for the moment it takes to load
  onDone: () => void
}) {
  const [typed, setTyped] = useState(0)
  // Typing starts once the visitor has chosen sound on or off. Asked on every
  // visit to the map, even if they chose earlier in this tab
  const [started, setStarted] = useState(false)
  const [read, setRead] = useState(false) // the reading pause is over
  const typedAll = typed >= BOOT_TEXT.length
  const done = started && ready && typedAll && read

  // Skipping (click or any key) jumps to the end and skips the reading pause
  // too: someone skipping wants in now
  const skip = () => {
    setTyped(BOOT_TEXT.length)
    setRead(true)
  }

  // Hold the finished text on screen for READ_SECONDS
  useEffect(() => {
    if (!started || !typedAll) return
    const timer = setTimeout(() => setRead(true), READ_SECONDS * 1000)
    return () => clearTimeout(timer)
  }, [started, typedAll])

  const start = (on: boolean) => {
    // Called from a click or key press, which is what browsers need before
    // they'll let a page start making sound
    sound?.setSoundOn(on)
    setStarted(true)
    if (reduceMotion) setTyped(BOOT_TEXT.length)
  }

  const needsChoice = sound !== null && !started
  // The button that starts focused, so Enter picks it: whatever they chose
  // last time in this tab, or ON the first time
  const lastChoice = sound?.loadSoundChoice() ?? 'on'

  // Tell the map the screen is clearing, so the camera fly-in can start
  useEffect(() => {
    if (done) onDone()
  }, [done, onDone])

  // Type one more character, waiting as long as that character asks for
  useEffect(() => {
    if (!started || typed >= BOOT_TEXT.length) return
    const timer = setTimeout(() => setTyped(typed + 1), delayFor(BOOT_TEXT[typed]))
    return () => clearTimeout(timer)
  }, [typed, started])

  // A terminal tick for every character typed, if sound is on
  useEffect(() => {
    if (typed > 0) sound?.charTick(BOOT_TEXT[typed - 1])
  }, [typed, sound])

  // Any key skips the typing too, for keyboard users. Not before the sound
  // choice, or the key press that picks a button would also skip everything
  useEffect(() => {
    if (!started) return
    const skipNow = () => {
      setTyped(BOOT_TEXT.length)
      setRead(true)
    }
    window.addEventListener('keydown', skipNow)
    return () => window.removeEventListener('keydown', skipNow)
  }, [started])

  return (
    // Click to skip the typing. Once done it fades out and lets clicks through
    <div
      onClick={() => started && skip()}
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

      {needsChoice && (
        // Stop the click reaching the boot screen underneath, which skips typing
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute flex flex-col items-center gap-4 font-['VT323',monospace] text-2xl text-[#2dd4bf] [text-shadow:0_0_8px_#2dd4bf]"
        >
          <p>&gt; ENABLE SOUND?</p>
          <div className="flex gap-6">
            <button
              type="button"
              autoFocus={lastChoice === 'on'}
              onClick={() => start(true)}
              className="px-3 hover:underline"
            >
              [ ON ]
            </button>
            <button
              type="button"
              autoFocus={lastChoice === 'off'}
              onClick={() => start(false)}
              className="px-3 hover:underline"
            >
              [ OFF ]
            </button>
          </div>
        </div>
      )}

      {started && (
        <p className="absolute bottom-6 font-['VT323',monospace] text-base text-[#94a3b8]">
          Click or press any key to skip
        </p>
      )}
      <p role="status" className="sr-only">
        {done ? '' : 'Loading the map'}
      </p>
    </div>
  )
}

function PlayMode() {
  const [ready, setReady] = useState(false)
  const [booted, setBooted] = useState(false)
  const [sound, setSound] = useState<Sound | null>(null)

  useEffect(() => {
    if (hasFinePointer) import('./sound').then(setSound)
  }, [])

  // Phones and touch-only tablets: explain instead of loading the game. The
  // Play buttons are hidden there, but a shared link can still land here
  if (!hasFinePointer) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center font-['VT323',monospace] text-xl text-[#2dd4bf] [text-shadow:0_0_8px_#2dd4bf]">
        <p>&gt; NO KEYBOARD OR MOUSE DETECTED</p>
        <p className="text-[#94a3b8] [text-shadow:none]">
          The CTF map needs a keyboard or a mouse. Try it on a computer.
        </p>
        <Link to="/" className="underline underline-offset-4">
          Back to the site
        </Link>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      <Suspense fallback={null}>
        <CtfMap booted={booted} onReady={() => setReady(true)} />
      </Suspense>
      <BootScreen ready={ready} sound={sound} onDone={() => setBooted(true)} />
    </div>
  )
}

export default PlayMode
