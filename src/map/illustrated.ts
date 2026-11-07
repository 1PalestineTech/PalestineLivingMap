// The optional "Illustrated base": a hand-painted picture of the land (made with an image generator, painted over a
// shape reference built from our own elevation data; see docs/BASEMAP_PROMPTS.md) laid under the labels, roads, paths
// and events. It is decoration, never a survey: the fields, groves and dry valleys in it are not data. It loads only
// when the reader switches it on, and while it is on the map's own colour washes, land patterns and rivers are hidden so
// nothing is drawn twice.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { luminance } from './color.ts';
import type { Palette } from './style.ts';

const SOURCE = 'look-illustrated';
export const ILLUSTRATED_LAYER = 'look-illustrated';
const KEY = 'illustrated';

/** The picture covers longitude 34.1 to 36.1 and a 2:5 portrait box from latitude 33.6 southward (scripts/make-reference-images.ts). */
const WEST = 34.1;
const EAST = 36.1;
const NORTH = 33.6;
const merc = (lat: number): number => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const SOUTH = (2 * Math.atan(Math.exp(merc(NORTH) - (((EAST - WEST) * Math.PI) / 180) * 2.5)) - Math.PI / 2) * (180 / Math.PI);

/** Layers that paint the same things the picture does; hidden while it is on (only those the current look has). */
const HIDDEN_WHILE_ON = [
  'look-wash-wood',
  'look-wash-farm',
  'look-wash-grass',
  'look-wash-sand',
  'look-wash-wet',
  'look-wash-rock',
  'look-landscape-field',
  'look-landscape-olive',
  'look-landscape-vine',
  'look-landscape-tufts',
  'look-landscape-dunes',
  'look-landscape-reeds',
  'look-landscape-rock',
  'landcover_wood',
  'waterway',
] as const;

/**
 * The picture goes just under the sea. Our own sea, lakes and coast line are drawn over it, so the shore stays the real
 * one and the picture's own sea (a slightly different colour) never shows; roads, borders, marks and labels stay above.
 */
const INSERT_BEFORE = ['look-districts-fill', 'look-offline-sea', 'water'] as const;

export function savedIllustrated(): boolean {
  try {
    return window.localStorage.getItem(KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveIllustrated(on: boolean): void {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

/** Dimmed and slightly desaturated on the night chart so the bright picture does not glare. */
export function illustratedPaint(p: Palette): Record<string, unknown> {
  const dark = luminance(p.paper) < 0.5;
  return { 'raster-opacity': 0.95, 'raster-brightness-max': dark ? 0.5 : 1, 'raster-saturation': dark ? -0.25 : 0, 'raster-fade-duration': 0 };
}

const hidden = new Set<string>();

export function setIllustrated(map: MapLibreMap, on: boolean, p: Palette): void {
  if (on && !map.getLayer(ILLUSTRATED_LAYER)) {
    map.addSource(SOURCE, {
      type: 'image',
      url: new URL('basemap/illustrated.webp', document.baseURI).href,
      coordinates: [[WEST, NORTH], [EAST, NORTH], [EAST, SOUTH], [WEST, SOUTH]],
    });
    const before = INSERT_BEFORE.find((id) => map.getLayer(id) !== undefined);
    map.addLayer({ id: ILLUSTRATED_LAYER, type: 'raster', source: SOURCE, paint: illustratedPaint(p) as Record<string, never> }, before);
  }
  if (map.getLayer(ILLUSTRATED_LAYER)) map.setLayoutProperty(ILLUSTRATED_LAYER, 'visibility', on ? 'visible' : 'none');
  if (on) {
    for (const id of HIDDEN_WHILE_ON) {
      if (map.getLayer(id) && map.getLayoutProperty(id, 'visibility') !== 'none') {
        map.setLayoutProperty(id, 'visibility', 'none');
        hidden.add(id);
      }
    }
  } else {
    for (const id of hidden) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'visible');
    hidden.clear();
  }
}

export function updateIllustratedPalette(map: MapLibreMap, p: Palette): void {
  if (!map.getLayer(ILLUSTRATED_LAYER)) return;
  for (const [name, value] of Object.entries(illustratedPaint(p))) {
    map.setPaintProperty(ILLUSTRATED_LAYER, name as Parameters<MapLibreMap['setPaintProperty']>[1], value as Parameters<MapLibreMap['setPaintProperty']>[2]);
  }
}
