// Animated paths (docs/SPEC_MAP_V2.md section 5). A path belongs to one event. While the event is
// on the timeline its line draws itself from the first waypoint to the last, with a small head at
// the leading point; afterwards it stays as a faint trail for `lingerYears`, then goes. While the
// timeline plays the drawing takes a few seconds; while you scrub (or with reduced motion) the
// drawn length jumps to match the year. Modules: geometry.ts (curve, length), timing.ts (when).

import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import type { Feature, FeatureCollection, LineString, Point } from 'geojson';
import { CATEGORIES } from '../data/categories.ts';
import type { ResolvedPath } from '../data/pathTypes.ts';
import { eventSpan } from '../data/spans.ts';
import type { EventSpan } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { INTERACTIVE_LAYERS } from '../map/layers.ts';
import type { Palette } from '../map/style.ts';
import { ARROW_IMAGE } from '../map/townIcons.ts';
import { getState, setState, subscribe } from '../state.ts';
import { cumulative, curveThrough, partial, waypointFractions } from './geometry.ts';
import type { Pos } from './geometry.ts';
import { opacityAt, targetProgress, waypointTimes } from './timing.ts';

const LINE_SOURCE = 'paths-line';
const HEAD_SOURCE = 'paths-head';
const LAYER = { hit: 'path-hit', solid: 'path-line-solid', dashed: 'path-line-dashed', dotted: 'path-line-dotted', arrows: 'path-arrows', head: 'path-head' } as const;
/** A whole path takes this long to draw while the timeline plays. */
const DRAW_MS = 2600;
/** Paths outside the followed thread dim to this share, like the markers. */
const DIMMED = 0.3;

interface Entry {
  path: ResolvedPath;
  event: HistoricalEvent;
  span: EventSpan;
  line: Pos[];
  cum: number[];
  times: number[];
  fractions: number[];
  color: string;
  shown: number;
}

export interface Paths {
  restyle(palette: Palette): void;
}

const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const kindIs = (...kinds: string[]): ExpressionSpecification => ['in', ['get', 'kind'], ['literal', kinds]];

function buildEntry(path: ResolvedPath, event: HistoricalEvent): Entry {
  const span = eventSpan(event);
  const waypoints: Pos[] = path.waypoints.map((w) => [w.lng, w.lat]);
  const line = path.shape === 'traced' && path.line.length >= 2 ? path.line : curveThrough(waypoints);
  const cum = cumulative(line);
  return {
    path,
    event,
    span,
    line,
    cum,
    times: waypointTimes(path.waypoints, span),
    fractions: waypointFractions(waypoints, line, cum),
    color: CATEGORIES.find((c) => c.id === event.category)?.color ?? '#444444',
    shown: 0,
  };
}

