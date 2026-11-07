import { describe, expect, it } from 'vitest';
import type { HistoricalEvent } from '../data/types.ts';
import { buildIndex, search } from './engine.ts';
import { normalize, tokenize } from './normalize.ts';

function event(over: Partial<HistoricalEvent> & { id: string; title: string }): HistoricalEvent {
  return {
    dateStart: '1900',
    dateEnd: null,
    datePrecision: 'year',
    location: { name: 'Nowhere', nameAr: null, nameHe: null, lat: 31.5, lng: 35, precision: 'area' },
    category: 'political',
    era: 'ottoman',
    summary: 'Plain summary.',
    sources: [{ title: 't', url: 'https://example.org', publisher: 'p', accessedDate: '2026-11-03' }],
    status: 'needs-review',
    tags: [],
    ...over,
  };
}

const events = [
  event({
    id: 'gaza-siege',
    title: "Alexander's siege of Gaza",
    dateStart: '-332-10',
    datePrecision: 'month',
    location: { name: 'Gaza', nameAr: 'غزة', nameHe: 'עזה', lat: 31.5, lng: 34.45, precision: 'area' },
    tags: ['siege', 'macedonian'],
  }),
  event({
    id: 'dome',
    title: 'Dome of the Rock completed',
    dateStart: '691',
    location: {
      name: 'Jerusalem',
      nameAr: 'القُدس',
      nameHe: 'ירושלים',
      historicalNames: [{ name: 'Aelia Capitolina', lang: 'la' }],
      lat: 31.77,
      lng: 35.23,
      precision: 'exact',
    },
    tags: ['umayyad'],
    summary: 'The caliph built it near Gaza road.',
  }),
  event({
    id: 'falastin',
    title: 'Falastin newspaper founded in Jaffa',
    dateStart: '1911-01',
    datePrecision: 'month',
    location: { name: 'Jaffa', nameAr: 'يافا', nameHe: 'יפו', lat: 32.05, lng: 34.75, precision: 'area' },
    tags: ['press'],
  }),
];

const index = buildIndex(events);
const ids = (q: string): string[] => search(index, q).map((e) => e.id);

describe('normalize', () => {
  it('folds case, accents and apostrophes', () => {
    expect(normalize('Jérusalem')).toBe('jerusalem');
    expect(normalize("Alexander's")).toBe('alexanders');
    expect(normalize('  A-B  c ')).toBe('a b c');
  });

  it('removes Arabic vowel marks and folds letter variants', () => {
    expect(normalize('القُدس')).toBe(normalize('القدس'));
    expect(normalize('أحمد')).toBe(normalize('احمد'));
    expect(normalize('مدينة')).toBe(normalize('مدينه'));
    expect(normalize('فلسطين')).toBe('فلسطين');
  });

  it('removes Hebrew vowel points and folds final letters', () => {
    expect(normalize('יְרוּשָׁלַיִם')).toBe(normalize('ירושלים'));
    expect(normalize('עזה')).toBe('עזה');
  });

  it('tokenizes on non-letters', () => {
    expect(tokenize('Tell es-Sultan (Ancient Jericho)')).toEqual(['tell', 'es', 'sultan', 'ancient', 'jericho']);
    expect(tokenize('')).toEqual([]);
  });
});

describe('search', () => {
  it('finds by title, place, tag and summary words', () => {
    expect(ids('dome')).toEqual(['dome']);
    expect(ids('jaffa')).toEqual(['falastin']);
    expect(ids('umayyad')).toEqual(['dome']);
    expect(ids('caliph')).toEqual(['dome']);
  });

  it('matches word prefixes and requires every word', () => {
    expect(ids('jaf')).toEqual(['falastin']);
    expect(ids('dome rock')).toEqual(['dome']);
    expect(ids('dome gaza siege')).toEqual([]);
  });

  it('ignores case and accents in the query', () => {
    expect(ids('JAFFA')).toEqual(['falastin']);
    expect(ids('Jérusalem')).toEqual(['dome']);
  });

  it('finds Arabic names, with or without vowel marks, and does not index Hebrew names', () => {
    expect(ids('غزة')).toEqual(['gaza-siege']);
    expect(ids('القدس')).toEqual(['dome']);
    expect(ids('القُدس')).toEqual(['dome']);
    expect(ids('ירושלים')).toEqual([]);
    expect(ids('יפו')).toEqual([]);
  });

  it('finds historical place names', () => {
    expect(ids('aelia')).toEqual(['dome']);
  });

  it('ranks a title match above a summary mention', () => {
    expect(ids('gaza')).toEqual(['gaza-siege', 'dome']);
  });

  it('returns nothing for an empty query or no match', () => {
    expect(ids('')).toEqual([]);
    expect(ids('   ')).toEqual([]);
    expect(ids('zzzz')).toEqual([]);
  });

  it('forgives one typo in longer words, only when nothing matches exactly', () => {
    expect(ids('alexandr')).toEqual(['gaza-siege']); // prefix: exact pass
    expect(ids('alexnder')).toEqual(['gaza-siege']); // one letter missing
    expect(ids('macedonan')).toEqual(['gaza-siege']);
    expect(ids('gzaa')).toEqual([]); // short words get no tolerance
    expect(ids('nakba')).not.toContain('gaza-siege');
  });

  it('limits the number of results', () => {
    const many = Array.from({ length: 20 }, (_, i) => event({ id: `e-${i}`, title: `Common title ${i}`, dateStart: String(1900 + i) }));
    expect(search(buildIndex(many), 'common', 8)).toHaveLength(8);
  });
});
