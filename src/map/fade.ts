// Edge fade into paper: a smooth ellipse around the home view with six nested rings of rising
// paper opacity, and solid paper beyond. It is geographic, so it moves with the map like the edge
// of a sheet. It is a picture frame, never a border: it is not traced along any political or
// historical boundary (docs/SPEC_MAP_V2.md 3.4).

import type { Map as MapLibreMap } from 'maplibre-gl';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import { ellipseRing, FRAME_PAPER_COVER, FRAME_RING_SCALES } from '../data/frame.ts';
import type { Palette } from './style.ts';

export const FADE_SOURCE = 'look-fade';
export const FADE_LAYER = 'look-fade';

const WORLD: [number, number][] = [[-90, -70], [90, -70], [90, 80], [-90, 80], [-90, -70]];

/** One ring: the area between the ellipse at `inner` times the base size and the one at `outer`, or everything beyond `inner`. */
function band(inner: number, outer: number | null, cover: number): Feature<Polygon> {
  // MapLibre treats a ring wound the opposite way to the first as a hole.
  const outside = outer === null ? WORLD : ellipseRing(outer);
  const hole = ellipseRing(inner).reverse();
  return { type: 'Feature', properties: { cover }, geometry: { type: 'Polygon', coordinates: [outside, hole] } };
}

/** Paper cover for each ring, from the clear edge outward, ending with solid paper beyond the last ring. */
export function fadeData(): FeatureCollection {
  const features = FRAME_RING_SCALES.map((inner, i) => band(inner, FRAME_RING_SCALES[i + 1] ?? null, FRAME_PAPER_COVER[i] ?? 1));
  return { type: 'FeatureCollection', features };
}

/** Adds the fade just below `beforeId` (the first event layer), above the basemap and region overlays. */
export function addFade(map: MapLibreMap, p: Palette, beforeId: string): void {
  map.addSource(FADE_SOURCE, { type: 'geojson', data: fadeData() });
  map.addLayer(
    {
      id: FADE_LAYER,
      type: 'fill',
      source: FADE_SOURCE,
      paint: { 'fill-color': p.paper2, 'fill-opacity': ['get', 'cover'], 'fill-antialias': false },
    },
    beforeId,
  );
}

export function updateFadePalette(map: MapLibreMap, p: Palette): void {
  map.setPaintProperty(FADE_LAYER, 'fill-color', p.paper2);
}
