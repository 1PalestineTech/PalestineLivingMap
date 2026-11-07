// The era-label map layers: one geojson source of the names valid in the current year, drawn in
// Almendra with an IBM Plex Sans Arabic line beneath (docs/GLYPHS.md). One symbol layer
// per rank, so minor places only appear from a higher zoom. The layers sit just under the edge
// fade (docs/MAP_LOOK.md), so they fade into paper at the sheet's edge with everything else.

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import type { Feature, FeatureCollection, Point } from 'geojson';
import { labelAt, shownNow } from '../data/places.ts';
import { getState } from '../state.ts';
import type { Place } from '../data/placeTypes.ts';
import { FONT } from '../map/glyphs.ts';
import { BANNER_IMAGE, NO_BANNER, PLATE_IMAGE } from '../map/banner.ts';
import { isInked } from '../map/inked.ts';
import { hasPathLabel } from './regions.ts';
import { SETTLEMENT_ICON, TOWN_ICON } from '../map/townIcons.ts';
import type { Palette } from '../map/style.ts';

export const LABEL_SOURCE = 'era-labels';
export const LABEL_LAYERS = ['era-labels-r1', 'era-labels-r2', 'era-labels-r3', 'era-labels-r4'] as const;

/** Lowest zoom at which each rank appears. The map's own minimum zoom is 6. */
const RANK_MIN_ZOOM = [0, 7, 8, 9] as const;
const ARABIC_SCALE = 0.86;

/** The places that have a name in `year`, as map features carrying the text to draw. */
/** Scroll banners for cities and towns in the painted look; square plates for cities only in the inked look. */
function bannerFor(place: Place): string {
  if (place.group === 'settlement') return NO_BANNER;
  if (isInked()) return place.kind === 'city' ? PLATE_IMAGE : NO_BANNER;
  return place.kind === 'city' || place.kind === 'town' ? BANNER_IMAGE : NO_BANNER;
}

export function labelData(places: readonly Place[], year: number): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];
  for (const place of places) {
    if (hasPathLabel(place)) continue; // drawn along its path (regions.ts)
    if (!shownNow(place, getState().selectedEventId, getState().selectedPlaceId)) continue;
    const picked = getState().placeFilter;
    if (picked !== null && !picked.ids.includes(place.id)) continue;
    const label = labelAt(place, year);
    if (label === null) continue;
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
      properties: { id: place.id, priority: place.priority ?? 5, kind: place.kind, rank: place.rank, group: place.group ?? '', icon: place.group === 'settlement' ? SETTLEMENT_ICON : (TOWN_ICON[place.kind] ?? ''), banner: bannerFor(place), en: label.en, ar: label.ar, nl: label.ar === '' ? '' : '\n' },
    });
  }
  return { type: 'FeatureCollection', features };
}

const byKind = (city: readonly string[], town: readonly string[], other: readonly string[]): ExpressionSpecification => [
  'match',
  ['get', 'kind'],
  'city',
  ['literal', city],
  ['town', 'village'],
  ['literal', town],
  ['literal', other],
];

const SIZE: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['zoom'],
  6,
  ['match', ['get', 'rank'], 1, 9, 2, 8, 3, 8, 8],
  8,
  ['match', ['get', 'rank'], 1, 12, 2, 10, 3, 10, 9],
  10,
  ['match', ['get', 'rank'], 1, 22, 2, 18, 3, 16, 14],
];

const NAMES = [['get', 'en'], {}, ['get', 'nl'], {}, ['get', 'ar'], { 'font-scale': ARABIC_SCALE }] as const;

/** The name over its Arabic line; places that have a drawing (town, village...) show it before the name. */
const TEXT = [
  'case',
  ['==', ['get', 'icon'], ''],
  ['format', ...NAMES],
  ['format', ['image', ['get', 'icon']], {}, ' ', {}, ...NAMES],
] as unknown as ExpressionSpecification;

/** Places of the Settlements section are lettered in the accent colour so they read apart from the rest. */
const textColor = (p: Palette): ExpressionSpecification => ['case', ['==', ['get', 'group'], 'settlement'], p.accent, p.ink];

