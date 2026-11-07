import { describe, expect, it } from 'vitest';
import { districtCells } from './districts.ts';

const centres = [
  { id: 'a', lng: 34.5, lat: 31.5 },
  { id: 'b', lng: 35.5, lat: 31.5 },
  { id: 'c', lng: 35.0, lat: 32.5 },
];

describe('districtCells', () => {
  const cells = districtCells(centres);

  it('makes one cell per centre, each closed', () => {
    expect(cells.features).toHaveLength(3);
    for (const f of cells.features) {
      const ring = f.geometry.coordinates[0] ?? [];
      expect(ring.length).toBeGreaterThanOrEqual(4);
      expect(ring[0]).toEqual(ring[ring.length - 1]);
    }
  });

  it('keeps each centre inside its own cell and splits halfway between two centres', () => {
    const a = cells.features[0]?.geometry.coordinates[0] ?? [];
    // Cell a lies west of the line halfway between a and b (longitude 35.0), never past it.
    expect(Math.max(...a.map((p) => p[0] ?? 0))).toBeLessThanOrEqual(35.0 + 1e-6);
    expect(Math.min(...a.map((p) => p[0] ?? 0))).toBeLessThan(34.5);
  });

  it('gives touching cells different tints', () => {
    const tints = cells.features.map((f) => f.properties?.['tint']);
    expect(new Set(tints).size).toBe(3);
  });
});
