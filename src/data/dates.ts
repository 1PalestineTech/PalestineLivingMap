// Historical date strings: "YYYY", "YYYY-MM" or "YYYY-MM-DD", with a leading "-" for
// BCE. The year is the historical year number: "-332" is 332 BCE. There is no year 0.
// Years may have 1-5 digits ("691", "-3200"); month and day are always two digits.

import type { DatePrecision } from './types.ts';

export interface HistDate {
  year: number;
  month: number | null;
  day: number | null;
}

const DATE_RE = /^(-?)(\d{1,5})(?:-(\d{2})(?:-(\d{2}))?)?$/;

export function parseHistDate(text: string): HistDate | null {
  const m = DATE_RE.exec(text);
  if (!m) return null;
  const [, sign, yearDigits, monthDigits, dayDigits] = m;
  const year = Number(yearDigits) * (sign === '-' ? -1 : 1);
  if (year === 0) return null;

  const month = monthDigits === undefined ? null : Number(monthDigits);
  if (month !== null && (month < 1 || month > 12)) return null;

  const day = dayDigits === undefined ? null : Number(dayDigits);
  if (day !== null && month !== null && (day < 1 || day > daysInMonth(year, month))) {
    return null;
  }
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  // Proleptic Gregorian for CE; BCE day-precision dates are rare, so allow up to 31.
  if (year < 0) return 31;
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Continuous numeric position for sorting and the timeline (astronomical years). */
export function toTimelineValue(d: HistDate): number {
  const astronomicalYear = d.year < 0 ? d.year + 1 : d.year;
  const monthFraction = d.month === null ? 0 : (d.month - 1) / 12;
  const dayFraction = d.day === null ? 0 : (d.day - 1) / 365;
  return astronomicalYear + monthFraction + dayFraction;
}

/** Returns a reason string if the date's shape doesn't match its precision, else null. */
export function precisionMismatch(d: HistDate, precision: DatePrecision): string | null {
  switch (precision) {
    case 'day':
      return d.day === null ? 'precision "day" needs YYYY-MM-DD' : null;
    case 'month':
      return d.month === null || d.day !== null ? 'precision "month" needs YYYY-MM' : null;
    case 'year':
      return d.month !== null ? 'precision "year" needs YYYY only' : null;
    case 'decade':
      if (d.month !== null) return 'precision "decade" needs YYYY only';
      return d.year % 10 !== 0 ? 'precision "decade" needs a year ending in 0 (e.g. 1920)' : null;
    case 'century':
      if (d.month !== null) return 'precision "century" needs YYYY only';
      return d.year % 100 !== 0 ? 'precision "century" needs a year ending in 00 (e.g. 1800)' : null;
  }
}
