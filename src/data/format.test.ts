import { describe, expect, it } from 'vitest';
import { formatEventDate, formatYear } from './format.ts';
import type { HistoricalEvent } from './types.ts';

describe('formatYear', () => {
  it('formats CE years plainly or with the CE suffix', () => {
    expect(formatYear(1917)).toBe('1917');
    expect(formatYear(1917, true)).toBe('1917 CE');
    expect(formatYear(1, true)).toBe('1 CE');
  });

  it('formats BCE years from negative numbers', () => {
    expect(formatYear(-332)).toBe('332 BCE');
    expect(formatYear(-332, true)).toBe('332 BCE');
    expect(formatYear(-3200)).toBe('3200 BCE');
    expect(formatYear(-1)).toBe('1 BCE');
  });
});

function event(overrides: Partial<HistoricalEvent>): HistoricalEvent {
  return {
    id: 'x',
    title: 'X',
    dateStart: '1948-05-15',
    dateEnd: null,
    datePrecision: 'day',
    location: { name: 'X', nameAr: null, nameHe: null, lat: 31.5, lng: 35, precision: 'area' },
    category: 'political',
    era: '1948-1967',
    summary: 'x',
    sources: [{ title: 't', url: 'https://example.org', publisher: 'p', accessedDate: '2026-11-03' }],
    status: 'needs-review',
    tags: [],
    ...overrides,
  };
}

describe('formatEventDate', () => {
  it('respects the date precision', () => {
    expect(formatEventDate(event({}))).toBe('15 May 1948');
    expect(formatEventDate(event({ dateStart: '1911-01', datePrecision: 'month' }))).toBe('January 1911');
    expect(formatEventDate(event({ dateStart: '1917', datePrecision: 'year' }))).toBe('1917');
    expect(formatEventDate(event({ dateStart: '1920', datePrecision: 'decade' }))).toBe('1920s');
    expect(formatEventDate(event({ dateStart: '1800', datePrecision: 'century' }))).toBe('19th century');
  });

  it('handles BCE dates and circa', () => {
    expect(formatEventDate(event({ dateStart: '-332-10', datePrecision: 'month' }))).toBe('October 332 BCE');
    expect(formatEventDate(event({ dateStart: '-1300', datePrecision: 'century' }))).toBe('13th century BCE');
    expect(formatEventDate(event({ dateStart: '691', datePrecision: 'year', circa: true }))).toBe('c. 691');
  });

  it('formats ranges and ongoing events', () => {
    expect(formatEventDate(event({ dateStart: '691', dateEnd: '692', datePrecision: 'year' }))).toBe('691 - 692');
    expect(formatEventDate(event({ dateStart: '2023-10-07', ongoing: true }))).toBe('7 October 2023 - present (ongoing)');
  });
});
