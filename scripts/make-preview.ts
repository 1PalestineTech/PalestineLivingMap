// Makes the share-preview picture (1200 x 630) that chat apps show when the link is posted: npm run build:preview
// It lays the title over the Illustrated base picture. Output: public/preview.png.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(import.meta.dirname, '..');
const W = 1200;
const H = 630;
const picture = await loadImage(path.join(root, 'public', 'basemap', 'illustrated.webp'));
const canvas = createCanvas(W, H);
const g = canvas.getContext('2d');

g.fillStyle = '#e9dcb8';
g.fillRect(0, 0, W, H);
// The land is a tall picture: show its middle (the central hills and the coast) on the right.
const sw = picture.width;
const sh = Math.round((sw * H) / (W * 0.55));
g.drawImage(picture, 0, Math.round(picture.height * 0.35), sw, sh, W * 0.45, 0, W * 0.55, H);
const fade = g.createLinearGradient(W * 0.38, 0, W * 0.62, 0);
fade.addColorStop(0, 'rgba(233,220,184,1)');
fade.addColorStop(1, 'rgba(233,220,184,0)');
g.fillStyle = fade;
g.fillRect(W * 0.38, 0, W * 0.24, H);

g.fillStyle = '#2b2117';
g.font = '600 76px Georgia, "Times New Roman", serif';
g.fillText('Palestine', 70, 250);
g.font = '600 54px Georgia, "Times New Roman", serif';
g.fillText('A Living Map', 70, 320);
g.fillStyle = '#5a4a36';
g.font = '30px Arial, sans-serif';
const lines = ['An interactive map and timeline', 'of Palestine\'s history, with a', 'source for every event.'];
lines.forEach((line, i) => g.fillText(line, 70, 390 + i * 40));
g.font = '24px Arial, sans-serif';
g.fillText('Built with the help of AI. Corrections welcome.', 70, 575);

writeFileSync(path.join(root, 'public', 'preview.png'), canvas.toBuffer('image/png'));
console.log('wrote public/preview.png');
