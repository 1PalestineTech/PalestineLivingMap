// Previous / Next in the event card. Events step in date order within a group: the events at
// the same place when there are two or more, otherwise the events in the same category.

import { CATEGORIES } from '../data/categories.ts';
import { parseHistDate, toTimelineValue } from '../data/dates.ts';
import type { HistoricalEvent } from '../data/types.ts';

export interface Siblings {
  scope: 'location' | 'category';
  /** Short name of the group, e.g. "Gaza" or "Conflict". */
  groupName: string;
  /** The group in date order, including the current event. */
  list: readonly HistoricalEvent[];
  /** Position of the current event in `list`. */
  index: number;
  previous: HistoricalEvent | null;
  next: HistoricalEvent | null;
}

function sortKey(event: HistoricalEvent): number {
  const parsed = parseHistDate(event.dateStart);
  return parsed ? toTimelineValue(parsed) : 0;
}

export function byDate(a: HistoricalEvent, b: HistoricalEvent): number {
  return sortKey(a) - sortKey(b) || a.id.localeCompare(b.id);
}

export function siblingsOf(events: readonly HistoricalEvent[], current: HistoricalEvent): Siblings {
  const here = events.filter((e) => e.location.name === current.location.name);
  const useLocation = here.length >= 2;
  const list = (useLocation ? here : events.filter((e) => e.category === current.category)).slice().sort(byDate);
  const index = Math.max(0, list.findIndex((e) => e.id === current.id));
  const categoryLabel = CATEGORIES.find((c) => c.id === current.category)?.label ?? current.category;

  return {
    scope: useLocation ? 'location' : 'category',
    groupName: useLocation ? current.location.name : categoryLabel,
    list,
    index,
    previous: list[index - 1] ?? null,
    next: list[index + 1] ?? null,
  };
}
