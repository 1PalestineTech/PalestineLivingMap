// The place card: every name of a place through time, each with its span and sources, plus the
// events at that place. Built from DOM nodes and textContent, so data can't inject markup.
// It reuses the event card's classes and shares its side panel.

import { formatYear } from '../data/format.ts';
import { distanceKm, nameValidInYear, spanText } from '../data/places.ts';
import type { Place, PlaceKind, PlaceName } from '../data/placeTypes.ts';
import { eventStartYear } from '../data/spans.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { el, externalLink } from '../dom.ts';
import { reportButton } from '../feedback.ts';
import { placeCardData, shareImageButton } from '../shareCard.ts';
import type { Card } from '../panel/render.ts';
import { openPlace } from './select.ts';

/** Events whose map point lies within this distance of the place are listed on its card. */
export const EVENT_RADIUS_KM = 5;

const KIND_LABEL: Record<PlaceKind, string> = {
  city: 'City',
  town: 'Town',
  village: 'Village',
  site: 'Site',
  region: 'Region',
  water: 'Water',
  mountain: 'Mountain',
};
const LANGUAGE: Record<string, string> = { la: 'Latin', grc: 'Greek', ar: 'Arabic', akk: 'Akkadian', arc: 'Aramaic', en: 'English', tr: 'Turkish' };

export function eventsAt(place: Place, events: readonly HistoricalEvent[]): HistoricalEvent[] {
  return events
    .filter((e) => distanceKm(place.lat, place.lng, e.location.lat, e.location.lng) <= EVENT_RADIUS_KM)
    .sort((a, b) => eventStartYear(a) - eventStartYear(b) || a.title.localeCompare(b.title));
}

/** The name the card is titled with: the one in use now, else the latest dated one. */
function titleName(place: Place, year: number): PlaceName | undefined {
  const dated = place.names.filter((n) => n.from !== null);
  const now = dated.filter((n) => nameValidInYear(n, year));
  return now[now.length - 1] ?? dated[dated.length - 1] ?? place.names[0];
}

function nameItem(name: PlaceName, year: number): HTMLElement {
  const item = el('li', 'place-name');
  const head = el('p', 'place-name__head');
  const en = el('span', 'card__name', name.en);
  head.append(en);
  if (name.ar !== null) {
    const ar = el('span', 'card__name', name.ar);
    ar.lang = 'ar';
    ar.dir = 'rtl';
    head.append(ar);
  }
  if (nameValidInYear(name, year)) head.append(el('span', 'card__tag', 'On the map now'));
  item.append(head, el('p', 'card__muted', `${spanText(name)}. Used in ${LANGUAGE[name.lang] ?? name.lang}.`));
  if (name.note) item.append(el('p', 'card__muted', name.note));

  const sources = el('ul', 'card__list place-name__sources');
  sources.setAttribute('aria-label', `Sources for ${name.en}`);
  for (const source of name.sources) {
    const line = el('li');
    line.append(externalLink(source.url, source.title));
    const detail = [source.author, source.publisher, source.pages].filter(Boolean).join(', ');
    if (detail !== '') line.append(el('span', 'card__muted', ` - ${detail}`));
    if (source.note) line.append(el('span', 'card__muted card__note', source.note));
    sources.append(line);
  }
  item.append(sources);
  return item;
}

const SOURCE_NAME = { pr: 'Palestine Remembered', book: 'Khalidi, All That Remains (machine-read from a scan, check against the print)' } as const;

function linkButton(text: string, id: string): HTMLButtonElement {
  const button = el('button', 'link-button', text);
  button.type = 'button';
  button.addEventListener('click', () => openPlace(id));
  return button;
}

