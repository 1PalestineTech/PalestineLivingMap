import { describe, expect, it } from 'vitest';
import { safeHttpUrl, safeImageSrc } from './dom.ts';

describe('safeHttpUrl', () => {
  it('allows http and https', () => {
    expect(safeHttpUrl('https://example.org/a?b=1')).toBe('https://example.org/a?b=1');
    expect(safeHttpUrl('http://example.org')).toBe('http://example.org/');
  });

  it('blocks script and data URLs and junk', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(safeHttpUrl('data:text/html,<b>x</b>')).toBeNull();
    expect(safeHttpUrl('//example.org')).toBeNull();
    expect(safeHttpUrl('not a url')).toBeNull();
    expect(safeHttpUrl('')).toBeNull();
  });
});

describe('safeImageSrc', () => {
  const base = 'https://site.test/app/';

  it('resolves relative paths and allows http(s)', () => {
    expect(safeImageSrc('images/a.jpg', base)).toBe('https://site.test/app/images/a.jpg');
    expect(safeImageSrc('https://upload.example.org/a.jpg', base)).toBe('https://upload.example.org/a.jpg');
  });

  it('blocks other schemes', () => {
    expect(safeImageSrc('javascript:alert(1)', base)).toBeNull();
    expect(safeImageSrc('data:image/svg+xml,<svg/>', base)).toBeNull();
  });
});
