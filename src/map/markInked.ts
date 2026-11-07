// Mountain and hill marks for the inked look: a jagged ridge with several peaks, a heavy outline, and
// dense hatching on the shaded slopes with cross-hatching at the foot, like an engraved range.
// Drawn from scratch with canvas; three variants per kind.

type Ctx = CanvasRenderingContext2D;

interface Peaks {
  /** [x, y] of each peak, left to right, in a 34 x 28 box (y grows downward). */
  tops: readonly (readonly [number, number])[];
}

const RANGES: readonly Peaks[] = [
  { tops: [[8, 12], [15, 5], [22, 11], [28, 8]] },
  { tops: [[7, 14], [13, 8], [19, 3], [26, 10]] },
  { tops: [[9, 10], [16, 4], [20, 9], [27, 6]] },
];

const BASE = 25;

function hatch(g: Ctx, x0: number, y0: number, x1: number, y1: number, count: number): void {
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1);
    const x = x0 + (x1 - x0) * t;
    g.beginPath();
    g.moveTo(x, y0 + (y1 - y0) * t * 0.35);
    g.lineTo(x - 1.4 - t, Math.min(BASE, y1 - 1 + t * 4));
    g.stroke();
  }
}

/** An engraved range of several peaks, with a shaded right face under each. */
export function drawInkedMountain(g: Ctx, variant: number): void {
  const peaks = RANGES[variant % RANGES.length]?.tops ?? RANGES[0]?.tops ?? [];
  g.lineWidth = 1.5;
  g.beginPath();
  g.moveTo(2, BASE);
  const first = peaks[0];
  if (first) g.lineTo(first[0] - 5, first[1] + 5);
  for (const [x, y] of peaks) {
    g.lineTo(x - 1.5, y + 2);
    g.lineTo(x, y);
    g.lineTo(x + 1.6, y + 2.5);
    g.lineTo(x + 3.5, y + 6);
  }
  g.lineTo(32, BASE);
  g.stroke();
  g.lineWidth = 0.9;
  for (const [x, y] of peaks) {
    hatch(g, x + 1.2, y + 2, x + 6, y + 8, 5);
    // A few strokes on the lit left face.
    g.globalAlpha = 0.55;
    hatch(g, x - 4, y + 5, x - 1, y + 8, 2);
    g.globalAlpha = 1;
  }
  // Cross-hatching along the foot.
  g.lineWidth = 0.7;
  for (let x = 4; x < 31; x += 2.6) {
    g.beginPath();
    g.moveTo(x, BASE);
    g.lineTo(x + 2.2, BASE - 3);
    g.stroke();
  }
}

/** A low hill: a rounded outline with short hatching. */
export function drawInkedHill(g: Ctx, variant: number): void {
  const w = 24 + variant * 2;
  const left = (34 - w) / 2;
  const h = 9 + variant;
  g.lineWidth = 1.3;
  g.beginPath();
  g.moveTo(left, BASE);
  g.quadraticCurveTo(left + w * 0.3, BASE - h * 1.7, left + w * 0.55, BASE - h);
  g.quadraticCurveTo(left + w * 0.82, BASE - h * 0.6, left + w, BASE);
  g.stroke();
  g.lineWidth = 0.8;
  hatch(g, left + w * 0.55, BASE - h + 1, left + w * 0.9, BASE - 2, 6);
}
