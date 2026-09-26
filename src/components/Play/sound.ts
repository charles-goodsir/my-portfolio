// Sound for the map: a dark looping synth track in the style of the
// Tron: Legacy score, synth sound effects, and terminal ticks for the boot
// screen. Everything is generated in code with the Web Audio API, so there are
// no audio files to download. The on/off choice is remembered for the browser
// tab, like the capture tracker
const STORAGE_KEY = 'ctf-sound'

const BPM = 100
const STEP = 60 / BPM / 4 // one 16th note, in seconds
const LOOKAHEAD = 0.12 // how far ahead notes are scheduled, in seconds

// Four bars, one chord each: A minor, F, D minor, E. The E major at the end
// (with its G sharp) pulls hard back to A minor, which is what makes the loop
// feel tense instead of calm. bass is the root, arp the notes the arpeggio
// runs over. Numbers are MIDI notes (69 = the A above middle C)
const CHORDS = [
  { bass: 45, arp: [57, 60, 64, 69, 72] }, // A minor
  { bass: 41, arp: [53, 57, 60, 65, 69] }, // F
  { bass: 38, arp: [50, 53, 57, 62, 65] }, // D minor
  { bass: 40, arp: [52, 56, 59, 64, 68] }, // E
]
// Which of the chord's arp notes plays on each 16th of a bar
const ARP_PATTERN = [0, 2, 3, 2, 1, 2, 4, 2, 0, 2, 3, 2, 1, 3, 4, 3]

// The track builds up: sub bass, pads and arpeggio first, pulsing bass from
// bar 4, drums and the big low "braam" hits from bar 8
const BASS_FROM_BAR = 4
const DRUMS_FROM_BAR = 8

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

// The audio graph, created the first time sound is turned on:
//   music voices → music (fades in and out) ┐
//   sound effects and terminal ticks ────────┼→ mix → compressor → speakers
//   echo (arpeggio and effects feed it) ─────┘
let context: AudioContext | null = null
let mix: GainNode
let music: GainNode
let echo: GainNode
let noise: AudioBuffer

let enabled = false // sound is switched on
let musicWanted = false // the map is up and wants the track playing
let playing = false // the track is actually running
let scheduler = 0
let nextStepTime = 0
let stepCount = 0 // 16ths since the track started, for the build-up

function buildGraph(ctx: AudioContext) {
  mix = ctx.createGain()
  const compressor = ctx.createDynamicsCompressor() // evens out the volume
  mix.connect(compressor).connect(ctx.destination)

  music = ctx.createGain()
  music.gain.value = 0
  music.connect(mix)

  // Echo three 16ths later, each repeat quieter
  echo = ctx.createGain()
  echo.gain.value = 0.35
  const delay = ctx.createDelay()
  delay.delayTime.value = STEP * 3
  const feedback = ctx.createGain()
  feedback.gain.value = 0.35
  echo.connect(delay).connect(feedback).connect(delay)
  delay.connect(mix)

  // One second of white noise, reused for the hi-hat and the crash
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const samples = noise.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1

  // Background tabs slow timers down, which would bunch the notes up.
  // Pause the audio while the tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend()
    else if (enabled) ctx.resume()
  })
}

// One synth note: an oscillator through a filter that moves over the note.
// Closing gives the plucky "wow" of analogue synths, opening gives a swell
function voice(
  type: OscillatorType,
  frequency: number,
  time: number,
  options: {
    length: number
    volume: number
    cutoff: number // filter opening at the start
    cutoffEnd?: number // and at the end
    attack?: number
    detune?: number // in cents, for thickening
    echo?: boolean
    out?: AudioNode // music by default
  },
) {
  const ctx = context!
  const { length, volume, cutoff, cutoffEnd = cutoff, attack = 0.005, detune = 0, out = music } = options
  const oscillator = ctx.createOscillator()
  oscillator.type = type
  oscillator.frequency.value = frequency
  oscillator.detune.value = detune
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 6 // a resonant peak at the cutoff, the classic synth squelch
  filter.frequency.setValueAtTime(cutoff, time)
  filter.frequency.exponentialRampToValueAtTime(cutoffEnd, time + length)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, time)
  gain.gain.exponentialRampToValueAtTime(volume, time + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + length)
  oscillator.connect(filter).connect(gain).connect(out)
  if (options.echo) gain.connect(echo)
  oscillator.start(time)
  oscillator.stop(time + length + 0.05)
}

