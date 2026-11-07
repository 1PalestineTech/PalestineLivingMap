// Prepares the optional "Illustrated base" picture: npm run build:illustrated-base
//
// Reads basemap-art/illustrated-base-source.webp (the owner's image-generator picture, painted over the shape
// reference from scripts/make-reference-images.ts) and writes public/basemap/illustrated.webp with its outer
// edges faded to transparent, so it blends into the map beneath instead of ending in a hard line. It lies
// exactly over the reference's bounds (see src/map/illustrated.ts).

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'basemap-art', 'illustrated-base-source.webp');
const out = path.join(root, 'public', 'basemap', 'illustrated.webp');
/** Fade width as a share of the picture width. */
const FEATHER = 0.07;

const image = await loadImage(source);
const canvas = createCanvas(image.width, image.height);
const g = canvas.getContext('2d');
g.drawImage(image, 0, 0);
const data = g.getImageData(0, 0, image.width, image.height);
const edge = Math.round(image.width * FEATHER);
for (let y = 0; y < image.height; y += 1) {
  for (let x = 0; x < image.width; x += 1) {
    const d = Math.min(x, y, image.width - 1 - x, image.height - 1 - y);
    if (d >= edge) continue;
    const t = d / edge;
    data.data[(y * image.width + x) * 4 + 3] = Math.round(255 * t * t * (3 - 2 * t));
  }
}
g.putImageData(data, 0, 0);
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, canvas.encodeSync('webp', 90));
console.log(`wrote ${out} (${image.width} x ${image.height}, edges faded ${edge}px)`);
