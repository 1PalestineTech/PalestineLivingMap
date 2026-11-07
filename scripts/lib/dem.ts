// Reads the committed zoom-9 elevation tiles (public/terrain) into one height grid, so the
// scripts that derive things from the terrain (sea mask, relief marks) share one reader.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { frameBounds } from '../../src/data/frame.ts';

export const SOURCE_ZOOM = 9;
export const TILE = 256;

export const lngToX = (lng: number, z: number): number => ((lng + 180) / 360) * 2 ** z;
export const latToY = (lat: number, z: number): number => {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z;
};
export const xToLng = (x: number, z: number): number => (x / 2 ** z) * 360 - 180;
export const yToLat = (y: number, z: number): number =>
  (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))) * 180) / Math.PI;

export interface HeightGrid {
  heights: Float32Array;
  width: number;
  height: number;
  /** Tile coordinates of the grid's top-left tile at SOURCE_ZOOM. */
  x0: number;
  y0: number;
  /** Cell size in km at the middle of the frame. */
  cellKm: number;
  /** Longitude and latitude of a cell's centre. */
  lngLatAt(col: number, row: number): [number, number];
  /** Column and row of a longitude and latitude. */
  cellAt(lng: number, lat: number): [number, number];
}

export async function loadHeightGrid(dir = path.resolve('public/terrain')): Promise<HeightGrid> {
  const [[west, south], [east, north]] = frameBounds();
  const x0 = Math.floor(lngToX(west, SOURCE_ZOOM));
  const x1 = Math.floor(lngToX(east, SOURCE_ZOOM));
  const y0 = Math.floor(latToY(north, SOURCE_ZOOM));
  const y1 = Math.floor(latToY(south, SOURCE_ZOOM));
  const width = (x1 - x0 + 1) * TILE;
  const height = (y1 - y0 + 1) * TILE;
  const heights = new Float32Array(width * height);
  for (let ty = y0; ty <= y1; ty += 1) {
    for (let tx = x0; tx <= x1; tx += 1) {
      const png = PNG.sync.read(await readFile(path.join(dir, String(SOURCE_ZOOM), String(tx), `${ty}.png`)));
      for (let py = 0; py < TILE; py += 1) {
        for (let px = 0; px < TILE; px += 1) {
          const i = (py * TILE + px) * 4;
          heights[((ty - y0) * TILE + py) * width + (tx - x0) * TILE + px] =
            (png.data[i] ?? 0) * 256 + (png.data[i + 1] ?? 0) - 32768;
        }
      }
    }
  }
  const midLat = (south + north) / 2;
  return {
    heights,
    width,
    height,
    x0,
    y0,
    cellKm: (40075 * Math.cos((midLat * Math.PI) / 180)) / (2 ** SOURCE_ZOOM * TILE),
    lngLatAt: (col, row) => [
      xToLng(x0 + (col + 0.5) / TILE, SOURCE_ZOOM),
      yToLat(y0 + (row + 0.5) / TILE, SOURCE_ZOOM),
    ],
    cellAt: (lng, lat) => [
      Math.floor((lngToX(lng, SOURCE_ZOOM) - x0) * TILE),
      Math.floor((latToY(lat, SOURCE_ZOOM) - y0) * TILE),
    ],
  };
}
