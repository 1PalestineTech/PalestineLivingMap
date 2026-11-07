// Checks for public/data/threads.json beyond the JSON Schema (docs/SPEC_MAP_V2.md section 6).
// Called from scripts/validate-data.ts, which owns the Ajv instance and the report.

import type Ajv from 'ajv';
import type { ThreadsFile } from '../../src/data/threadTypes.ts';

const MAX_INTRO_WORDS = 60;

export interface ThreadCheckEnv {
  ajv: Ajv;
  schema: object;
  data: unknown;
  eventIds: ReadonlySet<string>;
  pathIds: ReadonlySet<string>;
  placeIds: ReadonlySet<string>;
  errors: string[];
  warnings: string[];
}

export function checkThreads({ ajv, schema, data, eventIds, pathIds, placeIds, errors, warnings }: ThreadCheckEnv): void {
  const validate = ajv.compile<ThreadsFile>(schema);
  if (!validate(data)) {
    for (const e of validate.errors ?? []) errors.push(`threads: ${e.instancePath || '(root)'} ${e.message ?? ''}`.trim());
    return;
  }
  const seen = new Set<string>();
  for (const thread of data.threads) {
    const at = `thread "${thread.id}"`;
    if (seen.has(thread.id)) errors.push(`${at}: duplicate id`);
    seen.add(thread.id);
    const words = thread.intro.trim().split(/\s+/).length;
    if (words > MAX_INTRO_WORDS) errors.push(`${at}: intro has ${words} words (max ${MAX_INTRO_WORDS})`);
    for (const id of thread.eventIds) if (!eventIds.has(id)) errors.push(`${at}: eventId "${id}" is not an event id`);
    for (const id of thread.pathIds) if (!pathIds.has(id)) errors.push(`${at}: pathId "${id}" is not a path id`);
    for (const id of thread.placeIds) if (!placeIds.has(id)) errors.push(`${at}: placeId "${id}" is not a place id`);
    if (thread.status === 'needs-review') warnings.push(`${at} is needs-review: its intro must be checked against the event cards`);
  }
}
