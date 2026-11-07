// The "Follow" list: a small popover under the top-bar button, threads grouped by person, place
// and theme. It closes with Escape or a click outside, and returns focus to the button.

import type { Thread, ThreadKind } from '../data/threadTypes.ts';
import { el } from '../dom.ts';
import { ESCAPE_PRIORITY, registerEscape } from '../escape.ts';

const GROUPS: readonly { kind: ThreadKind; label: string }[] = [
  { kind: 'person', label: 'People' },
  { kind: 'place', label: 'Places' },
  { kind: 'theme', label: 'Themes' },
];

export function createPicker(button: HTMLElement, threads: readonly Thread[], onPick: (thread: Thread) => void): void {
  const panel = el('div', 'follow-picker');
  panel.id = 'follow-picker';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Follow a thread through time');
  panel.append(el('p', 'follow-picker__hint', 'Pick a subject. The map follows it through time and dims everything else.'));
  for (const group of GROUPS) {
    const items = threads.filter((t) => t.kind === group.kind);
    if (items.length === 0) continue;
    const heading = el('h2', 'follow-picker__heading', group.label);
    const list = el('ul', 'follow-picker__list');
    for (const thread of items) {
      const choose = el('button', 'follow-picker__item');
      choose.type = 'button';
      const title = el('span', 'follow-picker__title', thread.title);
      choose.append(title);
      if (thread.titleAr) {
        const ar = el('span', 'follow-picker__ar', thread.titleAr);
        ar.lang = 'ar';
        ar.dir = 'rtl';
        choose.append(ar);
      }
      choose.append(el('span', 'follow-picker__meta', `${thread.eventIds.length} events`));
      choose.addEventListener('click', () => {
        close(false);
        onPick(thread);
      });
      const item = el('li');
      item.append(choose);
      list.append(item);
    }
    panel.append(heading, list);
  }
  button.parentElement?.append(panel);
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', panel.id);
  button.setAttribute('aria-expanded', 'false');

  function close(restoreFocus: boolean): void {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus({ preventScroll: true });
  }
  function open(): void {
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    panel.querySelector<HTMLElement>('button')?.focus();
  }

  button.addEventListener('click', () => (panel.hidden ? open() : close(true)));
  document.addEventListener('pointerdown', (e) => {
    if (!panel.hidden && e.target instanceof Node && !panel.contains(e.target) && !button.contains(e.target)) close(false);
  });
  registerEscape({ priority: ESCAPE_PRIORITY.filters, isOpen: () => !panel.hidden, close: () => close(true) });
}
