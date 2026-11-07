// Fetches public/data/places.json. Places are optional: if the file is missing or broken the
// app works without era labels. Invalid places are skipped, never half-shown.

import type { Place, PlaceFacts, PlaceKind, PlaceName } from './placeTypes.ts';
import type { Source } from './types.ts';

export const PLACES_URL = `${import.meta.env.BASE_URL}data/places.json`;

const KINDS: readonly PlaceKind[] = ['city', 'town', 'village', 'site', 'region', 'water', 'mountain'];

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isYear = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value !== 0;
const isYearOrNull = (value: unknown): value is number | null => value === null || isYear(value);

function toSource(raw: unknown): Source | null {
  if (!isObj(raw) || !isText(raw['title']) || !isText(raw['url']) || !isText(raw['publisher'])) return null;
  const source: Source = {
    title: raw['title'],
    url: raw['url'],
    publisher: raw['publisher'],
    accessedDate: isText(raw['accessedDate']) ? raw['accessedDate'] : '',
  };
  if (isText(raw['author'])) source.author = raw['author'];
  if (isText(raw['pages'])) source.pages = raw['pages'];
  if (isText(raw['note'])) source.note = raw['note'];
  return source;
}

function toName(raw: unknown): PlaceName | null {
  if (!isObj(raw) || !isText(raw['en']) || !isText(raw['lang'])) return null;
  const { ar, from, to } = raw;
  if (!(ar === null || isText(ar)) || !isYearOrNull(from) || !isYearOrNull(to)) return null;
  const sources = (Array.isArray(raw['sources']) ? (raw['sources'] as unknown[]) : []).flatMap((s) => toSource(s) ?? []);
  if (sources.length === 0) return null;
  const name: PlaceName = {
    en: raw['en'],
    ar,
    lang: raw['lang'],
    from,
    to,
    fromCirca: raw['fromCirca'] === true,
    toCirca: raw['toCirca'] === true,
    sources,
  };
  if (isText(raw['note'])) name.note = raw['note'];
  return name;
}

function toPlace(raw: unknown): Place | null {
  if (!isObj(raw) || !isText(raw['id'])) return null;
  const { kind, rank, lat, lng } = raw;
  if (typeof kind !== 'string' || !KINDS.includes(kind as PlaceKind)) return null;
  if (rank !== 1 && rank !== 2 && rank !== 3 && rank !== 4) return null;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  const names = (Array.isArray(raw['names']) ? (raw['names'] as unknown[]) : []).flatMap((n) => toName(n) ?? []);
  if (names.length === 0) return null;
  const place: Place = {
    id: raw['id'],
    kind: kind as PlaceKind,
    rank,
    lat,
    lng,
    names,
    status: raw['status'] === 'verified' ? 'verified' : 'needs-review',
  };
  if (isText(raw['editorNote'])) place.editorNote = raw['editorNote'];
  const priority = raw['priority'];
  if (typeof priority === 'number' && Number.isInteger(priority) && priority >= 1 && priority <= 9) place.priority = priority;
  if (typeof raw['depopulated'] === 'number' && Number.isInteger(raw['depopulated'])) place.depopulated = raw['depopulated'];
  if (raw['group'] === 'settlement') place.group = 'settlement';
  const rawFacts = raw['facts'];
  if (rawFacts !== null && typeof rawFacts === 'object' && !Array.isArray(rawFacts)) place.facts = rawFacts as PlaceFacts;
  const context = raw['contextEvents'];
  if (Array.isArray(context)) place.contextEvents = context.filter((id): id is string => typeof id === 'string');
  const path = raw['labelPath'];
  if (Array.isArray(path)) {
    const pts = path.flatMap((pt): [number, number][] => (Array.isArray(pt) && typeof pt[0] === 'number' && typeof pt[1] === 'number' ? [[pt[0], pt[1]]] : []));
    if (pts.length >= 2) place.labelPath = pts;
  }
  return place;
}

export function parsePlaces(data: unknown): Place[] {
  if (!isObj(data) || data['version'] !== 1 || !Array.isArray(data['places'])) return [];
  const seen = new Set<string>();
  const places: Place[] = [];
  for (const raw of data['places'] as unknown[]) {
    const place = toPlace(raw);
    if (!place || seen.has(place.id)) continue;
    seen.add(place.id);
    places.push(place);
  }
  return places;
}

export async function loadPlaces(url: string = PLACES_URL): Promise<Place[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return parsePlaces(await response.json());
  } catch (err) {
    console.warn('Place names could not be loaded; era labels are unavailable.', err);
    return [];
  }
}
