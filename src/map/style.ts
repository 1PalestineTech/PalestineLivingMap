// The look of the basemap: the style URL, which layers are hidden, how modern labels and borders
// are kept faint, and where the painted terrain, water and relief layers slot in. Colors come
// from the CSS tokens (src/styles/tokens.css), so light and dark themes follow.
// Terrain, water, fade and relief marks have their own modules (terrain.ts, water.ts, fade.ts).

import type { FilterSpecification, LayerSpecification, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
import { FONT } from './glyphs.ts';
import { TERRAIN_SOURCE, terrainLayers, terrainPaintFor, terrainSource } from './terrain.ts';
import { addBorderLayers, borderPaintFor } from './borders.ts';
import { addWashLayers, roadOverride, washPaintFor } from './inked.ts';
import { offlineSeaPaint } from './offline.ts';
import { addLandscapeLayers } from './landscape.ts';
import { luminance, mix } from './color.ts';
import { TREE_IMAGE } from './townIcons.ts';
import { SEA_MASK_SOURCE, seaColor, seaMaskSource, waterLayers, waterPaintFor } from './water.ts';

/** Keyless, free vector basemap (OpenFreeMap "Positron"). Attribution comes with its tiles. */
export const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

export const BASEMAP_NOTE = 'Basemap shows present-day names and boundaries. District colour blocks and dashed lines are schematic nearest-city areas, not boundaries (Filters)';

/** Tweakable values. Opacities are 0-1. */
export const LOOK = {
  /** Modern labels stay faint, under our own era labels (docs/SPEC_MAP_V2.md 3.6). */
  labelOpacity: 0.35,
  waterLabelOpacity: 0.5,
  /** Villages and small towns, from the basemap: every one is on the map, quietly. */
  villageOpacity: 0.6,
  riverOpacity: 0.75,
  treeOpacity: 0.68,
} as const;

/** Roads, land use, buildings and other clutter. Hidden entirely; the painted terrain replaces land cover. */
const HIDDEN_LAYER = /^(building|aeroway|railway|tunnel_|highway|road_|airport|park|landcover|landuse)/;

/** Villages appear from this zoom, small and quiet, in their basemap positions. */
const VILLAGE_MIN_ZOOM = 9.5;

/** Countries, cities, towns and villages keep a modern label; suburbs and points of interest do not. */
const HIDDEN_LABEL = /^(label_other|label_state|waterway_line_label)$/;

export interface Palette {
  paper: string;
  paper2: string;
  ink: string;
  ink2: string;
  rule: string;
  sea: string;
  seaInk: string;
  landLow: string;
  landMid: string;
  landHigh: string;
  accent: string;
}

export function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string): string => css.getPropertyValue(name).trim();
  return {
    paper: get('--paper'),
    paper2: get('--paper-2'),
    ink: get('--ink'),
    ink2: get('--ink-2'),
    rule: get('--rule'),
    sea: get('--sea'),
    seaInk: get('--sea-ink'),
    landLow: get('--land-low'),
    landMid: get('--land-mid'),
    landHigh: get('--land-high'),
    accent: get('--accent'),
  };
}

interface Override {
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
  hidden?: boolean;
  /** Lowest zoom at which the layer shows. */
  minzoom?: number;
}

/** Label text: English name, then the Arabic name on a second line. Never the local (Hebrew) name. */
const ENGLISH_NAME = ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];

/**
 * Owner decision (2026-11-04, replacing the earlier "Occupied Palestinian Lands" label): the map shows
 * one whole land. Where the basemap labels "Israel" it says "Palestine" in English and Arabic, and
 * the basemap's separate West Bank / Gaza labels ("Palestinian Territories") are left blank, so
 * nothing on the map splits the land into parts. Labels only; see docs/MAP_LOOK.md.
 */
const LABEL_TEXT = [
  'case',
  ['==', ENGLISH_NAME, 'Israel'],
  'Palestine\nفلسطين',
  ['in', ENGLISH_NAME, ['literal', ['Palestinian Territories', 'State of Palestine', 'Palestine', 'West Bank', 'Gaza Strip', 'Gaza']]],
  '',
  [
    'concat',
    ENGLISH_NAME,
    ['case', ['has', 'name:ar'], ['concat', '\n', ['get', 'name:ar']], ''],
  ],
];

function isLabelLayer(layer: LayerSpecification): boolean {
  return layer.type === 'symbol' && layer.layout?.['text-field'] !== undefined;
}

