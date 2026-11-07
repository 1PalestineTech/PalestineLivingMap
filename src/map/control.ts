// Optional "who held the land" zones (Filters > Control of the land): one colour for the whole land before 1948, Israel's colour
// growing from the 1949 armistice lines, the occupied territories from 1967, and the Oslo areas from 1995. The shapes are in
// public/data/control/control.geojson (Natural Earth, public domain, for the outlines; the Oslo Agreement areas published on the
// Humanitarian Data Exchange for Area C). They are approximate and schematic: see docs/CONTROL_ZONES.md. Off by default.

import type { ExpressionSpecification, FilterSpecification, Map as MapLibreMap } from 'maplibre-gl';
import { formatYear } from '../data/format.ts';
import { el, externalLink } from '../dom.ts';
import { luminance } from './color.ts';
import type { Palette } from './style.ts';

const SOURCE = 'look-control';
export const CONTROL_FILL = 'look-control-fill';
export const CONTROL_LINE = 'look-control-line';

/** The colour of each kind of zone. */
export const CONTROL_COLORS = { palestine: '#3f9b4a', israel: '#2f6db5', occupied: '#5b93d6' } as const;
const KIND_NAME = {
  palestine: 'Palestine (the land outside Israeli control)',
  israel: 'Israeli control, within the 1949 armistice lines',
  occupied: 'Israeli control of occupied territory (from 1967; Area C and Israeli-declared East Jerusalem from 1995)',
} as const;

interface ZoneProps { id: string; kind: keyof typeof CONTROL_COLORS; from: number; to: number | null; label: string }
interface ZoneFile { features: { properties: ZoneProps }[] }

const colorExpr: ExpressionSpecification = ['match', ['get', 'kind'], 'israel', CONTROL_COLORS.israel, 'occupied', CONTROL_COLORS.occupied, CONTROL_COLORS.palestine];
const yearFilter = (year: number): FilterSpecification => ['all', ['<=', ['get', 'from'], year], ['any', ['==', ['get', 'to'], null], ['>=', ['get', 'to'], year]]];

const fillPaint = (p: Palette): Record<string, unknown> => ({
  'fill-color': colorExpr,
  'fill-opacity': ['match', ['get', 'kind'], 'occupied', luminance(p.paper) < 0.5 ? 0.42 : 0.4, luminance(p.paper) < 0.5 ? 0.46 : 0.5],
  'fill-antialias': true,
});
const linePaint = (): Record<string, unknown> => ({ 'line-color': colorExpr, 'line-width': 1.4, 'line-opacity': 0.9 });

let zones: ZoneProps[] = [];
let legend: HTMLElement | null = null;

function updateLegend(on: boolean, year: number): void {
  if (!legend) return;
  const active = zones.filter((z) => z.from <= year && (z.to === null || year <= z.to));
  legend.hidden = !on || active.length === 0;
  if (legend.hidden) return;
  const kinds = [...new Set(active.map((z) => z.kind))];
  const items = kinds.map((kind) => {
    const row = el('p', 'legend__head');
    const swatch = el('span', 'legend__swatch');
    swatch.style.background = CONTROL_COLORS[kind];
    row.append(swatch, el('strong', '', KIND_NAME[kind]));
    return row;
  });
  const source = el('p', 'legend__source');
  source.append('Sources: ', externalLink('https://www.naturalearthdata.com/', 'Natural Earth'), ' (outlines, public domain); ', externalLink('https://data.humdata.org/dataset/d3a843df-a640-4e9d-b867-8ca974c2aa74', 'Oslo Agreement areas, Palestinian Authority Ministry of Planning via OCHA (HDX)'), '.');
  const section = el('section', 'legend__item');
  section.append(
    el('p', 'legend__head', `Occupation of Palestine since 1948: ${formatYear(year, true)}`),
    ...items,
    el('p', 'legend__note', year === 1948 ? 'In 1948 control changed through the year; the armistice lines are drawn from 1949.' : 'Approximate and schematic: not exact boundaries.'),
    source,
  );
  legend.replaceChildren(section);
}

/** Shows the zones for `year`, loading the shapes the first time they are wanted. */
export async function setControl(map: MapLibreMap, on: boolean, year: number, p: Palette): Promise<void> {
  if (on && !map.getSource(SOURCE)) {
    const url = new URL('data/control/control.geojson', document.baseURI).href;
    const data = (await (await fetch(url)).json()) as ZoneFile;
    zones = data.features.map((f) => f.properties);
    map.addSource(SOURCE, { type: 'geojson', data: url });
    const underSea = ['look-offline-sea', 'water'].find((id) => map.getLayer(id) !== undefined);
    map.addLayer({ id: CONTROL_FILL, type: 'fill', source: SOURCE, filter: yearFilter(year), paint: fillPaint(p) as Record<string, never> }, underSea);
    map.addLayer({ id: CONTROL_LINE, type: 'line', source: SOURCE, filter: yearFilter(year), paint: linePaint() as Record<string, never> }, underSea);
    legend = el('aside', 'legend');
    legend.setAttribute('aria-label', 'Control of the land');
    document.getElementById('map')?.append(legend);
  }
  if (!map.getLayer(CONTROL_FILL)) return;
  map.setFilter(CONTROL_FILL, yearFilter(year));
  map.setFilter(CONTROL_LINE, yearFilter(year));
  map.setLayoutProperty(CONTROL_FILL, 'visibility', on ? 'visible' : 'none');
  map.setLayoutProperty(CONTROL_LINE, 'visibility', on ? 'visible' : 'none');
  updateLegend(on, year);
}

export function updateControlPalette(map: MapLibreMap, p: Palette): void {
  if (!map.getLayer(CONTROL_FILL)) return;
  for (const [name, value] of Object.entries(fillPaint(p))) map.setPaintProperty(CONTROL_FILL, name as Parameters<MapLibreMap['setPaintProperty']>[1], value as Parameters<MapLibreMap['setPaintProperty']>[2]);
}
