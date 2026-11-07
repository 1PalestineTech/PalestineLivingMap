// Hachure hill and mountain marks for the strong style, placed from the elevation data by
// scripts/build-relief-marks.ts. They sit above the terrain and under the labels, borders and
// edge fade. Drawn small and clustered, they fill in as you zoom.

import type { ExpressionSpecification, Map as MapLibreMap } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { markId } from './images.ts';
import { isInked } from './inked.ts';
import { isLight } from './perf.ts';
import { strengthParams } from './look.ts';

const SOURCE = 'look-marks';
export const MARKS_LAYER = 'look-relief-marks';
/** The grid each level was built on (scripts/build-relief-marks.ts) and the zoom it starts to show. */
const LEVELS = [
  { zoom: 6, from: 5 },
  { zoom: 8, from: 6.8 },
  { zoom: 10, from: 8.4 },
] as const;

/** [lng, lat, kind, variant, zoom, relief in metres]. */
export type MarkRow = readonly [number, number, 1 | 2, number, number, number];

export function marksToGeoJson(rows: readonly MarkRow[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: rows.map(([lng, lat, k, v, z, r]) => ({
      type: 'Feature',
      properties: { icon: markId(k, v), z, r },
      geometry: { type: 'Point', coordinates: [lng, lat] },
    })),
  };
}

export async function addReliefMarks(map: MapLibreMap): Promise<void> {
  if (!strengthParams().marks) return;
  let rows: readonly MarkRow[];
  try {
    const response = await fetch(new URL('data/relief-marks.json', document.baseURI).href);
    if (!response.ok) throw new Error(`Relief marks returned ${response.status}`);
    rows = ((await response.json()) as { marks: MarkRow[] }).marks;
  } catch (err) {
    console.warn('Relief marks unavailable:', err);
    return;
  }
  map.addSource(SOURCE, { type: 'geojson', data: marksToGeoJson(rows) });
  // The inked look draws bigger, denser ranges.
  const grow = isInked() ? 1.45 : 1;
  const size: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 6, 0.75 * grow, 9, grow, 12, 1.3 * grow];
  // Under the borders and labels. Without the online basemap (offline edition) the marks go under the labels, never over them:
  // layers are placed top first, so marks above a label would hide it wherever they overlap.
  const before = ['boundary_3', 'era-labels-r4'].find((id) => map.getLayer(id) !== undefined);
  // Two layers, one per grid: the denser grid waits until the map is zoomed in enough.
  // Light mode drops the finest grid of marks (src/map/perf.ts).
  for (const level of isLight() ? LEVELS.slice(0, 2) : LEVELS) {
    map.addLayer(
      {
        id: `${MARKS_LAYER}-${level.zoom}`,
        type: 'symbol',
        source: SOURCE,
        minzoom: level.from,
        filter: ['==', ['get', 'z'], level.zoom],
        layout: {
          'icon-image': ['get', 'icon'],
          'icon-size': size,
          'icon-anchor': 'bottom',
          // Bigger relief first, so a crowded spot keeps its mountains and drops its small hills.
          'symbol-sort-key': ['-', 0, ['get', 'r']],
          'icon-padding': 2,
        },
        paint: { 'icon-opacity': isInked() ? 0.9 : 0.8 },
      },
      before,
    );
  }
}
