// Tiny ink drawings for the map: a walled town, a few houses, two cottages and a watch-tower for
// places of different kinds (drawn inline before a label's name, labels/layer.ts), and a small
// tree-cluster tile for woodland. All original, drawn here with canvas in the palette's ink.

import type { PlaceKind } from '../data/placeTypes.ts';

export const TOWN_PREFIX = 'look-town-';
/** The drawing for places in the Settlements section: a fenced compound with flat roofs and a water tower. */
export const SETTLEMENT_ICON = `${TOWN_PREFIX}settlement`;
export const TREE_IMAGE = 'look-trees';

/** The drawing for each kind of place; kinds with no entry (region, water, mountain) get no icon. */
export const TOWN_ICON: Partial<Record<PlaceKind, string>> = {
  city: `${TOWN_PREFIX}city`,
  town: `${TOWN_PREFIX}town`,
  village: `${TOWN_PREFIX}village`,
  site: `${TOWN_PREFIX}site`,
};

const SIZE = 24;
const SCALE = 3;

type Ctx = CanvasRenderingContext2D;

function line(g: Ctx, points: readonly (readonly [number, number])[], close = false): void {
  g.beginPath();
  points.forEach(([x, y], i) => (i === 0 ? g.moveTo(x, y) : g.lineTo(x, y)));
  if (close) g.closePath();
  g.stroke();
}

function roof(g: Ctx, left: number, right: number, base: number, apex: number): void {
  g.beginPath();
  g.moveTo(left - 0.6, base);
  g.lineTo((left + right) / 2, apex);
  g.lineTo(right + 0.6, base);
  g.closePath();
  g.fill();
  g.stroke();
}

function house(g: Ctx, left: number, right: number, top: number, roofTop: number): void {
  g.strokeRect(left, top, right - left, 21 - top);
  roof(g, left, right, top, roofTop);
  const mid = (left + right) / 2;
  line(g, [[mid, 21], [mid, 21 - Math.min(4, (21 - top) / 2)]]);
}

function drawCity(g: Ctx): void {
  line(g, [[1.5, 21], [22.5, 21]]);
  g.strokeRect(3, 13, 18, 8);
  for (let x = 3.5; x < 20; x += 3.6) g.strokeRect(x, 11.2, 1.8, 1.8);
  g.strokeRect(3, 8, 5, 13);
  roof(g, 3, 8, 8, 2.5);
  g.strokeRect(16, 8, 5, 13);
  roof(g, 16, 21, 8, 2.5);
  g.strokeRect(9.5, 6, 5, 15);
  roof(g, 9.5, 14.5, 6, 0.8);
  g.beginPath();
  g.arc(12, 21, 2, Math.PI, 0);
  g.stroke();
}

function drawTown(g: Ctx): void {
  line(g, [[1.5, 21], [22.5, 21]]);
  house(g, 2, 9, 14, 8);
  house(g, 9, 16, 11.5, 4.5);
  house(g, 16, 22, 15, 10);
}

function drawVillage(g: Ctx): void {
  line(g, [[2, 21], [22, 21]]);
  house(g, 3, 11, 15, 9);
  house(g, 12.5, 20.5, 14, 7.5);
}

function drawSite(g: Ctx): void {
  line(g, [[3, 21], [21, 21]]);
  g.strokeRect(9, 9, 6, 12);
  for (let x = 9.2; x < 14.5; x += 2.4) g.strokeRect(x, 7.2, 1.6, 1.8);
  line(g, [[12, 7.2], [12, 1.5]]);
  g.beginPath();
  g.moveTo(12, 1.5);
  g.lineTo(17, 3);
  g.lineTo(12, 4.5);
  g.closePath();
  g.fill();
  g.beginPath();
  g.arc(12, 21, 1.6, Math.PI, 0);
  g.stroke();
}

function drawSettlement(g: Ctx): void {
  line(g, [[1.5, 21], [22.5, 21]]);
  // Fence posts and rails.
  line(g, [[2, 17], [22, 17]]);
  for (let x = 3; x <= 21; x += 3.6) line(g, [[x, 21], [x, 15.5]]);
  // Flat-roofed blocks.
  g.strokeRect(4, 11, 7, 6);
  g.strokeRect(13, 9, 6, 8);
  line(g, [[5.5, 13.5], [9.5, 13.5]]);
  // A water tower on legs.
  g.strokeRect(10.5, 3, 4, 3.2);
  line(g, [[11, 6.2], [10, 11]]);
  line(g, [[14, 6.2], [15, 9]]);
}

