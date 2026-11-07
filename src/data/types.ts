// Data types for public/data/events.json. The JSON Schema in
// public/data/events.schema.json must describe the same shape; see docs/DATA_GUIDE.md.
// The playbook calls the record type "Event"; it is HistoricalEvent here to avoid
// clashing with the DOM's built-in Event type.

import type { CategoryId } from './categories.ts';
import type { EraId } from './eras.ts';

export type DatePrecision = 'day' | 'month' | 'year' | 'decade' | 'century';
export type LocationPrecision = 'exact' | 'area' | 'approximate';
export type EventStatus = 'verified' | 'needs-review';

export interface HistoricalName {
  name: string;
  /** BCP 47 language tag, e.g. "la", "grc", "ar". */
  lang?: string;
  /** When the name was in use, in words, e.g. "Roman period". */
  period?: string;
}

export interface EventLocation {
  /** Common English name, shown first. */
  name: string;
  /** Arabic name; null only when none exists or it is still being checked. */
  nameAr: string | null;
  /** Hebrew name where one exists. */
  nameHe: string | null;
  historicalNames?: HistoricalName[];
  lat: number;
  lng: number;
  precision: LocationPrecision;
}

export interface Source {
  title: string;
  url: string;
  publisher: string;
  /** YYYY-MM-DD, the day the URL was opened and read. */
  accessedDate: string;
  author?: string;
  /** Page or section reference, e.g. "pp. 54-70". */
  pages?: string;
  /** What this source supports, e.g. "coordinates only". */
  note?: string;
}

export interface Perspective {
  /** Who holds this view, e.g. "UN Information System on the Question of Palestine". */
  viewpoint: string;
  claim: string;
  /** Index into the event's sources array. */
  sourceIndex: number;
}

export interface EventImage {
  src: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

export interface HistoricalEvent {
  /** Kebab-case, unique, stable. */
  id: string;
  title: string;
  /** See src/data/dates.ts for the format. */
  dateStart: string;
  dateEnd: string | null;
  datePrecision: DatePrecision;
  /** True when sources give the date as approximate ("c."). */
  circa?: boolean;
  /** True for events still under way; dateEnd must then be null. */
  ongoing?: boolean;
  location: EventLocation;
  category: CategoryId;
  era: EraId;
  /** Max 60 words, neutral, in our own words. */
  summary: string;
  details?: string;
  sources: [Source, ...Source[]];
  perspectives?: Perspective[];
  images?: EventImage[];
  status: EventStatus;
  tags: string[];
  /** Internal note for reviewers, e.g. why coordinates are approximate. Not shown in UI. */
  editorNote?: string;
}

export interface EventsFile {
  $schema?: string;
  version: 1;
  events: HistoricalEvent[];
}
