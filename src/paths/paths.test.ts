import { describe, expect, it } from 'vitest';
import { lineFromGeoJson, parsePaths } from '../data/loadPaths.ts';
import { cumulative, curveThrough, partial, waypointFractions } from './geometry.ts';
import type { Pos } from './geometry.ts';
import { opacityAt, targetProgress, TRAIL_OPACITY, waypointTimes } from './timing.ts';

const wp = (date: string | null) => ({ name: 'x', lat: 0, lng: 0, date });

describe('geometry', () => {
  const line = curveThrough([[34.75, 32.05], [35.08, 32.93]]);
  const cum = cumulative(line);
  it('starts and ends on the waypoints and bows sideways', () => {
    expect(line[0]).toEqual([34.75, 32.05]);
    expect(line[line.length - 1]?.[0]).toBeCloseTo(35.08);
    expect(cum[cum.length - 1] ?? 0).toBeGreaterThan(Math.hypot(0.33 * Math.cos(0.567), 0.88));
  });
  it('draws part of the line up to a head point', () => {
    expect(partial(line, cum, 0).coords).toEqual([]);
    expect(partial(line, cum, 1).coords).toHaveLength(line.length);
    const half = partial(line, cum, 0.5);
    expect(half.coords.length).toBeGreaterThan(2);
    expect(half.coords.length).toBeLessThan(line.length);
    expect(half.head).toEqual(half.coords[half.coords.length - 1]);
  });
  it('places middle waypoints along the line', () => {
    const pts: Pos[] = [[0, 0], [1, 0], [2, 0]];
    const l = curveThrough(pts, 4);
    const f = waypointFractions(pts, l, cumulative(l));
    expect(f[0]).toBe(0);
    expect(f[2]).toBe(1);
    expect(f[1]).toBeGreaterThan(0.3);
    expect(f[1]).toBeLessThan(0.7);
  });
});

describe('timing', () => {
  const span = { start: 1799, end: 1799 };
  it('completes a one-year campaign in its year', () => {
    const times = waypointTimes([wp('1799-03'), wp('1799-03-20')], span);
    expect(targetProgress(times, [0, 1], 1798)).toBe(0);
    expect(targetProgress(times, [0, 1], 1799)).toBe(1);
  });
  it('follows waypoint dates across years and spaces undated ones evenly', () => {
    const times = waypointTimes([wp('1900'), wp(null), wp('1904')], { start: 1900, end: 1904 });
    expect(times).toEqual([1900, 1902, 1904]);
    expect(targetProgress(times, [0, 0.5, 1], 1900)).toBeCloseTo(0.25);
    expect(targetProgress(times, [0, 0.5, 1], 1902)).toBeCloseTo(0.75);
    expect(targetProgress(times, [0, 0.5, 1], 1910)).toBe(1);
  });
  it('fades to a trail after the event, then away', () => {
    expect(opacityAt(span, 3, 1798)).toBe(0);
    expect(opacityAt(span, 3, 1799)).toBe(1);
    expect(opacityAt(span, 3, 1802)).toBe(TRAIL_OPACITY);
    expect(opacityAt(span, 3, 1803)).toBe(0);
  });
});

describe('parsePaths', () => {
  const good = {
    id: 'a',
    eventId: 'e',
    kind: 'campaign',
    shape: 'schematic',
    lingerYears: 2,
    status: 'needs-review',
    waypoints: [{ name: 'A', lat: 1, lng: 2, date: null }, { name: 'B', lat: 3, lng: 4, date: '1799-03' }],
    sources: [{ title: 'T', url: 'https://example.org', publisher: 'P', accessedDate: '2026-11-04' }],
  };
  it('accepts a good path and drops bad ones', () => {
    expect(parsePaths({ version: 1, paths: [good] })).toHaveLength(1);
    expect(parsePaths({ version: 1, paths: [{ ...good, waypoints: [good.waypoints[0]] }] })).toHaveLength(0);
    expect(parsePaths({ version: 1, paths: [{ ...good, sources: [] }] })).toHaveLength(0);
    expect(parsePaths({ version: 1, paths: [{ ...good, shape: 'traced' }] })).toHaveLength(0);
    expect(parsePaths({ version: 1, paths: [{ ...good, waypoints: [good.waypoints[0], { ...good.waypoints[1], date: '1799-13' }] }] })).toHaveLength(0);
  });
  it('reads a LineString from a Feature or a bare geometry', () => {
    const geometry = { type: 'LineString', coordinates: [[1, 2], [3, 4]] };
    expect(lineFromGeoJson(geometry)).toEqual([[1, 2], [3, 4]]);
    expect(lineFromGeoJson({ type: 'Feature', geometry })).toEqual([[1, 2], [3, 4]]);
    expect(lineFromGeoJson({ type: 'Point', coordinates: [1, 2] })).toBeNull();
  });
});
