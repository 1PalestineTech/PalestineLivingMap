// Event sources and layers. Pins are clustered; approximate locations are soft areas.
// Marker fades use the "fade" feature-state (see visibility.ts).

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { CATEGORIES } from '../data/categories.ts';
import { FONT } from './glyphs.ts';
import { MARKER_SIZE } from './markers.ts';
import type { Palette } from './style.ts';

export const PIN_SOURCE = 'events-pins';
export const AREA_SOURCE = 'events-areas';

export const LAYER = {
  areaFill: 'event-area-fill',
  areaLine: 'event-area-line',
  areaSelected: 'event-area-selected',
  cluster: 'event-clusters',
  clusterCount: 'event-cluster-count',
  pin: 'event-pins',
  selectedRing: 'event-selected-ring',
  selectedPin: 'event-selected-pin',
} as const;

/** Layers that can be hovered or clicked, top-most first. */
export const INTERACTIVE_LAYERS = [LAYER.cluster, LAYER.pin, LAYER.areaFill];

const CLUSTER_RADIUS_PX = 40;
const CLUSTER_MAX_ZOOM = 9;
const DIMMED_OPACITY = 0.3;
const FADE: ExpressionSpecification = ['coalesce', ['feature-state', 'fade'], 1];

const categoryColor = [
  'match',
  ['get', 'category'],
  ...CATEGORIES.flatMap((c) => [c.id, c.color]),
  '#444444',
] as unknown as ExpressionSpecification;

const isTouch = (): boolean => window.matchMedia('(pointer: coarse)').matches;
const noSelection: ExpressionSpecification = ['==', ['get', 'id'], ''];

const emptyCollection: FeatureCollection = { type: 'FeatureCollection', features: [] };

export function addEventLayers(map: MapLibreMap, p: Palette): void {
  map.addSource(AREA_SOURCE, { type: 'geojson', data: emptyCollection, promoteId: 'id' });
  map.addSource(PIN_SOURCE, {
    type: 'geojson',
    data: emptyCollection,
    promoteId: 'id',
    cluster: true,
    clusterRadius: CLUSTER_RADIUS_PX,
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
  });

  const touchScale = isTouch() ? 1.25 : 1;
  const iconImage: ExpressionSpecification = ['concat', 'marker-', ['get', 'category']];
  const notCluster: ExpressionSpecification = ['!', ['has', 'point_count']];

  map.addLayer({
    id: LAYER.areaFill,
    type: 'fill',
    source: AREA_SOURCE,
    paint: { 'fill-color': categoryColor, 'fill-opacity': ['*', 0.2, FADE] },
  });
  map.addLayer({
    id: LAYER.areaLine,
    type: 'line',
    source: AREA_SOURCE,
    paint: {
      'line-color': categoryColor,
      'line-width': 1.5,
      'line-dasharray': [2, 2],
      'line-opacity': ['*', 0.8, FADE],
    },
  });
  map.addLayer({
    id: LAYER.areaSelected,
    type: 'line',
    source: AREA_SOURCE,
    filter: noSelection,
    paint: { 'line-color': p.accent, 'line-width': 3 },
  });

  map.addLayer({
    id: LAYER.cluster,
    type: 'circle',
    source: PIN_SOURCE,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': p.paper,
      'circle-stroke-color': p.ink,
      'circle-stroke-width': 1.5,
      'circle-radius': ['step', ['get', 'point_count'], 14, 5, 17, 10, 20, 25, 24],
    },
  });
  map.addLayer({
    id: LAYER.clusterCount,
    type: 'symbol',
    source: PIN_SOURCE,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': [...FONT.regular],
      'text-size': 12,
      'text-allow-overlap': true,
    },
    paint: { 'text-color': p.ink },
  });

  map.addLayer({
    id: LAYER.pin,
    type: 'symbol',
    source: PIN_SOURCE,
    filter: notCluster,
    layout: {
      'icon-image': iconImage,
      'icon-size': touchScale,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
    paint: { 'icon-opacity': FADE },
  });

  const ringRadius = (MARKER_SIZE / 2 + 4) * touchScale;
  map.addLayer({
    id: LAYER.selectedRing,
    type: 'circle',
    source: PIN_SOURCE,
    filter: noSelection,
    paint: {
      'circle-radius': ringRadius * 1.25,
      'circle-color': 'rgba(0,0,0,0)',
      'circle-stroke-color': p.accent,
      'circle-stroke-width': 2.5,
    },
  });
  map.addLayer({
    id: LAYER.selectedPin,
    type: 'symbol',
    source: PIN_SOURCE,
    filter: noSelection,
    layout: {
      'icon-image': iconImage,
      'icon-size': touchScale * 1.25,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  });
}

/** Highlights one event (or none). Selection styling only applies to the currently shown features. */
export function setSelectedLayers(map: MapLibreMap, id: string | null): void {
  const filter: ExpressionSpecification = id === null ? noSelection : ['==', ['get', 'id'], id];
  for (const layer of [LAYER.selectedRing, LAYER.selectedPin, LAYER.areaSelected]) {
    map.setFilter(layer, filter);
  }
}

/** Story mode: dim every marker except the one with this id to 30%. Pass null to restore normal opacity. */
/** Dims every marker except the one (or the several) whose ids are given; null shows all at full strength. */
export function setDimmed(map: MapLibreMap, keep: string | readonly string[] | null): void {
  const id = keep;
  const only: ExpressionSpecification | number =
    keep === null
      ? 1
      : typeof keep === 'string'
        ? ['case', ['==', ['get', 'id'], keep], 1, DIMMED_OPACITY]
        : ['case', ['in', ['get', 'id'], ['literal', [...keep]]], 1, DIMMED_OPACITY];
  map.setPaintProperty(LAYER.pin, 'icon-opacity', ['*', FADE, only]);
  map.setPaintProperty(LAYER.areaFill, 'fill-opacity', ['*', 0.2, FADE, only]);
  map.setPaintProperty(LAYER.areaLine, 'line-opacity', ['*', 0.8, FADE, only]);
  const clusterOpacity = id === null ? 1 : DIMMED_OPACITY;
  map.setPaintProperty(LAYER.cluster, 'circle-opacity', clusterOpacity);
  map.setPaintProperty(LAYER.cluster, 'circle-stroke-opacity', clusterOpacity);
  map.setPaintProperty(LAYER.clusterCount, 'text-opacity', clusterOpacity);
}

export function updateLayerPalette(map: MapLibreMap, p: Palette): void {
  map.setPaintProperty(LAYER.cluster, 'circle-color', p.paper);
  map.setPaintProperty(LAYER.cluster, 'circle-stroke-color', p.ink);
  map.setPaintProperty(LAYER.clusterCount, 'text-color', p.ink);
  map.setPaintProperty(LAYER.selectedRing, 'circle-stroke-color', p.accent);
  map.setPaintProperty(LAYER.areaSelected, 'line-color', p.accent);
}

export function setSourceData(map: MapLibreMap, sourceId: string, data: FeatureCollection): void {
  const source = map.getSource<GeoJSONSource>(sourceId);
  source?.setData(data);
}
