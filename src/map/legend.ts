// Small legend on the map for the layers currently shown: name, years, an "approximate"
// note, and a link to the source. Hidden when no layer is shown.

import type { MapLayer } from '../data/layerTypes.ts';
import { formatYear } from '../data/format.ts';
import { el, externalLink } from '../dom.ts';

export const APPROXIMATE_NOTE = 'Boundaries shown are approximate; see source.';

export interface Legend {
  update(shown: readonly MapLayer[]): void;
}

export function createLegend(): Legend {
  const host = document.getElementById('map');
  const element = el('aside', 'legend');
  element.hidden = true;
  element.setAttribute('aria-label', 'Map layers shown');
  host?.append(element);

  return {
    update(shown) {
      element.hidden = shown.length === 0;
      element.replaceChildren(
        ...shown.map((layer) => {
          const item = el('section', 'legend__item');
          const head = el('p', 'legend__head');
          head.append(el('span', 'legend__swatch'), el('strong', '', layer.name));
          const years = layer.validTo === null ? 'present' : formatYear(layer.validTo, true);
          const range = el('span', 'legend__range', `${formatYear(layer.validFrom, true)} to ${years}`);

          const source = el('p', 'legend__source');
          source.append('Source: ');
          source.append(layer.source.url === null ? layer.source.title : externalLink(layer.source.url, layer.source.title));
          source.append(` (${layer.license})`);

          item.append(head, range, el('p', 'legend__note', APPROXIMATE_NOTE), source);
          return item;
        }),
      );
    },
  };
}
