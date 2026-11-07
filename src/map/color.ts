// Tiny colour helpers for building tints from the CSS palette tokens (which are hex strings).

type Rgb = readonly [number, number, number];

export function parseColor(value: string): Rgb {
  const hex = value.trim().replace('#', '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const n = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return [128, 128, 128];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toHex([r, g, b]: Rgb): string {
  const channel = (v: number): string => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Blends `a` toward `b`: t = 0 gives `a`, t = 1 gives `b`. */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseColor(a);
  const [br, bg, bb] = parseColor(b);
  return toHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}

/** Perceived brightness, 0 (black) to 1 (white). */
export function luminance(value: string): number {
  const [r, g, b] = parseColor(value);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** `rgba()` string for a hex colour at the given opacity. */
export function withAlpha(value: string, alpha: number): string {
  const [r, g, b] = parseColor(value);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}
