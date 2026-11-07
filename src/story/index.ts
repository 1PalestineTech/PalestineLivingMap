// Story mode: a guided tour through a list of events. Each step glides the timeline to the
// event's year, flies the camera there, highlights its marker and dims the others.
// The panel stays closed while a story runs (the overlay has "Open full card").

import { eventStartYear } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import type { Story } from '../data/storyTypes.ts';
import { ESCAPE_PRIORITY, registerEscape } from '../escape.ts';
import { HOME_BOUNDS } from '../data/region.ts';
import { flyToPoint, fitToBounds, zoomForPrecision } from '../map/camera.ts';
import { getState, setState, subscribe } from '../state.ts';
import { goToYear } from '../timeline/navigate.ts';
import { readStory } from '../urlHash.ts';
import { createOverlay } from './overlay.ts';

export function initStory(
  button: HTMLElement,
  host: HTMLElement,
  stories: readonly Story[],
  events: readonly HistoricalEvent[],
): void {
  if (stories.length === 0) return; // no stories: the button stays hidden
  button.hidden = false;

  const eventById = new Map(events.map((e) => [e.id, e]));
  const storyById = new Map(stories.map((s) => [s.id, s]));

  /** Where the story was when the reader opened a full card, so closing the card returns there. */
  let resume: { id: string; step: number; eventId: string | null } | null = null;

  function current(): { story: Story; step: number } | null {
    const progress = getState().story;
    const story = progress ? storyById.get(progress.id) : undefined;
    return progress && story ? { story, step: progress.step } : null;
  }

  function go(story: Story, step: number): void {
    const total = story.steps.length;
    const n = Math.min(total, Math.max(0, step));
    if (n === 0) {
      setState({ story: { id: story.id, step: 0 }, selectedEventId: null, dimOthers: false, isPlaying: false });
      fitToBounds(HOME_BOUNDS);
      return;
    }
    const item = story.steps[n - 1];
    const event = item ? eventById.get(item.eventId) : undefined;
    if (!item || !event) return;

    setState({ story: { id: story.id, step: n }, selectedEventId: event.id, dimOthers: true, isPlaying: false });
    goToYear(eventStartYear(event));
    // The overlay covers the bottom of the map, so aim above it.
    const inset = overlay.element.hidden ? 0 : overlay.element.offsetHeight + 24;
    flyToPoint(event.location.lng, event.location.lat, item.cameraZoom ?? zoomForPrecision(event.location.precision), inset);
  }

  function exit(): void {    setState({ story: null, dimOthers: false, selectedEventId: null });
    button.focus({ preventScroll: true });
  }

  const overlay = createOverlay({
    back: () => {
      const c = current();
      if (c) go(c.story, c.step - 1);
    },
    next: () => {
      const c = current();
      if (!c) return;
      if (c.step >= c.story.steps.length) exit();
      else go(c.story, c.step + 1);
    },
    exit,
    // End the story but keep this event selected, so its card opens.
    openCard: () => {
      const c = current();
      if (c) resume = { id: c.story.id, step: c.step, eventId: getState().selectedEventId };
      setState({ story: null, dimOthers: false });
    },
  });
  host.replaceChildren(overlay.element);

  function render(): void {
    const c = current();
    if (!c) {
      overlay.element.hidden = true;
      return;
    }
    const { story, step } = c;
    const item = step === 0 ? undefined : story.steps[step - 1];
    const event = item ? eventById.get(item.eventId) : undefined;
    overlay.render({
      storyTitle: story.title,
      placeholder: story.placeholder === true,
      step,
      total: story.steps.length,
      heading: event ? event.title : story.title,
      text: item ? item.caption : story.intro,
    });
    overlay.element.hidden = false;
  }

  button.addEventListener('click', () => {
    if (current()) {
      exit();
      return;
    }
    const first = stories[0];
    if (!first) return;
    go(first, 0);
    overlay.focusNext();
  });

  registerEscape({ priority: ESCAPE_PRIORITY.story, isOpen: () => current() !== null, close: exit });
  // A story that asks for the Israeli settlements switches them on while it runs; the reader's own choice returns after.
  let restoreSettlements: boolean | null = null;
  let restoreControl: boolean | null = null;
  let restoreLakes: boolean | null = null;
  subscribe((state, previous) => {
    const running = state.story ? storyById.get(state.story.id) : undefined;
    const wants = running?.showSettlements === true;
    if (wants && restoreSettlements === null) {
      restoreSettlements = state.showSettlements;
      if (!state.showSettlements) setState({ showSettlements: true });
    } else if (!wants && restoreSettlements !== null) {
      const back = restoreSettlements;
      restoreSettlements = null;
      if (getState().showSettlements !== back) setState({ showSettlements: back });
    }
    const wantsLakes = running?.showLakes === true;
    if (wantsLakes && restoreLakes === null) {
      restoreLakes = state.lakes1946;
      if (!state.lakes1946) setState({ lakes1946: true });
    } else if (!wantsLakes && restoreLakes !== null) {
      const back = restoreLakes;
      restoreLakes = null;
      if (getState().lakes1946 !== back) setState({ lakes1946: back });
    }
    const wantsControl = running?.showControl === true;
    if (wantsControl && restoreControl === null) {
      restoreControl = state.controlZones;
      if (!state.controlZones) setState({ controlZones: true });
    } else if (!wantsControl && restoreControl !== null) {
      const back = restoreControl;
      restoreControl = null;
      if (getState().controlZones !== back) setState({ controlZones: back });
    }
    if (resume !== null && state.story === null) {
      // The card of the story's own event was closed: carry on from the same step. Opening any other event drops the bookmark.
      if (state.selectedEventId === null && previous.selectedEventId === resume.eventId) {
        const back = storyById.get(resume.id);
        const step = resume.step;
        resume = null;
        if (back) go(back, step);
      } else if (state.selectedEventId !== null && state.selectedEventId !== resume.eventId) {
        resume = null;
      }
    }
    if (state.story !== previous.story) {
      render();
      button.setAttribute('aria-pressed', String(state.story !== null));
    }
  });

  // Restore from #story=id&step=n (the map and timeline are ready by now).
  const fromHash = readStory(window.location.hash);
  const restored = fromHash ? storyById.get(fromHash.id) : undefined;
  if (fromHash && restored) go(restored, fromHash.step);
  else if (!/[#&](event|place|thread|story)=/.test(window.location.hash) && document.documentElement.dataset['embed'] === undefined) {
    // A plain visit opens the first story (the short tour), as if its button had been clicked. A link to an event,
    // place, thread or story is left alone.
    const first = stories[0];
    if (first) go(first, 0);
  }
}
