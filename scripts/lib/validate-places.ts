// Checks for public/data/places.json beyond the JSON Schema (docs/SPEC_MAP_V2.md section 4).
// Called from scripts/validate-data.ts, which owns the Ajv instance and the report.

import type Ajv from 'ajv';
import { isInRegion } from '../../src/data/region.ts';
import type { PlacesFile } from '../../src/data/placeTypes.ts';
import { toAstronomical } from '../../src/data/spans.ts';

const HEBREW = /[֐-׿]/;

export interface PlaceCheckEnv {
  ajv: Ajv;
  schema: object;
  data: unknown;
  errors: string[];
  warnings: string[];
}

export function checkPlaces({ ajv, schema, data, errors, warnings }: PlaceCheckEnv): void {
  const validate = ajv.compile<PlacesFile>(schema);
  if (!validate(data)) {
    for (const e of validate.errors ?? []) errors.push(`places: ${e.instancePath || '(root)'} ${e.message ?? ''}`.trim());
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set<string>();
  for (const place of data.places) {
    const at = `place "${place.id}"`;
    if (seen.has(place.id)) errors.push(`${at}: duplicate id`);
    seen.add(place.id);
    if (!isInRegion(place.lat, place.lng)) warnings.push(`${at}: coordinates ${place.lat}, ${place.lng} are outside the Palestine region box`);

    for (const [i, name] of place.names.entries()) {
      const nameAt = `${at} names[${i}] "${name.en}"`;
      if (HEBREW.test(name.en) || (name.ar !== null && HEBREW.test(name.ar))) {
        errors.push(`${nameAt}: Hebrew script is never shown on the map; remove it`);
      }
      if (name.from !== null && name.to !== null && toAstronomical(name.to) < toAstronomical(name.from)) {
        errors.push(`${nameAt}: to ${name.to} is before from ${name.from}`);
      }
      if (name.ar === null && !name.note) errors.push(`${nameAt}: ar is null, so a note must explain why`);
      if (name.from === null) {
        if (place.status !== 'needs-review') errors.push(`${nameAt}: from is null, so the place must be "needs-review"`);
        warnings.push(`${nameAt}: no start year, so it is listed on the card but never drawn on the map`);
      }
      for (const [j, s] of name.sources.entries()) {
        if (s.accessedDate > today) warnings.push(`${nameAt}: sources[${j}].accessedDate is in the future`);
      }
    }

    // Names valid at the same time are drawn together; that should be deliberate.
    const dated = place.names.flatMap((n, i) => (n.from === null ? [] : [{ n, i }]));
    for (const [a, x] of dated.entries()) {
      for (const y of dated.slice(a + 1)) {
        const endX = x.n.to === null ? Infinity : toAstronomical(x.n.to);
        const endY = y.n.to === null ? Infinity : toAstronomical(y.n.to);
        const overlap = toAstronomical(x.n.from ?? 0) <= endY && toAstronomical(y.n.from ?? 0) <= endX;
        if (overlap) warnings.push(`${at}: names[${x.i}] "${x.n.en}" and names[${y.i}] "${y.n.en}" overlap in time; they will be drawn together`);
      }
    }
  }
}
