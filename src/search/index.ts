// Search combobox in the top bar (ARIA 1.2 combobox with a listbox popup). On phones the
// field opens as a full-screen sheet from a search icon. Press "/" anywhere to focus it.
// Modules: engine.ts (index and ranking), normalize.ts (Arabic, accents).

import { CATEGORIES } from '../data/categories.ts';
import { formatYear } from '../data/format.ts';
import { nameValidInYear } from '../data/places.ts';
import type { Place, PlaceName } from '../data/placeTypes.ts';
import { openPlace } from '../labels/select.ts';
import { eventStartYear } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { categoryIcon } from '../categoryIcon.ts';
import { el } from '../dom.ts';
import { ESCAPE_PRIORITY, registerEscape } from '../escape.ts';
import { trapFocus } from '../panel/sheet.ts';
import { getState, setState } from '../state.ts';
import { goToYear, selectEvent } from '../timeline/navigate.ts';
import { buildIndex, search } from './engine.ts';
import { buildPlaceIndex, searchPlaceSet, searchPlaces } from './places.ts';
import type { PlaceHit } from './places.ts';

const MAX_SUGGESTIONS = 25;
const SHEET_QUERY = '(max-width: 599px)';

const nameInUse = (name: PlaceName): boolean => nameValidInYear(name, getState().currentYear);

const SEARCH_ICON =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
  '<circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/>' +
  '<path d="M15 15l5.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

type Result = { type: 'event'; event: HistoricalEvent } | ({ type: 'place' } & PlaceHit) | { type: 'set'; label: string; places: Place[] };

