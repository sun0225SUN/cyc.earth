/**
 * Entrance camera on the globe page.
 * The map keeps the current whole-earth frame for `holdMs`, then eases onto
 * the newest ride over `durationMs`.
 */
export const earthIntroFocus = {
  holdMs: 700,
  durationMs: 3200,
  padding: { top: 112, right: 80, bottom: 88, left: 80 },
  maxZoom: 16,
} as const
