// The map's text alternative (docs/SPEC.md F11): a list of the events active in the current
// year, reached through the "Skip to event list" link. It is visually hidden until it holds
// keyboard focus, and it follows the same year and category rules as the map markers.

import { CATEGORIES } from '../data/categories.ts';
import { formatEventDate, formatYear } from '../data/format.ts';
import { eventSpan, isActiveInYear } from '../data/spans.ts';
import type { EventSpan } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { el } from '../dom.ts';
import { getState, subscribe } from '../state.ts';
import { selectEvent } from '../timeline/navigate.ts';

interface Entry {
  event: HistoricalEvent;
  span: EventSpan;
}

export function initEventList(container: HTMLElement, events: readonly HistoricalEvent[]): void {
  const entries: Entry[] = events.map((event) => ({ event, span: eventSpan(event) }));
  const categoryName = new Map(CATEGORIES.map((category) => [category.id, category.label]));
  let renderedKey = '';

  function render(): void {
    const { currentYear, activeCategories, threadEvents } = getState();
    const shown = entries
      .filter(({ event, span }) => activeCategories.has(event.category) && isActiveInYear(span, currentYear))
      .filter(({ event }) => threadEvents === null || threadEvents.includes(event.id))
      .map(({ event }) => event);

    const key = `${currentYear}|${threadEvents === null ? '' : 'thread'}|${shown.map((event) => event.id).join(',')}`;
    if (key === renderedKey) return;
    renderedKey = key;

    const heading = el('h2', 'event-list__heading', `Events in ${formatYear(currentYear, true)} (${shown.length})${threadEvents === null ? '' : ', in the followed thread'}`);
    const hint = el('p', 'event-list__hint', 'Use the timeline slider to change the year. Choose an event to open its card.');
    container.replaceChildren(heading, hint);

    if (shown.length === 0) {
      container.append(el('p', '', 'No events are shown for this year with the current filters.'));
      return;
    }
    const list = el('ul', 'event-list__items');
    for (const event of shown) {
      const item = el('li');
      const button = el('button', 'link-button', event.title);
      button.type = 'button';
      button.addEventListener('click', () => selectEvent(event));
      const meta = [formatEventDate(event), event.location.name, categoryName.get(event.category)]
        .filter((part): part is string => typeof part === 'string' && part !== '')
        .join(', ');
      item.append(button, el('span', 'event-list__meta', ` (${meta})`));
      list.append(item);
    }
    container.append(list);
  }

  // Focus the list directly: following the link would overwrite the #year=... URL state.
  document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    container.focus();
  });

  render();
  subscribe((state, previous) => {
    if (state.currentYear !== previous.currentYear || state.activeCategories !== previous.activeCategories || state.threadEvents !== previous.threadEvents) render();
  });
}
