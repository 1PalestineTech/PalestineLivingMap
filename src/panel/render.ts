// Builds the event story card (docs/SPEC.md F4). Everything is created with DOM nodes and
// textContent, so event data can never inject markup. Links are limited to http(s).

import { CATEGORIES } from '../data/categories.ts';
import { formatEventDate } from '../data/format.ts';
import type { ResolvedPath } from '../data/pathTypes.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { categoryIcon } from '../categoryIcon.ts';
import { el, externalLink, safeImageSrc } from '../dom.ts';
import { reportButton } from '../feedback.ts';
import { eventCardData, shareImageButton } from '../shareCard.ts';
import type { Siblings } from './siblings.ts';

export interface CardActions {
  onSelect(event: HistoricalEvent): void;
  /** Copies the link; resolves true if it worked. */
  onCopyLink(event: HistoricalEvent): Promise<boolean>;
}

export interface Card {
  element: HTMLElement;
  /** The h2; receives focus when the card opens. */
  heading: HTMLElement;
}

function nameSpan(text: string, lang: string): HTMLElement {
  const span = el('span', 'card__name', text);
  span.lang = lang;
  if (lang === 'ar') span.dir = 'rtl';
  return span;
}

function placeSection(event: HistoricalEvent): HTMLElement {
  const { location } = event;
  const place = el('p', 'card__place');
  place.append(el('span', 'card__name', location.name));
  if (location.nameAr) place.append(nameSpan(location.nameAr, 'ar'));
  if (location.precision === 'approximate') place.append(el('span', 'card__tag', 'Approximate area'));

  const names = location.historicalNames ?? [];
  if (names.length === 0) return place;

  const wrap = el('div', 'card__place-wrap');
  const list = el('ul', 'card__historical');
  for (const historical of names) {
    const item = el('li');
    const name = el('span', '', historical.name);
    if (historical.lang) name.lang = historical.lang;
    item.append(name);
    const note = [historical.period].filter(Boolean).join(', ');
    if (note !== '') item.append(el('span', 'card__muted', ` (${note})`));
    list.append(item);
  }
  wrap.append(place, el('p', 'card__muted card__label', 'Also known then as'), list);
  return wrap;
}

function detailsSection(event: HistoricalEvent, id: string): HTMLElement | null {
  if (!event.details) return null;
  const wrap = el('div', 'card__details');
  const body = el('div', 'card__details-body');
  body.id = id;
  body.hidden = true;
  for (const paragraph of event.details.split(/\n\s*\n/)) body.append(el('p', '', paragraph));

  const toggle = el('button', 'link-button', 'Read more');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', id);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Show less' : 'Read more';
    body.hidden = !open;
  });
  wrap.append(body, toggle);
  return wrap;
}

function imageSection(event: HistoricalEvent): HTMLElement | null {
  const image = event.images?.[0];
  const src = image ? safeImageSrc(image.src) : null;
  if (!image || src === null) return null;
  const figure = el('figure', 'card__figure');
  const img = el('img');
  img.src = src;
  img.alt = image.alt;
  img.loading = 'lazy';
  const caption = el('figcaption', 'card__muted');
  caption.append(`${image.credit}. ${image.license}. `, externalLink(image.sourceUrl, 'Source'));
  figure.append(img, caption);
  return figure;
}

function perspectivesSection(event: HistoricalEvent, uid: string): HTMLElement | null {
  const items = event.perspectives ?? [];
  if (items.length === 0) return null;
  const section = el('section', 'card__section card__accounts');
  const heading = el('h3', '', 'Different accounts');
  heading.id = `${uid}-accounts`;
  section.setAttribute('aria-labelledby', heading.id);
  section.append(heading);
  const list = el('ul', 'card__list');
  for (const perspective of items) {
    const item = el('li');
    item.append(el('p', 'card__viewpoint', `According to ${perspective.viewpoint}:`), el('p', '', perspective.claim));
    const source = event.sources[perspective.sourceIndex];
    if (source) {
      const line = el('p', 'card__muted');
      line.append('Source: ', externalLink(source.url, source.title));
      item.append(line);
    }
    list.append(item);
  }
  section.append(list);
  return section;
}