// A burst of filtered noise: a hi-hat or a crash depending on length and filter
function noiseHit(
  time: number,
  length: number,
  volume: number,
  filterType: BiquadFilterType,
  frequency: number,
  out: AudioNode = music,
) {
  const ctx = context!
  const source = ctx.createBufferSource()
  source.buffer = noise
  source.playbackRate.value = 0.8 + Math.random() * 0.4 // no two hits identical
  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.value = frequency
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, time)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + length)
  source.connect(filter).connect(gain).connect(out)
  source.start(time)
  source.stop(time + length)
}

// A sine wave whose pitch drops fast: the ear hears a thump. Used for the kick drum
function thump(time: number, from: number, to: number, length: number, volume: number, out: AudioNode = music) {
  const ctx = context!
  const oscillator = ctx.createOscillator()
  oscillator.frequency.setValueAtTime(from, time)
  oscillator.frequency.exponentialRampToValueAtTime(to, time + length * 0.3)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, time)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + length)
  oscillator.connect(gain).connect(out)
  oscillator.start(time)
  oscillator.stop(time + length + 0.05)
}

const pluck = (midi: number, time: number, volume = 0.035, out: AudioNode = music) =>
  voice('sawtooth', hz(midi), time, { length: 0.18, volume, cutoff: 1800, cutoffEnd: 250, echo: true, out })

const currentChord = () => CHORDS[Math.floor(stepCount / 16) % CHORDS.length]

// Everything that happens on one 16th note
function playStep(time: number) {
  const bar = Math.floor(stepCount / 16)
  const step = stepCount % 16
  const chord = CHORDS[bar % CHORDS.length]
  const barLength = STEP * 16

  pluck(chord.arp[ARP_PATTERN[step]], time)

  if (step === 0) {
    // Sub bass: a pure low sine an octave under the bass, held all bar. You
    // feel it more than hear it on headphones. Laptop speakers mostly can't
    // play it, which is why the saw bass below exists too
    voice('sine', hz(chord.bass - 12), time, { length: barLength, volume: 0.3, cutoff: 400, attack: 0.05 })

    // Pad: the chord an octave down, two slightly detuned saws per note, dark
    // and swelling in slowly
    for (const midi of chord.arp.slice(0, 3)) {
      for (const detune of [-10, 10]) {
        voice('sawtooth', hz(midi - 12), time, { length: barLength, volume: 0.018, cutoff: 500, attack: 0.8, detune })
      }
    }

    // Braam: every 4 bars, a huge low chord whose filter opens as it fades,
    // the ominous brass-like hit from film trailers
    if (bar >= DRUMS_FROM_BAR && bar % 4 === 0) {
      for (const midi of [chord.bass, chord.bass + 7, chord.bass + 12]) {
        for (const detune of [-15, 0, 15]) {
          voice('sawtooth', hz(midi), time, { length: 2.5, volume: 0.05, cutoff: 150, cutoffEnd: 1400, attack: 0.25, detune })
        }
      }
    }
  }

  // Pulsing bass on every 8th, jumping up an octave on the off-beats. Two
  // detuned saws with a filter that snaps shut
  if (bar >= BASS_FROM_BAR && step % 2 === 0) {
    const midi = chord.bass + (step % 4 === 2 ? 12 : 0)
    for (const detune of [-8, 8]) {
      voice('sawtooth', hz(midi), time, { length: STEP * 1.8, volume: 0.16, cutoff: 900, cutoffEnd: 120, detune })
    }
  }

  // Four-on-the-floor kick, deep and long. Hi-hat on the off-beats
  if (bar >= DRUMS_FROM_BAR && step % 4 === 0) thump(time, 120, 35, 0.45, 0.8)
  if (bar >= DRUMS_FROM_BAR && step % 4 === 2) noiseHit(time, 0.05, 0.03, 'highpass', 7000)
}

