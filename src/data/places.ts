// Which names of a place are valid in a year, and how a span reads in words. Years are
// historical (negative = BCE, no year 0); comparisons go through astronomical numbering.

import { formatYear } from './format.ts';
import type { Place, PlaceName } from './placeTypes.ts';
import { toAstronomical } from './spans.ts';

/** True when `year` falls inside the name's span. A name with no start year is never in force. */
export function nameValidInYear(name: PlaceName, year: number): boolean {
  if (name.from === null) return false;
  const y = toAstronomical(Math.round(year));
  if (y < toAstronomical(name.from)) return false;
  return name.to === null || y <= toAstronomical(name.to);
}

/** The names valid in `year`, in their listed order. */
export function namesAt(place: Place, year: number): PlaceName[] {
  return place.names.filter((name) => nameValidInYear(name, year));
}

/** False for a place kept only for context (outside Palestine) unless one of its events, or its own card, is open. */
export function shownNow(place: Place, selectedEventId: string | null, selectedPlaceId: string | null): boolean {
  if (place.contextEvents === undefined) return true;
  return selectedPlaceId === place.id || (selectedEventId !== null && place.contextEvents.includes(selectedEventId));
}

/** Added to a name after the place's depopulation year. */
export const DEPOPULATED = { en: '(depopulated)', ar: '(مهجّرة)' } as const;

export interface PlaceLabel {
  en: string;
  /** Empty when none of the valid names has an Arabic form. */
  ar: string;
}

/** The label text for a year: names valid together are joined ("A / B"). null = draw nothing. */
export function labelAt(place: Place, year: number): PlaceLabel | null {
  const names = namesAt(place, year);
  if (names.length === 0) return null;
  const en = names.map((n) => n.en).join(' / ');
  const ar = names.flatMap((n) => (n.ar === null ? [] : [n.ar])).join(' / ');
  // After its depopulation the name stays on the map, marked as such.
  if (place.depopulated !== undefined && toAstronomical(Math.round(year)) > toAstronomical(place.depopulated)) {
    return { en: `${en} ${DEPOPULATED.en}`, ar: ar === '' ? '' : `${ar} ${DEPOPULATED.ar}` };
  }
  return { en, ar };
}

function yearText(year: number, circa: boolean, ce: boolean): string {
  return `${circa ? 'c. ' : ''}${formatYear(year, ce)}`;
}

/** "c. 100 CE to c. 638 CE", "from 1187 CE", "until 1500 CE" or "date not yet sourced". */
export function spanText(name: PlaceName): string {
  if (name.from === null) return name.to === null ? 'Dates not yet sourced' : `Until ${yearText(name.to, name.toCirca, true)}`;
  const from = yearText(name.from, name.fromCirca, true);
  if (name.to === null) return `From ${from} to the present`;
  return `${from} to ${yearText(name.to, name.toCirca, true)}`;
}

/** Short span for the map tooltip: "c. 100-c. 638 CE". */
export function shortSpan(name: PlaceName): string {
  return spanText(name).replace(/ CE\b/g, '').replace(' to the present', ' on').replace(' to ', ' - ');
}

/** Great-circle distance in kilometres. */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((bLat - aLat) * rad) / 2) ** 2 +
    Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(((bLng - aLng) * rad) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}
