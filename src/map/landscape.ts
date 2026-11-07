// Landscape detail drawn from the basemap's land cover: olive and fruit groves, ploughed fields,
// vineyards, scrub and meadow tufts, dunes, reed beds and bare rock, each a small repeating ink
// pattern over the painted terrain. They go only where the basemap says the ground is that kind.
// Everything is drawn here from scratch with canvas, in the palette's ink colour.

import type { FilterSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl';
import { isLight } from './perf.ts';

export const LAND_PREFIX = 'look-land-';

interface Kind {
  id: string;
  /** Basemap `landcover` subclass values this pattern covers. */
  subclass: readonly string[];
  minzoom: number;
  opacity: number;
}

export const LAND_KINDS: readonly Kind[] = [
  { id: 'field', subclass: ['farmland'], minzoom: 8.5, opacity: 0.38 },
  { id: 'olive', subclass: ['orchard'], minzoom: 8.5, opacity: 0.6 },
  { id: 'vine', subclass: ['vineyard'], minzoom: 9, opacity: 0.55 },
  { id: 'tufts', subclass: ['scrub', 'meadow', 'grassland', 'heath', 'grass', 'fell'], minzoom: 9, opacity: 0.45 },
  { id: 'dunes', subclass: ['sand', 'beach'], minzoom: 8, opacity: 0.6 },
  { id: 'reeds', subclass: ['wetland'], minzoom: 9, opacity: 0.6 },
  { id: 'rock', subclass: ['bare_rock', 'scree'], minzoom: 8.5, opacity: 0.55 },
];

const SCALE = 3;
type Ctx = CanvasRenderingContext2D;

function surface(size: number): Ctx | null {
  const el = document.createElement('canvas');
  el.width = size * SCALE;
  el.height = size * SCALE;
  const g = el.getContext('2d');
  if (!g) return null;
  g.scale(SCALE, SCALE);
  g.lineWidth = 0.9;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  return g;
}

function stroke(g: Ctx, points: readonly (readonly [number, number])[]): void {
  g.beginPath();
  points.forEach(([x, y], i) => (i === 0 ? g.moveTo(x, y) : g.lineTo(x, y)));
  g.stroke();
}

/** Ploughed plots: a few small rectangles, each ruled with furrows at its own angle. */
function drawField(g: Ctx): void {
  const plots: readonly (readonly [number, number, number, number, number])[] = [
    [3, 4, 24, 15, 0], [30, 6, 15, 24, 1], [6, 24, 22, 18, 1], [32, 34, 12, 11, 0],
  ];
  for (const [x, y, w, h, vertical] of plots) {
    g.strokeRect(x, y, w, h);
    const step = 3.2;
    if (vertical) for (let i = x + step; i < x + w - 1; i += step) stroke(g, [[i, y + 1.5], [i, y + h - 1.5]]);
    else for (let j = y + step; j < y + h - 1; j += step) stroke(g, [[x + 1.5, j], [x + w - 1.5, j]]);
  }
}

/** Olive grove: rows of small round trees with a dot of shade, offset row to row. */
function drawOlive(g: Ctx): void {
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const x = 6 + col * 11 + (row % 2) * 5.5;
      const y = 6 + row * 11;
      g.beginPath();
      g.arc(x, y, 3, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(x + 0.6, y + 0.4, 0.8, 0, Math.PI * 2);
      g.fill();
    }
  }
}

/** Vineyard: close parallel rows with short cross-ticks. */
function drawVine(g: Ctx): void {
  for (let j = 4; j < 44; j += 5) {
    stroke(g, [[2, j], [46, j]]);
    for (let i = 5; i < 46; i += 6) stroke(g, [[i, j - 1.4], [i, j + 1.4]]);
  }
}

/** Scrub and meadow: scattered small grass tufts. */
function drawTufts(g: Ctx): void {
  const spots: readonly (readonly [number, number])[] = [[6, 8], [20, 5], [34, 11], [12, 22], [28, 26], [40, 20], [7, 36], [22, 40], [38, 38]];
  for (const [x, y] of spots) {
    stroke(g, [[x - 2, y], [x - 0.6, y - 3.5]]);
    stroke(g, [[x, y], [x, y - 4.4]]);
    stroke(g, [[x + 2, y], [x + 0.8, y - 3.2]]);
  }
}

