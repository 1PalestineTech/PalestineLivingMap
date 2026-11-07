// The offline edition (npm run package:offline): everything the map draws comes from files in the
// package, so it works with no internet. The online basemap (OpenFreeMap: roads, borders, modern
// town names, lakes and the coast outline) is left out; the sea comes from the local distance-to-coast
// tiles and the land from the local elevation tiles. All places, events, paths and threads work as usual.

import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl';
import { luminance } from './color.ts';
import { SEA_MASK_SOURCE, seaColor, seaMaskSource } from './water.ts';
import type { Palette } from './style.ts';
import { TERRAIN_LAYERS, TERRAIN_SOURCE, terrainLayers, terrainSource } from './terrain.ts';

export const IS_OFFLINE = import.meta.env.VITE_OFFLINE === 'true';

const SEA_LAYER = 'look-offline-sea';

/** The same colour with no opacity, for the land side of the shore. */
function clear(hex: string): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0)`;
}

/** Sea tint over the open sea: the mask tiles hold -(1 + 2 x km) metres off the coast and 0 on land. */
function seaPaint(p: Palette): Record<string, unknown> {
  const sea = seaColor(p);
  // Open sea is solid; the tint fades to nothing at the shore, so the land is never covered.
  const stops = ['interpolate', ['linear'], ['elevation'], -400, sea, -1, sea, 0, clear(sea)];
  return { 'color-relief-color': stops as unknown as ExpressionSpecification, 'color-relief-opacity': luminance(p.paper) < 0.5 ? 0.95 : 0.9 };
}

/** Paint to re-apply to the offline sea layer when the theme changes, or null if `id` is not it. */
export function offlineSeaPaint(id: string, p: Palette): Record<string, unknown> | null {
  return id === SEA_LAYER ? seaPaint(p) : null;
}

export function offlineStyle(p: Palette): StyleSpecification {
  const [tint, shade] = terrainLayers(p);
  return {
    version: 8,
    // Glyph requests for our own fonts are redirected to the package (map/glyphs.ts); the path only has to match.
    glyphs: `${new URL('fonts/', document.baseURI).href}{fontstack}/{range}.pbf`,
    sources: { [TERRAIN_SOURCE]: terrainSource(), [SEA_MASK_SOURCE]: seaMaskSource() },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': p.paper2 } },
      ...(tint ? [tint] : []),
      { id: SEA_LAYER, type: 'color-relief', source: SEA_MASK_SOURCE, paint: seaPaint(p) } as StyleSpecification['layers'][number],
      ...(shade ? [shade] : []),
    ],
  };
}

export { TERRAIN_LAYERS };
