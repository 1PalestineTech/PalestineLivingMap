// Category marker icons, drawn on a canvas so shape and color both encode the category
// (docs/SPEC.md section 5). Re-registered when the theme changes, because the 2px halo
// follows the theme: the lighter of paper and ink, so dark fills stay visible on a dark map.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { CATEGORIES } from '../data/categories.ts';
import type { MarkerShape } from '../data/categories.ts';
import { chevronPoints, shapeOutline } from '../data/shapes.ts';

/** On-screen size in CSS px. The canvas is drawn at 2x for sharp edges. */
export const MARKER_SIZE = 20;
const PIXEL_RATIO = 2;
const OUTLINE = 2;

export const markerImageId = (category: string): string => `marker-${category}`;

function shapePath(ctx: CanvasRenderingContext2D, shape: MarkerShape, c: number, r: number): void {
  const outline = shapeOutline(shape, c, r);
  ctx.beginPath();
  if (outline.kind === 'circle') {
    ctx.arc(outline.cx, outline.cy, outline.r, 0, Math.PI * 2);
    return;
  }
  outline.points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
}

function drawMarker(shape: MarkerShape, color: string, halo: string): HTMLCanvasElement {
  const px = MARKER_SIZE * PIXEL_RATIO;
  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas is not available');

  const c = px / 2;
  const outline = OUTLINE * PIXEL_RATIO;
  const r = c - outline - 1;
  ctx.lineJoin = 'round';

  shapePath(ctx, shape, c, r);
  ctx.lineWidth = outline * 2; // centered stroke: half of it shows outside the fill
  ctx.strokeStyle = halo;
  ctx.stroke();

  if (shape === 'ring-chevron') {
    // Hollow ring with an outward-pointing chevron: displacement.
    ctx.fillStyle = halo;
    ctx.fill();
    ctx.lineWidth = 2.5 * PIXEL_RATIO;
    ctx.strokeStyle = color;
    ctx.stroke();
    const [a, b, d] = chevronPoints(c, r);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(d[0], d[1]);
    ctx.lineCap = 'round';
    ctx.stroke();
  } else {
    ctx.fillStyle = color;
    ctx.fill();
  }
  return canvas;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

/** The lighter of two theme colors: paper in the light theme, ink in the dark theme. */
export function markerHalo(paper: string, ink: string): string {
  return luminance(ink) > luminance(paper) ? ink : paper;
}

/** Adds (or updates) one icon per category. Safe to call again after a theme change. */
export function registerMarkerImages(map: MapLibreMap, halo: string): void {
  for (const category of CATEGORIES) {
    const canvas = drawMarker(category.shape, category.color, halo);
    const data = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
    if (!data) continue;
    const id = markerImageId(category.id);
    if (map.hasImage(id)) map.updateImage(id, data);
    else map.addImage(id, data, { pixelRatio: PIXEL_RATIO });
  }
}
