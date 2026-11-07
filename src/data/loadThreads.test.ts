import { describe, expect, it } from 'vitest';
import { parseThreads } from './loadThreads.ts';
import type { HistoricalEvent } from './types.ts';

const events = ['a', 'b', 'c', 'd'].map((id) => ({ id }) as HistoricalEvent);
const thread = (extra: object = {}): object => ({
  id: 't',
  kind: 'person',
  title: 'T',
  intro: 'Intro.',
  eventIds: ['a', 'b', 'c'],
  pathIds: [],
  placeIds: [],
  status: 'needs-review',
  ...extra,
});
const file = (...threads: object[]): unknown => ({ version: 1, threads });

describe('parseThreads', () => {
  it('accepts a thread with three known events', () => {
    expect(parseThreads(file(thread()), events)).toHaveLength(1);
  });
  it('drops unknown events, and a thread left with fewer than three', () => {
    expect(parseThreads(file(thread({ eventIds: ['a', 'b', 'zzz', 'c'] })), events)[0]?.eventIds).toEqual(['a', 'b', 'c']);
    expect(parseThreads(file(thread({ eventIds: ['a', 'b', 'zzz'] })), events)).toHaveLength(0);
  });
  it('drops bad kinds and duplicate ids, and ignores the wrong version', () => {
    expect(parseThreads(file(thread({ kind: 'mood' })), events)).toHaveLength(0);
    expect(parseThreads(file(thread(), thread()), events)).toHaveLength(1);
    expect(parseThreads({ version: 2, threads: [thread()] }, events)).toEqual([]);
  });
});
