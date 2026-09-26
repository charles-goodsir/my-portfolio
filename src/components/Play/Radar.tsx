// Corner radar: the arena from above, with the six flags (orange until
// captured, then cyan) and the Bit. North is up, matching the camera, which
// always faces north. Plain SVG over the canvas, one unit per arena unit
import { useEffect, useRef, type RefObject } from 'react'
import type { Vector3 } from 'three'
import { MAP_SIZE } from './constants'
import { flags } from './flags'

const HALF = MAP_SIZE / 2
const EDGE = HALF + 4 // a little margin round the arena

export function Radar({
  player,
  owned,
}: {
  player: RefObject<Vector3>
  owned: Set<string>
}) {
  const dot = useRef<SVGCircleElement>(null)

  // Move the Bit's dot every frame. Straight to the DOM, not through React
  // state, so the rest of the HUD doesn't re-render 60 times a second
  useEffect(() => {
    let frame = 0
    const tick = () => {
      dot.current?.setAttribute('cx', String(player.current.x))
      dot.current?.setAttribute('cy', String(player.current.z))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [player])

  return (
    // Hidden from screen readers: the page list covers the same ground in words
    <svg
      aria-hidden
      viewBox={`${-EDGE} ${-EDGE} ${EDGE * 2} ${EDGE * 2}`}
      className="absolute bottom-16 right-4 h-32 w-32"
    >
      <circle r={EDGE - 0.5} fill="rgb(0 0 0 / 0.85)" stroke="#2dd4bf" strokeOpacity={0.4} strokeWidth={0.4} />
      {/* The arena walls */}
      <rect
        x={-HALF}
        y={-HALF}
        width={MAP_SIZE}
        height={MAP_SIZE}
        fill="none"
        stroke="#2dd4bf"
        strokeOpacity={0.25}
        strokeWidth={0.3}
      />

      {/* Sweep line. The invisible full circle makes the group's box centred
          on the middle, so it spins around the centre. Reduced motion: your
          global CSS stops the spin */}
      <g
        className="animate-spin"
        style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '4s' }}
      >
        <circle r={EDGE - 0.5} fill="none" />
        <line x1={0} y1={0} x2={0} y2={-(EDGE - 0.5)} stroke="#2dd4bf" strokeOpacity={0.5} strokeWidth={0.4} />
      </g>

      {flags.map((flag) => (
        <circle
          key={flag.to}
          cx={flag.position.x}
          cy={flag.position.z}
          r={1.3}
          fill={owned.has(flag.to) ? '#2dd4bf' : '#f59e0b'}
        />
      ))}

      <circle ref={dot} r={1.1} fill="#e0fbff" />
    </svg>
  )
}
