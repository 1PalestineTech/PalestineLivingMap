import { describe, expect, it } from 'vitest';
import { layerActiveInYear, parseLayers } from './loadLayers.ts';

const base = {
  id: 'a',
  name: 'A',
  description: 'd',
  validFrom: 1900,
  validTo: 1960,
  source: { title: 's', url: 'https://example.org' },
  license: 'l',
  file: 'a.geojson',
};

describe('layerActiveInYear', () => {
  it('includes both ends of the range', () => {
    expect(layerActiveInYear({ validFrom: 1900, validTo: 1960 }, 1900)).toBe(true);
    expect(layerActiveInYear({ validFrom: 1900, validTo: 1960 }, 1960)).toBe(true);
    expect(layerActiveInYear({ validFrom: 1900, validTo: 1960 }, 1899)).toBe(false);
    expect(layerActiveInYear({ validFrom: 1900, validTo: 1960 }, 1961)).toBe(false);
  });

  it('treats a null validTo as the present', () => {
    expect(layerActiveInYear({ validFrom: 1900, validTo: null }, 2026)).toBe(true);
  });

  it('handles BCE ranges', () => {
    const range = { validFrom: -500, validTo: -300 };
    expect(layerActiveInYear(range, -400)).toBe(true);
    expect(layerActiveInYear(range, -299)).toBe(false);
    expect(layerActiveInYear({ validFrom: -10, validTo: 10 }, 1)).toBe(true);
  });
});

describe('parseLayers', () => {
  it('keeps valid layers and drops broken or duplicate ones', () => {
    const data = {
      version: 1,
      layers: [base, { ...base }, { ...base, id: 'b', validFrom: 1960, validTo: 1900 }, { ...base, id: 'c', file: '' }],
    };
    expect(parseLayers(data).map((l) => l.id)).toEqual(['a']);
  });

  it('turns an unusable source url into null and keeps the placeholder flag', () => {
    const [layer] = parseLayers({ version: 1, layers: [{ ...base, placeholder: true, source: { title: 's', url: 'javascript:x' } }] });
    expect(layer?.source.url).toBeNull();
    expect(layer?.placeholder).toBe(true);
  });

  it('ignores junk input', () => {
    expect(parseLayers(null)).toEqual([]);
    expect(parseLayers({ version: 2, layers: [] })).toEqual([]);
  });
});
