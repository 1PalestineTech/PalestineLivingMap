// The "Settlements" section of the filter panel: one checkbox that shows or hides Israeli localities and
// districts (places with group "settlement"). They are marked apart on the map (a different drawing and an
// accent colour) and listed under their own heading, as the owner asked.

import { el } from '../dom.ts';
import { getState, setState, subscribe } from '../state.ts';

export function initSettlementsToggle(slot: HTMLElement): void {
  const heading = el('h3', 'filters__legend', 'Settlements');
  const label = el('label', 'filters__row');
  const checkbox = el('input');
  checkbox.type = 'checkbox';
  checkbox.checked = getState().showSettlements;
  label.append(checkbox, el('span', 'filters__name', 'Israeli settlements, localities and districts'));
  const note = el(
    'p',
    'filters__note',
    'Shown apart from the other places, in a different colour and drawing. Settlements in the occupied territories are considered illegal under international law by most states and the UN; Israel disputes this.',
  );
  checkbox.addEventListener('change', () => setState({ showSettlements: checkbox.checked }));
  subscribe((state, previous) => {
    if (state.showSettlements !== previous.showSettlements) checkbox.checked = state.showSettlements;
  });
  slot.append(heading, label, note);
}
