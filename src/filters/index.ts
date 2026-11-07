// Category filters: the Filters button, its panel (popover on desktop, full-screen sheet on
// phones), the "filters active" badge, and the empty-state message on the map.
// Modules: panel.ts (DOM), counts.ts (pure counts).

import { CATEGORY_IDS } from '../data/categories.ts';
import type { CategoryId } from '../data/categories.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { el } from '../dom.ts';
import { ESCAPE_PRIORITY, registerEscape } from '../escape.ts';
import { trapFocus } from '../panel/sheet.ts';
import { getState, setState, subscribe } from '../state.ts';
import { countMatching, createCategoryCounter, filtersActive } from './counts.ts';
import { buildFilterPanel } from './panel.ts';

export const FULL_SCREEN_QUERY = '(max-width: 599px)';

export interface FiltersHandle {
  /** Slot inside the panel for the map-layer toggles. */
  layersSlot: HTMLElement;
}

export function initFilters(button: HTMLElement, events: readonly HistoricalEvent[]): FiltersHandle {
  const panel = buildFilterPanel();
  const countFor = createCategoryCounter(events);
  const allCategories = (): Set<CategoryId> => new Set(CATEGORY_IDS);

  const app = document.getElementById('app');
  const map = document.getElementById('map');
  if (!app || !map) throw new Error('App shell is missing from index.html');
  app.append(panel.element);

  // Button: label plus a badge with how many categories are shown while a filter is on.
  const badge = el('span', 'btn__badge');
  badge.hidden = true;
  badge.setAttribute('aria-hidden', 'true');
  button.append(badge);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', panel.element.id);

  // Empty state on the map.
  const empty = el('div', 'map-empty');
  empty.hidden = true;
  empty.setAttribute('role', 'status');
  const emptyText = el('p', '', 'No events match these filters.');
  const clear = el('button', 'btn', 'Clear filters');
  clear.type = 'button';
  empty.append(emptyText, clear);
  map.append(empty);

  const isFullScreen = (): boolean => window.matchMedia(FULL_SCREEN_QUERY).matches;
  const isOpen = (): boolean => !panel.element.hidden;

  function open(): void {
    panel.element.hidden = false;
    if (isFullScreen()) panel.element.setAttribute('aria-modal', 'true');
    else panel.element.removeAttribute('aria-modal');
    button.setAttribute('aria-expanded', 'true');
    panel.firstFocus.focus({ preventScroll: true });
  }

  function close(restoreFocus = true): void {
    if (!isOpen()) return;
    panel.element.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus({ preventScroll: true });
  }

  button.addEventListener('click', () => (isOpen() ? close() : open()));
  panel.done.addEventListener('click', () => close());
  registerEscape({ priority: ESCAPE_PRIORITY.filters, isOpen, close: () => close() });

  panel.element.addEventListener('keydown', (e) => {
    if (isFullScreen()) trapFocus(panel.element, e);
  });
  // Desktop popover: a click elsewhere closes it (the full-screen sheet has a Done button).
  document.addEventListener('pointerdown', (e) => {
    if (!isOpen() || isFullScreen()) return;
    const target = e.target;
    if (target instanceof Node && !panel.element.contains(target) && !button.contains(target)) close(false);
  });

  // Checkboxes and bulk controls drive activeCategories.
  const update = (): void => {
    const next = new Set<CategoryId>();
    for (const [id, row] of panel.rows) if (row.checkbox.checked) next.add(id);
    setState({ activeCategories: next });
  };
  for (const row of panel.rows.values()) row.checkbox.addEventListener('change', update);
  panel.selectAll.addEventListener('click', () => setState({ activeCategories: allCategories() }));
  panel.selectNone.addEventListener('click', () => setState({ activeCategories: new Set() }));
  clear.addEventListener('click', () => setState({ activeCategories: allCategories() }));

  function renderCategories(): void {
    const { activeCategories } = getState();
    panel.setChecked(activeCategories);
    const on = filtersActive(activeCategories);
    badge.hidden = !on;
    badge.textContent = `${activeCategories.size}/${CATEGORY_IDS.length}`;
    button.setAttribute(
      'aria-label',
      on ? `Filters, ${activeCategories.size} of ${CATEGORY_IDS.length} categories shown` : 'Filters',
    );
    button.classList.toggle('is-active', on);
    empty.hidden = true;
  }

  const renderCounts = (): void => panel.setCounts(countFor(getState().currentYear));

  renderCategories();
  renderCounts();
  subscribe((state, previous) => {
    if (state.activeCategories !== previous.activeCategories) renderCategories();
    if (state.currentYear !== previous.currentYear) renderCounts();
  });

  return { layersSlot: panel.layersSlot };
}
