import { describe, expect, it } from 'vitest';
import type { CategoryId } from '../data/categories.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { siblingsOf } from './siblings.ts';

function event(id: string, dateStart: string, place: string, category: CategoryId): HistoricalEvent {
  return {
    id,
    title: id,
    dateStart,
    dateEnd: null,
    datePrecision: dateStart.length > 5 ? 'month' : 'year',
    location: { name: place, nameAr: null, nameHe: null, lat: 31.5, lng: 35, precision: 'area' },
    category,
    era: 'ottoman',
    summary: id,
    sources: [{ title: 't', url: 'https://example.org', publisher: 'p', accessedDate: '2026-11-03' }],
    status: 'needs-review',
    tags: [],
  };
}

const events = [
  event('gaza-late', '1948', 'Gaza', 'conflict'),
  event('gaza-early', '-332-10', 'Gaza', 'conflict'),
  event('jaffa', '1911-01', 'Jaffa', 'cultural'),
  event('hebron', '1929', 'Hebron', 'conflict'),
  event('gaza-mid', '1917', 'Gaza', 'political'),
];

describe('siblingsOf', () => {
  it('steps through events at the same place in date order', () => {
    const s = siblingsOf(events, events[0] as HistoricalEvent);
    expect(s.scope).toBe('location');
    expect(s.groupName).toBe('Gaza');
    expect(s.list.map((e) => e.id)).toEqual(['gaza-early', 'gaza-mid', 'gaza-late']);
    expect(s.index).toBe(2);
    expect(s.previous?.id).toBe('gaza-mid');
    expect(s.next).toBeNull();
  });

  it('falls back to the category when a place has one event', () => {
    const s = siblingsOf(events, events[3] as HistoricalEvent);
    expect(s.scope).toBe('category');
    expect(s.groupName).toBe('Conflict');
    expect(s.list.map((e) => e.id)).toEqual(['gaza-early', 'hebron', 'gaza-late']);
  });

  it('has no previous or next for a lone event', () => {
    const s = siblingsOf(events, events[2] as HistoricalEvent);
    expect(s.list).toHaveLength(1);
    expect(s.previous).toBeNull();
    expect(s.next).toBeNull();
  });
});
