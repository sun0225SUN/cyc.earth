/** Degrees the globe turns each second while it still fits on screen. */
const SPIN_DEGREES_PER_SECOND = 6

/** Zoom where that step matches the whole-earth frame. */
const SPIN_REFERENCE_ZOOM = 2.3

/**
 * Longitude step for one second of spin.
 * Above the whole-earth frame the step shrinks with zoom, so the earth keeps
 * turning at the same screen speed instead of stopping once it fills the view.
 */
export function spinLongitudeDelta(zoom: number) {
  if (!Number.isFinite(zoom)) return SPIN_DEGREES_PER_SECOND
  const scaled = SPIN_DEGREES_PER_SECOND * 2 ** (SPIN_REFERENCE_ZOOM - zoom)
  return Math.min(SPIN_DEGREES_PER_SECOND, scaled)
}
