// The "Map picture" section of the filter panel: one checkbox for the optional illustrated base (src/map/illustrated.ts).

import { el } from '../dom.ts';
import { saveIllustrated } from '../map/illustrated.ts';
import { getState, setState, subscribe } from '../state.ts';

export function initIllustratedToggle(slot: HTMLElement): void {
  const heading = el('h3', 'filters__legend', 'Map picture');
  const label = el('label', 'filters__row');
  const checkbox = el('input');
  checkbox.type = 'checkbox';
  checkbox.checked = getState().illustratedBase;
  label.append(checkbox, el('span', 'filters__name', 'Illustrated base'));
  const note = el(
    'p',
    'filters__note',
    'A hand-painted picture of the land under the labels, shaped from elevation data. It is an illustration: the fields, groves and dry valleys in it are decoration, not land-use data or a survey. It loads only when switched on.',
  );
  checkbox.addEventListener('change', () => {
    saveIllustrated(checkbox.checked);
    setState({ illustratedBase: checkbox.checked });
  });
  subscribe((state, previous) => {
    if (state.illustratedBase !== previous.illustratedBase) checkbox.checked = state.illustratedBase;
  });
  slot.append(heading, label, note);
}