function addLayers(map: MapLibreMap, p: Palette, beforeId: string): void {
  map.addSource(LINE_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  map.addSource(HEAD_SOURCE, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
  const common = { type: 'line' as const, source: LINE_SOURCE, layout: { 'line-cap': 'round' as const, 'line-join': 'round' as const } };
  const width: ExpressionSpecification = ['case', kindIs('railway'), 1.6, 2.6];
  const get = (key: string): ExpressionSpecification => ['get', key];
  const paint = { 'line-color': get('color'), 'line-opacity': get('opacity'), 'line-width': width };
  // A wide, almost clear line so thin paths are easy to hover and click.
  map.addLayer({ ...common, id: LAYER.hit, paint: { 'line-color': '#000000', 'line-opacity': 0.01, 'line-width': 16 } }, beforeId);
  map.addLayer({ ...common, id: LAYER.solid, filter: kindIs('displacement', 'railway'), paint: { ...paint } }, beforeId);
  map.addLayer({ ...common, id: LAYER.dashed, filter: kindIs('campaign'), paint: { ...paint, 'line-dasharray': [2.4, 1.6] } }, beforeId);
  map.addLayer({ ...common, id: LAYER.dotted, filter: kindIs('route'), paint: { ...paint, 'line-dasharray': [0.1, 2] } }, beforeId);
  map.addLayer(
    {
      id: LAYER.arrows,
      type: 'symbol',
      source: LINE_SOURCE,
      filter: kindIs('campaign', 'displacement'),
      layout: { 'symbol-placement': 'line', 'symbol-spacing': 80, 'icon-image': ARROW_IMAGE, 'icon-size': 0.85, 'icon-allow-overlap': true, 'icon-rotation-alignment': 'map' },
      paint: { 'icon-opacity': get('opacity') },
    },
    beforeId,
  );
  map.addLayer(
    {
      id: LAYER.head,
      type: 'circle',
      source: HEAD_SOURCE,
      paint: { 'circle-radius': 5, 'circle-color': get('color'), 'circle-stroke-color': p.paper, 'circle-stroke-width': 1.5 },
    },
    beforeId,
  );
}

export function initPaths(map: MapLibreMap, events: readonly HistoricalEvent[], paths: readonly ResolvedPath[], palette: Palette, beforeId: string): Paths {
  const byEvent = new Map(events.map((e) => [e.id, e]));
  const entries = paths.flatMap((path) => {
    const event = byEvent.get(path.eventId);
    return event ? [buildEntry(path, event)] : [];
  });
  if (entries.length === 0) return { restyle: () => undefined };
  addLayers(map, palette, beforeId);

  let frame = 0;
  let last = 0;

  const opacityOf = (e: Entry): number => {
    const { currentYear, activeCategories, threadEvents } = getState();
    if (!activeCategories.has(e.event.category)) return 0;
    const dim = threadEvents !== null && !threadEvents.includes(e.event.id) ? DIMMED : 1;
    return opacityAt(e.span, e.path.lingerYears, currentYear) * dim;
  };
  const targetOf = (e: Entry): number => targetProgress(e.times, e.fractions, getState().currentYear);

  function draw(): void {
    const lines: Feature<LineString>[] = [];
    const heads: Feature<Point>[] = [];
    for (const e of entries) {
      const opacity = opacityOf(e);
      if (opacity === 0) continue;
      const { coords, head } = partial(e.line, e.cum, e.shown);
      const props = { id: e.event.id, kind: e.path.kind, color: e.color, opacity };
      if (coords.length >= 2) lines.push({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: coords } });
      // The head marks the leading point only while the line is still being drawn.
      if (head && e.shown > 0 && e.shown < 1) heads.push({ type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: head } });
    }
    const fc = (features: Feature[]): FeatureCollection => ({ type: 'FeatureCollection', features });
    map.getSource<GeoJSONSource>(LINE_SOURCE)?.setData(fc(lines));
    map.getSource<GeoJSONSource>(HEAD_SOURCE)?.setData(fc(heads));
  }

  function tick(now: number): void {
    const dt = last === 0 ? 0 : now - last;
    last = now;
    let moving = false;
    for (const e of entries) {
      const target = targetOf(e);
      if (e.shown === target) continue;
      const delta = dt / DRAW_MS;
      e.shown = e.shown < target ? Math.min(target, e.shown + delta) : target;
      if (e.shown !== target) moving = true;
    }
    draw();
    frame = moving ? window.requestAnimationFrame(tick) : 0;
    if (!moving) last = 0;
  }

  function refresh(): void {
    const animate = getState().isPlaying && !reducedMotion();
    if (animate) {
      if (frame === 0) frame = window.requestAnimationFrame(tick);
      return;
    }
    window.cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    for (const e of entries) e.shown = targetOf(e);
    draw();
  }

  refresh();
  subscribe((state, previous) => {
    if (state.currentYear !== previous.currentYear || state.activeCategories !== previous.activeCategories || state.threadEvents !== previous.threadEvents || state.isPlaying !== previous.isPlaying) refresh();
  });

  const idAt = (point: { x: number; y: number }): string | undefined => {
    const id = map.queryRenderedFeatures([point.x, point.y], { layers: [LAYER.hit] })[0]?.properties?.['id'];
    return typeof id === 'string' ? id : undefined;
  };
  const canvas = map.getCanvas();
  map.on('mousemove', (e) => {
    if (idAt(e.point)) canvas.style.cursor = 'pointer';
  });
  map.on('click', (e) => {
    if (map.queryRenderedFeatures([e.point.x, e.point.y], { layers: INTERACTIVE_LAYERS }).length > 0) return;
    const id = idAt(e.point);
    if (id) setState({ selectedEventId: id, isPlaying: false, story: null, dimOthers: false });
  });

  return { restyle: (p) => map.setPaintProperty(LAYER.head, 'circle-stroke-color', p.paper) };
}
