// Fetches events.json and checks it at runtime. This is a light structural check; the full
// rules (precision, era ranges, word counts) are enforced by `npm run validate` at author time.
// Ajv is deliberately not bundled into the app to keep it small.

import { CATEGORY_IDS } from './categories.ts';
import { ERA_IDS } from './eras.ts';
import { parseHistDate } from './dates.ts';
import type { HistoricalEvent } from './types.ts';

export const EVENTS_URL = `${import.meta.env.BASE_URL}data/events.json`;

export interface LoadedEvents {
  events: HistoricalEvent[];
  /** One message per event that was skipped because it failed the structural check. */
  problems: string[];
}

/** Thrown when the file can't be fetched or isn't a usable events file. */
export class LoadEventsError extends Error {
  override name = 'LoadEventsError';
}

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/** Returns a reason the event is unusable, or null if it looks fine. */
function eventProblem(raw: unknown): string | null {
  if (!isObj(raw)) return 'not an object';
  if (!isText(raw.id)) return 'missing id';
  if (!isText(raw.title)) return 'missing title';
  if (typeof raw.dateStart !== 'string' || parseHistDate(raw.dateStart) === null) {
    return 'invalid dateStart';
  }
  if (raw.dateEnd !== null && (typeof raw.dateEnd !== 'string' || parseHistDate(raw.dateEnd) === null)) {
    return 'invalid dateEnd';
  }
  if (!isOneOf(CATEGORY_IDS, raw.category)) return 'unknown category';
  if (!isOneOf(ERA_IDS, raw.era)) return 'unknown era';
  if (!isText(raw.summary)) return 'missing summary';

  const loc = raw.location;
  if (!isObj(loc) || !isText(loc.name)) return 'missing location name';
  if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return 'missing coordinates';

  if (!Array.isArray(raw.sources) || raw.sources.length === 0) return 'no sources';
  if (!Array.isArray(raw.tags)) return 'missing tags';
  return null;
}

export async function loadEvents(url: string = EVENTS_URL): Promise<LoadedEvents> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new LoadEventsError(`Could not reach ${url}. Check your connection and try again.`, { cause: err });
  }
  if (!response.ok) {
    throw new LoadEventsError(`The events file could not be loaded (${response.status} ${response.statusText}).`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (err) {
    throw new LoadEventsError('The events file is missing or is not valid JSON.', { cause: err });
  }

  if (!isObj(data) || data.version !== 1 || !Array.isArray(data.events)) {
    throw new LoadEventsError('The events file has an unexpected format (expected version 1 with an "events" list).');
  }

  const events: HistoricalEvent[] = [];
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const [index, raw] of (data.events as unknown[]).entries()) {
    const problem = eventProblem(raw);
    if (problem !== null) {
      problems.push(`Event #${index + 1}: ${problem}`);
      continue;
    }
    // eventProblem has checked every field the app relies on.
    const event = raw as HistoricalEvent;
    if (seen.has(event.id)) {
      problems.push(`Event "${event.id}": duplicate id`);
      continue;
    }
    seen.add(event.id);
    events.push(event);
  }

  if (events.length === 0) {
    throw new LoadEventsError('The events file contains no usable events.');
  }
  return { events, problems };
}
