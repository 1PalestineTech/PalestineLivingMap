import { describe, expect, it } from 'vitest';
import { parseStories } from './loadStories.ts';
import type { HistoricalEvent } from './types.ts';

const events = [{ id: 'a' }, { id: 'b' }] as unknown as HistoricalEvent[];

const story = (steps: unknown[]): unknown => ({
  version: 1,
  stories: [{ id: 's', title: 'T', intro: 'I', placeholder: true, steps }],
});

describe('parseStories', () => {
  it('keeps valid stories and steps', () => {
    const [s] = parseStories(story([{ eventId: 'a', caption: 'x', cameraZoom: 8 }, { eventId: 'b', caption: 'y' }]), events);
    expect(s?.steps).toHaveLength(2);
    expect(s?.steps[0]?.cameraZoom).toBe(8);
    expect(s?.placeholder).toBe(true);
  });

  it('drops steps with unknown events and stories left with none', () => {
    expect(parseStories(story([{ eventId: 'a', caption: 'x' }, { eventId: 'zzz', caption: 'y' }]), events)[0]?.steps).toHaveLength(1);
    expect(parseStories(story([{ eventId: 'zzz', caption: 'y' }]), events)).toEqual([]);
  });

  it('ignores out-of-range zoom and junk input', () => {
    expect(parseStories(story([{ eventId: 'a', caption: 'x', cameraZoom: 99 }]), events)[0]?.steps[0]?.cameraZoom).toBeUndefined();
    expect(parseStories(null, events)).toEqual([]);
    expect(parseStories({ version: 2, stories: [] }, events)).toEqual([]);
  });
});
