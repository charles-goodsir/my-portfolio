// Development-only readout of frame rate and GPU work, so each new feature's
// real cost shows up while building. Only rendered when import.meta.env.DEV is
// true, so Vite leaves it out of the live site entirely
import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export function DevStats({ output }: { output: RefObject<HTMLParagraphElement | null> }) {
  const gl = useThree((state) => state.gl)
  const frames = useRef(0)
  const seconds = useRef(0)

  // The reflective floor and the effects each draw the scene separately, and
  // three.js normally zeroes its counters before every draw. Turn that off and
  // zero them once a frame instead, so the numbers cover the whole frame
  useEffect(() => {
    gl.info.autoReset = false
    return () => {
      gl.info.autoReset = true
    }
  }, [gl])

  // Mounted first in the Canvas, so this runs before anything draws: the
  // counters still hold last frame's totals. Text updates twice a second
  useFrame((_, delta) => {
    frames.current++
    seconds.current += delta
    if (seconds.current >= 0.5 && output.current) {
      const fps = Math.round(frames.current / seconds.current)
      const { calls, triangles } = gl.info.render
      output.current.textContent = `${fps} fps · ${calls} draw calls · ${Math.round(triangles / 1000)}k triangles`
      frames.current = 0
      seconds.current = 0
    }
    gl.info.reset()
  })

  return null
}
