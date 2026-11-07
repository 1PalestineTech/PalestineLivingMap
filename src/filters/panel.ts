// DOM for the filter panel: a header, the category checkboxes (with marker icons and
// per-year counts), and an empty slot where map-layer toggles are added (src/map/overlayPanel.ts).
// Behavior lives in index.ts.

import { CATEGORIES } from '../data/categories.ts';
import type { CategoryId } from '../data/categories.ts';
import { categoryIcon } from '../categoryIcon.ts';
import { el } from '../dom.ts';
import type { CategoryCounts } from './counts.ts';

export interface FilterRow {
  checkbox: HTMLInputElement;
  count: HTMLElement;
  countText: HTMLElement;
}

export interface FilterPanel {
  element: HTMLElement;
  firstFocus: HTMLElement;
  done: HTMLButtonElement;
  selectAll: HTMLButtonElement;
  selectNone: HTMLButtonElement;
  rows: Map<CategoryId, FilterRow>;
  /** Where the map-layer toggles go. */
  layersSlot: HTMLElement;
  setCounts(counts: CategoryCounts): void;
  setChecked(active: ReadonlySet<CategoryId>): void;
}

export function buildFilterPanel(): FilterPanel {
  const element = el('div', 'filters');
  element.id = 'filters-panel';
  element.hidden = true;
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-labelledby', 'filters-title');

  const header = el('div', 'filters__header');
  const title = el('h2', 'filters__title', 'Filters');
  title.id = 'filters-title';
  const done = el('button', 'btn', 'Done');
  done.type = 'button';
  header.append(title, done);

  const group = el('fieldset', 'filters__group');
  group.append(el('legend', 'filters__legend', 'Categories'));

  const bulk = el('div', 'filters__bulk');
  const selectAll = el('button', 'link-button', 'Select all');
  selectAll.type = 'button';
  const selectNone = el('button', 'link-button', 'Select none');
  selectNone.type = 'button';
  bulk.append(selectAll, selectNone);

  const list = el('ul', 'filters__list');
  const rows = new Map<CategoryId, FilterRow>();
  for (const category of CATEGORIES) {
    const item = el('li');
    const label = el('label', 'filters__row');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.value = category.id;
    const name = el('span', 'filters__name', category.label);
    const count = el('span', 'filters__count');
    const countVisible = el('span', '', '0');
    countVisible.setAttribute('aria-hidden', 'true');
    const countText = el('span', 'sr-only', ', no events this year');
    count.append(countVisible, countText);
    label.append(checkbox, categoryIcon(category), name, count);
    item.append(label);
    list.append(item);
    rows.set(category.id, { checkbox, count: countVisible, countText });
  }
  group.append(bulk, list);

  const note = el('p', 'filters__note', 'Tick a category to show its events on the map; none are shown until you do. Counts show events active in the year on the timeline.');
  const layersSlot = el('div', 'filters__layers');
  const body = el('div', 'filters__body');
  body.append(group, note, layersSlot);
  element.append(header, body);

  return {
    element,
    firstFocus: selectAll,
    done,
    selectAll,
    selectNone,
    rows,
    layersSlot,
    setCounts(counts) {
      for (const [id, row] of rows) {
        const n = counts[id];
        row.count.textContent = String(n);
        row.countText.textContent = n === 0 ? ', no events this year' : `, ${n} ${n === 1 ? 'event' : 'events'} this year`;
        row.checkbox.closest('label')?.classList.toggle('is-empty', n === 0);
      }
    },
    setChecked(active) {
      for (const [id, row] of rows) row.checkbox.checked = active.has(id);
    },
  };
}
