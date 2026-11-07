// Hover and focus tooltip, and click-to-open for the era labels. The tooltip shows the name(s)
// valid in the current year, their span and how many sources back them.

import { Popup } from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { namesAt, shortSpan } from '../data/places.ts';
import type { Place } from '../data/placeTypes.ts';
import { el } from '../dom.ts';
import { INTERACTIVE_LAYERS } from '../map/layers.ts';
import { getState } from '../state.ts';
import { labelBeatsMarker } from '../map/interactions.ts';
import { LABEL_LAYERS } from './layer.ts';
import { openPlace } from './select.ts';

export interface PlaceTooltip {
  show(place: Place): void;
  hide(): void;
}

/** The tooltip popup. Plain DOM nodes with textContent, so place data can't inject markup. */
export function createTooltip(map: MapLibreMap): PlaceTooltip {
  const popup = new Popup({ closeButton: false, closeOnClick: false, offset: 18, className: 'map-tooltip map-tooltip--place' });
  return {
    show(place) {
      const content = el('div');
      for (const name of namesAt(place, getState().currentYear)) {
        const line = el('div', 'map-tooltip__name');
        line.append(el('strong', '', name.en));
        if (name.ar !== null) {
          const ar = el('strong', 'map-tooltip__ar', name.ar);
          ar.lang = 'ar';
          ar.dir = 'rtl';
          line.append(ar);
        }
        line.append(el('span', '', `${shortSpan(name)} - ${name.sources.length} ${name.sources.length === 1 ? 'source' : 'sources'}`));
        content.append(line);
      }
      if (content.childElementCount === 0) {
        popup.remove();
        return;
      }
      popup.setLngLat([place.lng, place.lat]).setDOMContent(content).addTo(map);
    },
    hide() {
      popup.remove();
    },
  };
}

/** Wires mouse hover and click on the label layers. */
export function setupLabelPointer(map: MapLibreMap, byId: ReadonlyMap<string, Place>, tooltip: PlaceTooltip): void {
  const canvas = map.getCanvas();
  const placeAt = (point: { x: number; y: number }): Place | undefined => {
    const id = map.queryRenderedFeatures([point.x, point.y], { layers: [...LABEL_LAYERS] })[0]?.properties?.['id'];
    return typeof id === 'string' ? byId.get(id) : undefined;
  };

  map.on('mousemove', (e) => {
    const place = placeAt(e.point);
    // The event markers sit above the labels, so their own tooltip wins where they overlap.
    if (place && !canvas.style.cursor) tooltip.show(place);
    else if (!place) tooltip.hide();
    if (place && !canvas.style.cursor) canvas.style.cursor = 'pointer';
  });
  map.on('mouseout', () => tooltip.hide());

  map.on('click', (e) => {
    // A marker right under the pointer takes the click; one that only overlaps the label does not.
    const marker = map.queryRenderedFeatures([e.point.x, e.point.y], { layers: INTERACTIVE_LAYERS })[0];
    if (marker && !labelBeatsMarker(map, e.point, marker)) return;
    const place = placeAt(e.point);
    if (place) openPlace(place.id);
    else if (getState().selectedPlaceId !== null) openPlace(null);
  });
}
