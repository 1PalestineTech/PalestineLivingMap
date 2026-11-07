// Play / pause. Time advances along the track, faster across empty stretches and slower
// near events. At 1x the whole range takes about FULL_RANGE_SECONDS. With reduced motion
// there is no animation: playback steps from one event to the next every few seconds.

import type { HistoricalEvent } from '../data/types.ts';
import { eventSpan, toHistorical } from '../data/spans.ts';
import { getState, setState, subscribe } from '../state.ts';
import type { Scale } from './scale.ts';

export type Speed = 1 | 2 | 4;

const FULL_RANGE_SECONDS = 90;
const STEP_INTERVAL_MS = 2000;
/** Speed multiplier right at an event, and far from any event (track fractions). */
const SLOWEST = 0.35;
const FASTEST = 2.4;
const NEAR = 0.004;
const FAR = 0.04;

export interface Pacing {
  /** Speed multiplier at a track position (SLOWEST near an event, up to FASTEST far from any). */
  at(position: number): number;
  /** Average of at() over the whole track; used to keep the full-range time near the target. */
  average: number;
}

/** `positions` are track positions (0-1) of event starts, in any order. */
export function createPacing(positions: readonly number[]): Pacing {
  const sorted = [...positions].sort((a, b) => a - b);

  function distanceToEvent(position: number): number {
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if ((sorted[mid] ?? 0) < position) lo = mid + 1;
      else hi = mid;
    }
    const after = sorted[lo];
    const before = sorted[lo - 1];
    return Math.min(
      after === undefined ? Infinity : after - position,
      before === undefined ? Infinity : position - before,
    );
  }

  const at = (position: number): number => {
    const d = distanceToEvent(position);
    if (d === Infinity) return 1;
    const t = Math.min(1, Math.max(0, (d - NEAR) / (FAR - NEAR)));
    const smooth = t * t * (3 - 2 * t);
    return SLOWEST + (FASTEST - SLOWEST) * smooth;
  };

  const SAMPLES = 400;
  let total = 0;
  for (let i = 0; i < SAMPLES; i++) total += at((i + 0.5) / SAMPLES);
  return { at, average: total / SAMPLES };
}

export interface Playback {
  setSpeed(speed: Speed): void;
  toggle(): void;
  /** Call when the set of visible events changes (category filters). */
  refreshEvents(): void;
}

export function createPlayback(scale: Scale, events: readonly HistoricalEvent[]): Playback {
  const starts = events.map((event) => ({
    event,
    year: toHistorical(eventSpan(event, scale.maxYear).start),
  }));

  let speed: Speed = 1;
  let pacing = createPacing([]);
  let years: number[] = [];
  let frame = 0;
  let timer = 0;
  let lastTime = 0;
  let position = 0;

  function refreshEvents(): void {
    const { activeCategories } = getState();
    const active = starts.filter((s) => activeCategories.has(s.event.category));
    years = [...new Set(active.map((s) => s.year))].sort((a, b) => a - b);
    pacing = createPacing(active.map((s) => scale.yearToPosition(s.year)));
  }

  function setYear(year: number): void {
    setState({ currentYear: year, activeEra: scale.eraAt(year).id });
  }

  function stop(): void {
    window.cancelAnimationFrame(frame);
    window.clearInterval(timer);
    frame = 0;
    timer = 0;
    setState({ isPlaying: false });
  }

  function tick(now: number): void {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;
    position += (dt * speed * pacing.at(position)) / (FULL_RANGE_SECONDS * pacing.average);
    if (position >= 1) {
      setYear(scale.maxYear);
      stop();
      return;
    }
    const year = scale.positionToYear(position);
    if (year !== getState().currentYear) setYear(year);
    frame = window.requestAnimationFrame(tick);
  }

  function stepToNextEvent(): void {
    const next = years.find((y) => y > getState().currentYear);
    if (next === undefined) {
      stop();
      return;
    }
    setYear(next);
  }

  function start(): void {
    refreshEvents();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (getState().currentYear >= scale.maxYear) setYear(scale.minYear); // replay from the start
    if (reduced) {
      stepToNextEvent();
      timer = window.setInterval(stepToNextEvent, STEP_INTERVAL_MS / speed);
      return;
    }
    position = scale.yearToPosition(getState().currentYear);
    lastTime = performance.now();
    frame = window.requestAnimationFrame(tick);
  }

  // Start or stop when the shared state flips, whoever flipped it (button, marker click...).
  subscribe((state, previous) => {
    if (state.isPlaying === previous.isPlaying) return;
    if (state.isPlaying) start();
    else {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
      frame = 0;
      timer = 0;
    }
  });

  return {
    setSpeed(next) {
      speed = next;
      if (timer !== 0) {
        window.clearInterval(timer);
        timer = window.setInterval(stepToNextEvent, STEP_INTERVAL_MS / speed);
      }
    },
    toggle() {
      setState({ isPlaying: !getState().isPlaying });
    },
    refreshEvents,
  };
}
