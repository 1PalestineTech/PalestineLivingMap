// A small hook so other modules (era buttons, story mode) can move the camera without
// knowing anything about MapLibre. initMap() registers the real implementation.

import type { LngLatBox } from '../data/region.ts';
import type { LocationPrecision } from '../data/types.ts';

const ZOOM_FOR_PRECISION: Record<LocationPrecision, number> = { exact: 11, area: 9.5, approximate: 7 };

/** How close to look at a place, by how precisely its location is known. */
export const zoomForPrecision = (precision: LocationPrecision): number => ZOOM_FOR_PRECISION[precision];

export interface CameraImpl {
  fitBounds(bounds: LngLatBox): void;
  /** Flies (or jumps, with reduced motion) to a point. `zoom` null keeps the current zoom. */
  flyTo(lng: number, lat: number, zoom: number | null, bottomInset: number): void;
}

let camera: CameraImpl | null = null;

export function registerCamera(impl: CameraImpl): void {
  camera = impl;
}

/** Fits the map to a box. Does nothing until the map exists. */
export function fitToBounds(bounds: LngLatBox): void {
  camera?.fitBounds(bounds);
}

export function flyToPoint(lng: number, lat: number, zoom: number | null = null, bottomInset = 0): void {
  camera?.flyTo(lng, lat, zoom, bottomInset);
}
