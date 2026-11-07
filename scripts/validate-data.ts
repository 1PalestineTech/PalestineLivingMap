// Validates public/data/events.json against the JSON Schema plus rules the schema
// can't express. Usage: npm run validate [-- path/to/events.json]
// Exits 1 if there are errors; warnings are printed but don't fail the run.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { CATEGORY_IDS } from '../src/data/categories.ts';
import { ERA_IDS, eraById } from '../src/data/eras.ts';
import { isInRegion } from '../src/data/region.ts';
import { parseHistDate, precisionMismatch, toTimelineValue } from '../src/data/dates.ts';
import type { LayersFile } from '../src/data/layerTypes.ts';
import { toAstronomical } from '../src/data/spans.ts';
import type { StoriesFile } from '../src/data/storyTypes.ts';
import type { EventsFile, HistoricalEvent } from '../src/data/types.ts';
import { checkPaths } from './lib/validate-paths.ts';
import { checkPlaces } from './lib/validate-places.ts';
import { checkThreads } from './lib/validate-threads.ts';

const MAX_SUMMARY_WORDS = 60;
const MAX_CAPTION_WORDS = 40;
const root = resolve(import.meta.dirname, '..');
const dataPath = resolve(process.argv[2] ?? resolve(root, 'public/data/events.json'));
const schemaPath = resolve(root, 'public/data/events.schema.json');
const storiesSchemaPath = resolve(root, 'public/data/stories.schema.json');
// stories.json sits next to the events file, so a custom events path checks its own stories.
const storiesPath = resolve(dirname(dataPath), 'stories.json');
const layersDir = resolve(dirname(dataPath), 'layers');
const layersManifestPath = resolve(layersDir, 'layers.json');
const layersSchemaPath = resolve(layersDir, 'layers.schema.json');
const placesPath = resolve(dirname(dataPath), 'places.json');
const placesSchemaPath = resolve(dirname(dataPath), 'places.schema.json');
const pathsPath = resolve(dirname(dataPath), 'paths.json');
const pathsSchemaPath = resolve(dirname(dataPath), 'paths.schema.json');
const threadsPath = resolve(dirname(dataPath), 'threads.json');
const threadsSchemaPath = resolve(dirname(dataPath), 'threads.schema.json');

const errors: string[] = [];
const warnings: string[] = [];

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`Cannot read ${path}: ${(err as Error).message}`);
    process.exit(1);
  }
}

const schema = readJson(schemaPath) as {
  definitions: { event: { properties: { category: { enum: string[] }; era: { enum: string[] } } } };
};
checkEnumsMatch('category', schema.definitions.event.properties.category.enum, CATEGORY_IDS);
checkEnumsMatch('era', schema.definitions.event.properties.era.enum, ERA_IDS);

const data = readJson(dataPath);
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validateSchema = ajv.compile<EventsFile>(schema);

if (!validateSchema(data)) {
  for (const e of validateSchema.errors ?? []) {
    errors.push(`schema: ${e.instancePath || '(root)'} ${e.message ?? ''}`.trim());
  }
  report();
}

const events = (data as EventsFile).events;
const seenIds = new Set<string>();
const seenTitleDates = new Set<string>();

for (const ev of events) {
  checkEvent(ev);
}

const samples = events.filter((ev) => ev.tags.includes('sample')).length;
if (samples > 0) warnings.push(`${samples} event(s) are tagged "sample" and must be replaced before launch.`);
const placeholders = events.filter((ev) => ev.tags.includes('placeholder')).length;
if (placeholders > 0) warnings.push(`${placeholders} event(s) are tagged "placeholder": drafted from general knowledge with no source read; replace sources before verifying.`);
checkStories(new Set(events.map((ev) => ev.id)));
checkLayers();
if (existsSync(placesPath)) {
  checkPlaces({ ajv, schema: readJson(placesSchemaPath) as object, data: readJson(placesPath), errors, warnings });
}
if (existsSync(pathsPath)) {
  checkPaths({ ajv, schema: readJson(pathsSchemaPath) as object, data: readJson(pathsPath), events, geometryDir: resolve(dirname(dataPath), 'paths'), errors, warnings });
}
if (existsSync(threadsPath)) {
  const idsIn = (file: string, key: string): Set<string> => {
    if (!existsSync(file)) return new Set();
    const list = (readJson(file) as Record<string, unknown>)[key];
    return new Set(Array.isArray(list) ? list.flatMap((item: { id?: unknown }) => (typeof item.id === 'string' ? [item.id] : [])) : []);
  };
  checkThreads({
    ajv,
    schema: readJson(threadsSchemaPath) as object,
    data: readJson(threadsPath),
    eventIds: new Set(events.map((ev) => ev.id)),
    pathIds: idsIn(pathsPath, 'paths'),
    placeIds: idsIn(placesPath, 'places'),
    errors,
    warnings,
  });
}
report();

