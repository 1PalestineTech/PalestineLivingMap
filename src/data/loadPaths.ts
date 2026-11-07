// Fetches public/data/paths.json. Paths are optional: if the file is missing or broken the app
// works without them. Invalid paths are skipped. A "traced" path's GeoJSON line is fetched too.

import { parseHistDate } from './dates.ts';
import type { MapPath, PathKind, ResolvedPath, Waypoint } from './pathTypes.ts';
import type { Source } from './types.ts';

const BASE = `${import.meta.env.BASE_URL}data/`;
const KINDS: readonly PathKind[] = ['campaign', 'route', 'displacement', 'railway'];

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

function toWaypoint(raw: unknown): Waypoint | null {
  if (!isObj(raw) || !isText(raw['name'])) return null;
  const { lat, lng, date } = raw;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  if (date !== null && !(typeof date === 'string' && parseHistDate(date) !== null)) return null;
  return { name: raw['name'], lat, lng, date };
}

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

function toPath(raw: unknown): MapPath | null {
  if (!isObj(raw) || !isText(raw['id']) || !isText(raw['eventId'])) return null;
  const { kind, shape, lingerYears } = raw;
  if (typeof kind !== 'string' || !KINDS.includes(kind as PathKind)) return null;
  if (shape !== 'schematic' && shape !== 'traced') return null;
  if (typeof lingerYears !== 'number' || lingerYears < 0) return null;
  const waypoints = list(raw['waypoints']).flatMap((w) => toWaypoint(w) ?? []);
  const sources = list(raw['sources']).flatMap((s) => toSource(s) ?? []);
  if (waypoints.length < 2 || sources.length === 0) return null;
  if (shape === 'traced' && !isText(raw['geometryFile'])) return null;
  const path: MapPath = {
    id: raw['id'],
    eventId: raw['eventId'],
    kind: kind as PathKind,
    shape,
    waypoints,
    lingerYears,
    sources,
    status: raw['status'] === 'verified' ? 'verified' : 'needs-review',
  };
  if (isText(raw['geometryFile'])) path.geometryFile = raw['geometryFile'];
  if (isText(raw['editorNote'])) path.editorNote = raw['editorNote'];
  return path;
}

export function parsePaths(data: unknown): MapPath[] {
  if (!isObj(data) || data['version'] !== 1 || !Array.isArray(data['paths'])) return [];
  const seen = new Set<string>();
  const paths: MapPath[] = [];
  for (const raw of data['paths'] as unknown[]) {
    const path = toPath(raw);
    if (!path || seen.has(path.id)) continue;
    seen.add(path.id);
    paths.push(path);
  }
  return paths;
}

/** The [lng, lat] points of a GeoJSON LineString, or null if the data isn't one. */
export function lineFromGeoJson(data: unknown): [number, number][] | null {
  const geometry = isObj(data) && data['type'] === 'Feature' && isObj(data['geometry']) ? data['geometry'] : data;
  if (!isObj(geometry) || geometry['type'] !== 'LineString') return null;
  const points = list(geometry['coordinates']).flatMap((c): [number, number][] =>
    Array.isArray(c) && typeof c[0] === 'number' && typeof c[1] === 'number' ? [[c[0], c[1]]] : [],
  );
  return points.length >= 2 ? points : null;
}

async function resolve(path: MapPath): Promise<ResolvedPath | null> {
  if (path.shape === 'schematic' || !path.geometryFile) return { ...path, line: [] };
  try {
    const response = await fetch(`${BASE}paths/${path.geometryFile}`);
    const line = response.ok ? lineFromGeoJson(await response.json()) : null;
    return line ? { ...path, line } : null;
  } catch {
    return null;
  }
}

export async function loadPaths(url: string = `${BASE}paths.json`): Promise<ResolvedPath[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const resolved = await Promise.all(parsePaths(await response.json()).map(resolve));
    return resolved.flatMap((p) => p ?? []);
  } catch (err) {
    console.warn('Paths could not be loaded; routes are unavailable.', err);
    return [];
  }
}
