// The "Map layers" section of the filter panel: one checkbox per layer from the manifest.
// A layer that is on but outside its valid years says so instead of silently showing nothing.

import { formatYear } from '../data/format.ts';
import type { MapLayer } from '../data/layerTypes.ts';
import { layerActiveInYear } from '../data/loadLayers.ts';
import { el } from '../dom.ts';
import { getState, setState, subscribe } from '../state.ts';

export function initLayerToggles(slot: HTMLElement, layers: readonly MapLayer[]): void {
  if (layers.length === 0) return;

  const heading = el('h3', 'filters__legend', 'Map layers');
  const list = el('ul', 'filters__list');
  const rows = new Map<string, { checkbox: HTMLInputElement; status: HTMLElement }>();

  for (const layer of layers) {
    const item = el('li', 'filters__layer');
    const label = el('label', 'filters__row filters__row--layer');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.value = layer.id;
    const name = el('span', 'filters__name', layer.name);
    label.append(checkbox, name);

    const years = layer.validTo === null ? 'present' : formatYear(layer.validTo, true);
    const detail = el('p', 'filters__note', `${layer.description} Shown ${formatYear(layer.validFrom, true)} to ${years}.`);
    const status = el('p', 'filters__note filters__status');
    status.setAttribute('role', 'status');

    checkbox.addEventListener('change', () => {
      const next = new Set(getState().activeOverlays);
      if (checkbox.checked) next.add(layer.id);
      else next.delete(layer.id);
      setState({ activeOverlays: next });
    });
    item.append(label, detail, status);
    list.append(item);
    rows.set(layer.id, { checkbox, status });
  }
  slot.append(heading, list);

  function render(): void {
    const { activeOverlays, currentYear } = getState();
    for (const layer of layers) {
      const row = rows.get(layer.id);
      if (!row) continue;
      const on = activeOverlays.has(layer.id);
      row.checkbox.checked = on;
      row.status.textContent = on && !layerActiveInYear(layer, currentYear) ? 'Not shown in the current year.' : '';
    }
  }

  render();
  subscribe((state, previous) => {
    if (state.activeOverlays !== previous.activeOverlays || state.currentYear !== previous.currentYear) render();
  });
}
