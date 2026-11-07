// The compact story overlay: step counter, caption, and Back / Next / Exit.
// Pure view: index.ts decides what to show and what the buttons do.

import { el } from '../dom.ts';

export interface OverlayView {
  storyTitle: string;
  placeholder: boolean;
  /** 0 is the intro; 1..total are the events. */
  step: number;
  total: number;
  /** Heading for the current step (the story title on the intro, the event title after). */
  heading: string;
  text: string;
}

export interface OverlayActions {
  back(): void;
  next(): void;
  exit(): void;
  openCard(): void;
}

export interface Overlay {
  element: HTMLElement;
  render(view: OverlayView): void;
  /** Moves focus to the Next button (used when a story starts). */
  focusNext(): void;
}

export function createOverlay(actions: OverlayActions): Overlay {
  const element = el('section', 'story');
  element.hidden = true;

  const meta = el('p', 'story__meta');
  const counter = el('span', 'story__counter');
  const tag = el('span', 'tag', 'Sample story');
  meta.append(counter, tag);

  const heading = el('h2', 'story__heading');
  const caption = el('p', 'story__caption');
  caption.setAttribute('aria-live', 'polite');

  const button = (label: string, className: string, onClick: () => void): HTMLButtonElement => {
    const b = el('button', className, label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  };

  const back = button('Back', 'btn', actions.back);
  const next = button('Next', 'btn btn--primary', actions.next);
  const openCard = button('Full card', 'link-button', actions.openCard);
  const exit = button('Exit', 'btn', actions.exit);
  const row = el('div', 'story__actions');
  row.append(back, next, openCard, exit);

  element.append(meta, heading, caption, row);

  // Arrow keys step while focus is inside the overlay (they pan the map or move the
  // timeline handle everywhere else).
  element.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      actions.next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      actions.back();
    }
  });

  return {
    element,
    render(view) {
      element.setAttribute('aria-label', `Guided story: ${view.storyTitle}`);
      counter.textContent = view.step === 0 ? 'Introduction' : `Step ${view.step} of ${view.total}`;
      tag.hidden = !view.placeholder;
      heading.textContent = view.heading;
      caption.textContent = view.text;
      back.disabled = view.step === 0;
      next.textContent = view.step === 0 ? 'Start' : view.step === view.total ? 'Finish' : 'Next';
      openCard.hidden = view.step === 0;
    },
    focusNext() {
      next.focus({ preventScroll: true });
    },
  };
}
