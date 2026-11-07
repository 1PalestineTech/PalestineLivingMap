// When is an event "active" on the map? An event is shown for its whole date unit:
// a day, month or year event for that year; a decade or century event for that span;
// an event with a dateEnd for the whole range; an ongoing event up to the present year.
// Phase 5 may add a lingering window if the timeline needs one; change it here only.

import { parseHistDate } from './dates.ts';
import type { HistoricalEvent } from './types.ts';

/** Astronomical year numbers (1 BCE = 0), so spans can be compared with plain arithmetic. */
export interface EventSpan {
  start: number;
  /** Inclusive. */
  end: number;
}

/** Historical year (negative = BCE, no year 0) to astronomical year. */
export function toAstronomical(historicalYear: number): number {
  return historicalYear < 0 ? historicalYear + 1 : historicalYear;
}

/** Astronomical year back to historical numbering (0 becomes 1 BCE). */
export function toHistorical(astronomicalYear: number): number {
  return astronomicalYear <= 0 ? astronomicalYear - 1 : astronomicalYear;
}

function yearOf(text: string): number {
  const parsed = parseHistDate(text);
  if (!parsed) throw new Error(`Invalid date "${text}"`);
  return parsed.year;
}

export function eventSpan(event: HistoricalEvent, presentYear: number = new Date().getFullYear()): EventSpan {
  const startYear = yearOf(event.dateStart);
  let endYear: number;
  if (event.ongoing) endYear = presentYear;
  else if (event.dateEnd !== null) endYear = yearOf(event.dateEnd);
  else if (event.datePrecision === 'decade') endYear = startYear + 9;
  else if (event.datePrecision === 'century') endYear = startYear + 99;
  else endYear = startYear;

  const start = toAstronomical(startYear);
  return { start, end: Math.max(start, toAstronomical(endYear)) };
}

/** The year the timeline should show to make this event visible (historical numbering). */
export function eventStartYear(event: HistoricalEvent): number {
  return yearOf(event.dateStart);
}

/** `year` is a historical year, as stored in state.currentYear. */
export function isActiveInYear(span: EventSpan, year: number): boolean {
  const y = toAstronomical(Math.round(year));
  return y >= span.start && y <= span.end;
}
