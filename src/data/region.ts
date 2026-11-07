// Rough bounding box of historical Palestine, used by the validator to warn about
// coordinates that are probably mistyped. Not a political boundary.
export const REGION_BOUNDS = {
  minLat: 29.0,
  maxLat: 33.8,
  minLng: 33.8,
  maxLng: 36.2,
} as const;

/** [west, south] and [east, north]: the map's home view, roughly historical Palestine. */
export type LngLatBox = readonly [readonly [number, number], readonly [number, number]];

export const HOME_BOUNDS: LngLatBox = [
  [34.0, 29.4],
  [36.0, 33.4],
];

export function isInRegion(lat: number, lng: number): boolean {
  return (
    lat >= REGION_BOUNDS.minLat &&
    lat <= REGION_BOUNDS.maxLat &&
    lng >= REGION_BOUNDS.minLng &&
    lng <= REGION_BOUNDS.maxLng
  );
}
