import { appConfig } from '@/shared/lib/config'

export const SPEED_MIN_KMH = appConfig.speed.minKmh
export const SPEED_MAX_KMH = appConfig.speed.maxKmh
export const SPEED_STOPS = appConfig.speed.stops

export type SpeedStop = (typeof SPEED_STOPS)[number]

export const SPEED_GRADIENT = SPEED_STOPS.map(
  ([kmh, color]) => `${color} ${(kmh / SPEED_MAX_KMH) * 100}%`,
).join(', ')

export function speedLineColor(fallback: string, colorBySpeed: boolean) {
  if (!colorBySpeed) return fallback
  return [
    'interpolate',
    ['linear'],
    [
      'min',
      SPEED_MAX_KMH,
      ['max', SPEED_MIN_KMH, ['coalesce', ['get', 'speed'], 0]],
    ],
    ...SPEED_STOPS.flat(),
  ]
}
