import { describe, expect, it } from 'vitest';
import { createPacing } from './playback.ts';

describe('createPacing', () => {
  it('runs at normal speed when there are no events', () => {
    const pacing = createPacing([]);
    expect(pacing.at(0.5)).toBe(1);
    expect(pacing.average).toBeCloseTo(1, 10);
  });

  it('is slowest at an event and faster far from it', () => {
    const pacing = createPacing([0.5]);
    expect(pacing.at(0.5)).toBeLessThan(0.5);
    expect(pacing.at(0.1)).toBeGreaterThan(2);
    expect(pacing.at(0.5)).toBeLessThan(pacing.at(0.505));
    expect(pacing.at(0.505)).toBeLessThan(pacing.at(0.6));
  });

  it('slows down on approach from either side', () => {
    const pacing = createPacing([0.5]);
    expect(pacing.at(0.49)).toBeCloseTo(pacing.at(0.51), 6);
  });

  it('reports an average between the slowest and fastest speed', () => {
    const pacing = createPacing([0.2, 0.5, 0.8]);
    expect(pacing.average).toBeGreaterThan(0.35);
    expect(pacing.average).toBeLessThan(2.4);
  });
});
