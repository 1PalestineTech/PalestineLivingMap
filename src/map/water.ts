// Sea and coast: an inked coastline with ripple lines offset into the sea (the engraved-coast look
// of old maps), an optional dark coastal stain, and, in the strong style, rows of hand-inked wave
// strokes. The wave tile is drawn here from scratch; it is not copied from any other map.

import type { ExpressionSpecification, FilterSpecification, LayerSpecification, SourceSpecification } from 'maplibre-gl';
import { frameBounds } from '../data/frame.ts';
import { luminance, mix, withAlpha } from './color.ts';
import { strengthParams } from './look.ts';
import type { Palette } from './style.ts';

/** Sea fill: the palette's sea, darkened a little in the strong style. */
export function seaColor(p: Palette): string {
  const target = luminance(p.paper) < 0.5 ? '#000000' : p.ink2;
  return mix(p.sea, target, strengthParams().seaDarken);
}

export const WAVE_IMAGE = 'look-wave';
const WATER_SOURCE = 'openmaptiles';
const IDS = { waves: 'look-water-waves', ink: 'look-coast-ink' } as const;
export const SEA_MASK_SOURCE = 'sea-mask';
const STAIN_LAYER = 'look-coast-stain';
const rippleId = (n: number): string => `look-coast-ripple-${n}`;

/**
 * Ripple offsets (px into the sea) and opacities, nearest first. Offsets stay under about 8 px: the
 * basemap tiles only carry that much geometry past their edge, and a longer offset would draw seams.
 */
const RIPPLES: readonly { offset: number; opacity: number }[] = [
  { offset: 2.5, opacity: 0.35 },
  { offset: 5, opacity: 0.22 },
  { offset: 7.5, opacity: 0.12 },
];

/** A line layer on the water outline. Positive offsets run into the polygon, which is the sea. */
function waterLine(id: string, filter: FilterSpecification | undefined, paint: Record<string, unknown>): LayerSpecification {
  return {
    id,
    type: 'line',
    source: WATER_SOURCE,
    'source-layer': 'water',
    ...(filter ? { filter } : {}),
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint,
  } as LayerSpecification;
}

/** Local tiles of distance from the open sea's coast (scripts/build-sea-mask.ts). */
export function seaMaskSource(): SourceSpecification {
  const [[west, south], [east, north]] = frameBounds();
  return {
    type: 'raster-dem',
    tiles: [`${new URL('terrain-sea/', document.baseURI).href}{z}/{x}/{y}.png`],
    encoding: 'terrarium',
    tileSize: 256,
    minzoom: 5,
    maxzoom: 8,
    bounds: [west, south, east, north],
  };
}

/** Stain strength by coast distance: the tiles hold -(1 + 2 x km) metres, so -1 is the shore and -101 is 50 km out. */
function stainColor(p: Palette): ExpressionSpecification {
  const ink = (a: number): string => withAlpha(p.seaInk, a * strengthParams().stain);
  return [
    'interpolate', ['linear'], ['elevation'],
    -101, ink(0), -41, ink(0.1), -13, ink(0.3), -4, ink(0.55), -1.5, ink(0.7), -1, ink(0.7), 0, ink(0),
  ] as unknown as ExpressionSpecification;
}

export function waterLayers(filter: FilterSpecification | undefined, p: Palette): LayerSpecification[] {
  const look = strengthParams();
  const layers: LayerSpecification[] = [];

  if (look.waves) {
    layers.push({
      id: IDS.waves,
      type: 'fill',
      source: WATER_SOURCE,
      'source-layer': 'water',
      ...(filter ? { filter } : {}),
      paint: { 'fill-pattern': WAVE_IMAGE, 'fill-opacity': 0.85 },
    } as LayerSpecification);
  }
  if (look.stain > 0) {
    layers.push({
      id: STAIN_LAYER,
      type: 'color-relief',
      source: SEA_MASK_SOURCE,
      paint: { 'color-relief-color': stainColor(p), 'color-relief-opacity': ['interpolate', ['linear'], ['zoom'], 9, 1, 12, 0.35] },
    } as LayerSpecification);
  }
  RIPPLES.slice(0, look.ripples === 1 ? 1 : 3).forEach((r, i) => {
    layers.push(
      waterLine(rippleId(i + 1), filter, {
        'line-color': p.seaInk,
        'line-opacity': r.opacity,
        'line-width': 0.9,
        'line-offset': r.offset,
      }),
    );
  });
  layers.push(waterLine(IDS.ink, filter, { 'line-color': p.seaInk, 'line-width': look.coastWidth }));
  return layers;
}

/** Paint values to re-apply on a theme change, or null if the id is not one of ours. */
export function waterPaintFor(id: string, p: Palette): Record<string, unknown> | null {
  if (id === STAIN_LAYER) return { 'color-relief-color': stainColor(p) };
  if (id === IDS.ink || id.startsWith('look-coast-ripple-')) return { 'line-color': p.seaInk };
  return null;
}

/** One 44 x 22 px tile of staggered wave strokes, drawn at 2x for sharp lines. */
export function waveImage(color: string): ImageData {
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = 44 * scale;
  canvas.height = 22 * scale;
  const g = canvas.getContext('2d');
  if (!g) return new ImageData(1, 1);
  g.scale(scale, scale);
  g.strokeStyle = color;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  // Each stroke is a low double hump with a longer first swell. Two rows, the second half a tile over.
  const stroke = (x: number, y: number, w: number): void => {
    g.beginPath();
    g.moveTo(x, y + 1);
    g.quadraticCurveTo(x + w * 0.2, y - 5, x + w * 0.42, y);
    g.quadraticCurveTo(x + w * 0.58, y + 4, x + w * 0.74, y - 2.5);
    g.quadraticCurveTo(x + w * 0.86, y - 5, x + w, y - 1);
    g.stroke();
  };
  g.lineWidth = 1.4;
  stroke(2, 8, 19);
  stroke(24, 8, 17);
  g.lineWidth = 1.2;
  stroke(13, 19, 19);
  stroke(35, 19, 7);
  return g.getImageData(0, 0, canvas.width, canvas.height);
}
