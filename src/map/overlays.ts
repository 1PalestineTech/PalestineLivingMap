// Optional map layers (overlays) from public/data/layers/: GeoJSON shapes shown only while
// the reader has switched them on and the current year is within the layer's validFrom..validTo.
// They fade in and out, sit under the event markers, and have a legend with a source link.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { LAYERS_DIR_URL, layerActiveInYear } from '../data/loadLayers.ts';
import type { MapLayer } from '../data/layerTypes.ts';
import { getState, setState, subscribe } from '../state.ts';
import { LAYER } from './layers.ts';
import { createLegend } from './legend.ts';
import type { Palette } from './style.ts';

const FADE_MS = 400;
const FILL_OPACITY = 0.14;
const LINE_OPACITY = 0.85;

const ids = (layer: MapLayer): { source: string; fill: string; line: string; label: string } => ({
  source: `overlay-${layer.id}`,
  fill: `overlay-fill-${layer.id}`,
  line: `overlay-line-${layer.id}`,
  label: `overlay-label-${layer.id}`,
});

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface Overlays {
  restyle(palette: Palette): void;
}

export function initOverlays(map: MapLibreMap, layers: readonly MapLayer[], palette: Palette): Overlays {
  const legend = createLegend();

  // Drop layer ids from the URL that don't exist (typos, removed layers).
  const known = new Set(layers.map((l) => l.id));
  const requested = getState().activeOverlays;
  if ([...requested].some((id) => !known.has(id))) {
    setState({ activeOverlays: new Set([...requested].filter((id) => known.has(id))) });
  }

  for (const layer of layers) {
    const n = ids(layer);
    const data = new URL(`${LAYERS_DIR_URL}${layer.file}`, window.location.href).href;
    map.addSource(n.source, { type: 'geojson', data });
    // Under the event layers so markers stay on top.
    map.addLayer(
      { id: n.fill, type: 'fill', source: n.source, paint: { 'fill-color': palette.accent, 'fill-opacity': 0 } },
      LAYER.areaFill,
    );
    map.addLayer(
      {
        id: n.line,
        type: 'line',
        source: n.source,
        paint: { 'line-color': palette.accent, 'line-width': 1.5, 'line-dasharray': [4, 2], 'line-opacity': 0 },
      },
      LAYER.areaFill,
    );
    map.addLayer(
      {
        id: n.label,
        type: 'symbol',
        source: n.source,
        layout: { 'text-field': ['get', 'label'], 'text-font': ['Noto Sans Regular'], 'text-size': 12 },
        paint: { 'text-color': palette.accent, 'text-halo-color': palette.paper, 'text-halo-width': 1.5, 'text-opacity': 0 },
      },
      LAYER.areaFill,
    );
  }

  function update(): void {
    const { currentYear, activeOverlays } = getState();
    const duration = prefersReducedMotion() ? 0 : FADE_MS;
    const shown: MapLayer[] = [];
    for (const layer of layers) {
      const n = ids(layer);
      const on = activeOverlays.has(layer.id) && layerActiveInYear(layer, currentYear);
      if (on) shown.push(layer);
      map.setPaintProperty(n.fill, 'fill-opacity-transition', { duration, delay: 0 });
      map.setPaintProperty(n.line, 'line-opacity-transition', { duration, delay: 0 });
      map.setPaintProperty(n.label, 'text-opacity-transition', { duration, delay: 0 });
      map.setPaintProperty(n.fill, 'fill-opacity', on ? FILL_OPACITY : 0);
      map.setPaintProperty(n.line, 'line-opacity', on ? LINE_OPACITY : 0);
      map.setPaintProperty(n.label, 'text-opacity', on ? 1 : 0);
    }
    legend.update(shown);
  }

  update();
  subscribe((state, previous) => {
    if (state.currentYear !== previous.currentYear || state.activeOverlays !== previous.activeOverlays) update();
  });

  return {
    restyle(next) {
      for (const layer of layers) {
        const n = ids(layer);
        map.setPaintProperty(n.fill, 'fill-color', next.accent);
        map.setPaintProperty(n.line, 'line-color', next.accent);
        map.setPaintProperty(n.label, 'text-color', next.accent);
        map.setPaintProperty(n.label, 'text-halo-color', next.paper);
      }
    },
  };
}
