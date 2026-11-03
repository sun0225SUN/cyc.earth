import { expect, test } from 'vitest'
import { mapLanguage, rideMapStyle, rideMapStylePreview } from './index'

test('maps zh to the configured language and other locales to the default', () => {
  expect(mapLanguage('zh')).toBe('zh-Hans')
  expect(mapLanguage('en')).toBe('en')
})

test('returns a Mapbox style url for a named style', () => {
  expect(rideMapStyle('satellite')).toBe('mapbox://styles/mapbox/satellite-v9')
})

test('builds the privacy style from configured colors', () => {
  const style = rideMapStyle('privacy', 'light', {
    route: [
      [1, 2],
      [3, 4],
    ],
    color: '#fff',
  })
  expect(style).toMatchObject({
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    layers: [
      { paint: { 'background-color': '#f4f4f5' } },
      {
        paint: { 'line-color': '#fff', 'line-width': 4, 'line-opacity': 0.95 },
      },
    ],
  })
})

test('skips a preview without a token or for the privacy style', () => {
  expect(rideMapStylePreview('privacy', 'token', [120.1, 30.2])).toBeNull()
  expect(rideMapStylePreview('light', '', [120.1, 30.2])).toBeNull()
})

test('builds a static preview url from the configured camera', () => {
  expect(rideMapStylePreview('light', 'tok', [120.12345, 30.2])).toBe(
    'https://api.mapbox.com/styles/v1/mapbox/light-v11/static/120.1235,30.2000,12,0/80x80@2x?access_token=tok&logo=false&attribution=false',
  )
})
