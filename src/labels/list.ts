// A text alternative to the drawn labels, and the way to reach them by keyboard: a visually hidden
// list of the places named in the current year and inside the current view. Focusing a button
// shows the same tooltip as hovering the label; Enter opens the place card.

import type { Map as MapLibreMap } from 'maplibre-gl';
import { formatYear } from '../data/format.ts';
import { labelAt, shownNow } from '../data/places.ts';
import type { Place } from '../data/placeTypes.ts';
import { el } from '../dom.ts';
import { getState } from '../state.ts';
import { flyToPlace } from '../map/interactions.ts';
import type { PlaceTooltip } from './interact.ts';
import { openPlace } from './select.ts';

export interface PlaceList {
  render(year: number): void;
}

export function mountPlaceList(map: MapLibreMap, places: readonly Place[], tooltip: PlaceTooltip): PlaceList {
  const nav = el('nav', 'place-list sr-only');
  nav.setAttribute('aria-label', 'Place names on the map');
  const heading = el('p');
  const list = el('ul');
  nav.append(heading, list);
  map.getContainer().append(nav);

  let signature = '';
  const inView = (place: Place): boolean => map.getBounds().contains([place.lng, place.lat]);

  function render(year: number): void {
    const shown = places.flatMap((place) => {
      const label = labelAt(place, year);
      // Israeli localities are listed only while the Settlements filter is on, as they are drawn only then.
      const hidden = (place.group === 'settlement' && !getState().showSettlements) || !shownNow(place, getState().selectedEventId, getState().selectedPlaceId);
      return label === null || hidden || !inView(place) ? [] : [{ place, text: label.ar === '' ? label.en : `${label.en}, ${label.ar}` }];
    });
    const next = `${year}|${shown.map((s) => `${s.place.id}:${s.text}`).join('|')}`;
    if (next === signature) return;
    signature = next;
    heading.textContent = `Places named in ${formatYear(year, true)}: ${shown.length}`;
    list.replaceChildren(
      ...shown.map(({ place, text }) => {
        const item = el('li');
        const button = el('button', '', text);
        button.type = 'button';
        button.setAttribute('aria-haspopup', 'dialog');
        button.addEventListener('focus', () => {
          const p = map.project([place.lng, place.lat]);
          const canvas = map.getCanvas();
          if (p.x < 0 || p.y < 0 || p.x > canvas.clientWidth || p.y > canvas.clientHeight) flyToPlace(map, place.lng, place.lat, null, false);
          tooltip.show(place);
        });
        button.addEventListener('blur', () => tooltip.hide());
        button.addEventListener('click', () => openPlace(place.id));
        item.append(button);
        return item;
      }),
    );
  }

  return { render };
}
