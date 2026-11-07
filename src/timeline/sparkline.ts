// Event-density sparkline above the track: how many events are active at each point of the
// timeline, so people can see where history is "busy". Follows the category filters.

import type { CategoryId } from '../data/categories.ts';
import { eventSpan, toHistorical } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import type { Scale } from './scale.ts';

export const BUCKETS = 160;

/** Number of events active in each of `buckets` equal slices of the track. */
export function densityBuckets(
  events: readonly HistoricalEvent[],
  scale: Scale,
  categories: ReadonlySet<CategoryId>,
  buckets: number = BUCKETS,
): number[] {
  const counts = new Array<number>(buckets).fill(0);
  for (const event of events) {
    if (!categories.has(event.category)) continue;
    const span = eventSpan(event, scale.maxYear);
    const from = scale.yearToPosition(toHistorical(span.start));
    const to = scale.yearToPosition(toHistorical(span.end));
    const first = Math.min(buckets - 1, Math.floor(from * buckets));
    const last = Math.min(buckets - 1, Math.floor(to * buckets));
    for (let i = first; i <= last; i++) counts[i] = (counts[i] ?? 0) + 1;
  }
  return counts;
}

/** SVG path for a filled area in a 0..buckets by 0..1 box (y = 1 is the baseline). */
export function densityPath(counts: readonly number[]): string {
  const max = Math.max(...counts, 0);
  if (max === 0) return '';
  const points = counts.map((c, i) => `L${i + 0.5} ${(1 - c / max).toFixed(3)}`);
  return `M0 1 ${points.join(' ')} L${counts.length} 1 Z`;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSparkline(): { element: SVGSVGElement; update(counts: readonly number[]): void } {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'sparkline');
  svg.setAttribute('viewBox', `0 0 ${BUCKETS} 1`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  svg.append(path);
  return {
    element: svg,
    update(counts) {
      path.setAttribute('d', densityPath(counts));
    },
  };
}
