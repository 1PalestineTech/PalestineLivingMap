// Painted terrain: elevation tints (color-relief) and relief shading (hillshade) from the local
// elevation tiles in public/terrain (see docs/TERRAIN.md). Colours come from the palette tokens.

import type { ExpressionSpecification, LayerSpecification, SourceSpecification } from 'maplibre-gl';
import { frameBounds, TERRAIN_MAX_ZOOM, TERRAIN_MIN_ZOOM } from '../data/frame.ts';
import { luminance, mix } from './color.ts';
import { strengthParams } from './look.ts';
import type { Palette } from './style.ts';

export const TERRAIN_SOURCE = 'terrain-dem';
export const TERRAIN_LAYERS = { tint: 'look-terrain-tint', shade: 'look-terrain-shade' } as const;

/** Shown in the map attribution. Keep in step with docs/TERRAIN.md. */
export const TERRAIN_ATTRIBUTION =
  'Terrain: SRTM and GMTED2010 data courtesy of the U.S. Geological Survey; ETOPO1 data, NOAA; ' +
  'Cyprus: produced using Copernicus data and information funded by the European Union (EU-DEM). Heights rounded to whole metres.';

export function terrainSource(): SourceSpecification {
  const [[west, south], [east, north]] = frameBounds();
  return {
    type: 'raster-dem',
    // Built as a string: new URL() would percent-encode the {z}/{x}/{y} placeholders.
    tiles: [`${new URL('terrain/', document.baseURI).href}{z}/{x}/{y}.png`],
    encoding: 'terrarium',
    tileSize: 256,
    minzoom: TERRAIN_MIN_ZOOM,
    maxzoom: TERRAIN_MAX_ZOOM,
    bounds: [west, south, east, north],
    attribution: TERRAIN_ATTRIBUTION,
  };
}

/** Hypsometric tint stops (metres to colour), per docs/SPEC_MAP_V2.md 3.2. */
export function elevationStops(p: Palette): [number, string][] {
  // The night chart's tokens are already close to its paper, so pull them less.
  const pulled = luminance(p.paper) < 0.5 ? strengthParams().tintMix * 0.4 : strengthParams().tintMix;
  const dark = luminance(p.paper) < 0.5;
  // On the night chart, lift the earth tones a little so the relief still reads against the dark paper.
  const pull = (color: string): string => {
    const eased = mix(color, p.paper2, pulled);
    return dark ? mix(eased, p.ink2, 0.14) : eased;
  };
  const low = pull(p.landLow);
  const mid = pull(p.landMid);
  const high = pull(p.landHigh);
  return [
    [-440, pull(mix(p.sea, p.landLow, 0.5))],
    [0, low],
    [200, mix(low, mid, 0.5)],
    [500, mid],
    [900, mix(mid, high, 0.5)],
    [1200, high],
    [1500, high],
    [2800, mix(high, p.paper, 0.55)],
  ];
}

function tintColor(p: Palette): ExpressionSpecification {
  const stops = elevationStops(p).flat();
  return ['interpolate', ['linear'], ['elevation'], ...stops] as unknown as ExpressionSpecification;
}

/** Light from the northwest (315 degrees), the cartographic convention. */
function shadePaint(p: Palette): Record<string, string | number> {
  const dark = luminance(p.paper) < 0.5;
  return {
    'hillshade-method': 'standard',
    'hillshade-illumination-direction': 315,
    'hillshade-illumination-altitude': 45,
    'hillshade-exaggeration': dark ? Math.min(1, strengthParams().shade + 0.2) : strengthParams().shade,
    'hillshade-shadow-color': dark ? '#0b0a08' : p.ink,
    'hillshade-highlight-color': dark ? mix(p.paper, p.ink, 0.22) : p.paper,
    'hillshade-accent-color': dark ? '#0b0a08' : p.ink2,
  };
}

export function terrainLayers(p: Palette): LayerSpecification[] {
  return [
    {
      id: TERRAIN_LAYERS.tint,
      type: 'color-relief',
      source: TERRAIN_SOURCE,
      paint: { 'color-relief-color': tintColor(p), 'color-relief-opacity': strengthParams().reliefOpacity },
    },
    { id: TERRAIN_LAYERS.shade, type: 'hillshade', source: TERRAIN_SOURCE, paint: shadePaint(p) } as LayerSpecification,
  ];
}

/** Paint values to re-apply when the theme changes, or null if the id is not a terrain layer. */
export function terrainPaintFor(id: string, p: Palette): Record<string, unknown> | null {
  if (id === TERRAIN_LAYERS.tint) return { 'color-relief-color': tintColor(p) };
  if (id === TERRAIN_LAYERS.shade) return shadePaint(p);
  return null;
}
