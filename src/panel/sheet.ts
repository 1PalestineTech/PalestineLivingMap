// Mobile bottom sheet behavior: drag the grab handle between "peek" (about 35% of the screen)
// and "full" (about 90%), swipe down to close, and keep Tab inside while it is open.

export const MOBILE_QUERY = '(max-width: 1023px)';

const PEEK_FRACTION = 0.35;
const FULL_FRACTION = 0.9;
const DRAG_THRESHOLD_PX = 4;
const CLOSE_BELOW_PEEK = 0.65;

export const isMobileLayout = (): boolean => window.matchMedia(MOBILE_QUERY).matches;

export type SheetState = 'peek' | 'full';

function heights(): { peek: number; full: number } {
  const topbar = document.querySelector('.topbar')?.getBoundingClientRect().height ?? 0;
  const timeline = document.getElementById('timeline')?.getBoundingClientRect().height ?? 0;
  const room = window.innerHeight - topbar - timeline;
  return { peek: window.innerHeight * PEEK_FRACTION, full: Math.min(window.innerHeight * FULL_FRACTION, room) };
}

export function setSheetState(panel: HTMLElement, state: SheetState): void {
  panel.dataset['sheet'] = state;
  panel.style.height = '';
  panel.querySelector('.panel__grab')?.setAttribute('aria-expanded', String(state === 'full'));
}

export function attachSheet(panel: HTMLElement, grab: HTMLElement, close: () => void): void {
  setSheetState(panel, 'peek');

  let startY = 0;
  let startHeight = 0;
  let dragging = false;
  let pressed = false;
  let suppressClick = false; // a drag ends with a click event that must not toggle the sheet

  grab.addEventListener('pointerdown', (e) => {
    if (!isMobileLayout()) return;
    pressed = true;
    dragging = false;
    suppressClick = false;
    startY = e.clientY;
    startHeight = panel.getBoundingClientRect().height;
    grab.setPointerCapture(e.pointerId);
  });

  grab.addEventListener('pointermove', (e) => {
    if (!pressed) return;
    const dy = startY - e.clientY;
    if (!dragging && Math.abs(dy) < DRAG_THRESHOLD_PX) return;
    dragging = true;
    panel.classList.add('is-dragging');
    const { full } = heights();
    panel.style.height = `${Math.max(80, Math.min(full, startHeight + dy))}px`;
  });

  const release = (e: PointerEvent): void => {
    if (!pressed) return;
    pressed = false;
    if (grab.hasPointerCapture(e.pointerId)) grab.releasePointerCapture(e.pointerId);
    panel.classList.remove('is-dragging');
    if (!dragging) return; // a plain tap is handled by the click listener below
    dragging = false;
    suppressClick = true;
    const { peek, full } = heights();
    const current = panel.getBoundingClientRect().height;
    if (current < peek * CLOSE_BELOW_PEEK) {
      panel.style.height = '';
      close();
      return;
    }
    setSheetState(panel, Math.abs(current - full) < Math.abs(current - peek) ? 'full' : 'peek');
  };
  grab.addEventListener('pointerup', release);
  grab.addEventListener('pointercancel', release);

  // Tap or keyboard activation toggles between the two heights.
  grab.addEventListener('click', () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    setSheetState(panel, panel.dataset['sheet'] === 'full' ? 'peek' : 'full');
  });
}

/** Keeps Tab inside the panel (call from a keydown listener while the sheet is open on mobile). */
export function trapFocus(panel: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return;
  const focusable = [
    ...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ].filter((node) => node.offsetParent !== null);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !panel.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}
