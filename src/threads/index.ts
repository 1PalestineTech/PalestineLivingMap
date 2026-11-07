// Follow a thread (docs/SPEC_MAP_V2.md section 6): pick a person, place or theme and the map
// follows it through time. Events outside the thread dim (map/index.ts), the timeline marks the
// thread's events, and as the year passes each one the camera goes to it and its card opens.
// A story is a fixed tour you step through; a thread is a filter and camera-follow you drive with
// the timeline. Modules: picker.ts (the list), chip.ts (the chip and live region).

import type { Thread } from '../data/threadTypes.ts';
import { eventStartYear } from '../data/spans.ts';
import { toAstronomical } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { getState, setState, subscribe } from '../state.ts';
import { selectEvent } from '../timeline/navigate.ts';
import type { Scale } from '../timeline/scale.ts';
import { createChip } from './chip.ts';
import { createPicker } from './picker.ts';

const astro = (event: HistoricalEvent): number => toAstronomical(eventStartYear(event));

export function initThreads(
  button: HTMLElement,
  host: HTMLElement,
  threads: readonly Thread[],
  events: readonly HistoricalEvent[],
  scale: Scale,
): void {
  if (threads.length === 0) return; // no threads: the button stays hidden
  button.hidden = false;

  const eventById = new Map(events.map((e) => [e.id, e]));
  const threadById = new Map(threads.map((t) => [t.id, t]));
  let followed = -1;

  /** The thread's events, earliest first. */
  const sortedEvents = (thread: Thread): HistoricalEvent[] =>
    thread.eventIds.flatMap((id) => eventById.get(id) ?? []).sort((a, b) => astro(a) - astro(b));
  const currentThread = (): Thread | undefined => {
    const id = getState().thread;
    return id === null ? undefined : threadById.get(id);
  };
  const where = (thread: Thread): string => `${Math.max(followed + 1, 0)} of ${thread.eventIds.length}`;

  const stop = (): void => setState({ thread: null });
  const jump = (direction: 1 | -1): void => {
    const thread = currentThread();
    if (!thread) return;
    const year = toAstronomical(Math.round(getState().currentYear));
    const list = sortedEvents(thread);
    const target = direction === 1 ? list.find((e) => astro(e) > year) : [...list].reverse().find((e) => astro(e) < year);
    if (target) selectEvent(target);
  };
  const chip = createChip(host, () => jump(-1), () => jump(1), stop);

  // Marks on the timeline track, one per thread event.
  const track = (): HTMLElement | null => document.querySelector<HTMLElement>('.track__inner');
  const drawMarks = (thread: Thread | undefined): void => {
    track()?.querySelectorAll('.thread-mark').forEach((m) => m.remove());
    if (!thread) return;
    for (const event of sortedEvents(thread)) {
      const mark = document.createElement('span');
      mark.className = 'thread-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.style.left = `${scale.yearToPosition(eventStartYear(event)) * 100}%`;
      track()?.append(mark);
    }
  };

  /** The latest thread event at or before the year (-1 before the first). */
  const followedAt = (thread: Thread, year: number): number => {
    const y = toAstronomical(Math.round(year));
    let found = -1;
    sortedEvents(thread).forEach((e, i) => {
      if (astro(e) <= y) found = i;
    });
    return found;
  };

  function apply(): void {
    const thread = currentThread();
    if (!thread) {
      if (getState().thread !== null) setState({ thread: null }); // an unknown id in a link
      setState({ threadEvents: null, threadPlaces: null });
      chip.hide();
      drawMarks(undefined);
      followed = -1;
      return;
    }
    followed = followedAt(thread, getState().currentYear);
    setState({ threadEvents: thread.eventIds, threadPlaces: thread.placeIds });
    chip.show(thread.title, where(thread));
    drawMarks(thread);
    chip.announce(`Following ${thread.title}: ${thread.eventIds.length} events. ${thread.intro}`);
  }

  createPicker(button, threads, (thread) => {
    // Starting a thread brings the timeline to its first event, and its card opens.
    setState({ thread: thread.id, story: null, dimOthers: false });
    const first = sortedEvents(thread)[0];
    if (first) selectEvent(first);
  });

  subscribe((state, previous) => {
    if (state.thread !== previous.thread) {
      const had = previous.thread !== null && state.thread === null;
      apply();
      if (had) chip.announce('Stopped following');
      return;
    }
    const thread = currentThread();
    if (!thread || state.currentYear === previous.currentYear) return;
    const index = followedAt(thread, state.currentYear);
    if (index === followed) return;
    followed = index;
    chip.setPosition(where(thread));
    const event = index < 0 ? undefined : sortedEvents(thread)[index];
    // Passing a thread event opens its card, and the map's selection handler eases the camera to it.
    if (event && state.story === null && state.selectedEventId !== event.id) setState({ selectedEventId: event.id, selectedPlaceId: null });
  });

  apply();
}
