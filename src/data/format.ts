// Human-readable dates for tooltips and cards. English only (docs/SPEC.md decision 7).

import { parseHistDate } from './dates.ts';
import type { HistDate } from './dates.ts';
import type { DatePrecision, HistoricalEvent } from './types.ts';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** "332 BCE", and "1917" or, with `ce`, "1917 CE". There is no year 0. */
export function formatYear(year: number, ce = false): string {
  if (year < 0) return `${-year} BCE`;
  return ce ? `${year} CE` : `${year}`;
}

function formatOne(text: string, precision: DatePrecision): string {
  const d: HistDate | null = parseHistDate(text);
  if (!d) return text;
  const bce = d.year < 0;
  const abs = Math.abs(d.year);

  switch (precision) {
    case 'century': {
      // 1800 = the 19th century CE; -1300 = the 13th century BCE.
      const n = Math.floor((abs - 1) / 100) + 1;
      return `${ordinal(bce ? n : n + 1)} century${bce ? ' BCE' : ''}`;
    }
    case 'decade':
      return `${abs}s${bce ? ' BCE' : ''}`;
    case 'year':
      return formatYear(d.year);
    case 'month':
      return `${MONTHS[(d.month ?? 1) - 1]} ${formatYear(d.year)}`;
    case 'day':
      return `${d.day ?? 1} ${MONTHS[(d.month ?? 1) - 1]} ${formatYear(d.year)}`;
  }
}

export function formatEventDate(event: HistoricalEvent): string {
  const circa = event.circa ? 'c. ' : '';
  const start = formatOne(event.dateStart, event.datePrecision);
  if (event.ongoing) return `${circa}${start} - present (ongoing)`;
  if (event.dateEnd === null) return `${circa}${start}`;
  const end = formatOne(event.dateEnd, event.datePrecision);
  return end === start ? `${circa}${start}` : `${circa}${start} - ${end}`;
}
