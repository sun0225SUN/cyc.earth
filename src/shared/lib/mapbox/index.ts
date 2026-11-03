import { appConfig } from '@/shared/lib/config'

export const rideMapStyleIds = appConfig.mapbox.rideStyleOrder

export type RideMapStyleId = (typeof rideMapStyleIds)[number]
export type MapAppearance = keyof typeof appConfig.mapbox.appearanceStyles

const rideStyles = appConfig.mapbox.rideStyles

export function rideMapStyle(
  id: RideMapStyleId,
  appearance: MapAppearance = 'dark',
  overlay?: {
    route: [number, number][]
    color: string
  },
) {
  if (id === 'privacy') {
    const style = appConfig.mapbox.privacy
    const route = overlay?.route ?? []
    const color = overlay?.color ?? appConfig.theme.accent[appearance]
    return {
      version: 8 as const,
      glyphs: style.glyphs,
      sources: {
        'detail-ride': {
          type: 'geojson' as const,
          data: {
            type: 'Feature' as const,
            properties: {},
            geometry: { type: 'LineString' as const, coordinates: route },
          },
        },
      },
      layers: [
        {
          id: 'background',
          type: 'background' as const,
          paint: {
            'background-color': style.background[appearance],
          },
        },
        {
          id: 'detail-ride',
          type: 'line' as const,
          source: 'detail-ride',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': style.lineWidth,
            'line-opacity': style.lineOpacity,
          },
        },
      ],
    }
  }
  return rideStyles[id]
}

export function rideMapStylePreview(
  id: RideMapStyleId,
  token: string,
  center: [number, number],
) {
  if (id === 'privacy' || !token) return null
  const path = rideStyles[id].replace('mapbox://styles/', '')
  const [longitude, latitude] = center
  const { zoom, bearing, width, height, retina } = appConfig.mapbox.preview
  const scale = retina ? '@2x' : ''
  return `https://api.mapbox.com/styles/v1/${path}/static/${longitude.toFixed(4)},${latitude.toFixed(4)},${zoom},${bearing}/${width}x${height}${scale}?access_token=${token}&logo=false&attribution=false`
}

export function preloadRideMapStylePreviews(
  token: string,
  center: [number, number],
  ids: readonly RideMapStyleId[] = rideMapStyleIds,
) {
  if (!token) return
  for (const id of ids) {
    const url = rideMapStylePreview(id, token, center)
    if (!url) continue
    const image = new Image()
    image.src = url
  }
}

export function mapboxToken() {
  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? ''
}

export function mapLanguage(locale: string) {
  if (locale === 'zh') return appConfig.mapbox.language.zh
  return appConfig.mapbox.language.default
}
