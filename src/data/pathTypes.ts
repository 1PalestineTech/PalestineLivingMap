// Data types for public/data/paths.json. The JSON Schema in public/data/paths.schema.json must
// describe the same shape; see docs/DATA_GUIDE.md.

import type { EventStatus, Source } from './types.ts';

export type PathKind = 'campaign' | 'route' | 'displacement' | 'railway';

export interface Waypoint {
  /** A place named in a source for the event. */
  name: string;
  lat: number;
  lng: number;
  /** "YYYY", "YYYY-MM" or "YYYY-MM-DD" (see src/data/dates.ts), or null when no source dates it. */
  date: string | null;
}

export interface MapPath {
  id: string;
  /** The event this path belongs to. It shows while that event does. */
  eventId: string;
  kind: PathKind;
  /** schematic: a gentle curve between waypoints ("approximate"). traced: follows `geometryFile`. */
  shape: 'schematic' | 'traced';
  waypoints: Waypoint[];
  /** Years the full path stays as a faint trail after its event ends. */
  lingerYears: number;
  /** A GeoJSON LineString in public/data/paths/, for shape "traced". */
  geometryFile?: string;
  sources: Source[];
  status: EventStatus;
  editorNote?: string;
}

export interface PathsFile {
  $schema?: string;
  version: 1;
  paths: MapPath[];
}

/** A path with its traced line resolved ([lng, lat] points); empty for schematic paths. */
export interface ResolvedPath extends MapPath {
  line: [number, number][];
}
