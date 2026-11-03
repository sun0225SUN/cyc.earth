import { expect, test } from 'vitest'
import { speedLineColor } from './index'

test('keeps the fallback color when speed coloring is off', () => {
  expect(speedLineColor('#2563eb', false)).toBe('#2563eb')
})

test('builds a Mapbox interpolate expression from the configured stops', () => {
  const expression = speedLineColor('#2563eb', true)
  expect(expression).toEqual([
    'interpolate',
    ['linear'],
    ['min', 40, ['max', 0, ['coalesce', ['get', 'speed'], 0]]],
    0,
    '#14d45a',
    10,
    '#86e04a',
    20,
    '#f0dc1e',
    30,
    '#f08a22',
    40,
    '#e02424',
  ])
})
