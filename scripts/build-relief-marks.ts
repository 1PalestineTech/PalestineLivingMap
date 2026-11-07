// Picks where the strong map style draws its little hachure hill and mountain marks.
// Run by hand after build-terrain.ts: npm run build:relief-marks
//
// It reads the zoom-9 elevation tiles in public/terrain (nothing is downloaded) and writes
// public/data/relief-marks.json: [lng, lat, k, v, z, relief] points on three jittered grids (about 7, 4.5
// and 3 km apart). Marks go only where the ground forms a range: high, steep around it, standing
// above the country within 15 km (so plateaus and lowlands stay clean), and with other such ground
// close by (so single bumps and isolated hills are dropped). `k` is 1 (hill) or 2 (mountain), `v`
// picks one of three drawings, and `z` is the zoom where the mark first appears. The marks are
// decoration placed from the elevation data; they are not a map of named places.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { insideFrame } from '../src/data/frame.ts';
import { loadHeightGrid } from './lib/dem.ts';
import type { HeightGrid } from './lib/dem.ts';

/**
 * Ground must be at least `minHeight` metres and rise `relief` metres within a few km to count as a range,
 * and stand `crest` metres above the average ground within 15 km. The finest grid is a little more
 * forgiving, so the long ridges of Galilee, Carmel, Samaria and the Judean hills get marks when zoomed in.
 */
const LEVELS = [
  { km: 7, zoom: 6, minHeight: 450, relief: 170, crest: 45 },
  { km: 4.5, zoom: 8, minHeight: 450, relief: 170, crest: 45 },
  { km: 3, zoom: 10, minHeight: 350, relief: 120, crest: 25 },
] as const;
/** A mark needs this many other range cells within CLUSTER_KM, so lone hills are dropped. */
const CLUSTER_KM = 14;
const CLUSTER_NEIGHBOURS = 4;
/** Relief or height at which a mark is drawn as a mountain rather than a hill. */
const MOUNTAIN_RELIEF = 480;
const MOUNTAIN_HEIGHT = 850;
/** Marks stop where the paper fade gets heavy. */
const LAST_VISIBLE_RING = 1.25;

/** A repeatable pseudo-random number in [0, 1), so rebuilding gives the same marks. */
function noise(a: number, b: number, salt: number): number {
  const n = Math.sin(a * 127.1 + b * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

/** Highest minus lowest ground in a square of +/- `reach` cells, sampled every few cells. */
function relief(grid: HeightGrid, col: number, row: number, reach: number): number {
  let low = Infinity;
  let high = -Infinity;
  const step = Math.max(1, Math.floor(reach / 6));
  for (let dy = -reach; dy <= reach; dy += step) {
    for (let dx = -reach; dx <= reach; dx += step) {
      const x = Math.min(grid.width - 1, Math.max(0, col + dx));
      const y = Math.min(grid.height - 1, Math.max(0, row + dy));
      const h = grid.heights[y * grid.width + x] ?? 0;
      if (h < low) low = h;
      if (h > high) high = h;
    }
  }
  return high - low;
}

/** Average ground height in a square of +/- `reach` cells, sampled every few cells. */
function meanHeight(grid: HeightGrid, col: number, row: number, reach: number): number {
  const step = Math.max(1, Math.floor(reach / 5));
  let sum = 0;
  let n = 0;
  for (let dy = -reach; dy <= reach; dy += step) {
    for (let dx = -reach; dx <= reach; dx += step) {
      const x = Math.min(grid.width - 1, Math.max(0, col + dx));
      const y = Math.min(grid.height - 1, Math.max(0, row + dy));
      sum += grid.heights[y * grid.width + x] ?? 0;
      n += 1;
    }
  }
  return sum / n;
}

interface Mark { lng: number; lat: number; k: 1 | 2; v: number; z: number; r: number }

async function main(): Promise<void> {
  const grid = await loadHeightGrid();
  const marks: Mark[] = [];
  LEVELS.forEach((level, levelIndex) => {
    const spacing = Math.round(level.km / grid.cellKm);
    for (let row = 0; row < grid.height; row += spacing) {
      for (let col = 0; col < grid.width; col += spacing) {
        const c = Math.min(grid.width - 1, col + Math.floor(noise(col, row, 1 + levelIndex) * spacing));
        const r = Math.min(grid.height - 1, row + Math.floor(noise(col, row, 5 + levelIndex) * spacing));
        const height = grid.heights[r * grid.width + c] ?? 0;
        if (height < level.minHeight) continue;
        const rise = relief(grid, c, r, Math.round(spacing * 0.7));
        if (rise < level.relief) continue;
        if (height < meanHeight(grid, c, r, Math.round(15 / grid.cellKm)) + level.crest) continue;
        const [lng, lat] = grid.lngLatAt(c, r);
        if (!insideFrame(lng, lat, LAST_VISIBLE_RING)) continue;
        marks.push({
          lng: Math.round(lng * 1000) / 1000,
          lat: Math.round(lat * 1000) / 1000,
          k: rise >= MOUNTAIN_RELIEF || height >= MOUNTAIN_HEIGHT ? 2 : 1,
          v: Math.floor(noise(c, r, 9) * 3),
          z: level.zoom,
          r: Math.round(rise),
        });
      }
    }
  });

  // Drop marks with too few neighbours: a range is a line or a mass of them, not a single bump.
  const near = (a: Mark, b: Mark): boolean => Math.hypot((a.lng - b.lng) * 94, (a.lat - b.lat) * 111) <= CLUSTER_KM;
  const kept = marks.filter((m) => marks.filter((o) => o !== m && near(m, o)).length >= CLUSTER_NEIGHBOURS);
  marks.length = 0;
  marks.push(...kept);

  // A compact array form, [lng, lat, k, v, z, relief], that the map turns into GeoJSON at load.
  const out = path.resolve('public/data/relief-marks.json');
  const text = JSON.stringify({ version: 1, marks: marks.map((m) => [m.lng, m.lat, m.k, m.v, m.z, Math.round(m.r / 10) * 10]) });
  await writeFile(out, text);
  const mountains = marks.filter((m) => m.k === 2).length;
  console.log(`wrote ${marks.length} marks (${mountains} mountains), ${(text.length / 1000).toFixed(0)} KB, to ${out}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
