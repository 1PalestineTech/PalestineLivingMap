// Data types for public/data/places.json. The JSON Schema in public/data/places.schema.json
// must describe the same shape; see docs/DATA_GUIDE.md. Hebrew names are never stored here.

import type { EventStatus, Source } from './types.ts';

export type PlaceKind = 'city' | 'town' | 'village' | 'site' | 'region' | 'water' | 'mountain';

export interface PlaceName {
  en: string;
  /** Arabic form; null only with a `note` that says why. */
  ar: string | null;
  /** Language of the name as used at the time ("la", "grc", "ar", ...). */
  lang: string;
  /** Historical year (negative = BCE). null = start not yet sourced: listed on the card, never drawn. */
  from: number | null;
  /** Historical year. null = still in use today. */
  to: number | null;
  fromCirca: boolean;
  toCirca: boolean;
  sources: Source[];
  note?: string;
}

export interface PlaceFacts {
  /** The 1945 Mandate sub-district. */
  subDistrict?: string;
  occupied?: { text: string; year: number; source: 'pr' | 'book' };
  /** Population in 1948 (Palestine Remembered). */
  population?: { year: string; value: number; source: 'pr' | 'book' };
  /** Population in 1944/45, read from Khalidi's All That Remains by OCR. */
  population1944?: { year: string; value: number; source: 'pr' | 'book' };
  /** Israeli localities the book names on the village lands that match a place in our data. */
  localities?: { name: string; id: string }[];
  bookPage?: string;
}

export interface Place {
  id: string;
  kind: PlaceKind;
  /** 1 (major city) to 4 (minor site): sets label size and the zoom where it appears. */
  rank: 1 | 2 | 3 | 4;
  /** Optional, 1 (first) to 9: which place keeps its label when two collide. Default 5. */
  priority?: number;
  /** Optional lettering guide for a region: [lng, lat] points the name is set along. Decorative, never a boundary. */
  labelPath?: [number, number][];
  /** A place outside Palestine kept for context: its label shows only while one of these events (or its own card) is open. */
  contextEvents?: string[];
  /** Village facts shown on its card, each with where it comes from. Machine-read figures are flagged on the card. */
  facts?: PlaceFacts;
  /** Year the place was depopulated. From the year after it, the label reads "(depopulated)". */
  depopulated?: number;
  /** "settlement" puts the place in the separate Settlements section (Israeli localities and districts). */
  group?: 'settlement';
  lat: number;
  lng: number;
  names: PlaceName[];
  status: EventStatus;
  editorNote?: string;
}

export interface PlacesFile {
  $schema?: string;
  version: 1;
  places: Place[];
}
