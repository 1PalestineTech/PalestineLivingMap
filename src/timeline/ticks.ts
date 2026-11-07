// Tick marks and labels for the track. Each era is a linear stretch with its own years per
// pixel, so each gets its own tick spacing (millennia, centuries, decades or years), chosen
// so labels never crowd each other. Pure: takes the scale and the track width in pixels.

import { formatYear } from '../data/format.ts';
import { toAstronomical, toHistorical } from '../data/spans.ts';
import type { Scale } from './scale.ts';

export interface Tick {
  year: number;
  /** 0-1 along the track. */
  pos: number;
  /** Only major ticks have a label. */
  label: string | null;
}

/** Candidate spacings in years, smallest first. */
const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000] as const;
export const MIN_LABEL_GAP_PX = 56;
const MIN_MINOR_GAP_PX = 7;

function chooseStep(pxPerYear: number): number {
  return STEPS.find((step) => step * pxPerYear >= MIN_LABEL_GAP_PX) ?? STEPS[STEPS.length - 1] ?? 1000;
}

function minorStep(step: number, pxPerYear: number): number | null {
  for (const divisor of [5, 2]) {
    const minor = step / divisor;
    if (Number.isInteger(minor) && minor * pxPerYear >= MIN_MINOR_GAP_PX) return minor;
  }
  return null;
}

function labelFor(year: number): string {
  return formatYear(year, year === 1);
}

export function computeTicks(scale: Scale, trackWidthPx: number): Tick[] {
  if (trackWidthPx <= 0) return [];
  const ticks: Tick[] = [];
  const seen = new Set<number>();

  for (const segment of scale.segments) {
    const span = segment.endYear - segment.startYear;
    const pxPerYear = ((segment.endPos - segment.startPos) * trackWidthPx) / span;
    const step = chooseStep(pxPerYear);
    const minor = minorStep(step, pxPerYear);
    const first = toHistorical(segment.startYear);
    const last = toHistorical(segment.endYear);

    const add = (year: number, label: boolean): void => {
      if (year === 0 || year < first || year > last || seen.has(year)) return;
      seen.add(year);
      ticks.push({ year, pos: scale.yearToPosition(year), label: label ? labelFor(year) : null });
    };

    // Multiples of the step in historical numbering. There is no year 0; 1 CE stands in for it.
    for (let y = Math.ceil(first / step) * step; y <= last; y += step) add(y === 0 ? 1 : y, true);
    if (minor !== null) {
      for (let y = Math.ceil(first / minor) * minor; y <= last; y += minor) {
        if (toAstronomical(y) !== toAstronomical(0)) add(y, false);
      }
    }
  }

  ticks.sort((a, b) => a.pos - b.pos);

  // Drop labels that would sit too close to the previous kept label (can happen at era joins).
  let lastLabelPx = -Infinity;
  return ticks.map((tick) => {
    if (tick.label === null) return tick;
    const px = tick.pos * trackWidthPx;
    if (px - lastLabelPx < MIN_LABEL_GAP_PX) return { ...tick, label: null };
    lastLabelPx = px;
    return tick;
  });
}
