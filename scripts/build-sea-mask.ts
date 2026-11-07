// Builds the "distance from the coast" tiles that draw the dark coastal stain in the strong map
// style. Run by hand after build-terrain.ts: npm run build:sea-mask
//
// It reads the zoom-9 elevation tiles in public/terrain (nothing is downloaded), finds the open
// sea (cells below 0 m connected to the Mediterranean or the Gulf of Aqaba, so the Dead Sea and
// the Jordan valley are left alone), measures each sea cell's distance to the nearest land cell,
// and writes Terrarium PNG tiles for zoom 5-8 into public/terrain-sea/{z}/{x}/{y}.png.
// In those tiles land is 0 m and the sea is -(1 + 2 x distance in km) m, down to -101 m (50 km).
// The map reads that as a stain strength, not as a height.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { frameBounds } from '../src/data/frame.ts';
import { latToY, lngToX, loadHeightGrid, SOURCE_ZOOM, TILE, xToLng, yToLat } from './lib/dem.ts';

const OUT_MIN = 5;
const OUT_MAX = 8;
const MAX_KM = 50;
const SEA_SEEDS: readonly [number, number][] = [[33.0, 32.5], [34.95, 29.1]];
const outDir = path.resolve('public/terrain-sea');

async function main(): Promise<void> {
  const [[west, south], [east, north]] = frameBounds();
  const { heights, width, height, x0, y0, cellKm, cellAt } = await loadHeightGrid();

  // Flood-fill the open sea from the seeds through cells below 0 m.
  const sea = new Uint8Array(width * height);
  const stack: number[] = [];
  for (const [lng, lat] of SEA_SEEDS) {
    const [sx, sy] = cellAt(lng, lat);
    stack.push(sy * width + sx);
  }
  while (stack.length > 0) {
    const at = stack.pop() ?? 0;
    if (sea[at] === 1 || (heights[at] ?? 0) >= 0) continue;
    sea[at] = 1;
    const x = at % width;
    const y = Math.floor(at / width);
    if (x > 0) stack.push(at - 1);
    if (x < width - 1) stack.push(at + 1);
    if (y > 0) stack.push(at - width);
    if (y < height - 1) stack.push(at + width);
  }

  // Chamfer distance (in cells) from each sea cell to the nearest non-sea cell, two passes.
  const dist = new Float32Array(width * height);
  const FAR = 1e6;
  for (let i = 0; i < dist.length; i += 1) dist[i] = sea[i] === 1 ? FAR : 0;
  const D = 1;
  const DD = Math.SQRT2;
  const relax = (i: number, j: number, cost: number): void => {
    const d = (dist[j] ?? FAR) + cost;
    if (d < (dist[i] ?? FAR)) dist[i] = d;
  };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      if (x > 0) relax(i, i - 1, D);
      if (y > 0) {
        relax(i, i - width, D);
        if (x > 0) relax(i, i - width - 1, DD);
        if (x < width - 1) relax(i, i - width + 1, DD);
      }
    }
  }
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const i = y * width + x;
      if (x < width - 1) relax(i, i + 1, D);
      if (y < height - 1) {
        relax(i, i + width, D);
        if (x < width - 1) relax(i, i + width + 1, DD);
        if (x > 0) relax(i, i + width - 1, DD);
      }
    }
  }

  let written = 0;
  let bytes = 0;
  for (let z = OUT_MIN; z <= OUT_MAX; z += 1) {
    for (let ty = Math.floor(latToY(north, z)); ty <= Math.floor(latToY(south, z)); ty += 1) {
      for (let tx = Math.floor(lngToX(west, z)); tx <= Math.floor(lngToX(east, z)); tx += 1) {
        const png = new PNG({ width: TILE, height: TILE, colorType: 2 });
        for (let py = 0; py < TILE; py += 1) {
          for (let px = 0; px < TILE; px += 1) {
            const gx = Math.floor((lngToX(xToLng(tx + (px + 0.5) / TILE, z), SOURCE_ZOOM) - x0) * TILE);
            const gy = Math.floor((latToY(yToLat(ty + (py + 0.5) / TILE, z), SOURCE_ZOOM) - y0) * TILE);
            const inside = gx >= 0 && gy >= 0 && gx < width && gy < height;
            const i = gy * width + gx;
            const km = inside && sea[i] === 1 ? (dist[i] ?? 0) * cellKm : -1;
            const value = km < 0 ? 0 : -(1 + Math.round(Math.min(km, MAX_KM) * 2));
            const encoded = value + 32768;
            const o = (py * TILE + px) * 4;
            png.data[o] = encoded >> 8;
            png.data[o + 1] = encoded & 255;
            png.data[o + 2] = 0;
            png.data[o + 3] = 255;
          }
        }
        const file = path.join(outDir, String(z), String(tx), `${ty}.png`);
        await mkdir(path.dirname(file), { recursive: true });
        const out = PNG.sync.write(png, { colorType: 2, deflateLevel: 9 });
        await writeFile(file, out);
        written += 1;
        bytes += out.length;
      }
    }
  }
  console.log(`wrote ${written} tiles, ${(bytes / 1e6).toFixed(2)} MB, into ${outDir}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
