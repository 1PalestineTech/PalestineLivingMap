// Saves a small local copy of the OpenFreeMap basemap for the offline edition: npm run fetch:basemap-tiles
//
// The offline edition used to leave the online basemap out (no roads, borders, lakes or modern names). This copies the
// vector tiles that cover the map's frame (zoom 0-10; beyond that the map magnifies zoom 10), plus the "positron"
// style file, into offline-assets/basemap/. The data is OpenStreetMap (ODbL) in the OpenMapTiles layout, served by
// OpenFreeMap, which allows any use with attribution. Requests are sequential and few (a few hundred), with a
// descriptive User-Agent. Tiles are stored uncompressed so any static server can serve them as they are.

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { FRAME_CENTER, FRAME_RADII } from '../src/data/frame.ts';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'offline-assets', 'basemap');
const UA = 'PalestineLivingMap-offline-packaging/1.0 (one-off copy of a few hundred tiles; owner project)';
const MAX_ZOOM = 10;
/** Ring scale per zoom: the whole fade zone at low zoom, only near the map's clear area at the highest zooms. */
const scaleAt = (z: number): number => (z <= 8 ? 1.5 : 1.15);

const lngToX = (lng: number, z: number): number => ((lng + 180) / 360) * 2 ** z;
const latToY = (lat: number, z: number): number => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};
const xToLng = (x: number, z: number): number => (x / 2 ** z) * 360 - 180;
const yToLat = (y: number, z: number): number => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))) * 180) / Math.PI;

async function get(url: string): Promise<Buffer | null> {
  const response = await fetch(url, { headers: { 'User-Agent': UA } });
  if (response.status === 404 || response.status === 204) return null;
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

const tilejson = JSON.parse((await get('https://tiles.openfreemap.org/planet'))?.toString() ?? '{}') as { tiles?: string[] };
const template = tilejson.tiles?.[0];
if (!template) throw new Error('OpenFreeMap TileJSON has no tile URL');

let count = 0;
let bytes = 0;
for (let z = 0; z <= MAX_ZOOM; z += 1) {
  const s = scaleAt(z);
  const x0 = Math.floor(lngToX(FRAME_CENTER[0] - FRAME_RADII.lng * s, z));
  const x1 = Math.floor(lngToX(FRAME_CENTER[0] + FRAME_RADII.lng * s, z));
  const y0 = Math.floor(latToY(FRAME_CENTER[1] + FRAME_RADII.lat * s, z));
  const y1 = Math.floor(latToY(FRAME_CENTER[1] - FRAME_RADII.lat * s, z));
  for (let x = x0; x <= x1; x += 1) {
    for (let y = y0; y <= y1; y += 1) {
      const lng = xToLng(x + 0.5, z);
      const lat = yToLat(y + 0.5, z);
      const ex = (lng - FRAME_CENTER[0]) / (FRAME_RADII.lng * s);
      const ey = (lat - FRAME_CENTER[1]) / (FRAME_RADII.lat * s);
      // Tiles are bigger than the cells they cover at low zoom, so keep a margin; at high zoom keep the ellipse tight.
      if (z >= 7 && ex * ex + ey * ey > 1.15) continue;
      let tile = await get(template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y)));
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (!tile) continue;
      if (tile[0] === 0x1f && tile[1] === 0x8b) tile = gunzipSync(tile);
      const file = path.join(out, 'tiles', String(z), String(x), `${y}.pbf`);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, tile);
      count += 1;
      bytes += tile.length;
    }
  }
  console.log(`zoom ${z}: ${count} tiles so far, ${(bytes / 1048576).toFixed(1)} MB`);
}

// The style: the same "positron" style the online map uses, with the tiles read from this copy.
const style = JSON.parse((await get('https://tiles.openfreemap.org/styles/positron'))?.toString() ?? '{}') as {
  sources: Record<string, unknown>;
  sprite?: string;
  glyphs?: string;
};
delete style.sprite;
delete style.sources['ne2_shaded'];
style.sources['openmaptiles'] = {
  type: 'vector',
  // __BASE__ is replaced with the page's own address when the map loads (src/map/style.ts).
  tiles: ['__BASE__basemap/tiles/{z}/{x}/{y}.pbf'],
  minzoom: 0,
  maxzoom: MAX_ZOOM,
  attribution: '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
};
style.glyphs = '__BASE__fonts/{fontstack}/{range}.pbf';
mkdirSync(out, { recursive: true });
writeFileSync(path.join(out, 'style.json'), JSON.stringify(style));
console.log(`wrote ${count} tiles (${(bytes / 1048576).toFixed(1)} MB) and style.json to ${out}`);
