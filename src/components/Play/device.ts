// What the visitor's device and settings allow, read once on load.
// Its own file, with no three.js imports, so small files loaded with the rest
// of the site (PlayMode, Home, the project page) can share it without pulling
// three.js into the main bundle

// If the visitor asked for less motion, animations they didn't cause are
// skipped and the camera jumps instead of gliding
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// True when there's a mouse or trackpad. False on phones and touch-only
// tablets, where the map isn't offered: it needs a keyboard or a mouse
export const hasFinePointer = window.matchMedia('(any-pointer: fine)').matches