// Web Audio plays notes at exact times, but only if they're scheduled in
// advance. Every 25ms, queue up any notes due in the next LOOKAHEAD seconds
function schedule() {
  while (nextStepTime < context!.currentTime + LOOKAHEAD) {
    playStep(nextStepTime)
    nextStepTime += STEP
    stepCount++
  }
}

function play() {
  if (!context || playing) return
  playing = true
  stepCount = 0
  nextStepTime = context.currentTime + 0.1
  music.gain.cancelScheduledValues(context.currentTime)
  music.gain.setValueAtTime(0, context.currentTime)
  music.gain.linearRampToValueAtTime(0.6, context.currentTime + 2) // fade in
  scheduler = window.setInterval(schedule, 25)
}

// Fade out quickly rather than cutting off, which clicks
function pause() {
  if (!context || !playing) return
  playing = false
  music.gain.setTargetAtTime(0, context.currentTime, 0.08)
  window.clearInterval(scheduler)
}

// The map calls these when it appears and when it's left. The track only
// actually plays while sound is also switched on
export function startMusic() {
  musicWanted = true
  if (enabled) play()
}

export function stopMusic() {
  musicWanted = false
  pause()
}

// 'on' or 'off' if the visitor has chosen this tab, null if they haven't yet
export function loadSoundChoice() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved === 'on' || saved === 'off' ? saved : null
  } catch {
    return null
  }
}

export const loadSoundOn = () => loadSoundChoice() === 'on'

export function setSoundOn(on: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    // Storage blocked: sound just won't be remembered between pages
  }

  enabled = on
  if (!on) {
    pause()
    return
  }

  if (!context) {
    context = new AudioContext()
    buildGraph(context)
  }
  // Browsers only let a page start audio after the visitor has clicked or
  // pressed a key. Clicking Play or the sound button counts. If the browser
  // still says no, wait for the next interaction
  if (context.state === 'suspended') {
    const resume = () => context?.resume()
    window.addEventListener('pointerdown', resume, { once: true })
    window.addEventListener('keydown', resume, { once: true })
  }
  if (musicWanted) play()
}

// Sound effects. Silent unless sound is on

// A character appearing on the boot screen: a short, dull square-wave tick,
// the same every time, like a heavy old mainframe printing to its screen.
// Spaces and line breaks are silent, which gives the words a rhythm.
// Picked by ear from a side-by-side test of six options
export function charTick(char: string) {
  if (!enabled || !context) return
  if (char === ' ' || char === '\n') return
  const now = context.currentTime
  const oscillator = context.createOscillator()
  oscillator.type = 'square'
  oscillator.frequency.value = 440
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1500 // takes the harsh top off the square wave
  const gain = context.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.05, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)
  oscillator.connect(filter).connect(gain).connect(mix)
  oscillator.start(now)
  oscillator.stop(now + 0.035)
}

// Click on the floor: a short bright blip with an echo
export function blip() {
  if (!enabled || !context) return
  voice('square', hz(76), context.currentTime, { length: 0.08, volume: 0.04, cutoff: 3000, cutoffEnd: 600, echo: true, out: mix })
}

// Capturing a flag: a fast run up the current chord
export function chime() {
  if (!enabled || !context) return
  const now = context.currentTime
  currentChord().arp.forEach((midi, i) => pluck(midi + 12, now + i * STEP * 0.5, 0.1, mix))
}

// The finale: a two-octave run up the chord, a big swelling chord and a crash
export function fanfare() {
  if (!enabled || !context) return
  const now = context.currentTime
  const { arp, bass } = currentChord()
  ;[...arp, ...arp.map((midi) => midi + 12)].forEach((midi, i) => pluck(midi, now + i * STEP * 0.5, 0.1, mix))
  for (const midi of [bass, ...arp.slice(0, 3)]) {
    for (const detune of [-12, 12]) {
      voice('sawtooth', hz(midi), now, { length: 3, volume: 0.05, cutoff: 200, cutoffEnd: 4000, attack: 0.4, detune, out: mix })
    }
  }
  noiseHit(now, 2.5, 0.15, 'lowpass', 6000, mix)
}
