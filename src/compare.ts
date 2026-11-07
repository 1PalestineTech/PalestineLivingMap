// Compare two years side by side (Filters > Compare two years): the map is drawn for the left year, kept as a picture, then drawn for
// the right year, and a slider wipes between them. While comparing the map cannot be moved (the picture would no longer fit); the
// Exit button or Escape returns to the normal map at the right-hand year.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { formatYear } from './data/format.ts';
import { el } from './dom.ts';
import { ESCAPE_PRIORITY, registerEscape } from './escape.ts';
import { getState, setState } from './state.ts';

/** Waits until the map has finished drawing, plus a moment for labels to fade in. */
function settle(map: MapLibreMap): Promise<void> {
  return new Promise((resolve) => {
    const done = window.setTimeout(resolve, 9000);
    map.once('idle', () => {
      window.setTimeout(() => {
        window.clearTimeout(done);
        resolve();
      }, 900);
    });
    map.triggerRepaint();
  });
}

function snapshot(map: MapLibreMap): Promise<string> {
  return new Promise((resolve) => {
    map.once('render', () => resolve(map.getCanvas().toDataURL('image/png')));
    map.triggerRepaint();
  });
}

const INTERACTIONS = ['dragPan', 'scrollZoom', 'doubleClickZoom', 'touchZoomRotate', 'keyboard', 'boxZoom'] as const;

export function initCompare(slot: HTMLElement, map: MapLibreMap): void {
  let overlay: HTMLElement | null = null;

  const setInteractive = (on: boolean): void => {
    for (const name of INTERACTIONS) {
      if (on) map[name].enable();
      else map[name].disable();
    }
  };

  function exit(): void {
    overlay?.remove();
    overlay = null;
    setInteractive(true);
  }

  async function start(left: number, right: number, status: HTMLElement): Promise<void> {
    status.textContent = 'Drawing both years, one moment...';
    setState({ story: null, dimOthers: false, selectedEventId: null, selectedPlaceId: null, isPlaying: false, currentYear: left });
    await settle(map);
    const picture = await snapshot(map);
    setState({ currentYear: right });
    await settle(map);
    status.textContent = '';

    overlay = el('div', 'compare');
    const image = el('img', 'compare__img');
    image.src = picture;
    image.alt = `The map in ${formatYear(left, true)}`;
    const handle = el('div', 'compare__handle');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', `Move between ${formatYear(left, true)} and ${formatYear(right, true)}`);
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.tabIndex = 0;
    const grip = el('span', 'compare__grip', '↔');
    handle.append(grip);
    const leftLabel = el('span', 'compare__label compare__label--left', formatYear(left, true));
    const rightLabel = el('span', 'compare__label compare__label--right', formatYear(right, true));
    const quit = el('button', 'btn compare__exit', 'Exit compare');
    quit.type = 'button';
    quit.addEventListener('click', exit);
    overlay.append(image, handle, leftLabel, rightLabel, quit);
    map.getContainer().append(overlay);

    const place = (percent: number): void => {
      const p = Math.min(98, Math.max(2, percent));
      image.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      handle.style.left = `${p}%`;
      handle.setAttribute('aria-valuenow', String(Math.round(p)));
    };
    place(50);
    let dragging = false;
    handle.addEventListener('pointerdown', (e) => {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointerup', () => {
      dragging = false;
    });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging || !overlay) return;
      const box = overlay.getBoundingClientRect();
      place(((e.clientX - box.left) / box.width) * 100);
    });
    handle.addEventListener('keydown', (e) => {
      const now = Number(handle.getAttribute('aria-valuenow') ?? 50);
      if (e.key === 'ArrowLeft') place(now - 5);
      else if (e.key === 'ArrowRight') place(now + 5);
    });
    setInteractive(false);
    handle.focus({ preventScroll: true });
  }

  const heading = el('h3', 'filters__legend', 'Compare two years');
  const row = el('p', 'form__field');
  const leftInput = el('input');
  leftInput.type = 'number';
  leftInput.value = '1946';
  leftInput.setAttribute('aria-label', 'Left year');
  const rightInput = el('input');
  rightInput.type = 'number';
  rightInput.value = String(getState().currentYear);
  rightInput.setAttribute('aria-label', 'Right year');
  row.append(leftInput, rightInput);
  const go = el('button', 'btn', 'Compare');
  go.type = 'button';
  const status = el('p', 'filters__note');
  status.setAttribute('role', 'status');
  const note = el('p', 'filters__note', 'Draws the map for each year and wipes between them with a slider. Switch on the zones, lakes or settlements first to compare them. The map cannot be moved while comparing.');
  go.addEventListener('click', () => {
    const l = Math.round(Number(leftInput.value));
    const r = Math.round(Number(rightInput.value));
    if (!Number.isFinite(l) || !Number.isFinite(r) || l === 0 || r === 0) {
      status.textContent = 'Enter two years (negative for BCE).';
      return;
    }
    exit();
    void start(l, r, status);
  });
  slot.append(heading, row, go, status, note);
  registerEscape({ priority: ESCAPE_PRIORITY.story, isOpen: () => overlay !== null, close: exit });
}
