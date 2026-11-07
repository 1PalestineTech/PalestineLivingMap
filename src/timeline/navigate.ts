// Moving the timeline from code: era buttons, the event card's Prev/Next, story steps and
// #event= links all glide the year the same way (or jump, with reduced motion).

import { eventSpan, eventStartYear, isActiveInYear } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { getState, setState } from '../state.ts';
import type { Scale } from './scale.ts';

const DEFAULT_MS = 600;
const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

let scale: Scale | null = null;
let frame = 0;

export function initNavigation(shared: Scale): void {
  scale = shared;
}

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Stops a glide in progress (the reader grabbed the handle). */
export function cancelYearAnimation(): void {
  window.cancelAnimationFrame(frame);
  frame = 0;
}

function applyYear(year: number): void {
  if (!scale) return;
  setState({ currentYear: year, activeEra: scale.eraAt(year).id });
}

/** Moves the timeline to `year` and pauses playback. Calls `onDone` when it arrives. */
export function goToYear(year: number, onDone?: () => void, durationMs: number = DEFAULT_MS): void {
  if (!scale) return;
  cancelYearAnimation();
  setState({ isPlaying: false });

  const target = Math.min(scale.maxYear, Math.max(scale.minYear, year));
  const from = scale.yearToPosition(getState().currentYear);
  const to = scale.yearToPosition(target);
  if (prefersReducedMotion() || from === to || durationMs <= 0) {
    applyYear(target);
    onDone?.();
    return;
  }

  const startedAt = performance.now();
  const step = (now: number): void => {
    const t = Math.min(1, (now - startedAt) / durationMs);
    if (t >= 1) {
      frame = 0;
      applyYear(target);
      onDone?.();
      return;
    }
    if (scale) applyYear(scale.positionToYear(from + (to - from) * easeOut(t)));
    frame = window.requestAnimationFrame(step);
  };
  frame = window.requestAnimationFrame(step);
}

/** Selects an event and brings the timeline to its year so its marker is visible. */
export function selectEvent(event: HistoricalEvent): void {
  setState({ selectedEventId: event.id, isPlaying: false });
  // Keep the viewer's place when the event is already active in the current year.
  if (isActiveInYear(eventSpan(event), getState().currentYear)) return;
  const year = eventStartYear(event);
  if (getState().currentYear !== year) goToYear(year);
}
