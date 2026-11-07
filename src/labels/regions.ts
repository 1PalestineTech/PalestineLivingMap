// Region and district names set along a curve across the land, in large spaced capitals, as on printed
// fantasy maps (inked look only). A place opts in with `labelPath`, a decorative line of [lng, lat]
// points through the middle of the region; it is a lettering guide, never a boundary. English runs
// along the path and the Arabic name follows beneath it.

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
import { labelAt } from '../data/places.ts';
import type { Place } from '../data/placeTypes.ts';
import { FONT } from '../map/glyphs.ts';
import { isInked } from '../map/inked.ts';
import type { Palette } from '../map/style.ts';

const SOURCE = 'era-region-paths';
const POINT_SOURCE = 'era-region-points';
/** Below this zoom the names sit flat at the middle of each region; from it they curve along their paths. */
const CURVE_FROM = 8;
export const REGION_LAYERS = ['era-region-en', 'era-region-ar', 'era-region-pt-en', 'era-region-pt-ar'] as const;

/** Places drawn along a path in this look (so their point label is skipped). */
export const hasPathLabel = (place: Place): boolean => isInked() && (place.labelPath?.length ?? 0) >= 2;

/** The point half way along a path, where the name sits while the land is too small for curved lettering. */
function midpoint(path: readonly [number, number][]): [number, number] {
  const lengths = path.slice(1).map((pt, i) => Math.hypot(pt[0] - (path[i]?.[0] ?? 0), pt[1] - (path[i]?.[1] ?? 0)));
  let left = lengths.reduce((a, b) => a + b, 0) / 2;
  for (let i = 0; i < lengths.length; i++) {
    const seg = lengths[i] ?? 0;
    const a = path[i];
    const b = path[i + 1];
    if (a === undefined || b === undefined) break;
    if (left <= seg || i === lengths.length - 1) {
      const t = seg === 0 ? 0 : Math.min(1, left / seg);
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    left -= seg;
  }
  return path[0] ?? [0, 0];
}

export function regionData(places: readonly Place[], year: number): { lines: FeatureCollection<LineString>; points: FeatureCollection<Point> } {
  const lines: Feature<LineString>[] = [];
  const points: Feature<Point>[] = [];
  for (const place of places) {
    if (!hasPathLabel(place) || !place.labelPath) continue;
    const label = labelAt(place, year);
    if (label === null) continue;
    // Lettering on a path reads best short: the word "District" is left to the place card.
    // Governorates are lettered only along their paths (too many and too close for flat names), and so is the
    // whole land, whose flat name already comes from the base map's "Palestine" label.
    const en = (label.en.split(' / ')[0] ?? label.en).replace(/ (District|Governorate)$/, '').replace(/ and .*$/, '');
    const properties = { id: place.id, en, ar: label.ar, curveOnly: place.id.endsWith('-governorate') || place.kind === 'region' && !place.id.endsWith('-district') };
    lines.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: place.labelPath }, properties });
    points.push({ type: 'Feature', geometry: { type: 'Point', coordinates: midpoint(place.labelPath) }, properties });
  }
  return { lines: { type: 'FeatureCollection', features: lines }, points: { type: 'FeatureCollection', features: points } };
}

// Curved lettering grows with the land: small enough at zoom 8 to fit a district's short path.
const SIZE = (scale: number): ExpressionSpecification => ['interpolate', ['linear'], ['zoom'], 8, 14 * scale, 9, 26 * scale, 10, 50 * scale];
// Flat names at the home zoom, in the same spaced capitals.
const POINT_SIZE = (scale: number): ExpressionSpecification => ['interpolate', ['linear'], ['zoom'], 5, 8 * scale, 7, 12 * scale, CURVE_FROM, 15 * scale];

export function addRegionLayers(map: MapLibreMap, places: readonly Place[], year: number, p: Palette, beforeId: string): void {
  if (!isInked()) return;
  const data = regionData(places, year);
  map.addSource(SOURCE, { type: 'geojson', data: data.lines });
  map.addSource(POINT_SOURCE, { type: 'geojson', data: data.points });
  const line = { 'symbol-placement': 'line' as const, 'text-keep-upright': true, 'text-max-angle': 50, 'symbol-spacing': 1200 };
  const paint = { 'text-color': p.ink, 'text-opacity': 0.78, 'text-halo-color': p.paper, 'text-halo-width': 1.6, 'text-halo-blur': 0.5 };
  const arPaint = { ...paint, 'text-opacity': 0.7 };
  const en = { 'text-field': ['get', 'en'] as ExpressionSpecification, 'text-font': [...FONT.cityBold], 'text-letter-spacing': 0.16, 'text-transform': 'uppercase' as const };
  const ar = { 'text-field': ['get', 'ar'] as ExpressionSpecification, 'text-font': [...FONT.regular] };
  // Faint lettering sits under the banners and icons, so it may overlap them.
  const flat = { 'text-allow-overlap': true, 'text-ignore-placement': true, 'text-max-width': 12 };
  map.addLayer({ id: REGION_LAYERS[0], type: 'symbol', source: SOURCE, minzoom: CURVE_FROM, layout: { ...line, ...en, 'text-size': SIZE(1) }, paint }, beforeId);
  map.addLayer({ id: REGION_LAYERS[1], type: 'symbol', source: SOURCE, minzoom: CURVE_FROM, layout: { ...line, ...ar, 'text-size': SIZE(0.62), 'text-offset': [0, 1.5] }, paint: arPaint }, beforeId);
  const notCurveOnly: ExpressionSpecification = ['!', ['get', 'curveOnly']];
  map.addLayer({ id: REGION_LAYERS[2], type: 'symbol', source: POINT_SOURCE, maxzoom: CURVE_FROM, filter: notCurveOnly, layout: { ...flat, ...en, 'text-size': POINT_SIZE(1) }, paint }, beforeId);
  map.addLayer({ id: REGION_LAYERS[3], type: 'symbol', source: POINT_SOURCE, maxzoom: CURVE_FROM, filter: notCurveOnly, layout: { ...flat, ...ar, 'text-size': POINT_SIZE(0.7), 'text-offset': [0, 1.2] }, paint: arPaint }, beforeId);
}

export function setRegionData(map: MapLibreMap, places: readonly Place[], year: number): void {
  const data = regionData(places, year);
  map.getSource<GeoJSONSource>(SOURCE)?.setData(data.lines);
  map.getSource<GeoJSONSource>(POINT_SOURCE)?.setData(data.points);
}

export function updateRegionPalette(map: MapLibreMap, p: Palette): void {
  for (const id of REGION_LAYERS) {
    if (!map.getLayer(id)) continue;
    map.setPaintProperty(id, 'text-color', p.ink);
    map.setPaintProperty(id, 'text-halo-color', p.paper);
  }
}
