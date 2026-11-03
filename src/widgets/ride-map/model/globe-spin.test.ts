import { expect, test } from 'vitest'
import { spinLongitudeDelta } from './globe-spin'

test('keeps the whole-earth spin speed while the globe fits', () => {
  expect(spinLongitudeDelta(2.3)).toBeCloseTo(6)
  expect(spinLongitudeDelta(1)).toBe(6)
})

test('keeps turning after the earth fills the view', () => {
  const zoomedIn = spinLongitudeDelta(11)
  expect(zoomedIn).toBeGreaterThan(0)
  expect(zoomedIn).toBeLessThan(spinLongitudeDelta(5))
  expect(spinLongitudeDelta(5)).toBeLessThan(6)
})

test('falls back to the whole-earth step for an unusable zoom', () => {
  expect(spinLongitudeDelta(Number.NaN)).toBe(6)
})
