import { describe, expect, it } from 'vitest';
import { createScale } from './scale.ts';
import { MIN_LABEL_GAP_PX, computeTicks } from './ticks.ts';

const scale = createScale({ presentYear: 2026 });

describe('computeTicks', () => {
  for (const width of [320, 700, 1400]) {
    const ticks = computeTicks(scale, width);
    const labelled = ticks.filter((t) => t.label !== null);

    it(`never crowds labels at ${width}px`, () => {
      for (let i = 1; i < labelled.length; i++) {
        const a = labelled[i - 1];
        const b = labelled[i];
        if (a && b) expect((b.pos - a.pos) * width).toBeGreaterThanOrEqual(MIN_LABEL_GAP_PX - 0.001);
      }
    });

    it(`has labels and stays on the track at ${width}px`, () => {
      expect(labelled.length).toBeGreaterThan(3);
      for (const t of ticks) {
        expect(t.pos).toBeGreaterThanOrEqual(0);
        expect(t.pos).toBeLessThanOrEqual(1);
      }
    });
  }

  it('uses finer labels where the track is stretched', () => {
    const ticks = computeTicks(scale, 1200).filter((t) => t.label !== null);
    const recent = ticks.filter((t) => t.year >= 1900).map((t) => t.year);
    const ancient = ticks.filter((t) => t.year < -1000).map((t) => t.year);
    expect(recent.length).toBeGreaterThan(0);
    expect(recent.every((y) => y % 5 === 0 || y % 2 === 0 || y % 10 === 0 || y % 25 === 0)).toBe(true);
    expect(ancient.every((y) => y % 100 === 0)).toBe(true);
  });

  it('labels BCE years and 1 CE, and never year 0', () => {
    const ticks = computeTicks(scale, 1400);
    expect(ticks.some((t) => t.year === 0)).toBe(false);
    expect(ticks.some((t) => t.label?.endsWith('BCE'))).toBe(true);
  });

  it('returns nothing for a zero-width track', () => {
    expect(computeTicks(scale, 0)).toEqual([]);
  });
});