/** Dunes: rows of short shallow arcs with stippling below each crest. */
function drawDunes(g: Ctx): void {
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const x = 4 + col * 15 + (row % 2) * 7;
      const y = 8 + row * 11;
      g.beginPath();
      g.moveTo(x, y + 3);
      g.quadraticCurveTo(x + 5, y - 3, x + 12, y + 3);
      g.stroke();
      g.fillRect(x + 4, y + 5, 0.8, 0.8);
      g.fillRect(x + 8, y + 6, 0.8, 0.8);
    }
  }
}

/** Reed beds: tall stems with seed heads, over a few water dashes. */
function drawReeds(g: Ctx): void {
  const spots: readonly (readonly [number, number])[] = [[8, 18], [24, 12], [38, 24], [14, 38], [32, 40]];
  for (const [x, y] of spots) {
    for (let k = -1; k <= 1; k += 1) {
      stroke(g, [[x + k * 2, y], [x + k * 2.4, y - 9]]);
      g.fillRect(x + k * 2.4 - 0.6, y - 11, 1.2, 2.6);
    }
    stroke(g, [[x - 4, y + 2], [x + 4, y + 2]]);
  }
}

/** Bare rock and scree: angular crags with hatching. */
function drawRock(g: Ctx): void {
  const crags: readonly (readonly [number, number, number])[] = [[10, 16, 1], [32, 10, 0.8], [24, 34, 1.1], [6, 40, 0.7], [42, 36, 0.8]];
  for (const [x, y, s] of crags) {
    stroke(g, [[x - 6 * s, y + 4 * s], [x - 2 * s, y - 4 * s], [x + 1 * s, y - 1 * s], [x + 3 * s, y - 5 * s], [x + 7 * s, y + 4 * s]]);
    stroke(g, [[x + 3 * s, y - 3 * s], [x + 4 * s, y + 3 * s]]);
    stroke(g, [[x + 5 * s, y - 2 * s], [x + 5.6 * s, y + 3 * s]]);
  }
}

const DRAW: Record<string, (g: Ctx) => void> = {
  field: drawField,
  olive: drawOlive,
  vine: drawVine,
  tufts: drawTufts,
  dunes: drawDunes,
  reeds: drawReeds,
  rock: drawRock,
};

const TILE = 48;

/** A pattern tile for `look-land-<kind>`, or null if the id is not one. */
export function landImage(id: string, color: string): ImageData | null {
  const draw = DRAW[id.slice(LAND_PREFIX.length)];
  const g = draw ? surface(TILE) : null;
  if (!draw || !g) return null;
  g.strokeStyle = color;
  g.fillStyle = color;
  draw(g);
  return g.getImageData(0, 0, TILE * SCALE, TILE * SCALE);
}

/** Layer ids of the landscape patterns. */
export const LANDSCAPE_LAYER_IDS: readonly string[] = LAND_KINDS.map((k) => `look-landscape-${k.id}`);

/** Adds one fill layer per kind, just above the basemap's woodland, so patterns lie on the painted terrain. */
export function addLandscapeLayers(style: StyleSpecification): void {
  if (isLight()) return; // light mode: no pattern fills (src/map/perf.ts)
  const at = style.layers.findIndex((l) => l.id === 'landcover_wood');
  if (at === -1) return;
  const layers = LAND_KINDS.map(
    (kind): LayerSpecification => ({
      id: `look-landscape-${kind.id}`,
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      minzoom: kind.minzoom,
      filter: ['in', ['get', 'subclass'], ['literal', [...kind.subclass]]] as FilterSpecification,
      // Hidden until the map has first drawn, then switched on (map/index.ts), so the first paint stays light.
      layout: { visibility: 'none' },
      paint: { 'fill-pattern': `${LAND_PREFIX}${kind.id}`, 'fill-opacity': kind.opacity },
    }),
  );
  style.layers.splice(at, 0, ...layers);
}
