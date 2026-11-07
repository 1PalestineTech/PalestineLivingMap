// When is a path drawn? The timeline moves in whole years, so a path is placed on it by its
// waypoint dates: the share of the line drawn at a year is where the end of that year falls
// between the waypoint dates. A campaign that sits inside one year is therefore complete in that
// year; the map animates it over a few seconds while the timeline plays (src/paths/index.ts).

import { parseHistDate, toTimelineValue } from '../data/dates.ts';
import type { Waypoint } from '../data/pathTypes.ts';
import type { EventSpan } from '../data/spans.ts';
import { toAstronomical } from '../data/spans.ts';

/** The opacity of the faint trail left after the event ends. */
export const TRAIL_OPACITY = 0.35;

/** Timeline values (astronomical years, fractional) for each waypoint; undated ones are spaced evenly between dated neighbours. */
export function waypointTimes(waypoints: readonly Waypoint[], span: EventSpan): number[] {
  const dated = waypoints.map((w) => {
    const parsed = w.date === null ? null : parseHistDate(w.date);
    return parsed ? toTimelineValue(parsed) : null;
  });
  const last = dated.length - 1;
  const known: { at: number; time: number }[] = [];
  dated.forEach((time, at) => {
    if (time !== null) known.push({ at, time });
  });
  if (known[0]?.at !== 0) known.unshift({ at: 0, time: span.start });
  if (known[known.length - 1]?.at !== last) known.push({ at: last, time: span.end + 1 });
  return dated.map((_, i) => {
    const after = known.findIndex((k) => k.at >= i);
    const b = known[after];
    const a = known[after - 1];
    if (!b) return span.end + 1;
    if (b.at === i || !a) return b.time;
    return a.time + ((b.time - a.time) * (i - a.at)) / (b.at - a.at);
  });
}

/** Share (0-1) of the line drawn at `year`: waypoint i is reached when the year's end passes times[i]. */
export function targetProgress(times: readonly number[], fractions: readonly number[], year: number): number {
  const t = toAstronomical(Math.round(year)) + 1;
  const first = times[0];
  if (first === undefined || t <= first) return 0;
  for (let i = 1; i < times.length; i += 1) {
    const a = times[i - 1] ?? 0;
    const b = times[i] ?? a;
    if (t < b || i === times.length - 1) {
      const f = b === a ? 1 : Math.min(1, Math.max(0, (t - a) / (b - a)));
      const fa = fractions[i - 1] ?? 0;
      return fa + ((fractions[i] ?? 1) - fa) * f;
    }
  }
  return 1;
}

/** 0 before the event, 1 during it, a faint trail for `linger` years after, then 0. */
export function opacityAt(span: EventSpan, linger: number, year: number): number {
  const y = toAstronomical(Math.round(year));
  if (y < span.start) return 0;
  if (y <= span.end) return 1;
  return y <= span.end + linger ? TRAIL_OPACITY : 0;
}
