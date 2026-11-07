// A search such as "Safad depopulated" labels only the matching places. This shows what is picked, with a button to clear it,
// and moves the camera to fit them.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { el } from '../dom.ts';
import type { Place } from '../data/placeTypes.ts';
import { getState, setState, subscribe } from '../state.ts';

export function initPlaceFilterChip(map: MapLibreMap, places: readonly Place[]): void {
  const chip = el('div', 'place-filter');
  chip.hidden = true;
  chip.setAttribute('role', 'status');
  const text = el('span', 'place-filter__text');
  const clear = el('button', 'btn btn--compact', 'Show all places');
  clear.type = 'button';
  clear.addEventListener('click', () => setState({ placeFilter: null }));
  chip.append(text, clear);
  map.getContainer().append(chip);

  const byId = new Map(places.map((p) => [p.id, p]));
  subscribe((state, previous) => {
    if (state.placeFilter === previous.placeFilter) return;
    const picked = state.placeFilter;
    chip.hidden = picked === null;
    if (picked === null) return;
    text.textContent = `Showing ${picked.ids.length} places: ${picked.label}`;
    const pts = picked.ids.flatMap((id) => (byId.has(id) ? [byId.get(id) as Place] : []));
    if (pts.length === 0) return;
    const w = Math.min(...pts.map((p) => p.lng));
    const e = Math.max(...pts.map((p) => p.lng));
    const s = Math.min(...pts.map((p) => p.lat));
    const n = Math.max(...pts.map((p) => p.lat));
    map.fitBounds([[w, s], [e, n]], { padding: 60, maxZoom: 10, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900 });
  });
  void getState;
}