/** How one basemap layer should look, or null to leave it as the source style has it. */
export function overrideFor(layer: LayerSpecification, p: Palette): Override | null {
  const id = layer.id;
  // Woodland is drawn as small ink trees, only where the basemap says there is a wood.
  if (id === 'landcover_wood') return { layout: { visibility: 'visible' }, paint: { 'fill-pattern': TREE_IMAGE, 'fill-opacity': LOOK.treeOpacity } };
  const road = roadOverride(id, p);
  if (road) return road;
  if (HIDDEN_LAYER.test(id) || HIDDEN_LABEL.test(id)) return { hidden: true };

  if (layer.type === 'background') return { paint: { 'background-color': p.paper2 } };

  if (id === 'water') return { paint: { 'fill-color': seaColor(p) } };
  // Prefix rules also match label layers (e.g. "waterway_line_label"), so check the type too.
  if (layer.type === 'line' && id.startsWith('waterway')) {
    // Rivers as thin ink lines (sea-ink on the night chart), the Jordan and Yarmouk a little heavier.
    const name: unknown = ['coalesce', ['get', 'name_en'], ['get', 'name']];
    const major: unknown = ['in', name, ['literal', ['Jordan River', 'Yarmouk River']]];
    const width = (small: number, big: number): unknown => ['case', major, big, small];
    return {
      paint: {
        'line-color': luminance(p.paper) < 0.5 ? p.seaInk : mix(p.ink, p.paper2, 0.2),
        'line-opacity': LOOK.riverOpacity,
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, width(0.5, 1.4), 12, width(1.4, 3.2)],
      },
    };
  }

  if (layer.type === 'line' && id.startsWith('boundary')) {
    const paint = borderPaintFor(id, p);
    return paint ? { paint } : null;
  }

  if (isLabelLayer(layer)) {
    const isWater = id.startsWith('water');
    const village = id === 'label_village';
    const font = isWater || id === 'label_other' ? FONT.italic : /^label_(country|city)/.test(id) ? FONT.cityBold : FONT.regular;
    return {
      layout: { 'text-field': LABEL_TEXT, 'text-font': [...font] },
      paint: {
        'text-color': isWater ? p.seaInk : p.ink2,
        'text-halo-color': p.paper2,
        'text-opacity': isWater ? LOOK.waterLabelOpacity : village ? LOOK.villageOpacity : LOOK.labelOpacity,
      },
      ...(village ? { minzoom: VILLAGE_MIN_ZOOM } : {}),
    };
  }
  return null;
}

/** Applies the palette to a style document before the map is created (no flash of default colors). */
export function stylize(style: StyleSpecification, p: Palette): StyleSpecification {
  for (const layer of style.layers) {
    const override = overrideFor(layer, p);
    if (!override) continue;
    // Layer types each have their own paint/layout shape; the overrides are plain property bags.
    const target = layer as { layout?: Record<string, unknown>; paint?: Record<string, unknown> };
    if (override.minzoom !== undefined) (layer as { minzoom?: number }).minzoom = override.minzoom;
    if (override.hidden) {
      target.layout = { ...(target.layout ?? {}), visibility: 'none' };
    } else {
      if (override.layout) target.layout = { ...(target.layout ?? {}), ...override.layout };
      if (override.paint) target.paint = { ...(target.paint ?? {}), ...override.paint };
    }
  }
  addBorderLayers(style);
  addWashLayers(style, p);
  addLandscapeLayers(style);
  return addLookLayers(style, p);
}

/** Splices the painted terrain under the water and the coast ink and waves just above it. */
function addLookLayers(style: StyleSpecification, p: Palette): StyleSpecification {
  style.sources[TERRAIN_SOURCE] = terrainSource();
  style.sources[SEA_MASK_SOURCE] = seaMaskSource();
  const firstLand = style.layers.findIndex((l) => l.type !== 'background');
  style.layers.splice(firstLand === -1 ? style.layers.length : firstLand, 0, ...terrainLayers(p));
  const water = style.layers.find((l) => l.id === 'water');
  const filter = (water as { filter?: FilterSpecification } | undefined)?.filter;
  const at = style.layers.findIndex((l) => l.id === 'water');
  if (at !== -1) style.layers.splice(at + 1, 0, ...waterLayers(filter, p));
  return style;
}

/** Re-colors a live map, used when the theme changes. */
export function restyle(map: MapLibreMap, p: Palette): void {
  for (const layer of map.getStyle().layers) {
    // Our own layers (layers.ts, overlays.ts, fade.ts, labels/) manage their own colors.
    if (layer.id.startsWith('event-') || layer.id.startsWith('overlay-') || layer.id.startsWith('era-') || layer.id === 'look-fade') continue;
    const paint = layer.id.startsWith('look-')
      ? terrainPaintFor(layer.id, p) ?? waterPaintFor(layer.id, p) ?? washPaintFor(layer.id, p) ?? offlineSeaPaint(layer.id, p)
      : overrideFor(layer, p)?.paint;
    if (!paint) continue;
    for (const [name, value] of Object.entries(paint)) {
      map.setPaintProperty(
        layer.id,
        name as Parameters<MapLibreMap['setPaintProperty']>[1],
        value as Parameters<MapLibreMap['setPaintProperty']>[2],
      );
    }
  }
}

/** Plain parchment-and-sea style used when the basemap can't be fetched, so markers still work. */
export function fallbackStyle(p: Palette): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [{ id: 'background', type: 'background', paint: { 'background-color': p.paper2 } }],
  };
}

let pending: Promise<StyleSpecification> | null = null;

/** Starts fetching the basemap style now, so it downloads while the event data does. Safe to call twice. */
export function preloadBaseStyle(): void {
  pending ??= fetchBaseStyle();
  pending.catch(() => undefined); // the error surfaces where loadBaseStyle() is awaited
}

async function fetchBaseStyle(): Promise<StyleSpecification> {
  // The offline edition reads the same style and a local copy of its tiles from its own folder (scripts/fetch-basemap-tiles.ts).
  const offline = import.meta.env.VITE_OFFLINE === 'true';
  const response = await fetch(offline ? new URL('basemap/style.json', document.baseURI).href : STYLE_URL);
  if (!response.ok) throw new Error(`Basemap style returned ${response.status}`);
  if (!offline) return (await response.json()) as StyleSpecification;
  const text = (await response.text()).replaceAll('__BASE__', new URL('./', document.baseURI).href);
  return JSON.parse(text) as StyleSpecification;
}

export function loadBaseStyle(): Promise<StyleSpecification> {
  pending ??= fetchBaseStyle();
  // A failed preload must not stick: the next call tries again.
  const attempt = pending;
  attempt.catch(() => {
    if (pending === attempt) pending = null;
  });
  return attempt;
}
