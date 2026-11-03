const RIDE_STYLE_ORDER = [
  'privacy',
  'streets',
  'light',
  'dark',
  'satellite',
  'navigationDay',
  'navigationNight',
] as const

const MAP_STYLE_IDS = [
  'streets',
  'light',
  'dark',
  'satellite',
  'navigationDay',
  'navigationNight',
] as const

type MapStyleId = (typeof MAP_STYLE_IDS)[number]

export type AppConfig = {
  site: {
    githubRepositoryUrl: string
    productionSiteUrl: string
    localSiteUrl: string
  }
  privacy: {
    mode: boolean
    hideMeters: number
  }
  theme: {
    accent: { light: string; dark: string }
    accentOn: { light: string; dark: string }
  }
  speed: {
    minKmh: number
    maxKmh: number
    stops: readonly (readonly [number, string])[]
  }
  mapbox: {
    appearanceStyles: { light: string; dark: string }
    rideStyleOrder: typeof RIDE_STYLE_ORDER
    rideStyles: Record<MapStyleId, string>
    privacy: {
      glyphs: string
      background: { light: string; dark: string }
      lineWidth: number
      lineOpacity: number
    }
    language: { zh: string; default: string }
    preview: {
      zoom: number
      bearing: number
      width: number
      height: number
      retina: boolean
    }
  }
}

function fail(path: string): never {
  throw new Error(`src/config.yml: ${path} is missing or has the wrong type`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown, path: string) {
  if (typeof value !== 'string' || value.trim() === '') fail(path)
  return value
}

function flag(value: unknown, path: string) {
  if (typeof value !== 'boolean') fail(path)
  return value
}

function finite(value: unknown, path: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(path)
  return value
}

function record(value: unknown, path: string) {
  if (!isRecord(value)) fail(path)
  return value
}

function pair(source: Record<string, unknown>, path: string) {
  return {
    light: text(source.light, `${path}.light`),
    dark: text(source.dark, `${path}.dark`),
  }
}

export function parseAppConfig(value: unknown): AppConfig {
  const root = record(value, '(root)')
  const site = record(root.site, 'site')
  const privacy = record(root.privacy, 'privacy')
  const theme = record(root.theme, 'theme')
  const speed = record(root.speed, 'speed')
  const mapbox = record(root.mapbox, 'mapbox')
  const rideStyles = record(mapbox.rideStyles, 'mapbox.rideStyles')
  const privacyStyle = record(mapbox.privacy, 'mapbox.privacy')
  const language = record(mapbox.language, 'mapbox.language')
  const preview = record(mapbox.preview, 'mapbox.preview')

  const rideStyleOrder = mapbox.rideStyleOrder
  if (
    !Array.isArray(rideStyleOrder) ||
    rideStyleOrder.length !== RIDE_STYLE_ORDER.length ||
    RIDE_STYLE_ORDER.some((id, index) => rideStyleOrder[index] !== id)
  ) {
    fail('mapbox.rideStyleOrder')
  }

  if (!Array.isArray(speed.stops) || speed.stops.length === 0) {
    fail('speed.stops')
  }

  return {
    site: {
      githubRepositoryUrl: text(
        site.githubRepositoryUrl,
        'site.githubRepositoryUrl',
      ),
      productionSiteUrl: text(site.productionSiteUrl, 'site.productionSiteUrl'),
      localSiteUrl: text(site.localSiteUrl, 'site.localSiteUrl'),
    },
    privacy: {
      mode: flag(privacy.mode, 'privacy.mode'),
      hideMeters: finite(privacy.hideMeters, 'privacy.hideMeters'),
    },
    theme: {
      accent: pair(record(theme.accent, 'theme.accent'), 'theme.accent'),
      accentOn: pair(
        record(theme.accentOn, 'theme.accentOn'),
        'theme.accentOn',
      ),
    },
    speed: {
      minKmh: finite(speed.minKmh, 'speed.minKmh'),
      maxKmh: finite(speed.maxKmh, 'speed.maxKmh'),
      stops: speed.stops.map((entry, index) => {
        if (!Array.isArray(entry) || entry.length !== 2) {
          fail(`speed.stops.${index}`)
        }
        const kmh = entry[0]
        const color = entry[1]
        if (typeof kmh !== 'number' || typeof color !== 'string') {
          fail(`speed.stops.${index}`)
        }
        return [kmh, color] as const
      }),
    },
    mapbox: {
      appearanceStyles: pair(
        record(mapbox.appearanceStyles, 'mapbox.appearanceStyles'),
        'mapbox.appearanceStyles',
      ),
      rideStyleOrder: RIDE_STYLE_ORDER,
      rideStyles: Object.fromEntries(
        MAP_STYLE_IDS.map((id) => [
          id,
          text(rideStyles[id], `mapbox.rideStyles.${id}`),
        ]),
      ) as Record<MapStyleId, string>,
      privacy: {
        glyphs: text(privacyStyle.glyphs, 'mapbox.privacy.glyphs'),
        background: pair(
          record(privacyStyle.background, 'mapbox.privacy.background'),
          'mapbox.privacy.background',
        ),
        lineWidth: finite(privacyStyle.lineWidth, 'mapbox.privacy.lineWidth'),
        lineOpacity: finite(
          privacyStyle.lineOpacity,
          'mapbox.privacy.lineOpacity',
        ),
      },
      language: {
        zh: text(language.zh, 'mapbox.language.zh'),
        default: text(language.default, 'mapbox.language.default'),
      },
      preview: {
        zoom: finite(preview.zoom, 'mapbox.preview.zoom'),
        bearing: finite(preview.bearing, 'mapbox.preview.bearing'),
        width: finite(preview.width, 'mapbox.preview.width'),
        height: finite(preview.height, 'mapbox.preview.height'),
        retina: flag(preview.retina, 'mapbox.preview.retina'),
      },
    },
  }
}
