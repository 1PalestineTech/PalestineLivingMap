// Optional schematic district areas (Filters > District areas): blocks of colour and dashed lines that divide the land
// between the main cities. Every point is shaded by its nearest main city, a plain nearest-centre diagram (Voronoi cells).
// THESE ARE NOT BOUNDARIES. They are not the Mandate sub-districts, the governorates or any other official area, and the
// panel says so; real outlines need a surveyed source (docs/VILLAGE_SOURCES.md). Off by default.

import type { ExpressionSpecification, Map as MapLibreMap } from 'maplibre-gl';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { Place } from '../data/placeTypes.ts';
import { luminance } from './color.ts';
import type { Palette } from './style.ts';

const SOURCE = 'look-districts';
export const DISTRICT_FILL = 'look-districts-fill';
export const DISTRICT_LINE = 'look-districts-line';

/** The main cities the land is divided between: the sub-district centres the owner listed. */
export const DISTRICT_CENTRES = [
  'acre', 'beisan', 'beersheba', 'bethlehem', 'gaza', 'haifa', 'hebron', 'jaffa', 'jericho',
  'jerusalem', 'jenin', 'nablus', 'nazareth', 'ramallah', 'ramla', 'safad', 'tiberias', 'tulkarm',
] as const;

/** Soft block colours, handed out so that cells that touch never share one. */
const TINTS = ['#8a9a5b', '#c9a45c', '#b06a4f', '#6f8fa3', '#8c6b8f', '#9a8f6a'] as const;

type Pt = readonly [number, number];
/** Longitude is stretched by this at the land's latitude so "nearest" means nearest on the ground. */
const X = Math.cos((31.5 * Math.PI) / 180);
/** The cells stop at this box, well beyond the map's faded edge. */
const BOX: readonly Pt[] = [[32, 27], [38.5, 27], [38.5, 35.5], [32, 35.5]];

/** Keeps the part of a polygon that is nearer to `a` than to `b` (a half-plane cut), in the stretched plane. */
function clip(poly: readonly Pt[], a: Pt, b: Pt): Pt[] {
  const mx = ((a[0] + b[0]) / 2) * X;
  const my = (a[1] + b[1]) / 2;
  const dx = (b[0] - a[0]) * X;
  const dy = b[1] - a[1];
  const side = (p: Pt): number => (p[0] * X - mx) * dx + (p[1] - my) * dy; // <= 0 on a's side
  const out: Pt[] = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length];
    if (!q) return;
    const sp = side(p);
    const sq = side(q);
    if (sp <= 0) out.push(p);
    if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  });
  return out;
}

/** The cells, each with the index of a tint that none of its neighbours uses. Exported for the tests. */
export function districtCells(centres: readonly { id: string; lng: number; lat: number }[]): FeatureCollection<Polygon> {
  const cells = centres.map((c, i) => {
    let poly: Pt[] = [...BOX];
    centres.forEach((o, j) => {
      if (i !== j) poly = clip(poly, [c.lng, c.lat], [o.lng, o.lat]);
    });
    return poly;
  });
  const key = (p: Pt): string => `${p[0].toFixed(5)},${p[1].toFixed(5)}`;
  const vertices = cells.map((cell) => new Set(cell.map(key)));
  const tints: number[] = [];
  cells.forEach((_, i) => {
    const used = new Set<number>();
    cells.forEach((__, j) => {
      const tint = tints[j];
      if (j >= i || tint === undefined) return;
      // Neighbours share an edge, so they share at least two corners.
      let shared = 0;
      for (const v of vertices[i] ?? []) if (vertices[j]?.has(v)) shared += 1;
      if (shared >= 2) used.add(tint);
    });
    let tint = 0;
    while (used.has(tint)) tint += 1;
    tints.push(tint);
  });
  const features: Feature<Polygon>[] = cells.map((cell, i) => ({
    type: 'Feature',
    properties: { id: centres[i]?.id ?? '', tint: (tints[i] ?? 0) % TINTS.length },
    geometry: { type: 'Polygon', coordinates: [[...cell, cell[0] ?? [0, 0]].map((p) => [p[0], p[1]])] },
  }));
  return { type: 'FeatureCollection', features };
}

const fillPaint = (p: Palette): Record<string, unknown> => ({
  'fill-color': ['match', ['get', 'tint'], ...TINTS.flatMap((c, i) => [i, c]), TINTS[0]] as unknown as ExpressionSpecification,
  'fill-opacity': luminance(p.paper) < 0.5 ? 0.38 : 0.5,
  'fill-antialias': false,
});

const linePaint = (p: Palette): Record<string, unknown> => ({
  'line-color': p.ink,
  'line-opacity': luminance(p.paper) < 0.5 ? 0.75 : 0.8,
  'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.8, 9, 1.6],
  'line-dasharray': [4, 3],
});

let places: readonly Place[] = [];

/** Shows or hides the blocks and the lines, building them from the main cities' positions the first time. */
export function setDistricts(map: MapLibreMap, blocks: boolean, lines: boolean, all: readonly Place[], p: Palette): void {
  places = all.length > 0 ? all : places;
  if ((blocks || lines) && !map.getSource(SOURCE)) {
    const centres = DISTRICT_CENTRES.flatMap((id) => {
      const place = places.find((pl) => pl.id === id);
      return place ? [{ id, lng: place.lng, lat: place.lat }] : [];
    });
    map.addSource(SOURCE, { type: 'geojson', data: districtCells(centres) });
    // Blocks and lines lie just above the land and under the sea, so the water is never tinted or crossed.
    const underSea = ['look-offline-sea', 'water'].find((id) => map.getLayer(id) !== undefined);
    map.addLayer({ id: DISTRICT_FILL, type: 'fill', source: SOURCE, paint: fillPaint(p) as Record<string, never> }, underSea);
    map.addLayer({ id: DISTRICT_LINE, type: 'line', source: SOURCE, paint: linePaint(p) as Record<string, never> }, underSea);
  }
  if (map.getLayer(DISTRICT_FILL)) map.setLayoutProperty(DISTRICT_FILL, 'visibility', blocks ? 'visible' : 'none');
  if (map.getLayer(DISTRICT_LINE)) map.setLayoutProperty(DISTRICT_LINE, 'visibility', lines ? 'visible' : 'none');
}

export function updateDistrictPalette(map: MapLibreMap, p: Palette): void {
  if (!map.getLayer(DISTRICT_FILL)) return;
  for (const [name, value] of Object.entries(fillPaint(p))) map.setPaintProperty(DISTRICT_FILL, name as Parameters<MapLibreMap['setPaintProperty']>[1], value as Parameters<MapLibreMap['setPaintProperty']>[2]);
  for (const [name, value] of Object.entries(linePaint(p))) map.setPaintProperty(DISTRICT_LINE, name as Parameters<MapLibreMap['setPaintProperty']>[1], value as Parameters<MapLibreMap['setPaintProperty']>[2]);
}
