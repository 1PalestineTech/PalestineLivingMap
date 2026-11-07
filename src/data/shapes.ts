// Geometry of the eight category marker shapes (docs/SPEC.md section 5). Shared by the map's
// canvas icons (src/map/markers.ts) and the panel's SVG badges, so they always match.

import type { MarkerShape } from './categories.ts';

export type Point = readonly [number, number];

export type Outline =
  | { kind: 'polygon'; points: readonly Point[] }
  | { kind: 'circle'; cx: number; cy: number; r: number };

/** Regular polygon vertices, the first at `rotation` radians clockwise from straight up. */
function polygon(cx: number, cy: number, radius: number, sides: number, rotation: number): Point[] {
  return Array.from({ length: sides }, (_, i): Point => {
    const angle = rotation + (i * 2 * Math.PI) / sides;
    return [cx + radius * Math.sin(angle), cy - radius * Math.cos(angle)];
  });
}

/** The shape drawn inside a box centered on (c, c), with `r` as the base radius. */
export function shapeOutline(shape: MarkerShape, c: number, r: number): Outline {
  switch (shape) {
    case 'square':
      return { kind: 'polygon', points: polygon(c, c, r * Math.SQRT2, 4, Math.PI / 4) };
    case 'diamond':
      return { kind: 'polygon', points: polygon(c, c, r * 1.15, 4, 0) };
    case 'triangle':
      return { kind: 'polygon', points: polygon(c, c + r * 0.12, r * 1.2, 3, 0) };
    case 'pentagon':
      return { kind: 'polygon', points: polygon(c, c, r * 1.08, 5, 0) };
    case 'hexagon':
      return { kind: 'polygon', points: polygon(c, c, r * 1.05, 6, 0) };
    case 'octagon':
      return { kind: 'polygon', points: polygon(c, c, r * 1.05, 8, Math.PI / 8) };
    case 'circle':
    case 'ring-chevron':
      return { kind: 'circle', cx: c, cy: c, r };
  }
}

/** The outward chevron inside the displacement ring, as three points. */
export function chevronPoints(c: number, r: number): readonly [Point, Point, Point] {
  return [
    [c - r * 0.2, c - r * 0.5],
    [c + r * 0.35, c],
    [c - r * 0.2, c + r * 0.5],
  ];
}
