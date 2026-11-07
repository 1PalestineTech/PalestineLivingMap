// A category's marker shape and color as a small inline SVG, for badges and filter rows.
// Uses the same geometry as the map's canvas icons (src/data/shapes.ts).

import type { CategoryInfo } from './data/categories.ts';
import { chevronPoints, shapeOutline } from './data/shapes.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ICON_SIZE = 20;

export function categoryIcon(category: CategoryInfo): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${ICON_SIZE} ${ICON_SIZE}`);
  svg.setAttribute('width', String(ICON_SIZE));
  svg.setAttribute('height', String(ICON_SIZE));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const c = ICON_SIZE / 2;
  const r = c - 3;
  const outline = shapeOutline(category.shape, c, r);
  const ring = category.shape === 'ring-chevron';
  const shape = document.createElementNS(SVG_NS, outline.kind === 'circle' ? 'circle' : 'polygon');
  if (outline.kind === 'circle') {
    shape.setAttribute('cx', String(outline.cx));
    shape.setAttribute('cy', String(outline.cy));
    shape.setAttribute('r', String(outline.r));
  } else {
    shape.setAttribute('points', outline.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '));
  }
  shape.setAttribute('fill', ring ? 'none' : category.color);
  if (ring) {
    shape.setAttribute('stroke', category.color);
    shape.setAttribute('stroke-width', '2');
  }
  svg.append(shape);

  if (ring) {
    const chevron = document.createElementNS(SVG_NS, 'polyline');
    chevron.setAttribute('points', chevronPoints(c, r).map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '));
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', category.color);
    chevron.setAttribute('stroke-width', '2');
    chevron.setAttribute('stroke-linecap', 'round');
    svg.append(chevron);
  }
  return svg;
}

