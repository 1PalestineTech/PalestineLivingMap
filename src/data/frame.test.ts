import { describe, expect, it } from 'vitest';
import { fadeData } from '../map/fade.ts';
import {
  ellipseRing,
  frameBounds,
  FRAME_PAPER_COVER,
  FRAME_RING_SCALES,
  insideFrame,
} from './frame.ts';
import { HOME_BOUNDS } from './region.ts';

describe('frame geometry', () => {
  it('keeps every corner of the home view inside the clear ellipse', () => {
    for (const lng of [HOME_BOUNDS[0][0], HOME_BOUNDS[1][0]]) {
      for (const lat of [HOME_BOUNDS[0][1], HOME_BOUNDS[1][1]]) {
        expect(insideFrame(lng, lat)).toBe(true);
      }
    }
  });

  it('has a smooth run of rising rings and then solid paper', () => {
    expect(FRAME_RING_SCALES).toHaveLength(13);
    expect(FRAME_PAPER_COVER).toHaveLength(FRAME_RING_SCALES.length);
    for (let i = 1; i < FRAME_RING_SCALES.length; i += 1) {
      expect(FRAME_RING_SCALES[i]).toBeGreaterThan(FRAME_RING_SCALES[i - 1] ?? 0);
      expect(FRAME_PAPER_COVER[i]).toBeGreaterThan(FRAME_PAPER_COVER[i - 1] ?? 0);
    }
    expect(FRAME_PAPER_COVER[FRAME_PAPER_COVER.length - 1]).toBe(1);
  });

  it('gives each ring one paper cover, ending in solid paper', () => {
    const covers = fadeData().features.map((f) => f.properties?.cover);
    expect(covers).toEqual([...FRAME_PAPER_COVER]);
  });

  it('draws a closed ellipse that fits its bounding box', () => {
    const ring = ellipseRing(1.5);
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    const [[west, south], [east, north]] = frameBounds(1.5);
    for (const [lng, lat] of ring) {
      expect(lng).toBeGreaterThanOrEqual(west - 1e-9);
      expect(lng).toBeLessThanOrEqual(east + 1e-9);
      expect(lat).toBeGreaterThanOrEqual(south - 1e-9);
      expect(lat).toBeLessThanOrEqual(north + 1e-9);
    }
  });
});
