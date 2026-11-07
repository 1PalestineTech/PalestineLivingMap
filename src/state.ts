// App state: one small observable store, no framework.
// Later phases read with getState(), write with setState(), and react with subscribe().

import type { CategoryId } from './data/categories.ts';
import { CATEGORY_IDS } from './data/categories.ts';
import type { EraId } from './data/eras.ts';

/** Where the reader is in a guided story. Step 0 is the intro; steps 1..N are the events. */
export interface StoryProgress {
  id: string;
  step: number;
}

export interface AppState {
  /** Historical year: negative = BCE, no year 0 (see src/data/dates.ts). */
  currentYear: number;
  selectedEventId: string | null;
  /** The place whose card is open (era labels). Never set together with selectedEventId. */
  selectedPlaceId: string | null;
  /** The thread being followed (docs/SPEC_MAP_V2.md section 6), and its event ids while it is. */
  thread: string | null;
  threadEvents: readonly string[] | null;
  /** Ids of era-label places tied to the followed thread; other labels dim. */
  threadPlaces: readonly string[] | null;
  /** Show the separate Settlements section (Israeli localities and districts) on the map. */
  showSettlements: boolean;
  /** Show the optional hand-painted base picture under the map (src/map/illustrated.ts). Off by default. */
  illustratedBase: boolean;
  /** Optional schematic district areas (src/map/districts.ts): colour blocks and dashed lines between the main cities. On by default. */
  districtBlocks: boolean;
  districtLines: boolean;
  /** Optional zones showing who held the land by year (src/map/control.ts). Off by default; some stories switch them on. */
  controlZones: boolean;
  /** Lake Hula and the Dead Sea as the 1946 sheet prints them (src/map/lakes.ts). Off by default; one story switches it on. */
  lakes1946: boolean;
  /** A set of places picked by a search such as "Safad depopulated": only these are labelled. */
  placeFilter: { label: string; ids: readonly string[] } | null;
  /** Categories whose markers are shown. All eight by default. */
  activeCategories: ReadonlySet<CategoryId>;
  activeEra: EraId | null;
  isPlaying: boolean;
  /** Ids of the map layers (overlays) the reader switched on. Shown only within their years. */
  activeOverlays: ReadonlySet<string>;
  /** Set while a story is running. */
  story: StoryProgress | null;
  /** In story mode: dim every marker except the selected one. Cleared when the reader scrubs. */
  dimOthers: boolean;
}

export type Listener = (state: AppState, previous: AppState) => void;

const initialState: AppState = {
  currentYear: new Date().getFullYear(),
  selectedEventId: null,
  selectedPlaceId: null,
  thread: null,
  threadEvents: null,
  threadPlaces: null,
  showSettlements: false,
  illustratedBase: false,
  districtBlocks: true,
  districtLines: true,
  controlZones: false,
  lakes1946: false,
  placeFilter: null,
  activeCategories: new Set<CategoryId>(),
  activeEra: '1993-present',
  isPlaying: false,
  activeOverlays: new Set<string>(),
  story: null,
  dimOthers: false,
};

let state: AppState = initialState;
const listeners = new Set<Listener>();

export function getState(): AppState {
  return state;
}

/** Merges a partial update. Listeners run only if a value actually changed (sets by reference). */
export function setState(patch: Partial<AppState>): void {
  const next: AppState = { ...state, ...patch };
  const changed = (Object.keys(next) as (keyof AppState)[]).some((key) => next[key] !== state[key]);
  if (!changed) return;

  const previous = state;
  state = next;
  for (const listener of listeners) listener(state, previous);
}

/** Returns an unsubscribe function. Does not call the listener immediately. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
