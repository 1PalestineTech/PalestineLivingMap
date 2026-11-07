// Turns events into GeoJSON features for the map sources.

import type { Feature, Point, Polygon } from 'geojson';
import type { CategoryId } from '../data/categories.ts';
import type { HistoricalEvent } from '../data/types.ts';

/** The data has no extent field, so "approximate" locations get a fixed-size soft area. */
export const APPROX_RADIUS_KM = 30;

export interface EventProps {
  /** Also used as the feature id (promoteId), so fades can use feature-state. */
  id: string;
  category: CategoryId;
  title: string;
}

const KM_PER_DEGREE_LAT = 111.32;
const AREA_POINTS = 64;

export function isApproximate(event: HistoricalEvent): boolean {
  return event.location.precision === 'approximate';
}

function props(event: HistoricalEvent): EventProps {
  return { id: event.id, category: event.category, title: event.title };
}

export function pinFeature(event: HistoricalEvent): Feature<Point, EventProps> {
  const { lat, lng } = event.location;
  return { type: 'Feature', properties: props(event), geometry: { type: 'Point', coordinates: [lng, lat] } };
}

export function areaFeature(event: HistoricalEvent): Feature<Polygon, EventProps> {
  const { lat, lng } = event.location;
  const dLat = APPROX_RADIUS_KM / KM_PER_DEGREE_LAT;
  const dLng = APPROX_RADIUS_KM / (KM_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = Array.from({ length: AREA_POINTS + 1 }, (_, i) => {
    const angle = (i / AREA_POINTS) * 2 * Math.PI;
    return [lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)];
  });
  return { type: 'Feature', properties: props(event), geometry: { type: 'Polygon', coordinates: [ring] } };
}
