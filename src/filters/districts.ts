// The "District areas" section of the filter panel: two checkboxes for the schematic blocks and lines (src/map/districts.ts).

import { el } from '../dom.ts';
import { getState, setState, subscribe } from '../state.ts';

type Key = 'districtBlocks' | 'districtLines';

function row(key: Key, label: string): HTMLLabelElement {
  const wrap = el('label', 'filters__row');
  const checkbox = el('input');
  checkbox.type = 'checkbox';
  checkbox.checked = getState()[key];
  checkbox.addEventListener('change', () => setState({ [key]: checkbox.checked }));
  subscribe((state, previous) => {
    if (state[key] !== previous[key]) checkbox.checked = state[key];
  });
  wrap.append(checkbox, el('span', 'filters__name', label));
  return wrap;
}

export function initDistrictToggles(slot: HTMLElement): void {
  const note = el(
    'p',
    'filters__note',
    'Schematic only: each point is shaded by its nearest main city (Acre, Baysan, Beersheba, Bethlehem, Gaza, Haifa, Hebron, Jaffa, Jericho, Jerusalem, Jenin, Nablus, Nazareth, Ramallah, al-Ramla, Safad, Tiberias, Tulkarm). These are not boundaries and not the official districts of any period.',
  );
  slot.append(el('h3', 'filters__legend', 'District areas'), row('districtBlocks', 'Colour blocks'), row('districtLines', 'Dashed lines'), note);
}
