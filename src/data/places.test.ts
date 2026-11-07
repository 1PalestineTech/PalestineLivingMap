import { describe, expect, it } from 'vitest';
import { distanceKm, labelAt, nameValidInYear, namesAt, shortSpan, spanText } from './places.ts';
import { parsePlaces } from './loadPlaces.ts';
import type { Place, PlaceName } from './placeTypes.ts';

const source = { title: 'T', url: 'https://example.org', publisher: 'P', accessedDate: '2026-11-04' };
const name = (en: string, ar: string | null, from: number | null, to: number | null): PlaceName => ({
  en,
  ar,
  lang: 'xx',
  from,
  to,
  fromCirca: false,
  toCirca: false,
  sources: [source],
});

const place: Place = {
  id: 'test',
  kind: 'city',
  rank: 1,
  lat: 31.7,
  lng: 35.2,
  status: 'needs-review',
  names: [name('Old', null, -500, 99), name('Mid', 'وسط', 100, 199), name('Both', 'ب', 150, null), name('Unsourced', 'غ', null, 400)],
};

describe('nameValidInYear', () => {
  it('includes both ends of the span', () => {
    expect(nameValidInYear(name('x', null, 100, 199), 100)).toBe(true);
    expect(nameValidInYear(name('x', null, 100, 199), 199)).toBe(true);
    expect(nameValidInYear(name('x', null, 100, 199), 200)).toBe(false);
    expect(nameValidInYear(name('x', null, 100, 199), 99)).toBe(false);
  });
  it('treats a null end as still in use', () => {
    expect(nameValidInYear(name('x', null, 1187, null), 2026)).toBe(true);
  });
  it('never shows a name with no start year', () => {
    expect(nameValidInYear(name('x', null, null, 400), 300)).toBe(false);
  });
  it('steps over the missing year 0', () => {
    expect(nameValidInYear(name('x', null, -5, 5), 1)).toBe(true);
    expect(nameValidInYear(name('x', null, -5, -1), 1)).toBe(false);
    expect(nameValidInYear(name('x', null, 1, 5), -1)).toBe(false);
  });
});

describe('labelAt', () => {
  it('shows nothing where no name is attested', () => {
    expect(labelAt(place, -1000)).toBeNull();
    expect(labelAt(place, 400)).toEqual({ en: 'Both', ar: 'ب' });
  });
  it('joins names valid together in their listed order', () => {
    expect(namesAt(place, 160).map((n) => n.en)).toEqual(['Mid', 'Both']);
    expect(labelAt(place, 160)).toEqual({ en: 'Mid / Both', ar: 'وسط / ب' });
  });
  it('leaves the Arabic line empty when no valid name has one', () => {
    expect(labelAt(place, -100)).toEqual({ en: 'Old', ar: '' });
  });
  it('marks a village as depopulated only after its depopulation year', () => {
    const village: Place = { ...place, depopulated: 1948 };
    expect(labelAt(village, 1948)).toEqual({ en: 'Both', ar: 'ب' });
    expect(labelAt(village, 1949)).toEqual({ en: 'Both (depopulated)', ar: 'ب (مهجّرة)' });
  });
});

describe('span text', () => {
  it('writes approximate and open spans in words', () => {
    const n: PlaceName = { ...name('x', null, 100, 638), fromCirca: true, toCirca: true };
    expect(spanText(n)).toBe('c. 100 CE to c. 638 CE');
    expect(shortSpan(n)).toBe('c. 100 - c. 638');
    expect(spanText(name('x', null, 1187, null))).toBe('From 1187 CE to the present');
    expect(spanText(name('x', null, null, null))).toBe('Dates not yet sourced');
    expect(spanText(name('x', null, -500, -100))).toBe('500 BCE to 100 BCE');
  });
});

describe('parsePlaces', () => {
  const raw = (extra: object = {}): unknown => ({
    version: 1,
    places: [{ id: 'a', kind: 'city', rank: 1, lat: 1, lng: 2, status: 'needs-review', names: place.names, ...extra }],
  });
  it('accepts a good file', () => {
    expect(parsePlaces(raw())).toHaveLength(1);
  });
  it('drops places with no usable names, a bad kind or a year 0', () => {
    expect(parsePlaces(raw({ names: [] }))).toHaveLength(0);
    expect(parsePlaces(raw({ kind: 'planet' }))).toHaveLength(0);
    expect(parsePlaces(raw({ names: [{ ...name('x', null, 0, 5) }] }))).toHaveLength(0);
  });
  it('drops a name that has no source', () => {
    expect(parsePlaces(raw({ names: [{ ...name('x', null, 1, 5), sources: [] }] }))).toHaveLength(0);
  });
  it('returns nothing for the wrong version', () => {
    expect(parsePlaces({ version: 2, places: [] })).toEqual([]);
  });
});

describe('distanceKm', () => {
  it('is about 111 km per degree of latitude', () => {
    expect(distanceKm(31, 35, 32, 35)).toBeGreaterThan(110);
    expect(distanceKm(31, 35, 32, 35)).toBeLessThan(112);
  });
});
