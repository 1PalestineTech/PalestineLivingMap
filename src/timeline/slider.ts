// The scrubber: a track with a draggable handle that is a proper role="slider".
// Pointer (mouse and touch) and keyboard input both report a year through onInput; pointer
// updates are throttled to one per animation frame so the map stays smooth.

import type { Scale } from './scale.ts';

export interface SliderOptions {
  scale: Scale;
  /** The user asked for a specific year. */
  onInput(year: number): void;
  /** The user took control (pointer down or key press), so playback should pause. */
  onUserControl(): void;
}

export interface Slider {
  /** Pointer target; contains the rail, ticks and handle. */
  element: HTMLElement;
  /** Positioned container for ticks (same width as the rail). */
  inner: HTMLElement;
  handle: HTMLElement;
  setYear(year: number, valueText: string): void;
}

export function createSlider({ scale, onInput, onUserControl }: SliderOptions): Slider {
  const element = document.createElement('div');
  element.className = 'track';

  const inner = document.createElement('div');
  inner.className = 'track__inner';

  const rail = document.createElement('div');
  rail.className = 'track__rail';

  const handle = document.createElement('div');
  handle.className = 'handle';
  handle.tabIndex = 0;
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Year');
  handle.setAttribute('aria-orientation', 'horizontal');
  handle.setAttribute('aria-valuemin', String(scale.minYear));
  handle.setAttribute('aria-valuemax', String(scale.maxYear));
  const knob = document.createElement('span');
  knob.className = 'handle__knob';
  handle.append(knob);

  inner.append(rail, handle);
  element.append(inner);

  // Pointer: one update per frame, using the latest pointer position.
  let dragging = false;
  let pendingX: number | null = null;
  let frame = 0;

  const yearAt = (clientX: number): number => {
    const rect = inner.getBoundingClientRect();
    return scale.positionToYear((clientX - rect.left) / rect.width);
  };

  const flush = (): void => {
    frame = 0;
    if (pendingX === null) return;
    const x = pendingX;
    pendingX = null;
    onInput(yearAt(x));
  };

  element.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    element.setPointerCapture(e.pointerId);
    element.classList.add('is-dragging');
    handle.focus({ preventScroll: true });
    onUserControl();
    onInput(yearAt(e.clientX));
    e.preventDefault();
  });
  element.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    pendingX = e.clientX;
    if (frame === 0) frame = requestAnimationFrame(flush);
  });
  const endDrag = (e: PointerEvent): void => {
    if (!dragging) return;
    dragging = false;
    element.classList.remove('is-dragging');
    if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      flush();
    }
  };
  element.addEventListener('pointerup', endDrag);
  element.addEventListener('pointercancel', endDrag);

  // Keyboard: arrows step one local unit, Shift (or PageUp/PageDown) takes ten, Home/End jump.
  handle.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const current = Number(handle.getAttribute('aria-valuenow'));
    const big = e.shiftKey;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = scale.stepYear(current, 1, big);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = scale.stepYear(current, -1, big);
        break;
      case 'PageUp':
        next = scale.stepYear(current, 1, true);
        break;
      case 'PageDown':
        next = scale.stepYear(current, -1, true);
        break;
      case 'Home':
        next = scale.minYear;
        break;
      case 'End':
        next = scale.maxYear;
        break;
      default:
        return;
    }
    e.preventDefault();
    onUserControl();
    onInput(next);
  });

  return {
    element,
    inner,
    handle,
    setYear(year, valueText) {
      handle.style.left = `${scale.yearToPosition(year) * 100}%`;
      handle.setAttribute('aria-valuenow', String(year));
      handle.setAttribute('aria-valuetext', valueText);
    },
  };
}
