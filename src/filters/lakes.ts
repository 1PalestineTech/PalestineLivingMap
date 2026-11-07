// The "Geography over time" checkbox of the filter panel (src/map/lakes.ts).

import { el } from '../dom.ts';
import { getState, setState, subscribe } from '../state.ts';

export function initLakesToggle(slot: HTMLElement): void {
  const label = el('label', 'filters__row');
  const checkbox = el('input');
  checkbox.type = 'checkbox';
  checkbox.checked = getState().lakes1946;
  checkbox.addEventListener('change', () => setState({ lakes1946: checkbox.checked }));
  subscribe((state, previous) => {
    if (state.lakes1946 !== previous.lakes1946) checkbox.checked = state.lakes1946;
  });
  label.append(checkbox, el('span', 'filters__name', 'Lake Hula and the Dead Sea as printed in 1946'));
  const note = el(
    'p',
    'filters__note',
    "Shows Lake Hula (drained 1951 to 1958) and the Dead Sea as the 1946 Survey of Palestine sheet draws them: as water to 1950, then as a dashed outline of the old shore against today's lakes. Traced from the sheet; accurate to about 150 m. Move the timeline to compare.",
  );
  slot.append(el('h3', 'filters__legend', 'Geography over time'), label, note);
}
