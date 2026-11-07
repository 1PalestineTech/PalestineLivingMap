// Extra layers for the inked look (src/map/look.ts): colour washes under the landscape patterns, and
// the main roads as thin dashed ink trails. The basemap hides roads and land cover for the other looks.

import type { FilterSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl';
import { luminance, mix } from './color.ts';
import { activeStrength } from './look.ts';
import type { Palette } from './style.ts';

export const isInked = (): boolean => activeStrength() === 'inked';

const WASH_PREFIX = 'look-wash-';

interface Wash {
  id: string;
  subclass: readonly string[];
  /** The wash colour before it is eased toward the paper. */
  color: string;
  opacity: number;
}

const WASHES: readonly Wash[] = [
  { id: 'wood', subclass: ['wood', 'forest'], color: '#5f7a34', opacity: 0.6 },
  { id: 'farm', subclass: ['farmland', 'orchard', 'vineyard'], color: '#b3b45a', opacity: 0.5 },
  { id: 'grass', subclass: ['scrub', 'meadow', 'grassland', 'heath', 'grass', 'fell'], color: '#97a257', opacity: 0.4 },
  { id: 'sand', subclass: ['sand', 'beach'], color: '#e8d49a', opacity: 0.6 },
  { id: 'wet', subclass: ['wetland'], color: '#7f9a86', opacity: 0.55 },
  { id: 'rock', subclass: ['bare_rock', 'scree'], color: '#8c7b63', opacity: 0.45 },
];

/** Wash colour in the current theme: eased toward the paper, and darker on the night chart. */
function washColor(p: Palette, color: string): string {
  return luminance(p.paper) < 0.5 ? mix(p.paper2, color, 0.3) : mix(p.paper2, color, 0.75);
}

/** Adds one wash fill per land-cover kind above the terrain and below the landscape patterns. */
export function addWashLayers(style: StyleSpecification, p: Palette): void {
  if (!isInked()) return;
  const at = style.layers.findIndex((l) => l.id === 'landcover_wood');
  if (at === -1) return;
  const layers = WASHES.map(
    (wash): LayerSpecification => ({
      id: `${WASH_PREFIX}${wash.id}`,
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      minzoom: 6,
      filter: ['in', ['get', 'subclass'], ['literal', [...wash.subclass]]] as FilterSpecification,
      paint: { 'fill-color': washColor(p, wash.color), 'fill-opacity': wash.opacity, 'fill-antialias': false },
    }),
  );
  style.layers.splice(at, 0, ...layers);
}

/** Paint to re-apply to a wash layer when the theme changes, or null if `id` is not one. */
export function washPaintFor(id: string, p: Palette): Record<string, unknown> | null {
  const wash = id.startsWith(WASH_PREFIX) ? WASHES.find((w) => w.id === id.slice(WASH_PREFIX.length)) : undefined;
  return wash ? { 'fill-color': washColor(p, wash.color) } : null;
}

const ROADS: Record<string, { minzoom: number; width: [number, number]; opacity: number }> = {
  highway_motorway_inner: { minzoom: 6, width: [1, 1.8], opacity: 0.7 },
  highway_major_inner: { minzoom: 7, width: [0.8, 1.5], opacity: 0.6 },
  highway_minor: { minzoom: 10, width: [0.6, 1.1], opacity: 0.5 },
};

/** The main roads as dashed ink trails in the inked look; null leaves the layer to the usual rules. */
export function roadOverride(id: string, p: Palette): { layout: Record<string, unknown>; paint: Record<string, unknown>; minzoom: number } | null {
  const road = isInked() ? ROADS[id] : undefined;
  if (!road) return null;
  return {
    layout: { visibility: 'visible', 'line-cap': 'butt' },
    minzoom: road.minzoom,
    paint: {
      'line-color': p.ink2,
      'line-opacity': road.opacity,
      'line-width': ['interpolate', ['linear'], ['zoom'], 6, road.width[0], 12, road.width[1]],
      'line-dasharray': [3.2, 2.2],
    },
  };
}
