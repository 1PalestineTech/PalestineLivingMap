// Map core: MapLibre map, muted basemap, event markers, year filtering, controls.
// Modules: style.ts (look), markers.ts (icons), features.ts + layers.ts (data and layers),
// visibility.ts (year filter and fades), interactions.ts (hover, click, camera), controls.ts.

import { Map as MapLibreMap, setWorkerUrl } from 'maplibre-gl';
import type { LngLatBoundsLike } from 'maplibre-gl';
// MapLibre locates its worker next to its own script, which breaks once Vite bundles it.
// The worker file is self-contained, so Vite can serve it as a plain asset.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import type { MapLayer } from '../data/layerTypes.ts';
import type { ResolvedPath } from '../data/pathTypes.ts';
import type { Place } from '../data/placeTypes.ts';
import { initPaths } from '../paths/index.ts';
import { initLabels } from '../labels/index.ts';
import { frameBounds } from '../data/frame.ts';
import { HOME_BOUNDS } from '../data/region.ts';
import type { LngLatBox } from '../data/region.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { showStatus } from '../status.ts';
import { getState, subscribe } from '../state.ts';
import { registerCamera } from './camera.ts';
import { addControls } from './controls.ts';
import { transformGlyphRequest } from './glyphs.ts';
import { FADE_LAYER, addFade, updateFadePalette } from './fade.ts';
import { setupLookImages } from './images.ts';
import { flyToPlace, setupInteractions } from './interactions.ts';
import { LAYER, addEventLayers, setDimmed, updateLayerPalette } from './layers.ts';
import { activeStrength, saveLook } from './look.ts';
import { markerHalo, registerMarkerImages } from './markers.ts';
import { initOverlays } from './overlays.ts';
import { addReliefMarks } from './relief.ts';
import { addShips } from './ships.ts';
import { setControl, updateControlPalette } from './control.ts';
import { setLakes, updateLakesPalette } from './lakes.ts';
import { setDistricts, updateDistrictPalette } from './districts.ts';
import { setIllustrated, updateIllustratedPalette } from './illustrated.ts';
import { isLight } from './perf.ts';
import { addGrain, mountPaper } from './paper.ts';
import { BASEMAP_NOTE, fallbackStyle, loadBaseStyle, readPalette, restyle, stylize } from './style.ts';
import { LANDSCAPE_LAYER_IDS } from './landscape.ts';
import { createVisibility } from './visibility.ts';
import { IS_OFFLINE, offlineStyle } from './offline.ts';
import { MAX_PITCH, applySky, applyView, pitchFor, readViewMode, setTerrain } from './view.ts';
import type { ViewMode } from './view.ts';

const toBounds = (box: LngLatBox): LngLatBoundsLike => [
  [box[0][0], box[0][1]],
  [box[1][0], box[1][1]],
];
/**
 * The camera can't leave the edge-fade frame. The frame is wider than tall, so the sides get a
 * little extra room (solid paper) and wide screens still fit the whole home view.
 */
const MAX_BOUNDS: LngLatBoundsLike = (() => {
  const [[west, south], [east, north]] = frameBounds();
  const extra = (east - west) * 0.1;
  return [
    [west - extra, south],
    [east + extra, north],
  ];
})();
const HOME_PADDING = 24;
const MIN_ZOOM = 6.4;
const MAX_ZOOM = 14;

setWorkerUrl(workerUrl);

