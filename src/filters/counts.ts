// Pure helpers for the filter panel: events per category in a year, and whether any event
// at all matches the active categories.

import { CATEGORY_IDS } from '../data/categories.ts';
import type { CategoryId } from '../data/categories.ts';
import { eventSpan, isActiveInYear } from '../data/spans.ts';
import type { EventSpan } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';

export type CategoryCounts = Record<CategoryId, number>;

export function emptyCounts(): CategoryCounts {
  return Object.fromEntries(CATEGORY_IDS.map((id) => [id, 0])) as CategoryCounts;
}

/** Returns a function that counts the events active in a year, per category (ignoring filters). */
export function createCategoryCounter(events: readonly HistoricalEvent[]): (year: number) => CategoryCounts {
  const spans: { category: CategoryId; span: EventSpan }[] = events.map((e) => ({
    category: e.category,
    span: eventSpan(e),
  }));
  return (year) => {
    const counts = emptyCounts();
    for (const { category, span } of spans) {
      if (isActiveInYear(span, year)) counts[category] += 1;
    }
    return counts;
  };
}

/** How many events, in any year, belong to a currently active category. */
export function countMatching(events: readonly HistoricalEvent[], active: ReadonlySet<CategoryId>): number {
  return events.reduce((n, e) => (active.has(e.category) ? n + 1 : n), 0);
}

/** True when some category is switched on (none is the default). */
export function filtersActive(active: ReadonlySet<CategoryId>): boolean {
  return active.size > 0;
}
