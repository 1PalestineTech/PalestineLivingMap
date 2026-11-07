// Shareable URL state kept in the hash, e.g. #year=1948&event=nakba-1947-1948 or
// #story=intro&step=3. Unknown keys are preserved so later phases (cats) can add theirs.
// Updates use replaceState, so scrubbing doesn't fill the browser history.

import { CATEGORY_IDS } from './data/categories.ts';
import type { CategoryId } from './data/categories.ts';
import type { HistoricalEvent } from './data/types.ts';
import { eventStartYear } from './data/spans.ts';
import { getState, setState, subscribe } from './state.ts';
import type { StoryProgress } from './state.ts';
import { selectEvent } from './timeline/navigate.ts';
import type { Scale } from './timeline/scale.ts';

export function parseHash(hash: string): Map<string, string> {
  const params = new Map<string, string>();
  const text = hash.startsWith('#') ? hash.slice(1) : hash;
  for (const part of text.split('&')) {
    if (part === '') continue;
    const eq = part.indexOf('=');
    const key = decodeURIComponent(eq === -1 ? part : part.slice(0, eq));
    const value = eq === -1 ? '' : decodeURIComponent(part.slice(eq + 1));
    params.set(key, value);
  }
  return params;
}

/** Rebuilds a hash from `hash` with `updates` applied; a null value removes the key. */
export function buildHash(hash: string, updates: Record<string, string | null>): string {
  const params = parseHash(hash);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }
  // Commas stay readable in lists like cats=political,cultural.
  const text = [...params]
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%2C/gi, ',')}`)
    .join('&');
  return text === '' ? '' : `#${text}`;
}

/** A whole, non-zero year within [min, max], or null if the hash has no usable year. */
export function readYear(hash: string, min: number, max: number): number | null {
  const raw = parseHash(hash).get('year');
  if (raw === undefined || !/^-?\d+$/.test(raw)) return null;
  const year = Number(raw);
  if (year === 0) return null;
  return Math.min(max, Math.max(min, year));
}

/** The event id in the hash, if it names a known event. */
export function readEvent(hash: string, events: readonly HistoricalEvent[]): HistoricalEvent | null {
  const id = parseHash(hash).get('event');
  return id === undefined ? null : (events.find((e) => e.id === id) ?? null);
}

/** The place id in "place=" (checked against the loaded places once the map starts). */
export function readPlace(hash: string): string | null {
  const id = parseHash(hash).get('place');
  return id !== undefined && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) ? id : null;
}

/** The thread id in "thread=" (checked against the loaded threads once the app starts). */
export function readThread(hash: string): string | null {
  const id = parseHash(hash).get('thread');
  return id !== undefined && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id) ? id : null;
}

/** `story` and `step` from the hash. The step defaults to 0 (the intro) and is never negative. */
export function readStory(hash: string): StoryProgress | null {
  const params = parseHash(hash);
  const id = params.get('story');
  if (id === undefined || id === '') return null;
  const raw = params.get('step');
  const step = raw !== undefined && /^\d+$/.test(raw) ? Number(raw) : 0;
  return { id, step };
}

/**
 * Active categories from "cats=a,b". Returns null when the key is absent or has no valid ids
 * (meaning the default, none); "cats=all" means every category and "cats=none" none.
 */
export function readCats(hash: string): Set<CategoryId> | null {
  const raw = parseHash(hash).get('cats');
  if (raw === undefined) return null;
  if (raw === 'none') return new Set();
  if (raw === 'all') return new Set(CATEGORY_IDS);
  const wanted = new Set(raw.split(',').map((s) => s.trim()));
  const valid = CATEGORY_IDS.filter((id) => wanted.has(id));
  return valid.length === 0 ? null : new Set(valid);
}

/** The "cats" hash value for a set of active categories, or null when all are active. */
export function catsValue(active: ReadonlySet<CategoryId>): string | null {
  if (active.size >= CATEGORY_IDS.length) return 'all';
  if (active.size === 0) return null;
  return CATEGORY_IDS.filter((id) => active.has(id)).join(',');
}