export async function initMap(
  container: HTMLElement,
  events: readonly HistoricalEvent[],
  layers: readonly MapLayer[] = [],
  places: readonly Place[] = [],
  paths: readonly ResolvedPath[] = [],
): Promise<MapLibreMap> {
  document.documentElement.dataset.look = activeStrength();
  let palette = readPalette();

  let style;
  try {
    style = stylize(await loadBaseStyle(), palette);
  } catch (err) {
    console.error(err);
    if (IS_OFFLINE) {
      // The package's own basemap copy is missing: draw the land from elevation alone.
      style = offlineStyle(palette);
    } else {
      showStatus({
        title: 'The basemap could not load',
        detail: 'Event markers still work, but the background map is unavailable. Check your connection and reload.',
      });
      style = fallbackStyle(palette);
    }
  }

  const map = new MapLibreMap({
    container,
    style,
    bounds: toBounds(HOME_BOUNDS),
    fitBoundsOptions: { padding: HOME_PADDING },
    maxBounds: MAX_BOUNDS,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    transformRequest: transformGlyphRequest,
    // Symbols (the era labels among them) fade over 300 ms when they change; none with reduced motion.
    fadeDuration: window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLight() ? 0 : 300,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    maxPitch: MAX_PITCH,
    // Phones draw at up to 3x; capping the pixel ratio cuts fill work a lot for little visible loss on this style.
    pixelRatio: isLight() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
    renderWorldCopies: false,
    // Full text on wide screens; on phones the longer credits (terrain data licences) fold behind the (i) button.
    attributionControl: { compact: window.matchMedia('(max-width: 600px)').matches, customAttribution: BASEMAP_NOTE },
  });
  const images = setupLookImages(map, () => palette);
  mountPaper(container);
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();

  let viewMode: ViewMode = readViewMode();
  const fit = (box: LngLatBox, animate: boolean): void => {
    map.fitBounds(toBounds(box), { padding: HOME_PADDING, duration: animate ? 800 : 0, pitch: pitchFor(viewMode) });
  };
  addControls(map, (animate) => fit(HOME_BOUNDS, animate), {
    getMode: () => viewMode,
    toggle: () => {
      viewMode = viewMode === 'tilted' ? 'flat' : 'tilted';
      applyView(map, viewMode, true);
    },
  }, {
    current: activeStrength() === 'inked' ? 'inked' : 'strong',
    // The two looks build different map layers, so a switch reloads the page.
    choose: (look) => {
      saveLook(look);
      window.location.reload();
    },
  });
  registerCamera({
    fitBounds: (box) => fit(box, !window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    flyTo: (lng, lat, zoom, bottomInset) => flyToPlace(map, lng, lat, zoom, false, bottomInset),
  });

  map.on('error', (e) => console.warn('Map error:', e.error));

  await new Promise<void>((resolve) => map.once('load', () => resolve()));
  // In its compact (phone) form MapLibre starts with the credits open; fold them until asked for.
  container.querySelector('.maplibregl-ctrl-attrib.maplibregl-compact')?.removeAttribute('open');
  container.querySelector('.maplibregl-ctrl-attrib.maplibregl-compact')?.classList.remove('maplibregl-compact-show');
  container.dataset.attribReady = 'true';
  addGrain(container);
  applySky(map, palette);
  // First paint stays flat and light. Once the map has drawn, the landscape patterns switch on and, in the
  // default tilted view, the camera eases down into the 3D view.
  map.once('idle', () => {
    for (const id of LANDSCAPE_LAYER_IDS) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'visible');
    if (viewMode !== 'tilted') return;
    const untouched = getState().selectedEventId === null && getState().selectedPlaceId === null;
    if (untouched) {
      setTerrain(map, true);
      fit(HOME_BOUNDS, true);
    } else {
      applyView(map, viewMode, true);
    }
  });

  registerMarkerImages(map, markerHalo(palette.paper, palette.ink));
  addEventLayers(map, palette);
  const visibility = createVisibility(map, events);
  setupInteractions(map, events);
  const overlays = initOverlays(map, layers, palette);
  addFade(map, palette, LAYER.areaFill);
  const labels = initLabels(map, places, palette, FADE_LAYER);
  // Paths sit above the edge fade and under the markers, so they are never washed out.
  const pathLayer = initPaths(map, events, paths, palette, LAYER.areaFill);
  void addReliefMarks(map);
  if (!isLight()) addShips(map, FADE_LAYER);
  if (getState().illustratedBase) setIllustrated(map, true, palette);
  const { districtBlocks, districtLines } = getState();
  if (districtBlocks || districtLines) setDistricts(map, districtBlocks, districtLines, places, palette);

  visibility.refresh();
  subscribe((state, previous) => {
    if (state.illustratedBase !== previous.illustratedBase) setIllustrated(map, state.illustratedBase, palette);
    if (state.controlZones !== previous.controlZones || (state.controlZones && state.currentYear !== previous.currentYear)) {
      void setControl(map, state.controlZones, state.currentYear, palette);
    }
    if (state.lakes1946 !== previous.lakes1946 || (state.lakes1946 && state.currentYear !== previous.currentYear)) {
      setLakes(map, state.lakes1946, state.currentYear, palette);
    }
    // The district areas are off unless chosen in Filters, but show while a story runs.
    const inStory = state.story !== null;
    if (state.districtBlocks !== previous.districtBlocks || state.districtLines !== previous.districtLines || inStory !== (previous.story !== null) || state.controlZones !== previous.controlZones) {
      // The colour blocks give way to the control zones, so the two never muddy each other; the dashed lines stay.
      setDistricts(map, (state.districtBlocks || inStory) && !state.controlZones, state.districtLines || inStory, places, palette);
    }
    if (state.currentYear !== previous.currentYear || state.activeCategories !== previous.activeCategories || state.selectedEventId !== previous.selectedEventId) {
      visibility.refresh();
    }
    if (
      state.dimOthers !== previous.dimOthers ||
      state.selectedEventId !== previous.selectedEventId ||
      state.threadEvents !== previous.threadEvents ||
      state.story !== previous.story
    ) {
      // A story dims all but its step; following a thread dims all but the thread's events.
      const storyStep = state.story !== null && state.dimOthers ? state.selectedEventId : null;
      setDimmed(map, storyStep ?? state.threadEvents);
    }
  });

  // Follow the light/dark theme, whether it comes from the system or from data-theme.
  const applyTheme = (): void => {
    palette = readPalette();
    restyle(map, palette);
    applySky(map, palette);
    registerMarkerImages(map, markerHalo(palette.paper, palette.ink));
    updateLayerPalette(map, palette);
    overlays.restyle(palette);
    updateFadePalette(map, palette);
    labels.restyle(palette);
    pathLayer.restyle(palette);
    images.restyle();
    updateIllustratedPalette(map, palette);
    updateDistrictPalette(map, palette);
    updateControlPalette(map, palette);
    updateLakesPalette(map, palette);
  };
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return map;
}
