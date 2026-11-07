// The "Control of the land" section of the filter panel: one checkbox for the zones in src/map/control.ts.

import { el } from '../dom.ts';
import { getState, setState, subscribe } from '../state.ts';

export function initControlToggle(slot: HTMLElement): void {
  const label = el('label', 'filters__row');
  const checkbox = el('input');
  checkbox.type = 'checkbox';
  checkbox.checked = getState().controlZones;
  checkbox.addEventListener('change', () => setState({ controlZones: checkbox.checked }));
  subscribe((state, previous) => {
    if (state.controlZones !== previous.controlZones) checkbox.checked = state.controlZones;
  });
  label.append(checkbox, el('span', 'filters__name', 'Occupation of Palestine since 1948'));
  const note = el(
    'p',
    'filters__note',
    'Green is Palestine, the whole land before 1948 and the parts outside Israeli control after; blue is Israeli control, growing from the 1949 armistice lines, the occupied territories from 1967 and Area C from 1995. Approximate and schematic: not exact boundaries. Move the timeline to watch it change.',
  );
  slot.append(el('h3', 'filters__legend', 'Occupation of Palestine since 1948'), label, note);
}
