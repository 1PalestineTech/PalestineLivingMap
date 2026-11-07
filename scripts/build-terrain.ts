// Builds the local elevation tile pyramid. Run by hand: npm run build:terrain
//
// What it does: downloads the Terrarium-encoded PNG tiles that cover the map's frame from the
// public AWS "Terrain Tiles" bucket (https://registry.opendata.aws/terrain-tiles/), once, and
// writes them under public/terrain/{z}/{x}/{y}.png. The output is committed. The site and the
// build never contact that bucket. Dataset, licence and attribution: docs/TERRAIN.md.
//
// To keep the pyramid small, each tile is re-encoded: heights are rounded to whole metres and
// the sea floor is flattened to SEA_FLOOR (the water layer hides it; the Dead Sea shore, the
// lowest land, is about -430 m). Terrarium: height = R * 256 + G + B / 256 - 32768.
//
// Options: --max-zoom N (default TERRAIN_MAX_ZOOM)  --out DIR (default public/terrain)
//          --raw DIR (cache of untouched downloaded tiles, so re-runs don't refetch)

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { frameBounds, TERRAIN_MAX_ZOOM, TERRAIN_MIN_ZOOM } from '../src/data/frame.ts';

const SOURCE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';
const CONCURRENCY = 8;
const SEA_FLOOR = -440;

function argValue(name: string): string | undefined {
  const at = process.argv.indexOf(name);
  return at === -1 ? undefined : process.argv[at + 1];
}

const maxZoom = Number(argValue('--max-zoom') ?? TERRAIN_MAX_ZOOM);
const outDir = path.resolve(argValue('--out') ?? 'public/terrain');
const rawArg = argValue('--raw');
const rawDir = rawArg === undefined ? null : path.resolve(rawArg);

const lngToX = (lng: number, z: number): number => Math.floor(((lng + 180) / 360) * 2 ** z);
const latToY = (lat: number, z: number): number => {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z);
};

interface Tile { z: number; x: number; y: number }

function tilesFor(z: number): Tile[] {
  const [[west, south], [east, north]] = frameBounds();
  const tiles: Tile[] = [];
  for (let x = lngToX(west, z); x <= lngToX(east, z); x += 1) {
    for (let y = latToY(north, z); y <= latToY(south, z); y += 1) tiles.push({ z, x, y });
  }
  return tiles;
}

/** Rounds heights to whole metres and flattens the sea floor. */
function simplify(source: Buffer): Buffer {
  const png = PNG.sync.read(source);
  const px = png.data;
  for (let i = 0; i < px.length; i += 4) {
    const height = (px[i] ?? 0) * 256 + (px[i + 1] ?? 0) + (px[i + 2] ?? 0) / 256 - 32768;
    const whole = Math.round(Math.max(height, SEA_FLOOR)) + 32768;
    px[i] = whole >> 8;
    px[i + 1] = whole & 255;
    px[i + 2] = 0;
  }
  return PNG.sync.write(png, { colorType: 2, deflateLevel: 9 });
}

async function download(t: Tile): Promise<Buffer> {
  const cached = rawDir === null ? null : path.join(rawDir, String(t.z), String(t.x), `${t.y}.png`);
  if (cached !== null && existsSync(cached)) return readFile(cached);
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(`${SOURCE}/${t.z}/${t.x}/${t.y}.png`);
    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer());
      if (cached !== null) {
        await mkdir(path.dirname(cached), { recursive: true });
        await writeFile(cached, bytes);
      }
      return bytes;
    }
    if (attempt === 4) throw new Error(`Tile ${t.z}/${t.x}/${t.y} returned ${response.status}`);
    await new Promise((r) => setTimeout(r, 500 * attempt));
  }
}

async function fetchTile(t: Tile): Promise<void> {
  const file = path.join(outDir, String(t.z), String(t.x), `${t.y}.png`);
  if (existsSync(file)) return;
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, simplify(await download(t)));
}

async function dirSize(dir: string): Promise<number> {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(full) : (await stat(full)).size;
  }
  return total;
}

async function main(): Promise<void> {
  const all: Tile[] = [];
  for (let z = TERRAIN_MIN_ZOOM; z <= maxZoom; z += 1) all.push(...tilesFor(z));
  console.log(`Fetching ${all.length} tiles (zoom ${TERRAIN_MIN_ZOOM}-${maxZoom}) into ${outDir}`);

  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < all.length) {
      const tile = all[next++];
      if (tile) await fetchTile(tile);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  for (let z = TERRAIN_MIN_ZOOM; z <= maxZoom; z += 1) {
    const dir = path.join(outDir, String(z));
    if (existsSync(dir)) console.log(`zoom ${z}: ${tilesFor(z).length} tiles, ${((await dirSize(dir)) / 1e6).toFixed(2)} MB`);
  }
  console.log(`total: ${((await dirSize(outDir)) / 1e6).toFixed(2)} MB`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