function sourcesSection(event: HistoricalEvent, uid: string): HTMLElement {
  const section = el('section', 'card__section');
  const heading = el('h3', '', `Sources (${event.sources.length})`);
  heading.id = `${uid}-sources`;
  section.setAttribute('aria-labelledby', heading.id);
  const list = el('ol', 'card__list');
  for (const source of event.sources) {
    const item = el('li');
    item.append(externalLink(source.url, source.title));
    const detail = [source.author, source.publisher, source.pages].filter(Boolean).join(', ');
    if (detail !== '') item.append(el('span', 'card__muted', ` - ${detail}`));
    if (source.note) item.append(el('span', 'card__muted card__note', source.note));
    list.append(item);
  }
  section.append(heading, list);
  return section;
}

function navSection(siblings: Siblings, actions: CardActions): HTMLElement {
  const nav = el('nav', 'card__nav');
  nav.setAttribute('aria-label', `More from ${siblings.groupName}`);

  const makeButton = (label: string, target: HistoricalEvent | null): HTMLButtonElement => {
    const button = el('button', 'btn', label);
    button.type = 'button';
    button.disabled = target === null;
    if (target) {
      button.setAttribute('aria-label', `${label}: ${target.title}`);
      button.addEventListener('click', () => actions.onSelect(target));
    }
    return button;
  };

  const position = el('span', 'card__position', `${siblings.groupName}: ${siblings.index + 1} of ${siblings.list.length}`);
  nav.append(makeButton('Previous', siblings.previous), position, makeButton('Next', siblings.next));
  return nav;
}

function copyButton(event: HistoricalEvent, actions: CardActions): HTMLElement {
  const wrap = el('div', 'card__actions');
  const button = el('button', 'btn', 'Copy link');
  button.type = 'button';
  const status = el('span', 'sr-only');
  status.setAttribute('role', 'status');
  let timer = 0;
  button.addEventListener('click', () => {
    void actions.onCopyLink(event).then((ok) => {
      button.textContent = ok ? 'Link copied' : 'Copy failed';
      status.textContent = ok ? 'Link copied to clipboard' : 'Could not copy the link';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.textContent = 'Copy link';
        status.textContent = '';
      }, 2000);
    });
  });
  wrap.append(button, status);
  return wrap;
}

/** "Route: Jaffa → Acre (approximate)" for the event's path, if it has one. */
export function routeLine(path: ResolvedPath): HTMLElement {
  const names = path.waypoints.map((w) => w.name).join(' → ');
  return el('p', 'card__route', `Route: ${names}${path.shape === 'schematic' ? ' (approximate; the line is schematic, not the road taken)' : ''}`);
}

export function renderCard(event: HistoricalEvent, siblings: Siblings, actions: CardActions, path?: ResolvedPath): Card {
  const uid = `card-${event.id}`;
  const category = CATEGORIES.find((c) => c.id === event.category);

  const article = el('article', 'card');
  article.setAttribute('aria-labelledby', `${uid}-title`);

  const meta = el('div', 'card__meta');
  const badge = el('span', 'badge');
  if (category) badge.append(categoryIcon(category), el('span', '', category.label));
  meta.append(badge);
  if (event.status === 'needs-review') {
    const review = el('span', 'tag tag--review', 'Under review');
    review.title = 'This entry has not yet been fully checked against its sources';
    meta.append(review);
  }

  const heading = el('h2', 'card__title', event.title);
  heading.id = `${uid}-title`;
  heading.tabIndex = -1;

  const details = detailsSection(event, `${uid}-details`);
  const image = imageSection(event);
  const accounts = perspectivesSection(event, uid);

  article.append(meta, heading, el('p', 'card__date', formatEventDate(event)), placeSection(event));
  article.append(el('p', 'card__summary', event.summary));
  if (path) article.append(routeLine(path));
  if (details) article.append(details);
  if (image) article.append(image);
  if (accounts) article.append(accounts);
  article.append(sourcesSection(event, uid), navSection(siblings, actions), copyButton(event, actions), shareImageButton(() => eventCardData(event)), reportButton(`${event.title} (event ${event.id})`));

  return { element: article, heading };
}
