// The map's "picture frame": a smooth ellipse around the home view, with rings that fade the
// map into paper. It is purely geographic decoration. It is never traced along a political or
// historical boundary, and nothing in the UI describes it as one (docs/SPEC_MAP_V2.md 3.4).

import { HOME_BOUNDS } from './region.ts';
import type { LngLatBox } from './region.ts';

/** Centre of the home view, in [lng, lat]. */
export const FRAME_CENTER: readonly [number, number] = [
  (HOME_BOUNDS[0][0] + HOME_BOUNDS[1][0]) / 2,
  (HOME_BOUNDS[0][1] + HOME_BOUNDS[1][1]) / 2,
];

/** Half-width and half-height, in degrees, of the clear inner ellipse. It contains the whole home view. */
export const FRAME_RADII = { lng: 1.5, lat: 2.8 } as const;

/** How many nested rings fade the map out. More rings make a smoother fade (fewer visible bands). */
const RING_COUNT = 12;
const OUTER = 1.5;

/** Ring edges as multiples of the inner ellipse. The first is the inner clear zone, the last is where paper turns solid. */
export const FRAME_RING_SCALES: readonly number[] = Array.from({ length: RING_COUNT + 1 }, (_, i) => 1 + ((OUTER - 1) * i) / RING_COUNT);

/** Cumulative paper opacity seen outside each ring edge: a smooth rise, then solid paper beyond the last ring. */
export const FRAME_PAPER_COVER: readonly number[] = Array.from({ length: RING_COUNT + 1 }, (_, i) => {
  if (i === RING_COUNT) return 1;
  const t = (i + 1) / RING_COUNT;
  return 0.1 + 0.86 * (t * t * (3 - 2 * t));
});

/** Elevation tiles cover only the frame, so nothing outside it is ever requested. */
export const TERRAIN_MIN_ZOOM = 5;
export const TERRAIN_MAX_ZOOM = 9;

const OUTER_SCALE = FRAME_RING_SCALES[FRAME_RING_SCALES.length - 1] ?? 1;

/** [lng, lat] points of the ellipse at `scale` times the inner size. Closed: first point repeats at the end. */
export function ellipseRing(scale: number, steps = 128): [number, number][] {
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    ring.push([
      FRAME_CENTER[0] + Math.cos(angle) * FRAME_RADII.lng * scale,
      FRAME_CENTER[1] + Math.sin(angle) * FRAME_RADII.lat * scale,
    ]);
  }
  return ring;
}

/** Bounding box of the outermost ring, as [west, south] and [east, north]. */
export function frameBounds(scale = OUTER_SCALE): LngLatBox {
  return [
    [FRAME_CENTER[0] - FRAME_RADII.lng * scale, FRAME_CENTER[1] - FRAME_RADII.lat * scale],
    [FRAME_CENTER[0] + FRAME_RADII.lng * scale, FRAME_CENTER[1] + FRAME_RADII.lat * scale],
  ];
}

/** True when a point sits inside the ellipse at `scale` times the inner size. */
export function insideFrame(lng: number, lat: number, scale = 1): boolean {
  const x = (lng - FRAME_CENTER[0]) / (FRAME_RADII.lng * scale);
  const y = (lat - FRAME_CENTER[1]) / (FRAME_RADII.lat * scale);
  return x * x + y * y <= 1;
}
