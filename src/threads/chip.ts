// The "Following: Dahir al-Umar" chip over the map, with Previous, Next and a close button, and a
// live region that announces thread mode to screen readers.

import { el } from '../dom.ts';

export interface Chip {
  show(title: string, position: string): void;
  setPosition(position: string): void;
  hide(): void;
  announce(text: string): void;
}

export function createChip(host: HTMLElement, onPrevious: () => void, onNext: () => void, onStop: () => void): Chip {
  const chip = el('div', 'thread-chip');
  chip.hidden = true;
  chip.setAttribute('role', 'group');
  chip.setAttribute('aria-label', 'Thread being followed');
  const label = el('span', 'thread-chip__label');
  const position = el('span', 'thread-chip__position');
  const button = (text: string, aria: string, onClick: () => void): HTMLButtonElement => {
    const b = el('button', 'btn', text);
    b.type = 'button';
    b.setAttribute('aria-label', aria);
    b.addEventListener('click', onClick);
    return b;
  };
  chip.append(label, position, button('Previous', 'Previous event in this thread', onPrevious), button('Next', 'Next event in this thread', onNext), button('×', 'Stop following', onStop));

  const live = el('div', 'sr-only');
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  host.append(chip, live);

  return {
    show(title, where) {
      label.textContent = `Following: ${title}`;
      position.textContent = where;
      chip.hidden = false;
    },
    setPosition(where) {
      position.textContent = where;
    },
    hide() {
      chip.hidden = true;
    },
    announce(text) {
      live.textContent = text;
    },
  };
}
