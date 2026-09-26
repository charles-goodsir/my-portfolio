// Every tuning knob for the map in one place: sizes, speeds, camera, colours
import { Color, Vector2, Vector3 } from 'three'

export const MAP_SIZE = 40
export const FLAG_RING_RADIUS = 12
export const PLAYER_SPEED = 8 // units per second
export const PREVIEW_RANGE = 3 // how close the player must get for a flag's hologram to open
export const STOP_SHORT = 2 // clicking a flag parks this far in front of it, inside PREVIEW_RANGE
export const CAPTURE_SECONDS = 1 // how long the capture effect plays before the page changes
export const HOVER_HEIGHT = 0.9 // how high the Bit floats
export const RIPPLE_SECONDS = 0.6 // how long the click ring takes to expand and fade
// Low chase camera: 6 up and 15 back, aimed LOOK_HEIGHT above the player.
// That tips the view to about 15° down, so the horizon and skyline sit along
// the top of the screen and the Bit sits a little below centre
export const CAMERA_OFFSET = new Vector3(0, 6, 15)
export const LOOK_HEIGHT = 2
// Opening shot: high up on the far side of the arena. After boot the camera
// sweeps from here down to its normal spot, turning to keep the Bit in view
export const FLY_IN_START = new Vector3(-24, 30, -16)
export const FLY_IN_RATE = 1.5 // lower = slower sweep. The normal follow uses 4
export const DIVE_OFFSET = new Vector3(0, 3, 5) // on capture the camera dives to here, relative to the flag
export const DIVE_FOV = 85 // lens widens from 50 to this during the dive, for a warp feel
// CRT feel. Kept faint on purpose: noticeable, it looks cheap
export const FRINGE_OFFSET = new Vector2(0.0008, 0.0008) // how far red and blue split apart
// Phase 7's hidden flag: where it sits (south-east corner, near the camera's
// side of the arena where nobody looks) and how close you must get
export const ANOMALY_POSITION = new Vector3(16, 0, 16)
export const ANOMALY_RANGE = 2.5
export const GLOW_COLOUR = '#e0fbff' // the cyan-white the screen fades to on exit

// Colour channels above 1 are "brighter than white". Bloom only picks up
// pixels above 1, so these glow and everything at or below 1 stays dark
export const NEON_CYAN = new Color(0, 2.5, 3)
export const DIM_CYAN = new Color(0, 0.25, 0.3)
export const NEON_ORANGE = new Color(3, 0.8, 0) // Tron's "other team"
export const BEAM_ORANGE = new Color(1, 0.35, 0) // below 1, so the beam stays soft
export const BEAM_CYAN = new Color(0, 0.5, 0.6) // a captured flag's beam
export const WALL_CYAN = new Color(0, 0.6, 0.7)
export const ANOMALY_RED = new Color(0.6, 0, 0.1) // below 1: faint, easy to miss
export const WHITE_HOT = new Color(6, 6, 6) // the flash on capture

// HUD font (loaded in PlayMode). Tailwind turns the _ into spaces
export const HUD_FONT = "font-['Share_Tech_Mono',monospace]"

// Shared look for the HTML overlays: dark glass panel, glowing cyan text
export const HUD_PANEL = `rounded border border-[#2dd4bf]/40 bg-black/70 ${HUD_FONT}`
export const HUD_GLOW = 'text-[#2dd4bf] [text-shadow:0_0_8px_#2dd4bf]'
