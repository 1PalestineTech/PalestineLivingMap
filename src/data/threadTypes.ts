// Data types for public/data/threads.json. The JSON Schema in public/data/threads.schema.json must
// describe the same shape; see docs/DATA_GUIDE.md.

import type { EventStatus } from './types.ts';

export type ThreadKind = 'person' | 'place' | 'theme';

export interface Thread {
  id: string;
  kind: ThreadKind;
  title: string;
  titleAr?: string;
  /** At most 60 words, restating only what the event cards say. Adds no new claims. */
  intro: string;
  /** The events followed, listed explicitly (tags are free-form, so they build no threads). */
  eventIds: string[];
  pathIds: string[];
  placeIds: string[];
  status: EventStatus;
}

export interface ThreadsFile {
  $schema?: string;
  version: 1;
  threads: Thread[];
}
