// Optional "lakes in 1946" picture (Filters > Geography over time): Lake Hula and the Dead Sea as the 1946 Survey of Palestine
// sheet prints them, drawn as water for 1944 to 1950 and as a dashed outline of the old shore afterwards, so the draining of the Hula
// and the shrinking of the Dead Sea can be seen against today's base map. The outlines in public/data/control/lakes.geojson were traced
// from the owner's scan of the sheet after fitting it to the sheet's own grid (see docs/GEOGRAPHY_NOTES.md). Off by default.

import type { FilterSpecification, Map as MapLibreMap } from 'maplibre-gl';
import { formatYear } from '../data/format.ts';
import { el } from '../dom.ts';
import { luminance } from './color.ts';
import type { Palette } from './style.ts';

const SOURCE = 'look-lakes';
export const LAKES_FILL = 'look-lakes-fill';
export const LAKES_LINE = 'look-lakes-line';

const showing = (year: number, kind: 'fill' | 'line'): FilterSpecification => [
  'all',
  ['==', ['get', 'kind'], kind],
  ['<=', ['get', 'from'], year],
  ['any', ['==', ['get', 'to'], null], ['>=', ['get', 'to'], year]],
];

const lineColor = (p: Palette): string => (luminance(p.paper) < 0.5 ? '#cfd8dc' : p.ink);

let legend: HTMLElement | null = null;

function updateLegend(on: boolean, year: number): void {
  if (!legend) return;
  legend.hidden = !on || year < 1944;
  if (legend.hidden) return;
  const section = el('section', 'legend__item');
  section.append(
    el('p', 'legend__head', `Lakes as printed in 1946, shown for ${formatYear(year, true)}`),
    el(
      'p',
      'legend__note',
      year <= 1950
        ? 'Lake Hula and the Dead Sea as the 1946 Survey of Palestine sheet draws them.'
        : "Dashed lines: the 1946 shore of Lake Hula (drained 1951 to 1958) and of the Dead Sea. The blue water is today's base map.",
    ),
    el('p', 'legend__source', 'Source: Survey of Palestine, 1:250,000 sheets (1944, reprinted c. 1946), traced by the project; accurate to about 150 m. Approximate.'),
  );
  legend.replaceChildren(section);
}

export function setLakes(map: MapLibreMap, on: boolean, year: number, p: Palette): void {
  if (on && !map.getSource(SOURCE)) {
    map.addSource(SOURCE, { type: 'geojson', data: new URL('data/control/lakes.geojson', document.baseURI).href });
    const before = ['boundary_casing', 'era-labels-r4'].find((id) => map.getLayer(id) !== undefined);
    map.addLayer({ id: LAKES_FILL, type: 'fill', source: SOURCE, filter: showing(year, 'fill'), paint: { 'fill-color': p.sea, 'fill-opacity': 0.93 } }, before);
    map.addLayer(
      { id: LAKES_LINE, type: 'line', source: SOURCE, filter: showing(year, 'line'), paint: { 'line-color': lineColor(p), 'line-width': 1.6, 'line-dasharray': [3, 2], 'line-opacity': 0.9 } },
      before,
    );
    legend = el('aside', 'legend');
    legend.setAttribute('aria-label', 'Lakes as printed in 1946');
    document.getElementById('map')?.append(legend);
  }
  if (!map.getLayer(LAKES_FILL)) return;
  map.setFilter(LAKES_FILL, showing(year, 'fill'));
  map.setFilter(LAKES_LINE, showing(year, 'line'));
  for (const id of [LAKES_FILL, LAKES_LINE]) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
  updateLegend(on, year);
}

export function updateLakesPalette(map: MapLibreMap, p: Palette): void {
  if (!map.getLayer(LAKES_FILL)) return;
  map.setPaintProperty(LAKES_FILL, 'fill-color', p.sea);
  map.setPaintProperty(LAKES_LINE, 'line-color', lineColor(p));
}
