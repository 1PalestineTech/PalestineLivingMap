// Era labels (docs/SPEC_MAP_V2.md section 4): place names that change with the timeline year.
// Modules: layer.ts (map layers and data), interact.ts (tooltip, hover, click), list.ts (keyboard
// and screen-reader list), card.ts (the place card), select.ts (open and close).
// The crossfade is MapLibre's own symbol fade (the map's fadeDuration, 300 ms, none with reduced
// motion): when a place's text changes, the old name fades out as the new one fades in.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { labelAt, shownNow } from '../data/places.ts';
import type { Place } from '../data/placeTypes.ts';
import { flyToPlace } from '../map/interactions.ts';
import { isMobileLayout } from '../panel/sheet.ts';
import type { Palette } from '../map/style.ts';
import { getState, setState, subscribe } from '../state.ts';
import { createTooltip, setupLabelPointer } from './interact.ts';
import { dimOthers } from './layer.ts';
import { addLabelLayers, setLabelData, setSettlementsVisible, updateLabelPalette } from './layer.ts';
import { mountPlaceList } from './list.ts';
import { initPlaceFilterChip } from './placeFilter.ts';
import { addRegionLayers, setRegionData, updateRegionPalette } from './regions.ts';

const PLACE_ZOOM = 9;
/** On phones the place card opens as a bottom sheet over about this share of the screen. */
const SHEET_SHARE = 0.5;
const coverage = (): number => (isMobileLayout() ? window.innerHeight * SHEET_SHARE : 0);

export interface Labels {
  restyle(palette: Palette): void;
}

export function initLabels(map: MapLibreMap, places: readonly Place[], palette: Palette, beforeId: string): Labels {
  const byId = new Map(places.map((p) => [p.id, p]));
  addLabelLayers(map, places, getState().currentYear, palette, beforeId);
  addRegionLayers(map, places, getState().currentYear, palette, beforeId);
  initPlaceFilterChip(map, places);
  const tooltip = createTooltip(map);
  const list = mountPlaceList(map, places, tooltip);
  setupLabelPointer(map, byId, tooltip);

  // Only redraw when some label's text actually changed, not on every tick of the year.
  const textKey = (year: number): string =>
    places.map((p) => { const l = labelAt(p, year); return l === null || !shownNow(p, getState().selectedEventId, getState().selectedPlaceId) || (getState().placeFilter !== null && !getState().placeFilter?.ids.includes(p.id)) ? '' : `${p.id}:${l.en}|${l.ar}`; }).join(';');
  let drawn = textKey(getState().currentYear);
  const refresh = (): void => {
    const year = getState().currentYear;
    const key = textKey(year);
    if (key !== drawn) {
      drawn = key;
      setLabelData(map, places, year);
      setRegionData(map, places, year);
    }
    list.render(year);
  };
  list.render(getState().currentYear);
  map.on('moveend', () => list.render(getState().currentYear));

  // A link to an unknown place (or a place card left open) must not leave a ghost selection.
  const { selectedPlaceId } = getState();
  const restored = selectedPlaceId === null ? undefined : byId.get(selectedPlaceId);
  if (selectedPlaceId !== null && !restored) setState({ selectedPlaceId: null });
  if (restored) flyToPlace(map, restored.lng, restored.lat, Math.max(map.getZoom(), PLACE_ZOOM), true, coverage());

  subscribe((state, previous) => {
    if (state.currentYear !== previous.currentYear || state.selectedEventId !== previous.selectedEventId || state.selectedPlaceId !== previous.selectedPlaceId || state.placeFilter !== previous.placeFilter) refresh();
    if (state.showSettlements !== previous.showSettlements) {
      setSettlementsVisible(map, state.showSettlements);
      list.render(state.currentYear);
    }
    if (state.threadPlaces !== previous.threadPlaces) dimOthers(map, state.threadPlaces);
    if (state.selectedEventId !== previous.selectedEventId && state.selectedEventId !== null && state.selectedPlaceId !== null) {
      setState({ selectedPlaceId: null });
    }
    if (state.selectedPlaceId !== previous.selectedPlaceId) {
      tooltip.hide();
      const place = state.selectedPlaceId === null ? undefined : byId.get(state.selectedPlaceId);
      if (place && state.story === null) flyToPlace(map, place.lng, place.lat, Math.max(map.getZoom(), PLACE_ZOOM), false, coverage());
    }
  });

  return {
    restyle: (p) => {
      updateLabelPalette(map, p);
      updateRegionPalette(map, p);
    },
  };
}
