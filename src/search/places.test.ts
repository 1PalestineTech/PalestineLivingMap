import { describe, expect, it } from 'vitest';
import { parsePlaces } from '../data/loadPlaces.ts';
import { buildPlaceIndex, searchPlaceSet, searchPlaces } from './places.ts';

const source = { title: 'T', url: 'https://example.org', publisher: 'P', accessedDate: '2026-11-04' };
const base = { lang: 'ar', fromCirca: false, toCirca: false, sources: [source] };
const [jerusalem] = parsePlaces({
  version: 1,
  places: [
    {
      id: 'jerusalem',
      kind: 'city',
      rank: 1,
      lat: 31.7,
      lng: 35.2,
      status: 'needs-review',
      names: [
        { ...base, en: 'Aelia Capitolina', ar: null, from: 100, to: 637 },
        { ...base, en: 'al-Quds / Jerusalem', ar: 'القدس', from: 1187, to: null },
      ],
    },
  ],
});
const index = buildPlaceIndex(jerusalem ? [jerusalem] : []);

describe('searchPlaces', () => {
  it('finds a place by an old name and reports which name matched', () => {
    const [hit] = searchPlaces(index, 'aelia cap');
    expect(hit?.place.id).toBe('jerusalem');
    expect(hit?.name.en).toBe('Aelia Capitolina');
  });
  it('matches Arabic and transliterated forms', () => {
    expect(searchPlaces(index, 'القدس')[0]?.name.en).toBe('al-Quds / Jerusalem');
    expect(searchPlaces(index, 'quds')).toHaveLength(1);
  });
  it('needs every word to match one name', () => {
    expect(searchPlaces(index, 'aelia quds')).toHaveLength(0);
    expect(searchPlaces(index, '')).toHaveLength(0);
  });
});

describe('searchPlaceSet', () => {
  const mk = (id: string, en: string, sub: string, depop?: number): unknown => ({
    id, kind: 'village', rank: 4, lat: 33, lng: 35.5, status: 'needs-review',
    ...(depop ? { depopulated: depop } : {}),
    facts: { subDistrict: sub },
    names: [{ ...base, en, ar: null, from: 1945, to: null, note: 'n' }],
  });
  const all = parsePlaces({ version: 1, places: [mk('a', 'Hunin', 'Safad', 1948), mk('b', 'Akbara', 'Safad', 1948), mk('c', 'Biriyya', 'Safad', 1948), mk('d', 'Kuwaykat', 'Acre', 1948), mk('e', 'Safad Town', 'Safad')] });
  const idx = buildPlaceIndex(all);

  it('finds the depopulated villages of a sub-district', () => {
    expect(searchPlaceSet(idx, all, 'villages of Safad depopulated 1948').map((p) => p.id).sort()).toEqual(['a', 'b', 'c']);
  });

  it('needs a descriptive word, so a plain name search stays a name search', () => {
    expect(searchPlaceSet(idx, all, 'hunin akbara')).toEqual([]);
  });
});
