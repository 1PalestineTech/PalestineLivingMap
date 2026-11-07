// Makes label-free shape references of the land (a plain silhouette and a shaded relief) to upload to image
// generators with docs/BASEMAP_PROMPTS.md: npm run build:reference-images. Output: basemap-art/reference/.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { loadHeightGrid, lngToX, latToY } from './lib/dem.ts';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'basemap-art', 'reference');
mkdirSync(outDir, { recursive: true });

const grid = await loadHeightGrid(path.join(root, 'public/terrain'));

// Sea mask tiles (zoom 8): negative terrarium values are sea.
const SEA_Z = 8;
const seaCache = new Map<string, PNG | null>();
function seaAt(lng: number, lat: number): number {
  const fx = lngToX(lng, SEA_Z);
  const fy = latToY(lat, SEA_Z);
  const tx = Math.floor(fx);
  const ty = Math.floor(fy);
  const key = `${tx}/${ty}`;
  if (!seaCache.has(key)) {
    try {
      seaCache.set(key, PNG.sync.read(readFileSync(path.join(root, 'public/terrain-sea', String(SEA_Z), String(tx), `${ty}.png`))));
    } catch {
      seaCache.set(key, null);
    }
  }
  const png = seaCache.get(key);
  if (!png) return 0;
  const px = Math.min(255, Math.floor((fx - tx) * 256));
  const py = Math.min(255, Math.floor((fy - ty) * 256));
  const i = (py * 256 + px) * 4;
  return (png.data[i] ?? 0) * 256 + (png.data[i + 1] ?? 0) + (png.data[i + 2] ?? 0) / 256 - 32768;
}

const west = 34.1;
const east = 36.1;
const north = 33.6;
const merc = (lat: number): number => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const spanX = ((east - west) * Math.PI) / 180;
const spanY = spanX * 2.5; // 2:5 portrait
const southMerc = merc(north) - spanY;
const south = (2 * Math.atan(Math.exp(southMerc)) - Math.PI / 2) * (180 / Math.PI);
const W = 1000;
const H = 2500;
console.log('south', south.toFixed(3));

const heightAt = (lng: number, lat: number): number => {
  const [c, r] = grid.cellAt(lng, lat);
  const x = Math.min(grid.width - 2, Math.max(1, c));
  const y = Math.min(grid.height - 2, Math.max(1, r));
  return grid.heights[y * grid.width + x] ?? 0;
};

const sil = new PNG({ width: W, height: H });
const rel = new PNG({ width: W, height: H });
const set = (png: PNG, x: number, y: number, rgb: readonly [number, number, number]): void => {
  const i = (y * W + x) * 4;
  png.data[i] = rgb[0];
  png.data[i + 1] = rgb[1];
  png.data[i + 2] = rgb[2];
  png.data[i + 3] = 255;
};
const mixc = (a: readonly number[], b: readonly number[], t: number): [number, number, number] => [
  Math.round((a[0] ?? 0) + ((b[0] ?? 0) - (a[0] ?? 0)) * t),
  Math.round((a[1] ?? 0) + ((b[1] ?? 0) - (a[1] ?? 0)) * t),
  Math.round((a[2] ?? 0) + ((b[2] ?? 0) - (a[2] ?? 0)) * t),
];

const SEA = [120, 150, 160] as const;
const LAND = [226, 208, 160] as const;
const LOW = [150, 170, 95] as const;
const MID = [205, 185, 120] as const;
const HIGH = [140, 110, 80] as const;

const lngLatOf = (x: number, y: number): [number, number] => {
  const lng = west + ((x + 0.5) / W) * (east - west);
  const m = merc(north) - ((y + 0.5) / H) * spanY;
  return [lng, (2 * Math.atan(Math.exp(m)) - Math.PI / 2) * (180 / Math.PI)];
};

for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    const [lng, lat] = lngLatOf(x, y);
    const h0 = heightAt(lng, lat);
    // Open water: the Mediterranean from the sea mask, the Gulf of Aqaba, and the two lakes (flat surfaces in the elevation data).
    const gulf = lat < 29.58 && lng > 34.7 && h0 < -2;
    const deadSea = lat > 30.95 && lat < 31.8 && lng > 35.3 && lng < 35.65 && h0 <= -412;
    const galilee = lat > 32.68 && lat < 32.9 && lng > 35.45 && lng < 35.68 && h0 <= -205;
    const sea = seaAt(lng, lat) < 0 || gulf || deadSea || galilee;
    if (sea) {
      set(sil, x, y, SEA);
      set(rel, x, y, SEA);
      continue;
    }
    set(sil, x, y, LAND);
    const h = heightAt(lng, lat);
    const [c, r] = grid.cellAt(lng, lat);
    const g = (dx: number, dy: number): number => grid.heights[Math.min(grid.height - 1, Math.max(0, r + dy)) * grid.width + Math.min(grid.width - 1, Math.max(0, c + dx))] ?? 0;
    // Hillshade, light from the north-west, vertical exaggeration 3.
    const dzdx = ((g(1, 0) - g(-1, 0)) * 3) / (2 * 261);
    const dzdy = ((g(0, 1) - g(0, -1)) * 3) / (2 * 261);
    const shade = Math.max(0, Math.min(1, 0.5 + (-dzdx - dzdy) * 0.9));
    let base: [number, number, number];
    if (h < 400) base = mixc(LOW, MID, Math.max(0, h) / 400);
    else base = mixc(MID, HIGH, Math.min(1, (h - 400) / 800));
    set(rel, x, y, mixc([base[0] * 0.55, base[1] * 0.55, base[2] * 0.55], [Math.min(255, base[0] * 1.15), Math.min(255, base[1] * 1.15), Math.min(255, base[2] * 1.15)], shade));
  }
}
writeFileSync(path.join(outDir, 'land-silhouette.png'), PNG.sync.write(sil));
writeFileSync(path.join(outDir, 'land-relief.png'), PNG.sync.write(rel));
console.log('done');
