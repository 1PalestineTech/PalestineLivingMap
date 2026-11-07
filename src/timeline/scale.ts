// The timeline's non-linear scale. Each era owns a fixed share of the track, and years map
// linearly inside an era. So the ancient millennia are compressed and recent decades get
// room. Era buttons land exactly on segment boundaries. Pure functions, no DOM; see scale.test.ts.
//
// Years in and out of this module are historical (negative = BCE, no year 0), like
// state.currentYear. Arithmetic inside uses astronomical years (1 BCE = 0).

import { ERAS } from '../data/eras.ts';
import type { EraId, EraInfo } from '../data/eras.ts';
import { toAstronomical, toHistorical } from '../data/spans.ts';

/** Fraction of the track each era gets. Must sum to 1. Tune the feel of the scrubber here. */
export const ERA_SHARES: Readonly<Record<EraId, number>> = {
  ancient: 0.14,
  classical: 0.17,
  'early-islamic': 0.1,
  crusader: 0.05,
  'ayyubid-mamluk': 0.09,
  ottoman: 0.14,
  'british-mandate': 0.08,
  '1948-1967': 0.06,
  '1967-1993': 0.07,
  '1993-present': 0.1,
};

export interface Segment {
  era: EraInfo;
  /** Astronomical years, continuous from one segment to the next. */
  startYear: number;
  endYear: number;
  /** Track positions, 0-1. */
  startPos: number;
  endPos: number;
}

export interface Scale {
  /** First and last year of the track, historical. */
  minYear: number;
  maxYear: number;
  segments: readonly Segment[];
  yearToPosition(year: number): number;
  positionToYear(position: number): number;
  eraAt(year: number): EraInfo;
  /** Keyboard step for one arrow press near `year`: 1 (year), 10 (decade) or 100 (century). */
  stepAt(year: number): number;
  /** Next year after stepping from `year`, snapped to a multiple of the local step. */
  stepYear(year: number, direction: 1 | -1, big: boolean): number;
}

export interface ScaleOptions {
  /** The present year, the right end of the track. Defaults to the current year. */
  presentYear?: number;
  /** Extends the left end earlier than the first era's start, if the data needs it. */
  firstYear?: number;
}

export function createScale(options: ScaleOptions = {}): Scale {
  const presentYear = options.presentYear ?? new Date().getFullYear();
  const firstEra = ERAS[0];
  if (!firstEra) throw new Error('No eras defined');
  const minYear = Math.min(firstEra.start, options.firstYear ?? firstEra.start);

  const segments: Segment[] = [];
  let position = 0;
  ERAS.forEach((era, index) => {
    const share = ERA_SHARES[era.id];
    const start = index === 0 ? minYear : era.start;
    const end = era.end ?? presentYear;
    segments.push({
      era,
      startYear: toAstronomical(start),
      endYear: toAstronomical(end),
      startPos: position,
      endPos: position + share,
    });
    position += share;
  });
  const last = segments[segments.length - 1];
  if (last) last.endPos = 1; // absorb floating-point drift

  const maxYear = presentYear;
  const clampYear = (year: number): number => Math.min(maxYear, Math.max(minYear, year));

  function segmentForYear(astronomical: number): Segment {
    // Later segment wins on a boundary year, matching eraAt().
    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
      if (segment && astronomical >= segment.startYear) return segment;
    }
    return segments[0] as Segment;
  }

  function segmentForPosition(pos: number): Segment {
    return segments.find((s) => pos < s.endPos) ?? (segments[segments.length - 1] as Segment);
  }

  function yearToPosition(year: number): number {
    const a = toAstronomical(clampYear(Math.round(year)));
    const s = segmentForYear(a);
    const span = s.endYear - s.startYear;
    const t = span === 0 ? 0 : (a - s.startYear) / span;
    return Math.min(1, s.startPos + t * (s.endPos - s.startPos));
  }

  function positionToYear(position: number): number {
    const pos = Math.min(1, Math.max(0, position));
    const s = segmentForPosition(pos);
    const t = (pos - s.startPos) / (s.endPos - s.startPos);
    const a = Math.round(s.startYear + t * (s.endYear - s.startYear));
    return clampYear(toHistorical(a));
  }

  function eraAt(year: number): EraInfo {
    return segmentForYear(toAstronomical(clampYear(Math.round(year)))).era;
  }

  function stepAt(year: number): number {
    const s = segmentForYear(toAstronomical(clampYear(year)));
    const yearsPerPercent = (s.endYear - s.startYear) / ((s.endPos - s.startPos) * 100);
    if (yearsPerPercent >= 100) return 100;
    if (yearsPerPercent >= 10) return 10;
    return 1;
  }

  function stepYear(year: number, direction: 1 | -1, big: boolean): number {
    const step = stepAt(year) * (big ? 10 : 1);
    let next =
      direction === 1 ? (Math.floor(year / step) + 1) * step : (Math.ceil(year / step) - 1) * step;
    if (next === 0) next = direction; // there is no year 0
    return clampYear(next);
  }

  return { minYear, maxYear, segments, yearToPosition, positionToYear, eraAt, stepAt, stepYear };
}
