import { describe, expect, it } from 'vitest';
import { ERAS } from '../data/eras.ts';
import { ERA_SHARES, createScale } from './scale.ts';

const scale = createScale({ presentYear: 2026 });

describe('ERA_SHARES', () => {
  it('sums to 1 and covers every era', () => {
    const total = ERAS.reduce((sum, era) => sum + ERA_SHARES[era.id], 0);
    expect(total).toBeCloseTo(1, 10);
  });
});

describe('yearToPosition', () => {
  it('maps the ends of the range to 0 and 1', () => {
    expect(scale.yearToPosition(-3200)).toBe(0);
    expect(scale.yearToPosition(2026)).toBe(1);
  });

  it('clamps years outside the range', () => {
    expect(scale.yearToPosition(-9000)).toBe(0);
    expect(scale.yearToPosition(3000)).toBe(1);
  });

  it('puts era boundaries at the cumulative share', () => {
    expect(scale.yearToPosition(-332)).toBeCloseTo(0.14, 10);
    expect(scale.yearToPosition(638)).toBeCloseTo(0.31, 10);
    expect(scale.yearToPosition(1917)).toBeCloseTo(0.69, 10);
    expect(scale.yearToPosition(1948)).toBeCloseTo(0.77, 10);
  });

  it('is strictly increasing across the BCE/CE gap (no year 0)', () => {
    expect(scale.yearToPosition(1)).toBeGreaterThan(scale.yearToPosition(-1));
    expect(scale.yearToPosition(-1)).toBeGreaterThan(scale.yearToPosition(-2));
  });

  it('gives recent centuries more room per year than ancient ones', () => {
    const ancient = scale.yearToPosition(-2200) - scale.yearToPosition(-2300);
    const modern = scale.yearToPosition(1950) - scale.yearToPosition(1850);
    expect(modern).toBeGreaterThan(ancient * 10);
  });
});

describe('positionToYear', () => {
  it('maps the ends of the track to the ends of the range', () => {
    expect(scale.positionToYear(0)).toBe(-3200);
    expect(scale.positionToYear(1)).toBe(2026);
    expect(scale.positionToYear(-1)).toBe(-3200);
    expect(scale.positionToYear(2)).toBe(2026);
  });

  it('round-trips years in the recent eras exactly', () => {
    for (const year of [1517, 1900, 1917, 1948, 1967, 1993, 2023]) {
      expect(scale.positionToYear(scale.yearToPosition(year))).toBe(year);
    }
  });

  it('round-trips ancient years to within the local resolution', () => {
    for (const year of [-3000, -1500, -332, 1, 400]) {
      const back = scale.positionToYear(scale.yearToPosition(year));
      expect(Math.abs(back - year)).toBeLessThanOrEqual(1);
    }
  });

  it('never returns year 0', () => {
    for (let p = 0; p <= 1; p += 0.0005) {
      expect(scale.positionToYear(p)).not.toBe(0);
    }
  });

  it('is monotonic', () => {
    let previous = -Infinity;
    for (let p = 0; p <= 1; p += 0.001) {
      const astronomical = scale.positionToYear(p);
      const linear = astronomical < 0 ? astronomical + 1 : astronomical;
      expect(linear).toBeGreaterThanOrEqual(previous);
      previous = linear;
    }
  });
});

describe('eraAt', () => {
  it('finds the era for a year', () => {
    expect(scale.eraAt(-3000).id).toBe('ancient');
    expect(scale.eraAt(691).id).toBe('early-islamic');
    expect(scale.eraAt(1917).id).toBe('british-mandate');
    expect(scale.eraAt(2023).id).toBe('1993-present');
  });

  it('gives a boundary year to the later era', () => {
    expect(scale.eraAt(-332).id).toBe('classical');
    expect(scale.eraAt(1948).id).toBe('1948-1967');
    expect(scale.eraAt(1947).id).toBe('british-mandate');
  });
});

describe('stepAt and stepYear', () => {
  it('uses coarser steps where the track is compressed', () => {
    expect(scale.stepAt(-2000)).toBe(100);
    expect(scale.stepAt(1700)).toBe(10);
    expect(scale.stepAt(1930)).toBe(1);
  });

  it('snaps to multiples of the local step', () => {
    expect(scale.stepYear(1700, 1, false)).toBe(1710);
    expect(scale.stepYear(1705, 1, false)).toBe(1710);
    expect(scale.stepYear(1705, -1, false)).toBe(1700);
    expect(scale.stepYear(-3150, 1, false)).toBe(-3100);
  });

  it('takes a ten-times step with big', () => {
    expect(scale.stepYear(1930, 1, true)).toBe(1940);
    expect(scale.stepYear(1700, 1, true)).toBe(1800);
  });

  it('skips year 0 and clamps at the ends', () => {
    expect(scale.stepYear(-1, 1, false)).toBeGreaterThanOrEqual(1);
    expect(scale.stepYear(-3200, -1, false)).toBe(-3200);
    expect(scale.stepYear(2026, 1, false)).toBe(2026);
  });
});

describe('createScale with an earlier first year', () => {
  it('extends the left end', () => {
    const wide = createScale({ presentYear: 2026, firstYear: -4000 });
    expect(wide.minYear).toBe(-4000);
    expect(wide.yearToPosition(-4000)).toBe(0);
    expect(wide.yearToPosition(-332)).toBeCloseTo(0.14, 10);
  });
});
