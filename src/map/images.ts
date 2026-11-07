// Drawn map images, made on demand with canvas and re-drawn when the theme changes: the wave
// tile for the sea (water.ts), the hachure hill and mountain marks (relief.ts), and the town
// drawings and woodland tile (townIcons.ts). Everything
// is drawn here from scratch, in the palette's ink colours.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { luminance, mix } from './color.ts';
import type { Palette } from './style.ts';
import { BANNER_IMAGE, BANNER_STRETCH, NO_BANNER, PLATE_IMAGE, PLATE_STRETCH, bannerImage } from './banner.ts';
import { isInked } from './inked.ts';
import { LAND_PREFIX, landImage } from './landscape.ts';
import { drawInkedHill, drawInkedMountain } from './markInked.ts';
import { ARROW_IMAGE, TOWN_PREFIX, TREE_IMAGE, arrowImage, townImage, treeTile } from './townIcons.ts';
import { SHIP_IMAGE, shipImage } from './ships.ts';
import { WAVE_IMAGE, waveImage } from './water.ts';

export const MARK_PREFIX = 'look-mark-';
export const markId = (kind: 1 | 2, variant: number): string => `${MARK_PREFIX}${kind}-${variant}`;

interface Shape {
  peak: number;
  height: number;
  width: number;
}

const MOUNTAIN_SHAPES: readonly Shape[] = [
  { peak: 0.46, height: 21, width: 30 },
  { peak: 0.58, height: 18, width: 28 },
  { peak: 0.4, height: 23, width: 32 },
];

/** A mountain: a ridge line, a shoulder to the left, and hachure strokes down the shaded right slope. */
function drawMountain(g: CanvasRenderingContext2D, shape: Shape): void {
  const base = 25;
  const left = 2;
  const right = left + shape.width;
  const px = left + shape.width * shape.peak;
  const top = base - shape.height;
  g.beginPath();
  g.moveTo(left, base);
  g.lineTo(left + (px - left) * 0.45, base - shape.height * 0.62);
  g.lineTo(px - 2, top + 3);
  g.lineTo(px, top);
  g.lineTo(px + 2.5, top + 4);
  g.lineTo(px + (right - px) * 0.55, base - shape.height * 0.4);
  g.lineTo(right, base);
  g.stroke();
  // Hachure: short strokes from the right-hand ridge toward the foot, shorter toward the edge.
  const strokes = 6;
  for (let i = 1; i <= strokes; i += 1) {
    const t = i / (strokes + 1);
    const x = px + (right - px) * t;
    const ridgeY = top + (base - top) * Math.pow(t, 0.85) * 0.8;
    g.beginPath();
    g.moveTo(x - 1, ridgeY + 1);
    g.lineTo(x - 2.5, Math.min(base, ridgeY + (base - ridgeY) * (0.85 - t * 0.35)));
    g.stroke();
  }
  // A few lighter strokes on the left face.
  g.globalAlpha = 0.6;
  for (let i = 1; i <= 3; i += 1) {
    const x = left + (px - left) * (0.3 + i * 0.16);
    g.beginPath();
    g.moveTo(x, base - shape.height * (0.35 + i * 0.12));
    g.lineTo(x - 1.5, base - shape.height * (0.12 + i * 0.05));
    g.stroke();
  }
  g.globalAlpha = 1;
}

/** A hill: a low rounded bump with three small ticks. */
function drawHill(g: CanvasRenderingContext2D, variant: number): void {
  const w = 22 + variant * 3;
  const left = (32 - w) / 2;
  const base = 24;
  const h = 8 + variant;
  g.beginPath();
  g.moveTo(left, base);
  g.quadraticCurveTo(left + w * 0.25, base - h * 1.6, left + w * 0.55, base - h);
  g.quadraticCurveTo(left + w * 0.8, base - h * 0.6, left + w, base);
  g.stroke();
  for (let i = 0; i < 3; i += 1) {
    const x = left + w * (0.5 + i * 0.13);
    g.beginPath();
    g.moveTo(x, base - h * (0.85 - i * 0.2));
    g.lineTo(x - 1.5, base - h * (0.25 - i * 0.05));
    g.stroke();
  }
}

export function markImage(kind: 1 | 2, variant: number, color: string): ImageData {
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = 34 * scale;
  canvas.height = 28 * scale;
  const g = canvas.getContext('2d');
  if (!g) return new ImageData(1, 1);
  g.scale(scale, scale);
  g.strokeStyle = color;
  g.lineWidth = 1.2;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  if (isInked()) {
    if (kind === 2) drawInkedMountain(g, variant % 3);
    else drawInkedHill(g, variant % 3);
  } else if (kind === 2) drawMountain(g, MOUNTAIN_SHAPES[variant % 3] ?? { peak: 0.5, height: 20, width: 30 });
  else drawHill(g, variant % 3);
  return g.getImageData(0, 0, canvas.width, canvas.height);
}

function draw(id: string, p: Palette): ImageData | null {
  const seaInk = p.seaInk;
  const ink = markInk(p);
  if (id === BANNER_IMAGE || id === NO_BANNER || id === PLATE_IMAGE) return bannerImage(id, p);
  if (id.startsWith(LAND_PREFIX)) return landImage(id, ink);
  if (id === WAVE_IMAGE) return waveImage(seaInk);
  if (id === TREE_IMAGE) return treeTile(ink);
  if (id === ARROW_IMAGE) return arrowImage(ink);
  if (id === SHIP_IMAGE) return shipImage(seaInk);
  if (id.startsWith(TOWN_PREFIX)) return townImage(id, ink);
  if (id.startsWith(MARK_PREFIX)) {
    const [kind, variant] = id.slice(MARK_PREFIX.length).split('-').map(Number);
    if (kind === 1 || kind === 2) return markImage(kind, variant ?? 0, ink);
  }
  return null;
}

/** Mark ink: the palette's ink, eased toward the paper so marks stay quiet, especially on the dark night chart. */
function markInk(p: Palette): string {
  return mix(p.ink, p.paper2, luminance(p.paper) < 0.5 ? 0.5 : 0.1);
}

/** Supplies each drawn image when the style first asks for it, and re-draws them all for a new theme. */
export function setupLookImages(
  map: MapLibreMap,
  palette: () => Palette,
): { restyle(): void } {
  const added = new Set<string>();
  map.setMissingStyleImageResolver((id) => {
    const image = draw(id, palette());
    if (image && !map.hasImage(id)) {
      const triple = id === TREE_IMAGE || id === ARROW_IMAGE || id === SHIP_IMAGE || id.startsWith(TOWN_PREFIX) || id.startsWith(LAND_PREFIX);
      if (id === BANNER_IMAGE) map.addImage(id, image, { pixelRatio: 3, ...BANNER_STRETCH });
      else if (id === PLATE_IMAGE) map.addImage(id, image, { pixelRatio: 3, ...PLATE_STRETCH });
      else map.addImage(id, image, { pixelRatio: id === NO_BANNER ? 1 : triple ? 3 : 2 });
      added.add(id);
    }
  });
  return {
    restyle(): void {
      const p = palette();
      for (const id of added) {
        const image = draw(id, p);
        if (image && map.hasImage(id)) map.updateImage(id, image);
      }
    },
  };
}
