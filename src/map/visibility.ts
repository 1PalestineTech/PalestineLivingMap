// Shows only the events active in the current year (and in an active category), and fades
// markers in and out instead of popping them. The map sources hold only the markers that
// are visible or still fading out; the fade itself is the "fade" feature-state (0-1).

import type { Map as MapLibreMap } from 'maplibre-gl';
import type { HistoricalEvent } from '../data/types.ts';
import { eventSpan, isActiveInYear } from '../data/spans.ts';
import type { EventSpan } from '../data/spans.ts';
import { getState } from '../state.ts';
import { areaFeature, isApproximate, pinFeature } from './features.ts';
import { AREA_SOURCE, PIN_SOURCE, setSourceData } from './layers.ts';

const FADE_MS = 300;

interface Entry {
  event: HistoricalEvent;
  span: EventSpan;
}

interface Fade {
  from: number;
  to: number;
  startedAt: number;
}

const ease = (t: number): number => 1 - Math.pow(1 - t, 3);
const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface Visibility {
  /** Re-evaluates which events are active from the current app state. */
  refresh(): void;
}

export function createVisibility(map: MapLibreMap, events: readonly HistoricalEvent[]): Visibility {
  const entries: Entry[] = events.map((event) => ({ event, span: eventSpan(event) }));
  const inSource = new Map<string, HistoricalEvent>();
  const values = new Map<string, number>();
  const fades = new Map<string, Fade>();
  let frame = 0;

  function setValue(id: string, value: number, area: boolean): void {
    values.set(id, value);
    map.setFeatureState({ source: area ? AREA_SOURCE : PIN_SOURCE, id }, { fade: value });
  }

  function pushData(): void {
    const shown = [...inSource.values()];
    setSourceData(map, PIN_SOURCE, {
      type: 'FeatureCollection',
      features: shown.filter((e) => !isApproximate(e)).map(pinFeature),
    });
    setSourceData(map, AREA_SOURCE, {
      type: 'FeatureCollection',
      features: shown.filter(isApproximate).map(areaFeature),
    });
  }

  function retarget(event: HistoricalEvent, to: number, now: number): void {
    const from = values.get(event.id) ?? 0;
    if (from === to) {
      fades.delete(event.id);
      return;
    }
    fades.set(event.id, { from, to, startedAt: now });
  }

  function tick(now: number): void {
    frame = 0;
    let removed = false;
    for (const [id, fade] of fades) {
      const event = inSource.get(id);
      if (!event) {
        fades.delete(id);
        continue;
      }
      const t = Math.min(1, (now - fade.startedAt) / FADE_MS);
      setValue(id, fade.from + (fade.to - fade.from) * ease(t), isApproximate(event));
      if (t < 1) continue;
      fades.delete(id);
      if (fade.to === 0) {
        inSource.delete(id);
        removed = true;
      }
    }
    if (removed) pushData();
    if (fades.size > 0) frame = requestAnimationFrame(tick);
  }

  function refresh(): void {
    const { currentYear, activeCategories, selectedEventId } = getState();
    const instant = prefersReducedMotion();
    const now = performance.now();
    let membershipChanged = false;

    for (const { event, span } of entries) {
      // The event that is open (a story step, a link, a search result) shows even when its category is off.
      const active = (activeCategories.has(event.category) || event.id === selectedEventId) && isActiveInYear(span, currentYear);
      const present = inSource.has(event.id);

      if (active && !present) {
        inSource.set(event.id, event);
        setValue(event.id, instant ? 1 : 0, isApproximate(event));
        if (!instant) retarget(event, 1, now);
        membershipChanged = true;
      } else if (active && present) {
        if (instant) {
          fades.delete(event.id);
          setValue(event.id, 1, isApproximate(event));
        } else {
          retarget(event, 1, now);
        }
      } else if (!active && present) {
        if (instant) {
          fades.delete(event.id);
          inSource.delete(event.id);
          membershipChanged = true;
        } else {
          retarget(event, 0, now);
        }
      }
    }

    if (membershipChanged) pushData();
    if (fades.size > 0 && frame === 0) frame = requestAnimationFrame(tick);
  }

  return { refresh };
}
