import { describe, expect, it } from 'vitest';
import { CATEGORY_IDS } from '../data/categories.ts';
import type { CategoryId } from '../data/categories.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { countMatching, createCategoryCounter, filtersActive } from './counts.ts';

function event(id: string, dateStart: string, category: CategoryId, dateEnd: string | null = null): HistoricalEvent {
  return {
    id,
    title: id,
    dateStart,
    dateEnd,
    datePrecision: 'year',
    location: { name: id, nameAr: null, nameHe: null, lat: 31.5, lng: 35, precision: 'area' },
    category,
    era: 'ottoman',
    summary: id,
    sources: [{ title: 't', url: 'https://example.org', publisher: 'p', accessedDate: '2026-11-03' }],
    status: 'needs-review',
    tags: [],
  };
}

const events = [
  event('a', '1948', 'conflict'),
  event('b', '1947', 'displacement', '1949'),
  event('c', '1948', 'conflict'),
  event('d', '1911', 'cultural'),
];

describe('createCategoryCounter', () => {
  const count = createCategoryCounter(events);

  it('counts events active in the year, per category', () => {
    const c = count(1948);
    expect(c.conflict).toBe(2);
    expect(c.displacement).toBe(1);
    expect(c.cultural).toBe(0);
  });

  it('is zero everywhere in a quiet year', () => {
    expect(Object.values(count(1500)).every((n) => n === 0)).toBe(true);
  });

  it('has an entry for every category', () => {
    expect(Object.keys(count(1948)).sort()).toEqual([...CATEGORY_IDS].sort());
  });
});

describe('countMatching and filtersActive', () => {
  it('counts events in active categories across all years', () => {
    expect(countMatching(events, new Set<CategoryId>(['conflict']))).toBe(2);
    expect(countMatching(events, new Set<CategoryId>())).toBe(0);
    expect(countMatching(events, new Set<CategoryId>(['political']))).toBe(0);
  });

  it('knows when a filter is on', () => {
    expect(filtersActive(new Set<CategoryId>())).toBe(false);
    expect(filtersActive(new Set<CategoryId>(CATEGORY_IDS))).toBe(true);
    expect(filtersActive(new Set<CategoryId>(['conflict']))).toBe(true);
  });
});
