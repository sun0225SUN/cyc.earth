import {
  type Activity,
  activitiesNewestFirst,
  activityToFeature,
  type LngLatBounds,
} from '@/entities/activity'
import { earthIntroFocus } from '../config/earth-intro'

/** Bounds of the newest ride that has a drawable track. */
export function newestRideBounds(
  activities: readonly Activity[],
): LngLatBounds | null {
  for (const activity of activitiesNewestFirst(activities)) {
    const feature = activityToFeature(activity)
    if (!feature) continue
    let west = Number.POSITIVE_INFINITY
    let south = Number.POSITIVE_INFINITY
    let east = Number.NEGATIVE_INFINITY
    let north = Number.NEGATIVE_INFINITY
    for (const [longitude, latitude] of feature.geometry.coordinates) {
      west = Math.min(west, longitude)
      south = Math.min(south, latitude)
      east = Math.max(east, longitude)
      north = Math.max(north, latitude)
    }
    return [
      [west, south],
      [east, north],
    ]
  }
  return null
}

/**
 * Perlin smootherstep. Slope is zero at both ends, so the globe holds
 * and the camera settles onto the ride.
 */
export function introFocusEasing(progress: number) {
  const t = Math.min(1, Math.max(0, progress))
  return t * t * t * (t * (t * 6 - 15) + 10)
}

const MERCATOR_TILE = 512

export type IntroFocusLngLat = { lng: number; lat: number }

function mercatorX(lng: number) {
  return (lng + 180) / 360
}

function mercatorY(lat: number) {
  const clamped = Math.min(85.0511287798, Math.max(-85.0511287798, lat))
  const sine = Math.sin((clamped * Math.PI) / 180)
  return 0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)
}

function lngFromMercator(x: number) {
  const lng = x * 360 - 180
  return ((((lng + 180) % 360) + 360) % 360) - 180
}

function latFromMercator(y: number) {
  const exponent = Math.exp((0.5 - y) * 4 * Math.PI)
  const sine = (exponent - 1) / (exponent + 1)
  return (Math.asin(sine) * 180) / Math.PI
}

function shortestMercatorDelta(target: number, start: number) {
  let delta = target - start
  if (delta > 0.5) delta -= 1
  if (delta < -0.5) delta += 1
  return delta
}

/**
 * One frame of the flight. `progress` is 0 on the current earth frame and 1
 * on the ride. The ride's pixel offset from the viewport center shrinks with
 * `progress`, so the globe travels toward the ride while zooming. A plain
 * longitude blend stays put on screen until the zoom catches up, which reads
 * as zoom-then-slide.
 */
export function introFocusView(
  start: IntroFocusLngLat,
  target: IntroFocusLngLat,
  startZoom: number,
  endZoom: number,
  progress: number,
) {
  const t = Math.min(1, Math.max(0, progress))
  const zoom = startZoom + (endZoom - startZoom) * t
  const startWorld = MERCATOR_TILE * 2 ** startZoom
  const world = MERCATOR_TILE * 2 ** zoom
  const remain = (1 - t) * (startWorld / world)
  const targetX = mercatorX(target.lng)
  const targetY = mercatorY(target.lat)
  return {
    lng: lngFromMercator(
      targetX - shortestMercatorDelta(targetX, mercatorX(start.lng)) * remain,
    ),
    lat: latFromMercator(targetY - (targetY - mercatorY(start.lat)) * remain),
    zoom,
  }
}

/** Keep the configured inset inside the canvas so the whole ride still fits. */
export function introFocusPadding(viewport: { width: number; height: number }) {
  const padding = earthIntroFocus.padding
  const maxX = Math.max(0, (viewport.width - 32) / 2)
  const maxY = Math.max(0, (viewport.height - 32) / 2)
  return {
    top: Math.min(padding.top, maxY),
    right: Math.min(padding.right, maxX),
    bottom: Math.min(padding.bottom, maxY),
    left: Math.min(padding.left, maxX),
  }
}