export function initSearch(host: HTMLElement, events: readonly HistoricalEvent[], places: readonly Place[] = []): void {
  const index = buildIndex(events);
  const placeIndex = buildPlaceIndex(places);

  const toggle = el('button', 'btn btn--icon search__toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Search places and events');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = SEARCH_ICON; // fixed markup, no event data

  const box = el('div', 'search__box');
  const field = el('div', 'search__field');
  const input = el('input', 'search__input');
  input.type = 'text';
  input.id = 'search-input';
  input.placeholder = 'Search places and events (press /)';
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-label', 'Search places and events');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'search-list');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.spellcheck = false;
  input.dir = 'auto'; // Arabic types right to left
  const cancel = el('button', 'btn search__cancel', 'Cancel');
  cancel.type = 'button';
  field.append(input, cancel);

  const list = el('ul', 'search__list');
  list.id = 'search-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Search suggestions');
  list.hidden = true;

  const status = el('div', 'sr-only');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  box.append(field, list, status);
  host.append(toggle, box);

  let results: Result[] = [];
  let active = -1;

  const isSheetLayout = (): boolean => window.matchMedia(SHEET_QUERY).matches;
  const sheetOpen = (): boolean => host.classList.contains('is-open');
  const listOpen = (): boolean => !list.hidden;

  function setActive(next: number): void {
    active = next;
    list.querySelectorAll('[role=option]').forEach((node, i) => {
      node.setAttribute('aria-selected', String(i === active));
      if (i === active) node.scrollIntoView({ block: 'nearest' });
    });
    if (active >= 0) input.setAttribute('aria-activedescendant', `search-option-${active}`);
    else input.removeAttribute('aria-activedescendant');
  }

  function closeList(): void {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  }

  function openSheet(): void {
    host.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closeSheet(): void {
    host.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    closeList();
    toggle.focus({ preventScroll: true });
  }

  function render(): void {
    const query = input.value;
    const skipSettlements = (place: Place): boolean => place.group === 'settlement' && !getState().showSettlements;
    const set = searchPlaceSet(placeIndex, places, query, skipSettlements);
    results = [
      ...(set.length >= 3 ? [{ type: 'set', label: query.trim(), places: set } as Result] : []),
      ...searchPlaces(placeIndex, query, 3, (place) => place.group === 'settlement' && !getState().showSettlements).map((hit): Result => ({ type: 'place', ...hit })),
      ...search(index, query, MAX_SUGGESTIONS).map((event): Result => ({ type: 'event', event })),
    ];
    list.replaceChildren(
      ...results.map((result, i) => {
        const option = el('li', 'search__option');
        option.id = `search-option-${i}`;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        const text = el('span', 'search__text');
        if (result.type === 'set') {
          text.append(el('span', 'search__title', `Show all ${result.places.length} matching places on the map`), el('span', 'search__meta', `Places - "${result.label}"`));
        } else if (result.type === 'place') {
          const { place, name } = result;
          const span = name.from === null ? 'dates not yet sourced' : `${formatYear(name.from, true)}${name.to === null ? ' on' : ` - ${formatYear(name.to, true)}`}`;
          const label = name.ar === null ? name.en : `${name.en} (${name.ar})`;
          text.append(el('span', 'search__title', label), el('span', 'search__meta', `Place - ${span}`));
        } else {
          const { event } = result;
          const category = CATEGORIES.find((c) => c.id === event.category);
          if (category) option.append(categoryIcon(category));
          text.append(
            el('span', 'search__title', event.title),
            el('span', 'search__meta', `${formatYear(eventStartYear(event), true)} - ${category?.label ?? event.category}`),
          );
        }
        option.append(text);
        // mousedown (not click) so the input keeps focus and blur doesn't close the list first
        option.addEventListener('mousedown', (e) => {
          e.preventDefault();
          choose(result);
        });
        return option;
      }),
    );
    const open = results.length > 0;
    list.hidden = !open;
    input.setAttribute('aria-expanded', String(open));
    setActive(-1);
    status.textContent =
      query.trim() === '' ? '' : open ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'No results';
  }

  function choose(result: Result): void {
    setState({ story: null, dimOthers: false });
    if (result.type === 'set') {
      setState({ placeFilter: { label: result.label, ids: result.places.map((p) => p.id) }, selectedEventId: null, selectedPlaceId: null });
      input.value = result.label;
    } else if (result.type === 'place') {
      // Bring the timeline to the years the matched name was in use, so its label is on the map.
      const { place, name } = result;
      openPlace(place.id);
      if (name.from !== null && !nameInUse(name)) goToYear(name.from);
      input.value = name.en;
    } else {
      const { event } = result;
      // A result in a hidden category would select nothing visible, so switch that category on.
      const { activeCategories } = getState();
      if (!activeCategories.has(event.category)) {
        setState({ activeCategories: new Set([...activeCategories, event.category]) });
      }
      selectEvent(event);
      input.value = event.title;
    }
    closeList();
    if (sheetOpen()) {
      host.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', () => {
    if (input.value.trim() !== '' && results.length > 0) list.hidden = false;
    input.setAttribute('aria-expanded', String(!list.hidden));
  });
  input.addEventListener('blur', () => {
    // Let a click on a suggestion land first.
    window.setTimeout(() => {
      if (!sheetOpen() && !box.contains(document.activeElement)) closeList();
    }, 100);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!listOpen()) render();
      if (results.length > 0) setActive((active + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) setActive(active <= 0 ? results.length - 1 : active - 1);
    } else if (e.key === 'Enter') {
      const pick = results[active >= 0 ? active : 0];
      if (pick && listOpen()) {
        e.preventDefault();
        choose(pick);
      }
    }
  });

  toggle.addEventListener('click', () => (sheetOpen() ? closeSheet() : openSheet()));
  cancel.addEventListener('click', closeSheet);
  box.addEventListener('keydown', (e) => {
    if (isSheetLayout() && sheetOpen()) trapFocus(box, e);
  });

  // Escape closes the suggestions first, then the phone sheet.
  registerEscape({
    priority: ESCAPE_PRIORITY.search,
    isOpen: () => listOpen() || sheetOpen(),
    close: () => (listOpen() ? closeList() : closeSheet()),
  });

  // "/" focuses search from anywhere except while typing in a field.
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    if (isEditable(e.target)) return;
    e.preventDefault();
    if (isSheetLayout()) openSheet();
    else input.focus();
    input.select();
  });
}
