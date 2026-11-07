// Screen-space finishing: a static paper grain, a light vignette and a compass rose, laid over
// the map as one inert element (styles in src/styles/paper.css). Nothing here is animated.

const SVG_NS = 'http://www.w3.org/2000/svg';

/** An original eight-point compass rose, drawn with plain shapes. */
function compassRose(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '-50 -50 100 100');
  svg.setAttribute('class', 'paper__compass');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const add = (tag: string, attrs: Record<string, string>): void => {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    svg.appendChild(el);
  };
  add('circle', { r: '30', class: 'paper__stroke', fill: 'none' });
  add('circle', { r: '24', class: 'paper__stroke paper__stroke--thin', fill: 'none' });
  // Four long points (N, E, S, W) and four short ones between them.
  add('path', { d: 'M0 -46 L6 -6 L46 0 L6 6 L0 46 L-6 6 L-46 0 L-6 -6 Z', class: 'paper__fill' });
  add('path', { d: 'M0 -28 L4 -4 L28 0 L4 4 L0 28 L-4 4 L-28 0 L-4 -4 Z', class: 'paper__fill paper__fill--short', transform: 'rotate(45)' });
  add('path', { d: 'M0 -46 L6 -6 L-6 -6 Z', class: 'paper__half' });
  add('circle', { r: '3', class: 'paper__fill' });
  const north = document.createElementNS(SVG_NS, 'text');
  north.setAttribute('y', '-50');
  north.setAttribute('text-anchor', 'middle');
  north.setAttribute('class', 'paper__letter');
  north.textContent = 'N';
  svg.appendChild(north);
  return svg;
}

/** A static noise tile (feTurbulence) repeated across the overlay. Drawn as an inline element, not a CSS image, so it is never the page's largest paint. */
function grain(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'paper__grain');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML =
    '<defs>' +
    '<filter id="paper-noise" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" stitchTiles="stitch"/>' +
    '<feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.27 0 0 0 0 0.18 0 0 0 1.1 -0.35"/>' +
    '</filter>' +
    '<pattern id="paper-grain" width="128" height="128" patternUnits="userSpaceOnUse">' +
    '<rect width="128" height="128" filter="url(#paper-noise)"/>' +
    '</pattern></defs>' +
    '<rect width="100%" height="100%" fill="url(#paper-grain)"/>';
  return svg;
}

/** Adds the compass to the overlay that index.html already provides (created here if the page lacks it). */
export function mountPaper(container: HTMLElement): void {
  const host = container.parentElement;
  if (!host) return;
  let paper = host.querySelector<HTMLElement>('.paper');
  if (!paper) {
    paper = document.createElement('div');
    paper.className = 'paper';
    paper.setAttribute('aria-hidden', 'true');
    host.appendChild(paper);
  }
  if (!paper.querySelector('.paper__compass')) paper.appendChild(compassRose());
}

/** Lays the grain over the map. Called once the map has loaded, so it stays off the first paint. */
export function addGrain(container: HTMLElement): void {
  const paper = container.parentElement?.querySelector('.paper');
  if (paper && !paper.querySelector('.paper__grain')) paper.prepend(grain());
}
