import { encode } from '@mapbox/polyline'
import { expect, test } from 'vitest'
import type { Activity } from '@/entities/activity'
import { earthIntroFocus } from '../config/earth-intro'
import {
  introFocusEasing,
  introFocusPadding,
  introFocusView,
  newestRideBounds,
} from './earth-intro'

function activity(
  polyline: string,
  startDateLocal: string,
  id: number,
): Activity {
  return {
    run_id: id,
    name: '',
    distance: 1000,
    moving_time: '0:10:00',
    type: 'cycling',
    subtype: 'road',
    start_date: startDateLocal,
    start_date_local: startDateLocal,
    location_country: '',
    summary_polyline: polyline,
    average_heartrate: null,
    average_speed: 5,
    elevation_gain: 10,
    streak: 1,
  }
}

test('frames the newest ride and skips rides without a track', () => {
  const older = activity(
    encode([
      [30, 120],
      [31, 121],
    ]),
    '2024-01-01 08:00:00',
    1,
  )
  const newerEmpty = activity('', '2025-06-01 08:00:00', 2)
  const newest = activity(
    encode([
      [22.5, 113.4],
      [22.6, 113.5],
    ]),
    '2026-01-01 08:00:00',
    3,
  )

  const bounds = newestRideBounds([older, newerEmpty, newest])

  expect(bounds?.[0][0]).toBeCloseTo(113.4)
  expect(bounds?.[0][1]).toBeCloseTo(22.5)
  expect(bounds?.[1][0]).toBeCloseTo(113.5)
  expect(bounds?.[1][1]).toBeCloseTo(22.6)
})

test('returns no bounds when every ride is empty', () => {
  expect(newestRideBounds([activity('', '2026-01-01 08:00:00', 1)])).toBeNull()
})

test('eases in and out and stays inside 0..1', () => {
  expect(introFocusEasing(0)).toBe(0)
  expect(introFocusEasing(1)).toBe(1)
  expect(introFocusEasing(0.5)).toBeCloseTo(0.5)
  expect(introFocusEasing(0.2)).toBeLessThan(0.2)
  expect(introFocusEasing(0.8)).toBeGreaterThan(0.8)
  expect(introFocusEasing(-1)).toBe(0)
  expect(introFocusEasing(2)).toBe(1)
})

test('starts on the earth frame and finishes on the ride', () => {
  const start = { lng: 110.98, lat: 31.27 }
  const target = { lng: 120.22, lat: 30.3 }
  const view = introFocusView(start, target, 2.3, 11.2, 0)
  const done = introFocusView(start, target, 2.3, 11.2, 1)

  expect(view.zoom).toBe(2.3)
  expect(view.lng).toBeCloseTo(start.lng)
  expect(view.lat).toBeCloseTo(start.lat)
  expect(done.zoom).toBe(11.2)
  expect(done.lng).toBeCloseTo(target.lng)
  expect(done.lat).toBeCloseTo(target.lat)
})

test('is already near the ride halfway through the zoom', () => {
  const start = { lng: 110.98, lat: 31.27 }
  const target = { lng: 120.22, lat: 30.3 }
  const mid = introFocusView(start, target, 2.3, 11.2, 0.5)
  const linearLng = (start.lng + target.lng) / 2

  expect(Math.abs(mid.lng - target.lng)).toBeLessThan(
    Math.abs(linearLng - target.lng),
  )
  expect(mid.zoom).toBeCloseTo(6.75)
})

test('crosses the antimeridian on the short way', () => {
  const mid = introFocusView(
    { lng: 170, lat: 0 },
    { lng: -170, lat: 0 },
    2,
    2,
    0.5,
  )

  expect(Math.abs(mid.lng)).toBeGreaterThan(170)
})

test('keeps the configured inset on a large map', () => {
  expect(introFocusPadding({ width: 1200, height: 900 })).toEqual(
    earthIntroFocus.padding,
  )
})

test('shrinks the inset so it still fits a small map', () => {
  expect(introFocusPadding({ width: 100, height: 80 })).toEqual({
    top: 24,
    right: 34,
    bottom: 24,
    left: 34,
  })
})
