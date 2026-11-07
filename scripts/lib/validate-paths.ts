// Checks for public/data/paths.json beyond the JSON Schema (docs/SPEC_MAP_V2.md section 5).
// Called from scripts/validate-data.ts, which owns the Ajv instance and the report.

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type Ajv from 'ajv';
import { parseHistDate, toTimelineValue } from '../../src/data/dates.ts';
import { isInRegion } from '../../src/data/region.ts';
import type { PathsFile } from '../../src/data/pathTypes.ts';
import { eventSpan } from '../../src/data/spans.ts';
import type { HistoricalEvent } from '../../src/data/types.ts';

export interface PathCheckEnv {
  ajv: Ajv;
  schema: object;
  data: unknown;
  events: readonly HistoricalEvent[];
  /** Folder that holds traced geometry files (public/data/paths). */
  geometryDir: string;
  errors: string[];
  warnings: string[];
}

export function checkPaths({ ajv, schema, data, events, geometryDir, errors, warnings }: PathCheckEnv): void {
  const validate = ajv.compile<PathsFile>(schema);
  if (!validate(data)) {
    for (const e of validate.errors ?? []) errors.push(`paths: ${e.instancePath || '(root)'} ${e.message ?? ''}`.trim());
    return;
  }

  const byId = new Map(events.map((e) => [e.id, e]));
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  for (const path of data.paths) {
    const at = `path "${path.id}"`;
    if (seen.has(path.id)) errors.push(`${at}: duplicate id`);
    seen.add(path.id);

    const event = byId.get(path.eventId);
    if (!event) errors.push(`${at}: eventId "${path.eventId}" is not an event id`);
    if (path.shape === 'traced') {
      if (!path.geometryFile) errors.push(`${at}: a traced path needs a geometryFile`);
      else if (!existsSync(resolve(geometryDir, path.geometryFile))) errors.push(`${at}: geometryFile "${path.geometryFile}" does not exist in ${geometryDir}`);
    }
    if (path.shape === 'schematic' && path.geometryFile) warnings.push(`${at}: geometryFile is ignored for a schematic path`);

    const span = event ? eventSpan(event) : null;
    let previous = -Infinity;
    for (const [i, w] of path.waypoints.entries()) {
      const wAt = `${at} waypoints[${i}] "${w.name}"`;
      if (!isInRegion(w.lat, w.lng)) warnings.push(`${wAt}: coordinates ${w.lat}, ${w.lng} are outside the Palestine region box`);
      if (w.date === null) continue;
      const parsed = parseHistDate(w.date);
      if (!parsed) {
        errors.push(`${wAt}: invalid date "${w.date}"`);
        continue;
      }
      const time = toTimelineValue(parsed);
      if (time < previous) errors.push(`${wAt}: date ${w.date} is before the previous waypoint's date`);
      previous = Math.max(previous, time);
      if (span && (time < span.start || time >= span.end + 1)) warnings.push(`${wAt}: date ${w.date} is outside the event's span`);
    }

    for (const [j, s] of path.sources.entries()) {
      if (s.accessedDate > today) warnings.push(`${at} sources[${j}].accessedDate is in the future`);
    }
    if (path.shape === 'schematic' && !path.editorNote) warnings.push(`${at}: a schematic path should say in editorNote why the line is approximate`);
  }
}
