import { describe, expect, it } from 'vitest';
import { CATEGORY_IDS } from '../data/categories.ts';
import type { CategoryId } from '../data/categories.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { createScale } from './scale.ts';
import { BUCKETS, densityBuckets, densityPath } from './sparkline.ts';

const scale = createScale({ presentYear: 2026 });
const all = new Set<CategoryId>(CATEGORY_IDS);

function event(id: string, dateStart: string, category: CategoryId, dateEnd: string | null = null): HistoricalEvent {
  return {
    id,
    title: id,
    dateStart,
    dateEnd,
    datePrecision: 'year',
    location: { name: id, nameAr: null, nameHe: null, lat: 31.5, lng: 35, precision: 'area' },
    category,
    era: 'british-mandate',
    summary: id,
    sources: [{ title: 't', url: 'https://example.org', publisher: 'p', accessedDate: '2026-11-03' }],
    status: 'needs-review',
    tags: [],
  };
}

describe('densityBuckets', () => {
  it('counts an event in the bucket for its year', () => {
    const counts = densityBuckets([event('a', '1948', 'political')], scale, all);
    expect(counts).toHaveLength(BUCKETS);
    expect(counts[Math.floor(scale.yearToPosition(1948) * BUCKETS)]).toBe(1);
    expect(counts.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(1);
  });

  it('spreads a ranged event over several buckets', () => {
    const counts = densityBuckets([event('a', '1500', 'political', '1900')], scale, all);
    expect(counts.filter((c) => c > 0).length).toBeGreaterThan(10);
  });

  it('ignores inactive categories', () => {
    const only = new Set<CategoryId>(['cultural']);
    const counts = densityBuckets([event('a', '1948', 'political')], scale, only);
    expect(counts.every((c) => c === 0)).toBe(true);
  });
});

describe('densityPath', () => {
  it('is empty with no events', () => {
    expect(densityPath([0, 0, 0])).toBe('');
  });

  it('scales to the busiest bucket', () => {
    expect(densityPath([0, 2, 1])).toContain('L1.5 0.000');
  });
});
