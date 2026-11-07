// A few small sailing ships on the Mediterranean, in the inked look: pure decoration, as on printed
// fantasy and old charts. They mark no event, route or fleet, and are placed only on open water.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { isInked } from './inked.ts';

export const SHIP_IMAGE = 'look-ship';
const LAYER = 'look-ships';

/** [lng, lat, mirrored] of each ship, well out to sea and apart from the coast towns. */
const SHIPS: readonly (readonly [number, number, 0 | 1])[] = [
  [34.05, 32.9, 0],
  [33.85, 31.95, 1],
  [34.15, 31.45, 0],
  [34.2, 33.55, 1],
];

/** A three-masted ship under sail: hull, two masts with square sails, a pennant, and a few ripples. */
export function shipImage(color: string): ImageData {
  const scale = 3;
  const canvas = document.createElement('canvas');
  canvas.width = 40 * scale;
  canvas.height = 34 * scale;
  const g = canvas.getContext('2d');
  if (!g) return new ImageData(1, 1);
  g.scale(scale, scale);
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = 1.1;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  // Hull.
  g.beginPath();
  g.moveTo(5, 22);
  g.quadraticCurveTo(20, 31, 35, 21);
  g.lineTo(32, 26);
  g.quadraticCurveTo(20, 32, 9, 26.5);
  g.closePath();
  g.stroke();
  // Masts.
  g.beginPath();
  g.moveTo(15, 23);
  g.lineTo(15, 5);
  g.moveTo(26, 23.5);
  g.lineTo(26, 8);
  g.stroke();
  // Sails, bellied to the wind, with a faint wash.
  for (const [x, top, w, h] of [[8.5, 7, 13, 10], [20, 9.5, 12, 9]] as const) {
    g.beginPath();
    g.moveTo(x, top);
    g.quadraticCurveTo(x + w / 2, top + 1.5, x + w, top);
    g.quadraticCurveTo(x + w + 1.5, top + h / 2, x + w, top + h);
    g.quadraticCurveTo(x + w / 2, top + h - 1.5, x, top + h);
    g.quadraticCurveTo(x - 1.5, top + h / 2, x, top);
    g.globalAlpha = 0.25;
    g.fill();
    g.globalAlpha = 1;
    g.stroke();
  }
  // Pennants and ripples.
  g.beginPath();
  g.moveTo(15, 5);
  g.lineTo(21, 3.5);
  g.lineTo(15, 2.5);
  g.moveTo(26, 8);
  g.lineTo(31, 6.5);
  g.lineTo(26, 5.5);
  g.moveTo(3, 30);
  g.quadraticCurveTo(6, 28.5, 9, 30);
  g.moveTo(30, 31);
  g.quadraticCurveTo(33, 29.5, 36, 31);
  g.stroke();
  return g.getImageData(0, 0, canvas.width, canvas.height);
}

export function addShips(map: MapLibreMap, beforeId?: string): void {
  if (!isInked()) return;
  map.addSource('look-ships', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: SHIPS.map(([lng, lat, flip]) => ({ type: 'Feature', properties: { flip }, geometry: { type: 'Point', coordinates: [lng, lat] } })),
    },
  });
  map.addLayer({
    id: LAYER,
    type: 'symbol',
    source: 'look-ships',
    minzoom: 5.5,
    maxzoom: 9.5,
    layout: {
      'icon-image': SHIP_IMAGE,
      'icon-size': ['interpolate', ['linear'], ['zoom'], 5.5, 0.85, 8, 1.15, 9.5, 1.4],
      'icon-rotate': ['case', ['==', ['get', 'flip'], 1], -4, 4],
      'icon-allow-overlap': false,
    },
    paint: { 'icon-opacity': 0.92 },
  }, beforeId);
}
