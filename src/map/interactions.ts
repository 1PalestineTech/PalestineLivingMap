// Hover tooltip, click-to-select, cluster expansion, and flying to the selected event.
// Selection lives in app state, so anything that sets selectedEventId (search, story mode)
// gets the same camera move and highlight.

import { Popup } from 'maplibre-gl';
import type { GeoJSONSource, Map as MapLibreMap, MapGeoJSONFeature } from 'maplibre-gl';
import { formatEventDate } from '../data/format.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { getState, setState, subscribe } from '../state.ts';
import { zoomForPrecision } from './camera.ts';
import { LABEL_LAYERS } from '../labels/layer.ts';
import { INTERACTIVE_LAYERS, LAYER, PIN_SOURCE, setSelectedLayers } from './layers.ts';

const FLY_MIN_MS = 800;
const FLY_MAX_MS = 1600;

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function featureAt(map: MapLibreMap, point: { x: number; y: number }): MapGeoJSONFeature | undefined {
  return map.queryRenderedFeatures([point.x, point.y], { layers: INTERACTIVE_LAYERS })[0];
}

/** How close (pixels) a click must be to a marker's centre for the marker to win over a place label under it. */
export const MARKER_PRIORITY_PX = 14;

/** True when a place label is under the point and the marker found there is not right under the pointer. */
export function labelBeatsMarker(map: MapLibreMap, point: { x: number; y: number }, marker: MapGeoJSONFeature | undefined): boolean {
  if (map.queryRenderedFeatures([point.x, point.y], { layers: [...LABEL_LAYERS] }).length === 0) return false;
  if (!marker || marker.geometry.type !== 'Point') return true;
  const [lng, lat] = marker.geometry.coordinates;
  if (lng === undefined || lat === undefined) return true;
  const at = map.project([lng, lat]);
  return Math.hypot(at.x - point.x, at.y - point.y) > MARKER_PRIORITY_PX;
}

function flightDuration(map: MapLibreMap, lng: number, lat: number): number {
  const center = map.getCenter();
  const degrees = Math.hypot(center.lng - lng, center.lat - lat);
  return Math.min(FLY_MAX_MS, FLY_MIN_MS + degrees * 150);
}

export function setupInteractions(map: MapLibreMap, events: readonly HistoricalEvent[]): void {
  const byId = new Map(events.map((e) => [e.id, e]));
  const tooltip = new Popup({ closeButton: false, closeOnClick: false, offset: 14, className: 'map-tooltip' });
  const canvas = map.getCanvas();

  function showTooltip(event: HistoricalEvent, lng: number, lat: number): void {
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = event.title;
    const date = document.createElement('span');
    date.textContent = formatEventDate(event);
    content.append(title, date);
    tooltip.setLngLat([lng, lat]).setDOMContent(content).addTo(map);
  }

  map.on('mousemove', (e) => {
    const feature = featureAt(map, e.point);
    const id = feature?.layer.id === LAYER.cluster ? undefined : (feature?.properties?.['id'] as string | undefined);
    const event = id === undefined ? undefined : byId.get(id);
    canvas.style.cursor = feature ? 'pointer' : '';
    if (event) showTooltip(event, e.lngLat.lng, e.lngLat.lat);
    else tooltip.remove();
  });
  map.on('mouseout', () => tooltip.remove());

  map.on('click', (e) => {
    const feature = featureAt(map, e.point);
    // A place label that the pointer is really on takes the click (the label module opens its card).
    if (labelBeatsMarker(map, e.point, feature)) return;
    if (!feature) {
      if (getState().story === null) setState({ selectedEventId: null });
      return;
    }
    if (feature.layer.id === LAYER.cluster) {
      void expandCluster(map, feature);
      return;
    }
    const id = feature.properties?.['id'];
    // Picking a marker during a story ends the story and opens that card.
    if (typeof id === 'string') setState({ selectedEventId: id, isPlaying: false, story: null, dimOthers: false });
  });

  subscribe((state, previous) => {
    if (state.selectedEventId === previous.selectedEventId) return;
    setSelectedLayers(map, state.selectedEventId);
    const event = state.selectedEventId === null ? undefined : byId.get(state.selectedEventId);
    // During a story the story module steers the camera.
    if (event && state.story === null) flyToEvent(map, event);
  });
  setSelectedLayers(map, getState().selectedEventId);
  const initial = getState().selectedEventId === null ? undefined : byId.get(getState().selectedEventId ?? '');
  if (initial) flyToPlace(map, initial.location.lng, initial.location.lat, zoomForPrecision(initial.location.precision), true);
}

async function expandCluster(map: MapLibreMap, feature: MapGeoJSONFeature): Promise<void> {
  const clusterId = feature.properties?.['cluster_id'];
  if (typeof clusterId !== 'number' || feature.geometry.type !== 'Point') return;
  const source = map.getSource<GeoJSONSource>(PIN_SOURCE);
  if (!source) return;
  const zoom = await source.getClusterExpansionZoom(clusterId);
  const [lng, lat] = feature.geometry.coordinates;
  if (lng === undefined || lat === undefined) return;
  const target = { center: [lng, lat] as [number, number], zoom };
  if (prefersReducedMotion()) map.jumpTo(target);
  else map.easeTo({ ...target, duration: 500 });
}

function flyToEvent(map: MapLibreMap, event: HistoricalEvent): void {
  const { lng, lat, precision } = event.location;
  // Zoom in to the place, but never out from where the reader already is.
  flyToPlace(map, lng, lat, Math.max(map.getZoom(), zoomForPrecision(precision)), false);
}

/**
 * Flies to a point at an exact zoom (null keeps the current one), or jumps with reduced motion or
 * when instant. bottomInset is the height of something covering the bottom of the map (the story
 * overlay), so the point lands in the visible part.
 */
export function flyToPlace(
  map: MapLibreMap,
  lng: number,
  lat: number,
  zoom: number | null,
  instant: boolean,
  bottomInset = 0,
): void {
  const target = { center: [lng, lat] as [number, number], zoom: zoom ?? map.getZoom(), offset: [0, -bottomInset / 2] as [number, number] };
  if (instant || prefersReducedMotion()) map.easeTo({ ...target, duration: 0 });
  else map.flyTo({ ...target, duration: flightDuration(map, lng, lat), essential: false });
}
