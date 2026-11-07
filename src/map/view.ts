// Camera angle: a tilted view over 3D terrain (the default, an oblique painted-map look) or the
// flat top-down view. The choice is saved in localStorage when it is available. Rotation stays
// off: north is always up. With reduced motion the change jumps instead of easing.

import type { Map as MapLibreMap } from 'maplibre-gl';

import type { Palette } from './style.ts';
import { TERRAIN_SOURCE } from './terrain.ts';

export type ViewMode = 'tilted' | 'flat';

export const TILT_PITCH = 50;
export const MAX_PITCH = 60;
/** Palestine's relief is gentle, so heights are exaggerated to read at an oblique angle. */
const EXAGGERATION = 2.2;
const KEY = 'view';
const EASE_MS = 900;

/** The saved choice; with none, the map opens flat (owner request 2026-11-08; the tilt button still switches). */
export function readViewMode(): ViewMode {
  const fallback: ViewMode = 'flat';
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved === 'flat' || saved === 'tilted' ? saved : fallback;
  } catch {
    return fallback;
  }
}

function saveViewMode(mode: ViewMode): void {
  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

export const pitchFor = (mode: ViewMode): number => (mode === 'tilted' ? TILT_PITCH : 0);

const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The sky past the horizon fades into the paper, like the edge of the sheet. */
export function applySky(map: MapLibreMap, p: Palette): void {
  const paper = p.paper2;
  map.setSky({ 'sky-color': paper, 'horizon-color': paper, 'fog-color': paper, 'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.8, 'fog-ground-blend': 0.3 });
}

/** Switches terrain on or off to match the mode. */
export function setTerrain(map: MapLibreMap, on: boolean): void {
  map.setTerrain(on ? { source: TERRAIN_SOURCE, exaggeration: EXAGGERATION } : null);
}

export function applyView(map: MapLibreMap, mode: ViewMode, animate: boolean): void {
  saveViewMode(mode);
  const duration = animate && !reduced() ? EASE_MS : 0;
  if (mode === 'tilted') {
    setTerrain(map, true);
    map.easeTo({ pitch: TILT_PITCH, duration });
    return;
  }
  map.easeTo({ pitch: 0, duration });
  const done = (): void => setTerrain(map, false);
  if (duration === 0) done();
  else map.once('moveend', done);
}