function rankFilter(rank: number, showSettlements: boolean): ExpressionSpecification {
  return showSettlements ? ['==', ['get', 'rank'], rank] : ['all', ['==', ['get', 'rank'], rank], ['!=', ['get', 'group'], 'settlement']];
}

/** Shows or hides the Settlements section's labels. */
export function setSettlementsVisible(map: MapLibreMap, show: boolean): void {
  LABEL_LAYERS.forEach((id, i) => map.setFilter(id, rankFilter(i + 1, show)));
}

const isRegionLike = ['in', ['get', 'kind'], ['literal', ['region', 'water']]] as ExpressionSpecification;

/** Adds the source and one layer per rank, below `beforeId` (the edge fade). */
export function addLabelLayers(map: MapLibreMap, places: readonly Place[], year: number, p: Palette, beforeId: string): void {
  map.addSource(LABEL_SOURCE, { type: 'geojson', data: labelData(places, year) });
  // MapLibre places the top layer's symbols first, so add minor ranks first: cities then win collisions.
  const order = LABEL_LAYERS.map((id, i) => ({ id, i })).reverse();
  order.forEach(({ id, i }) => {
    map.addLayer(
      {
        id,
        type: 'symbol',
        source: LABEL_SOURCE,
        minzoom: RANK_MIN_ZOOM[i] ?? 0,
        filter: rankFilter(i + 1, getState().showSettlements),
        layout: {
          'text-field': TEXT,
          'text-font': byKind(FONT.cityBold, FONT.regular, FONT.italic),
          'text-size': SIZE,
          'text-line-height': 1.1,
          'text-letter-spacing': ['case', isRegionLike, 0.18, 0.02],
          'text-transform': ['case', isRegionLike, 'uppercase', isInked() ? ['match', ['get', 'kind'], 'city', 'uppercase', 'none'] : 'none'],
          'text-max-width': 9,
          // Just below the point, clear of the event pins and clusters drawn on top of it.
          // If a name would collide with a neighbour's, it tries the other sides before it is dropped.
          'text-variable-anchor': ['top', 'bottom', 'right', 'left'],
          'text-radial-offset': 1.6,
          'text-padding': 3,
          // City and town names sit on a scroll banner that stretches to the text.
          'icon-image': ['get', 'banner'],
          'icon-text-fit': 'both',
          // The banner's tails and folds are fixed-size, so shrink it with the text at wide zoom.
          'icon-size': ['interpolate', ['linear'], ['zoom'], 6, 0.5, 8, 0.65, 10, 1],
          'icon-text-fit-padding': [1, 4, 1, 4],
          // Within a layer, cities and towns win over districts, then the lower `priority` number wins.
          'symbol-sort-key': ['+', ['*', 10, ['match', ['get', 'kind'], ['city', 'town'], 0, 1]], ['get', 'priority']],
        },
        paint: {
          'text-color': textColor(p),
          'text-halo-color': p.paper,
          'text-halo-width': 1.6,
          'text-halo-blur': 0.4,
        },
      },
      beforeId,
    );
  });
}

export function setLabelData(map: MapLibreMap, places: readonly Place[], year: number): void {
  map.getSource<GeoJSONSource>(LABEL_SOURCE)?.setData(labelData(places, year));
}

export function updateLabelPalette(map: MapLibreMap, p: Palette): void {
  for (const id of LABEL_LAYERS) {
    map.setPaintProperty(id, 'text-color', textColor(p));
    map.setPaintProperty(id, 'text-halo-color', p.paper);
  }
}

const DIMMED = 0.3;

/** While a thread is followed, labels of places outside it dim, like the markers. null shows all at full strength. */
export function dimOthers(map: MapLibreMap, keep: readonly string[] | null): void {
  const opacity: ExpressionSpecification | number =
    keep === null ? 1 : ['case', ['in', ['get', 'id'], ['literal', [...keep]]], 1, DIMMED];
  for (const id of LABEL_LAYERS) {
    map.setPaintProperty(id, 'text-opacity', opacity);
    map.setPaintProperty(id, 'icon-opacity', opacity);
  }
}
