// Self-hosted glyph files. The basemap style points at OpenFreeMap's fonts, but our two display
// families are served from public/glyphs (see docs/GLYPHS.md), so requests for them are redirected
// here. MapLibre draws Arabic shaping and right-to-left order itself; no text plugin is needed.

import type { RequestParameters, ResourceType } from 'maplibre-gl';

export const FONT = {
  cityBold: ['Almendra Bold', 'IBM Plex Sans Arabic Medium'],
  regular: ['Almendra Regular', 'IBM Plex Sans Arabic Regular'],
  italic: ['Almendra Italic', 'IBM Plex Sans Arabic Regular'],
} as const;

const OWN_FONT = /\/fonts\/((?:Almendra|IBM)(?:%20| )[^/]*)\/(\d+-\d+\.pbf)$/;

/**
 * MapLibre asks for a whole `text-font` list as one comma-joined stack ("A,B"), which a font server
 * would merge on the fly. Static hosting can't, so scripts/build-glyphs.ts writes one merged folder
 * per stack in FONT below, named exactly like the request.
 */
export function transformGlyphRequest(url: string, resourceType: ResourceType | undefined): RequestParameters | undefined {
  if (resourceType !== 'Glyphs') return undefined;
  const match = OWN_FONT.exec(url);
  if (!match?.[1] || !match[2]) return undefined;
  const stack = encodeURIComponent(decodeURIComponent(match[1])).replace(/%2C/g, ',');
  return { url: `${new URL('glyphs/', document.baseURI).href}${stack}/${match[2]}` };
}