const DRAW: Record<string, (g: Ctx) => void> = {
  [`${TOWN_PREFIX}settlement`]: drawSettlement,
  [`${TOWN_PREFIX}city`]: drawCity,
  [`${TOWN_PREFIX}town`]: drawTown,
  [`${TOWN_PREFIX}village`]: drawVillage,
  [`${TOWN_PREFIX}site`]: drawSite,
};

function canvas(width: number, height: number): { g: Ctx; el: HTMLCanvasElement } | null {
  const el = document.createElement('canvas');
  el.width = width * SCALE;
  el.height = height * SCALE;
  const g = el.getContext('2d');
  if (!g) return null;
  g.scale(SCALE, SCALE);
  g.lineWidth = 1.1;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  return { g, el };
}

/** A town drawing in `color`, or null if `id` is not one. Roofs are filled with `color` at partial strength. */
export function townImage(id: string, color: string): ImageData | null {
  const drawing = DRAW[id];
  const surface = drawing ? canvas(SIZE, SIZE) : null;
  if (!drawing || !surface) return null;
  surface.g.strokeStyle = color;
  surface.g.fillStyle = color;
  drawing(surface.g);
  return surface.g.getImageData(0, 0, SIZE * SCALE, SIZE * SCALE);
}

/** One tree: a bushy, scalloped crown, lightly filled, on a short trunk, so it reads as foliage and not as a map pin. */
function tree(g: Ctx, x: number, y: number, r: number): void {
  const cy = y - r * 0.9;
  const bumps = 7;
  g.beginPath();
  for (let i = 0; i < bumps; i += 1) {
    const a0 = (i / bumps) * Math.PI * 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2;
    const mid = (a0 + a1) / 2;
    g.lineTo(x + Math.cos(a0) * r * 0.92, cy + Math.sin(a0) * r * 0.8);
    g.quadraticCurveTo(x + Math.cos(mid) * r * 1.5, cy + Math.sin(mid) * r * 1.35, x + Math.cos(a1) * r * 0.92, cy + Math.sin(a1) * r * 0.8);
  }
  g.closePath();
  const alpha = g.globalAlpha;
  g.globalAlpha = alpha * 0.22;
  g.fill();
  g.globalAlpha = alpha;
  g.stroke();
  line(g, [[x, y - 0.4], [x, y + 1.6]]);
}

/** A group of three trees growing together. */
function grove(g: Ctx, x: number, y: number, scale: number): void {
  tree(g, x - 4.2 * scale, y + 1.2 * scale, 3.2 * scale);
  tree(g, x + 4 * scale, y + 0.4 * scale, 3.5 * scale);
  tree(g, x, y - 3 * scale, 3.6 * scale);
}

/** A repeating tile of small tree groves for woodland. The spacing is uneven so the repeat is hard to spot. */
export function treeTile(color: string): ImageData {
  const size = 56;
  const surface = canvas(size, size);
  if (!surface) return new ImageData(1, 1);
  surface.g.strokeStyle = color;
  surface.g.fillStyle = color;
  surface.g.lineWidth = 0.9;
  grove(surface.g, 14, 18, 1);
  grove(surface.g, 41, 12, 0.8);
  grove(surface.g, 30, 41, 1.1);
  grove(surface.g, 8, 47, 0.75);
  return surface.g.getImageData(0, 0, size * SCALE, size * SCALE);
}

export const ARROW_IMAGE = 'look-arrow';

/** A small chevron pointing right, placed along path lines (it turns with the line). */
export function arrowImage(color: string): ImageData {
  const size = 12;
  const surface = canvas(size, size);
  if (!surface) return new ImageData(1, 1);
  surface.g.strokeStyle = color;
  surface.g.lineWidth = 1.8;
  line(surface.g, [[3, 2], [9, 6], [3, 10]]);
  return surface.g.getImageData(0, 0, size * SCALE, size * SCALE);
}