/** The village facts and the localities built on or beside it: only what the data has, each with its source. */
function factsSection(place: Place, all: readonly Place[], uid: string): HTMLElement | null {
  const f = place.facts;
  const built = all.filter((p) => p.facts?.localities?.some((l) => l.id === place.id));
  if (!f && built.length === 0) return null;
  const section = el('section', 'card__section');
  const heading = el('h3', '', place.kind === 'village' ? 'The village in 1948' : 'Facts');
  heading.id = `${uid}-facts`;
  section.setAttribute('aria-labelledby', heading.id);
  const list = el('ul', 'card__list');
  const row = (label: string, value: string, source?: string): HTMLElement => {
    const li = el('li');
    li.append(el('strong', '', `${label}: `), value);
    if (source) li.append(el('span', 'card__muted card__note', ` (${source})`));
    return li;
  };
  if (f?.subDistrict) list.append(row('Mandate sub-district', f.subDistrict));
  if (f?.occupied) list.append(row('Occupied', f.occupied.text, SOURCE_NAME[f.occupied.source]));
  if (f?.population) list.append(row(`Population in ${f.population.year}`, f.population.value.toLocaleString('en-US'), SOURCE_NAME[f.population.source]));
  if (f?.population1944) list.append(row(`Population in ${f.population1944.year}`, f.population1944.value.toLocaleString('en-US'), SOURCE_NAME[f.population1944.source]));
  if (f?.localities?.length) {
    const li = el('li');
    li.append(el('strong', '', 'Israeli locality on its land: '));
    f.localities.forEach((l, i) => {
      if (i > 0) li.append(', ');
      li.append(linkButton(l.name, l.id));
    });
    li.append(el('span', 'card__muted card__note', ' (named in the village entry of All That Remains; matched to our places by name and position)'));
    list.append(li);
  }
  if (built.length > 0) {
    const li = el('li');
    li.append(el('strong', '', 'Built on the land of: '));
    built.forEach((v, i) => {
      if (i > 0) li.append(', ');
      li.append(linkButton(v.names[0]?.en ?? v.id, v.id));
    });
    li.append(el('span', 'card__muted card__note', ' (All That Remains)'));
    list.append(li);
  }
  section.append(heading, list);
  return section;
}

export function renderPlaceCard(
  place: Place,
  year: number,
  events: readonly HistoricalEvent[],
  onSelectEvent: (event: HistoricalEvent) => void,
  allPlaces: readonly Place[] = [],
): Card {
  const uid = `place-${place.id}`;
  const article = el('article', 'card');
  article.setAttribute('aria-labelledby', `${uid}-title`);

  const meta = el('div', 'card__meta');
  meta.append(el('span', 'badge', KIND_LABEL[place.kind]));
  if (place.status === 'needs-review') {
    const review = el('span', 'tag tag--review', 'Under review');
    review.title = 'These names and dates have not yet been fully checked against their sources';
    meta.append(review);
  }

  const title = titleName(place, year);
  const heading = el('h2', 'card__title', title?.en ?? place.id);
  heading.id = `${uid}-title`;
  heading.tabIndex = -1;
  article.append(meta, heading);
  if (title?.ar) {
    const ar = el('p', 'card__place');
    const span = el('span', 'card__name', title.ar);
    span.lang = 'ar';
    span.dir = 'rtl';
    ar.append(span);
    article.append(ar);
  }

  const notes: string[] = [];
  if (place.group === 'settlement') notes.push('In the Settlements section: an Israeli locality or district, shown apart from the other places.');
  if (place.depopulated !== undefined) notes.push(`Depopulated in ${formatYear(place.depopulated, true)} (the year is approximate); the name is shown with "(depopulated)" after it.`);
  for (const text of notes) article.append(el('p', 'card__muted', text));

  const facts = factsSection(place, allPlaces, uid);
  if (facts) article.append(facts);

  const names = el('section', 'card__section');
  const namesHeading = el('h3', '', `Names through time (${place.names.length})`);
  namesHeading.id = `${uid}-names`;
  names.setAttribute('aria-labelledby', namesHeading.id);
  const nameList = el('ol', 'card__list place-names');
  for (const name of place.names) nameList.append(nameItem(name, year));
  names.append(namesHeading, nameList);
  article.append(names);

  const here = eventsAt(place, events);
  const eventsSection = el('section', 'card__section');
  const eventsHeading = el('h3', '', `Nearby events (${here.length})`);
  eventsHeading.id = `${uid}-events`;
  eventsSection.setAttribute('aria-labelledby', eventsHeading.id);
  eventsSection.append(eventsHeading);
  if (here.length === 0) {
    eventsSection.append(el('p', 'card__muted', `No events in the timeline within ${EVENT_RADIUS_KM} km.`));
  } else {
    const list = el('ul', 'card__list place-events');
    for (const event of here) {
      const button = el('button', 'link-button', event.title);
      button.type = 'button';
      button.addEventListener('click', () => onSelectEvent(event));
      const item = el('li');
      item.append(el('span', 'card__muted', `${formatYear(eventStartYear(event), true)} `), button);
      list.append(item);
    }
    eventsSection.append(list);
  }
  article.append(eventsSection, shareImageButton(() => placeCardData(place, year)), reportButton(`${title?.en ?? place.id} (place ${place.id})`));

  return { element: article, heading };
}