/** The map layer ids in "layers=a,b" (unknown ids are dropped later, once layers have loaded). */
export function readLayerIds(hash: string): Set<string> {
  const raw = parseHash(hash).get('layers');
  return new Set((raw ?? '').split(',').map((s) => s.trim()).filter((s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)));
}

/** The "layers" hash value, or null when no layer is on. */
export function layersValue(active: ReadonlySet<string>): string | null {
  return active.size === 0 ? null : [...active].sort().join(',');
}

function applyYear(scale: Scale, year: number): void {
  setState({ currentYear: year, activeEra: scale.eraAt(year).id });
}

/** Restores year and event from the current URL. Call before the map and timeline start. */
export function restoreFromHash(scale: Scale, events: readonly HistoricalEvent[]): void {
  const hash = window.location.hash;
  const event = readEvent(hash, events);
  const year = readYear(hash, scale.minYear, scale.maxYear);
  if (year !== null) applyYear(scale, year);
  else if (event) applyYear(scale, Math.min(scale.maxYear, Math.max(scale.minYear, eventStartYear(event))));
  if (event) setState({ selectedEventId: event.id });
  else {
    const place = readPlace(hash);
    if (place !== null) setState({ selectedPlaceId: place });
  }
  const thread = readThread(hash);
  if (thread !== null) setState({ thread });
  const cats = readCats(hash);
  if (cats) setState({ activeCategories: cats });
  const layers = readLayerIds(hash);
  if (layers.size > 0) setState({ activeOverlays: layers });
}

/** Keeps the hash and state in step, both ways. */
export function syncHash(scale: Scale, events: readonly HistoricalEvent[]): void {
  let timer = 0;
  const write = (): void => {
    timer = 0;
    const { currentYear, selectedEventId, selectedPlaceId, story, thread, activeCategories, activeOverlays } = getState();
    const next = buildHash(window.location.hash, {
      year: String(currentYear),
      event: story === null ? selectedEventId : null,
      place: story === null ? selectedPlaceId : null,
      thread,
      story: story === null ? null : story.id,
      step: story === null ? null : String(story.step),
      cats: catsValue(activeCategories),
      layers: layersValue(activeOverlays),
    });
    if (next !== window.location.hash) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`);
    }
  };

  subscribe((state, previous) => {
    if (
      state.currentYear === previous.currentYear &&
      state.selectedEventId === previous.selectedEventId &&
      state.selectedPlaceId === previous.selectedPlaceId &&
      state.thread === previous.thread &&
      state.story === previous.story &&
      state.activeCategories === previous.activeCategories &&
      state.activeOverlays === previous.activeOverlays
    ) {
      return;
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(write, 200);
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    const year = readYear(hash, scale.minYear, scale.maxYear);
    if (year !== null && year !== getState().currentYear) applyYear(scale, year);
    const cats = readCats(hash) ?? new Set<CategoryId>();
    if (catsValue(cats) !== catsValue(getState().activeCategories)) setState({ activeCategories: cats });
    if (readThread(hash) !== getState().thread) setState({ thread: readThread(hash) });
    const layers = readLayerIds(hash);
    if (layersValue(layers) !== layersValue(getState().activeOverlays)) setState({ activeOverlays: layers });
    if (getState().story !== null) return; // story mode owns the selection
    const event = readEvent(hash, events);
    const place = event === null ? readPlace(hash) : null;
    if (place !== getState().selectedPlaceId && event === null) setState({ selectedPlaceId: place, selectedEventId: null });
    if (event === null) {
      if (getState().selectedEventId !== null) setState({ selectedEventId: null });
    } else if (event.id !== getState().selectedEventId) {
      // Without an explicit year in the link, bring the timeline to the event.
      if (year === null) selectEvent(event);
      else setState({ selectedEventId: event.id });
    }
  });
}
