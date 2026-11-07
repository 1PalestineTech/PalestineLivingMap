import { describe, expect, it } from 'vitest';
import type { HistoricalEvent } from './data/types.ts';
import { CATEGORY_IDS } from './data/categories.ts';
import {
  buildHash,
  catsValue,
  layersValue,
  parseHash,
  readCats,
  readEvent,
  readLayerIds,
  readPlace,
  readStory,
  readYear,
} from './urlHash.ts';

describe('parseHash', () => {
  it('reads key=value pairs with or without the leading #', () => {
    expect([...parseHash('#year=1948&event=balfour')]).toEqual([
      ['year', '1948'],
      ['event', 'balfour'],
    ]);
    expect(parseHash('year=1948').get('year')).toBe('1948');
  });

  it('copes with empty and odd hashes', () => {
    expect(parseHash('').size).toBe(0);
    expect(parseHash('#').size).toBe(0);
    expect(parseHash('#flag').get('flag')).toBe('');
  });
});

describe('buildHash', () => {
  it('sets a key and keeps the others', () => {
    expect(buildHash('#event=x&year=1900', { year: '1948' })).toBe('#event=x&year=1948');
    expect(buildHash('', { year: '-332' })).toBe('#year=-332');
  });

  it('keeps commas readable in list values', () => {
    expect(buildHash('', { cats: 'political,cultural' })).toBe('#cats=political,cultural');
  });

  it('removes keys set to null', () => {
    expect(buildHash('#year=1&event=x', { event: null })).toBe('#year=1');
    expect(buildHash('#year=1', { year: null })).toBe('');
  });
});

describe('readYear', () => {
  it('reads CE and BCE years', () => {
    expect(readYear('#year=1948', -3200, 2026)).toBe(1948);
    expect(readYear('#year=-332', -3200, 2026)).toBe(-332);
  });

  it('clamps to the range', () => {
    expect(readYear('#year=9999', -3200, 2026)).toBe(2026);
    expect(readYear('#year=-9999', -3200, 2026)).toBe(-3200);
  });

  it('rejects missing, zero, and non-numeric years', () => {
    expect(readYear('', -3200, 2026)).toBeNull();
    expect(readYear('#year=0', -3200, 2026)).toBeNull();
    expect(readYear('#year=abc', -3200, 2026)).toBeNull();
    expect(readYear('#year=19.5', -3200, 2026)).toBeNull();
  });
});

describe('readEvent', () => {
  const events = [{ id: 'a-1' }, { id: 'b-2' }] as unknown as HistoricalEvent[];

  it('finds a known event and ignores unknown ones', () => {
    expect(readEvent('#event=b-2', events)?.id).toBe('b-2');
    expect(readEvent('#event=nope', events)).toBeNull();
    expect(readEvent('', events)).toBeNull();
  });
});

describe('readStory', () => {
  it('reads the story id and step', () => {
    expect(readStory('#story=intro&step=3')).toEqual({ id: 'intro', step: 3 });
  });

  it('defaults to the intro step and rejects bad steps', () => {
    expect(readStory('#story=intro')).toEqual({ id: 'intro', step: 0 });
    expect(readStory('#story=intro&step=-1')).toEqual({ id: 'intro', step: 0 });
    expect(readStory('#story=intro&step=x')).toEqual({ id: 'intro', step: 0 });
    expect(readStory('#year=1900')).toBeNull();
  });
});

describe('cats', () => {
  it('reads a list of categories in canonical order, ignoring unknown ids', () => {
    expect([...(readCats('#cats=cultural,political,bogus') ?? [])]).toEqual(['political', 'cultural']);
  });

  it('treats a missing key or no valid ids as the default (none), all as every category, and none as empty', () => {
    expect(readCats('#cats=all')?.size).toBe(CATEGORY_IDS.length);
    expect(readCats('')).toBeNull();
    expect(readCats('#cats=bogus')).toBeNull();
    expect(readCats('#cats=none')?.size).toBe(0);
  });

  it('writes all for every category, null for none (the default), and a list otherwise', () => {
    expect(catsValue(new Set(CATEGORY_IDS))).toBe('all');
    expect(catsValue(new Set())).toBeNull();
    expect(catsValue(new Set(['cultural', 'political']))).toBe('political,cultural');
  });
});

describe('layers', () => {
  it('reads valid layer ids and ignores junk', () => {
    expect([...readLayerIds('#layers=sample-shape,Bad Id,other-1')]).toEqual(['sample-shape', 'other-1']);
    expect(readLayerIds('').size).toBe(0);
  });

  it('writes a sorted list, or null when none are on', () => {
    expect(layersValue(new Set(['b', 'a']))).toBe('a,b');
    expect(layersValue(new Set())).toBeNull();
  });
});

describe('readPlace', () => {
  it('reads a well-formed place id and ignores anything else', () => {
    expect(readPlace('#year=100&place=jerusalem')).toBe('jerusalem');
    expect(readPlace('#place=bayt-jibrin')).toBe('bayt-jibrin');
    expect(readPlace('#place=Bad%20Id')).toBeNull();
    expect(readPlace('#year=100')).toBeNull();
  });
});
