// Search over place names, so "Aelia Capitolina" finds Jerusalem. Every typed word must match the
// start of a word in one name of the place (English or Arabic); the matched name is returned so the
// timeline can move to the years when that name was in use.

import type { Place, PlaceName } from '../data/placeTypes.ts';
import { tokenize } from './normalize.ts';

export interface PlaceHit {
  place: Place;
  /** The name the query matched. */
  name: PlaceName;
}

export interface PlaceIndex {
  entries: readonly { place: Place; name: PlaceName; words: string[] }[];
}

export function buildPlaceIndex(places: readonly Place[]): PlaceIndex {
  return {
    entries: places.flatMap((place) =>
      place.names.map((name) => ({ place, name, words: tokenize([name.en, name.ar].filter(Boolean).join(' ')) })),
    ),
  };
}

/** The words that describe a place beyond its names: its kind, its 1945 sub-district, "depopulated" and the year. */
function descriptors(place: Place): string[] {
  const words: string[] = [place.kind];
  if (place.facts?.subDistrict) words.push(...tokenize(place.facts.subDistrict), 'subdistrict');
  if (place.depopulated !== undefined) words.push('depopulated', String(place.depopulated));
  if (place.group === 'settlement') words.push('settlement', 'settlements', 'israeli');
  return words;
}

/** Words that mark a query as asking for a set of places ("village", "depopulated", a sub-district...). */
const SET_WORDS = new Set(['village', 'villages', 'depopulated', 'subdistrict', 'settlement', 'settlements', 'khirbat']);

/**
 * All the places that match every word of the query, where a word may match a name or a descriptor (kind, sub-district,
 * "depopulated", the year). Used for searches like "villages of Safad depopulated 1948". Needs a descriptor word or a sub-district.
 */
export function searchPlaceSet(index: PlaceIndex, places: readonly Place[], query: string, skip?: (place: Place) => boolean): Place[] {
  const words = tokenize(query).filter((w) => !['of', 'in', 'the', 'all', 'sub', 'district'].includes(w));
  if (words.length < 2) return [];
  const subDistricts = new Set(places.flatMap((p) => (p.facts?.subDistrict ? tokenize(p.facts.subDistrict) : [])));
  const asksForSet = words.some((w) => SET_WORDS.has(w) || subDistricts.has(w) || /^(19|20)\d\d$/.test(w));
  if (!asksForSet) return [];
  const names = new Map<string, string[]>();
  for (const entry of index.entries) names.set(entry.place.id, [...(names.get(entry.place.id) ?? []), ...entry.words]);
  return places.filter((place) => {
    if (skip?.(place)) return false;
    const bag = [...(names.get(place.id) ?? []), ...descriptors(place)];
    return words.every((w) => bag.some((b) => b.startsWith(w) || b.startsWith(w.replace(/s$/, ''))));
  });
}

/** At most one hit per place (its best-matching name), exact words first, then listed order. */
export function searchPlaces(index: PlaceIndex, query: string, limit = 3, skip?: (place: Place) => boolean): PlaceHit[] {
  const words = tokenize(query);
  if (words.length === 0) return [];
  const best = new Map<string, { hit: PlaceHit; score: number }>();
  for (const { place, name, words: candidates } of index.entries) {
    if (skip?.(place)) continue;
    if (!words.every((w) => candidates.some((c) => c.startsWith(w)))) continue;
    const score = words.filter((w) => candidates.includes(w)).length;
    const current = best.get(place.id);
    if (!current || score > current.score) best.set(place.id, { hit: { place, name }, score });
  }
  return [...best.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((b) => b.hit);
}