function checkEvent(ev: HistoricalEvent): void {
  const at = `event "${ev.id}"`;

  if (seenIds.has(ev.id)) errors.push(`${at}: duplicate id`);
  seenIds.add(ev.id);

  const titleDate = `${ev.title.trim().toLowerCase()}|${ev.dateStart}`;
  if (seenTitleDates.has(titleDate)) errors.push(`${at}: duplicate title on the same date`);
  seenTitleDates.add(titleDate);

  const start = parseHistDate(ev.dateStart);
  if (!start) {
    errors.push(`${at}: invalid dateStart "${ev.dateStart}" (bad month/day, or year 0)`);
  } else {
    const mismatch = precisionMismatch(start, ev.datePrecision);
    if (mismatch) errors.push(`${at}: dateStart ${mismatch}`);

    const era = eraById(ev.era);
    const fits = start.year >= era.start && (era.end === null || start.year <= era.end);
    if (!fits) errors.push(`${at}: dateStart ${ev.dateStart} is outside era "${ev.era}"`);
  }

  if (ev.dateEnd !== null) {
    const end = parseHistDate(ev.dateEnd);
    if (!end) {
      errors.push(`${at}: invalid dateEnd "${ev.dateEnd}"`);
    } else if (start && toTimelineValue(end) < toTimelineValue(start)) {
      errors.push(`${at}: dateEnd ${ev.dateEnd} is before dateStart ${ev.dateStart}`);
    }
  }
  if (ev.ongoing === true && ev.dateEnd !== null) errors.push(`${at}: ongoing events must have dateEnd null`);

  const words = ev.summary.trim().split(/\s+/).length;
  if (words > MAX_SUMMARY_WORDS) errors.push(`${at}: summary has ${words} words (max ${MAX_SUMMARY_WORDS})`);

  for (const [i, p] of (ev.perspectives ?? []).entries()) {
    if (p.sourceIndex >= ev.sources.length) {
      errors.push(`${at}: perspectives[${i}].sourceIndex ${p.sourceIndex} has no matching source`);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  for (const [i, s] of ev.sources.entries()) {
    if (s.accessedDate > today) warnings.push(`${at}: sources[${i}].accessedDate is in the future`);
  }

  const { lat, lng, precision, nameAr } = ev.location;
  if (!isInRegion(lat, lng)) warnings.push(`${at}: coordinates ${lat}, ${lng} are outside the Palestine region box`);
  if (nameAr === null) warnings.push(`${at}: location has no Arabic name`);
  if (precision === 'approximate' && !ev.editorNote) {
    warnings.push(`${at}: approximate location should explain itself in editorNote`);
  }
}

function checkStories(eventIds: ReadonlySet<string>): void {
  if (!existsSync(storiesPath)) return;
  const stories = readJson(storiesPath);
  const validate = ajv.compile<StoriesFile>(readJson(storiesSchemaPath) as object);
  if (!validate(stories)) {
    for (const e of validate.errors ?? []) {
      errors.push(`stories: ${e.instancePath || '(root)'} ${e.message ?? ''}`.trim());
    }
    return;
  }

  const seenStoryIds = new Set<string>();
  for (const story of stories.stories) {
    const at = `story "${story.id}"`;
    if (seenStoryIds.has(story.id)) errors.push(`${at}: duplicate id`);
    seenStoryIds.add(story.id);
    if (story.placeholder === true) warnings.push(`${at} is a placeholder and must be replaced before launch.`);

    for (const [i, step] of story.steps.entries()) {
      if (!eventIds.has(step.eventId)) {
        errors.push(`${at}: steps[${i}].eventId "${step.eventId}" is not an event id`);
      }
      const words = step.caption.trim().split(/\s+/).length;
      if (words > MAX_CAPTION_WORDS) {
        errors.push(`${at}: steps[${i}] caption has ${words} words (max ${MAX_CAPTION_WORDS})`);
      }
    }
  }
}

function checkLayers(): void {
  if (!existsSync(layersManifestPath)) return;
  const manifest = readJson(layersManifestPath);
  const validate = ajv.compile<LayersFile>(readJson(layersSchemaPath) as object);
  if (!validate(manifest)) {
    for (const e of validate.errors ?? []) {
      errors.push(`layers: ${e.instancePath || '(root)'} ${e.message ?? ''}`.trim());
    }
    return;
  }

  const seenIds = new Set<string>();
  for (const layer of manifest.layers) {
    const at = `layer "${layer.id}"`;
    if (seenIds.has(layer.id)) errors.push(`${at}: duplicate id`);
    seenIds.add(layer.id);
    if (layer.validFrom === 0 || layer.validTo === 0) errors.push(`${at}: there is no year 0`);
    if (layer.validTo !== null && toAstronomical(layer.validTo) < toAstronomical(layer.validFrom)) {
      errors.push(`${at}: validTo ${layer.validTo} is before validFrom ${layer.validFrom}`);
    }

    if (layer.placeholder === true) {
      warnings.push(`${at} is a placeholder and must be replaced before launch.`);
    } else if (layer.source.url === null) {
      errors.push(`${at}: a real layer needs a source url`);
    }

    const file = resolve(layersDir, layer.file);
    if (!existsSync(file)) {
      errors.push(`${at}: file "${layer.file}" does not exist in ${layersDir}`);
      continue;
    }
    const geo = readJson(file) as { type?: unknown; features?: unknown };
    if (geo.type !== 'FeatureCollection' || !Array.isArray(geo.features) || geo.features.length === 0) {
      errors.push(`${at}: "${layer.file}" must be a GeoJSON FeatureCollection with at least one feature`);
    }
  }
}

function checkEnumsMatch(name: string, schemaValues: string[], codeValues: readonly string[]): void {
  const a = [...schemaValues].sort().join(',');
  const b = [...codeValues].sort().join(',');
  if (a !== b) errors.push(`schema "${name}" enum doesn't match src/data (${a} vs ${b})`);
}

function report(): never {
  for (const w of warnings) console.warn(`warning: ${w}`);
  for (const e of errors) console.error(`error:   ${e}`);
  const count = Array.isArray((data as Partial<EventsFile> | undefined)?.events)
    ? (data as EventsFile).events.length
    : 0;
  if (errors.length > 0) {
    console.error(`\n${dataPath}: ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(`\n${dataPath}: ${count} event(s) valid, ${warnings.length} warning(s).`);
  process.exit(0);
}
