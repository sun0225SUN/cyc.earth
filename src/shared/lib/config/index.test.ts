import { expect, test } from 'vitest'
import { appConfig, parseAppConfig } from './index'

test('loads the application settings from src/config.yml', () => {
  expect(appConfig.site).toEqual({
    githubRepositoryUrl: 'https://github.com/sun0225SUN/cyc.earth',
    productionSiteUrl: 'https://cyc.earth',
    localSiteUrl: 'http://localhost:3000',
  })
  expect(appConfig.privacy).toEqual({ mode: true, hideMeters: 500 })
  expect(appConfig.theme.accent).toEqual({
    light: '#2563eb',
    dark: '#ceff00',
  })
  expect(appConfig.speed.minKmh).toBe(0)
  expect(appConfig.speed.maxKmh).toBe(40)
  expect(appConfig.speed.stops[0]).toEqual([0, '#14d45a'])
  expect(appConfig.mapbox.rideStyleOrder[0]).toBe('privacy')
  expect(appConfig.mapbox.rideStyles.light).toBe(
    'mapbox://styles/mapbox/light-v11',
  )
  expect(appConfig.mapbox.preview).toEqual({
    zoom: 12,
    bearing: 0,
    width: 80,
    height: 80,
    retina: true,
  })
})

test('rejects a config that drops a required group', () => {
  expect(() => parseAppConfig({ site: {} })).toThrow(/privacy/)
})
