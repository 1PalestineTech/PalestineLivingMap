// The scroll banner behind city names: a parchment ribbon with folded, notched tails, drawn from
// scratch. It is a stretchable image (a 9-slice), so MapLibre sizes it to fit each name.

import { mix } from './color.ts';
import type { Palette } from './style.ts';

export const BANNER_IMAGE = 'look-banner';
/** A transparent stand-in for places that get no banner. */
export const NO_BANNER = 'look-banner-none';
/** The square name plate used by the inked look. */
export const PLATE_IMAGE = 'look-plate';

const W = 100;
const H = 44;
const SCALE = 3;

/** Stretch regions and the text area, in image pixels at pixelRatio 3. */
export const PLATE_STRETCH = {
  stretchX: [[8 * SCALE, 52 * SCALE]] as [number, number][],
  stretchY: [[8 * SCALE, 24 * SCALE]] as [number, number][],
  content: [8 * SCALE, 8 * SCALE, 52 * SCALE, 24 * SCALE] as [number, number, number, number],
};

export const BANNER_STRETCH = {
  stretchX: [[18 * SCALE, 82 * SCALE]] as [number, number][],
  stretchY: [[12 * SCALE, 30 * SCALE]] as [number, number][],
  content: [18 * SCALE, 9 * SCALE, 82 * SCALE, 33 * SCALE] as [number, number, number, number],
};

/** A tan plate with a double ink outline and small corner studs, like the city plates of printed fantasy maps. */
function plateImage(p: Palette): ImageData | null {
  const w = 60;
  const h = 32;
  const el = document.createElement('canvas');
  el.width = w * SCALE;
  el.height = h * SCALE;
  const g = el.getContext('2d');
  if (!g) return null;
  g.scale(SCALE, SCALE);
  g.lineJoin = 'miter';
  g.fillStyle = mix(p.paper, p.landMid, 0.45);
  g.fillRect(2, 2, w - 4, h - 4);
  g.strokeStyle = p.ink;
  g.lineWidth = 1.6;
  g.strokeRect(2, 2, w - 4, h - 4);
  g.lineWidth = 0.8;
  g.strokeRect(5, 5, w - 10, h - 10);
  g.fillStyle = p.ink;
  for (const [x, y] of [[3.5, 3.5], [w - 3.5, 3.5], [3.5, h - 3.5], [w - 3.5, h - 3.5]] as const) g.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
  return g.getImageData(0, 0, w * SCALE, h * SCALE);
}

export function bannerImage(id: string, p: Palette): ImageData | null {
  if (id === NO_BANNER) return new ImageData(1, 1);
  if (id === PLATE_IMAGE) return plateImage(p);
  if (id !== BANNER_IMAGE) return null;
  const el = document.createElement('canvas');
  el.width = W * SCALE;
  el.height = H * SCALE;
  const g = el.getContext('2d');
  if (!g) return null;
  g.scale(SCALE, SCALE);
  g.lineJoin = 'round';
  g.lineWidth = 1.3;
  g.strokeStyle = p.ink;
  const body = p.paper;
  const shade = mix(p.paper2, p.ink, 0.18);

  // Tails behind the ribbon, lower and notched, with a darker fold where they tuck in.
  const tail = (x0: number, x1: number, notch: number): void => {
    g.fillStyle = shade;
    g.beginPath();
    g.moveTo(x0, 15);
    g.lineTo(x1, 15);
    g.lineTo(x1, 37);
    g.lineTo(x0, 37);
    g.lineTo(x0 + notch, 26);
    g.closePath();
    g.fill();
    g.stroke();
  };
  tail(2, 20, 5);
  tail(98, 80, -5);

  // The ribbon: a stretchable middle (x 18-82) with a slightly curved top and bottom edge.
  g.fillStyle = body;
  g.beginPath();
  g.moveTo(18, 9);
  g.quadraticCurveTo(50, 6, 82, 9);
  g.lineTo(82, 33);
  g.quadraticCurveTo(50, 36, 18, 33);
  g.closePath();
  g.fill();
  g.stroke();

  // Folds: small triangles where the ribbon turns back over each tail.
  g.fillStyle = mix(shade, p.ink, 0.25);
  for (const [x, dir] of [[18, 1], [82, -1]] as const) {
    g.beginPath();
    g.moveTo(x, 33);
    g.lineTo(x + dir * 4, 37);
    g.lineTo(x, 37);
    g.closePath();
    g.fill();
    g.stroke();
  }
  return g.getImageData(0, 0, W * SCALE, H * SCALE);
}
