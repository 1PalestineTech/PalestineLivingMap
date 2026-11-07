// Borders of the basemap, drawn so each level reads apart at a glance: countries as a heavy
// dash-dot line, provinces dashed, districts finely dashed and municipal limits dotted, each on a
// soft paper casing so it stays visible over the relief. They are present-day lines from the
// basemap (see BASEMAP_NOTE), not historical boundaries (docs/SPEC_MAP_V2.md section 7).

import type { ExpressionSpecification, FilterSpecification, LayerSpecification, StyleSpecification } from 'maplibre-gl';
import type { Palette } from './style.ts';

const SOURCE = 'openmaptiles';
const SOURCE_LAYER = 'boundary';

export const BORDER = {
  casing: 'boundary_casing',
  province: 'boundary_3',
  district: 'boundary_district',
  local: 'boundary_local',
  country: 'boundary_2',
  disputed: 'boundary_disputed',
} as const;

const plain: ExpressionSpecification[] = [
  ['!=', ['get', 'maritime'], 1],
  ['!=', ['get', 'disputed'], 1],
  ['!', ['has', 'claimed_by']],
];

/** Filter for admin levels min..max (the basemap's own levels, 2 = country). */
function levels(min: number, max: number): FilterSpecification {
  return ['all', ['==', ['typeof', ['get', 'admin_level']], 'number'], ['>=', ['get', 'admin_level'], min], ['<=', ['get', 'admin_level'], max], ...plain] as FilterSpecification;
}

function line(id: string, filter: FilterSpecification, minzoom: number): LayerSpecification {
  return { id, type: 'line', source: SOURCE, 'source-layer': SOURCE_LAYER, minzoom, filter, layout: { 'line-join': 'round' }, paint: {} };
}

/**
 * One whole land (owner decision, 2026-11-04): the map draws no line between the West Bank, Gaza and
 * the rest of Palestine. Country lines stay only where a neighbour is on one side (Egypt, Jordan,
 * Syria, Lebanon, Saudi Arabia), the basemap's "disputed" lines (the 1949 armistice line, the
 * Golan) are hidden, and the district level that the basemap only carries for the West Bank (admin
 * 5-6) and the province level (3-4, which the basemap carries unevenly across the land) are not drawn, so no
 * part of the land looks subdivided differently from another. Municipal limits (7-9) are drawn everywhere.
 */
const NEIGHBOURS = ['EGY', 'JOR', 'LBN', 'SYR', 'SAU'];
const neighbour: ExpressionSpecification = ['any', ['in', ['get', 'adm0_l'], ['literal', NEIGHBOURS]], ['in', ['get', 'adm0_r'], ['literal', NEIGHBOURS]]];
const outerBorder = levels(2, 2);

/** Re-filters the basemap's layers and adds the casing and municipal layers beneath them. */
export function addBorderLayers(style: StyleSpecification): void {
  const at = style.layers.findIndex((l) => l.id === BORDER.province);
  if (at === -1) return;
  const province = style.layers[at] as { filter?: FilterSpecification };
  province.filter = levels(3, 4);
  (style.layers[at] as { layout?: Record<string, unknown> }).layout = { ...((style.layers[at] as { layout?: Record<string, unknown> }).layout ?? {}), visibility: 'none' };
  for (const layer of style.layers) {
    const target = layer as { filter?: FilterSpecification; layout?: Record<string, unknown> };
    if (layer.id === BORDER.country) target.filter = ['all', outerBorder, neighbour] as FilterSpecification;
    if (layer.id === BORDER.disputed) target.layout = { ...(target.layout ?? {}), visibility: 'none' };
  }
  style.layers.splice(
    at,
    0,
    line(BORDER.casing, ['all', outerBorder, neighbour] as FilterSpecification, 6),
    line(BORDER.local, levels(7, 9), 11),
  );
}

const zoomWidth = (low: number, high: number): ExpressionSpecification => ['interpolate', ['linear'], ['zoom'], 6, low, 12, high];

/** Paint for a border layer in the current palette, or null if `id` is not one of ours or the basemap's. */
export function borderPaintFor(id: string, p: Palette): Record<string, unknown> | null {
  switch (id) {
    case BORDER.casing:
      return { 'line-color': p.paper2, 'line-opacity': 0.8, 'line-width': zoomWidth(3.5, 7), 'line-blur': 0.6 };
    case BORDER.country:
      return { 'line-color': p.ink, 'line-opacity': 0.95, 'line-width': zoomWidth(1.8, 3), 'line-dasharray': [6, 2, 1, 2] };
    case BORDER.disputed:
      return { 'line-color': p.ink, 'line-opacity': 0.85, 'line-width': zoomWidth(1.4, 2.3), 'line-dasharray': [1, 2.4] };
    case BORDER.province:
      return { 'line-color': p.ink, 'line-opacity': 0.9, 'line-width': zoomWidth(1.5, 2.4), 'line-dasharray': [4, 2.2] };
    case BORDER.district:
      return { 'line-color': p.ink2, 'line-opacity': 0.8, 'line-width': zoomWidth(1.1, 1.8), 'line-dasharray': [2, 2] };
    case BORDER.local:
      return { 'line-color': p.ink2, 'line-opacity': 0.85, 'line-width': zoomWidth(1, 1.7), 'line-dasharray': [1.6, 1.8] };
    default:
      return null;
  }
}
