import { describe, expect, it } from 'vitest';
import { luminance, mix, parseColor, withAlpha } from './color.ts';

describe('color helpers', () => {
  it('parses long and short hex', () => {
    expect(parseColor('#f4ecdc')).toEqual([244, 236, 220]);
    expect(parseColor('#fff')).toEqual([255, 255, 255]);
  });

  it('mixes between two colors', () => {
    expect(mix('#000000', '#ffffff', 0)).toBe('#000000');
    expect(mix('#000000', '#ffffff', 1)).toBe('#ffffff');
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  it('tells light from dark', () => {
    expect(luminance('#f4ecdc')).toBeGreaterThan(0.5);
    expect(luminance('#1c1a17')).toBeLessThan(0.5);
  });

  it('writes rgba strings', () => {
    expect(withAlpha('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.500)');
  });
});
