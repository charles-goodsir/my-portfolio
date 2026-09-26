// Read once on load. If the visitor asked for less motion, animations that
// the visitor didn't cause are skipped and the camera jumps instead of gliding.
// Its own file, with no three.js imports, so the small PlayMode (loaded with the
// rest of the site) can share it without pulling three.js into the main bundle
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
