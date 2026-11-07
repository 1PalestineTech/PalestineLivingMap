// Era definitions from docs/SPEC.md section 8. Ids must match the "era" enum in
// public/data/events.schema.json (the validator checks this).
//
// Years use historical numbering: negative = BCE, positive = CE, no year 0.
// Boundaries are inclusive on both ends, so a boundary year (e.g. 1948) can belong to
// either neighbouring era; the event's author picks the one that fits.
// `end: null` means "to the present".

import { HOME_BOUNDS } from './region.ts';
import type { LngLatBox } from './region.ts';

export const ERA_IDS = [
  'ancient',
  'classical',
  'early-islamic',
  'crusader',
  'ayyubid-mamluk',
  'ottoman',
  'british-mandate',
  '1948-1967',
  '1967-1993',
  '1993-present',
] as const;

export type EraId = (typeof ERA_IDS)[number];

export interface EraInfo {
  id: EraId;
  label: string;
  start: number;
  end: number | null;
  /** Where the map looks when this era is chosen. A viewport choice, not a historical claim. */
  bounds: LngLatBox;
}

// Every era starts with the home view. Give an era its own box here to change where the map
// goes when that era's button is pressed, e.g. a wider box for an era whose story reaches
// beyond Palestine.
const HOME = HOME_BOUNDS;

export const ERAS: readonly EraInfo[] = [
  { id: 'ancient', label: 'Ancient', start: -3200, end: -332, bounds: HOME },
  { id: 'classical', label: 'Classical', start: -332, end: 638, bounds: HOME },
  { id: 'early-islamic', label: 'Early Islamic', start: 638, end: 1099, bounds: HOME },
  { id: 'crusader', label: 'Crusader', start: 1099, end: 1187, bounds: HOME },
  { id: 'ayyubid-mamluk', label: 'Ayyubid-Mamluk', start: 1187, end: 1516, bounds: HOME },
  { id: 'ottoman', label: 'Ottoman', start: 1516, end: 1917, bounds: HOME },
  { id: 'british-mandate', label: 'British Mandate', start: 1917, end: 1948, bounds: HOME },
  { id: '1948-1967', label: '1948-1967', start: 1948, end: 1967, bounds: HOME },
  { id: '1967-1993', label: '1967-1993', start: 1967, end: 1993, bounds: HOME },
  { id: '1993-present', label: '1993-present', start: 1993, end: null, bounds: HOME },
];

export function eraById(id: EraId): EraInfo {
  const era = ERAS.find((e) => e.id === id);
  if (!era) throw new Error(`Unknown era: ${id}`);
  return era;
}
