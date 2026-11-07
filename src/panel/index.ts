// Event story card: a side panel on desktop, a draggable bottom sheet on phones.
// Opens when selectedEventId is set (and no story is running); closes with the X, Escape,
// or a click on empty map. Modules: render.ts (content), siblings.ts (Prev/Next),
// sheet.ts (mobile drag and focus trap).

import { ESCAPE_PRIORITY, registerEscape } from '../escape.ts';
import type { ResolvedPath } from '../data/pathTypes.ts';
import type { Place } from '../data/placeTypes.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { renderPlaceCard } from '../labels/card.ts';
import { nameValidInYear } from '../data/places.ts';
import { buildHash } from '../urlHash.ts';
import { getState, setState, subscribe } from '../state.ts';
import { selectEvent } from '../timeline/navigate.ts';
import { renderCard } from './render.ts';
import type { Card, CardActions } from './render.ts';
import { MOBILE_QUERY, attachSheet, isMobileLayout, setSheetState, trapFocus } from './sheet.ts';
import { siblingsOf } from './siblings.ts';

function linkFor(event: HistoricalEvent): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${buildHash('', { event: event.id })}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API needs a secure context; fall back to a temporary textarea.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

export function initPanel(panel: HTMLElement, events: readonly HistoricalEvent[], places: readonly Place[] = [], paths: readonly ResolvedPath[] = []): void {
  const body = panel.querySelector<HTMLElement>('#panel-body');
  const closeButton = panel.querySelector<HTMLElement>('#panel-close');
  const grab = panel.querySelector<HTMLElement>('#panel-grab');
  if (!body || !closeButton || !grab) throw new Error('Panel markup is missing from index.html');

  const byId = new Map(events.map((e) => [e.id, e]));
  const placeById = new Map(places.map((p) => [p.id, p]));
  const pathByEvent = new Map(paths.map((p) => [p.eventId, p]));
  let shownId: string | null = null;
  let opener: HTMLElement | null = null;

  const close = (): void => setState({ selectedEventId: null, selectedPlaceId: null });
  closeButton.addEventListener('click', close);
  attachSheet(panel, grab, close);

  registerEscape({ priority: ESCAPE_PRIORITY.panel, isOpen: () => !panel.hidden, close });
  panel.addEventListener('keydown', (e) => {
    if (isMobileLayout()) trapFocus(panel, e);
  });

  const actions: CardActions = {
    onSelect: selectEvent,
    onCopyLink: (event) => copyText(linkFor(event)),
  };

  function applyLayoutRole(): void {
    if (panel.hidden || !isMobileLayout()) {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
    } else {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
    }
  }
  window.matchMedia(MOBILE_QUERY).addEventListener('change', applyLayoutRole);

  function show(key: string, build: () => Card): void {
    const wasHidden = panel.hidden;
    if (wasHidden) {
      const active = document.activeElement;
      opener = active instanceof HTMLElement && active !== document.body ? active : null;
    }
    const card = build();
    body!.replaceChildren(card.element);
    body!.scrollTop = 0;
    panel.hidden = false;
    if (wasHidden) setSheetState(panel, 'peek');
    applyLayoutRole();
    shownId = key;
    card.heading.focus({ preventScroll: true });
  }

  function hide(restoreFocus: boolean): void {
    if (panel.hidden) return;
    panel.hidden = true;
    shownId = null;
    body!.replaceChildren();
    applyLayoutRole();
    if (!restoreFocus) return;
    const target = opener?.isConnected ? opener : document.querySelector<HTMLElement>('.maplibregl-canvas');
    target?.focus({ preventScroll: true });
    opener = null;
  }

  /** The open place card marks the names in use "now"; redraw it (keeping scroll and focus) when that changes. */
  const inUse = (place: Place, year: number): string => place.names.map((n) => (nameValidInYear(n, year) ? 1 : 0)).join('');
  let shownUse = '';
  function refreshPlaceCard(year: number): void {
    const place = shownId?.startsWith('place:') ? placeById.get(shownId.slice(6)) : undefined;
    if (!place || inUse(place, year) === shownUse) return;
    shownUse = inUse(place, year);
    const top = body!.scrollTop;
    body!.replaceChildren(renderPlaceCard(place, year, events, selectEvent, places).element);
    body!.scrollTop = top;
  }

  function sync(): void {
    const { selectedEventId, selectedPlaceId, story } = getState();
    const event = selectedEventId === null ? undefined : byId.get(selectedEventId);
    const place = selectedPlaceId === null ? undefined : placeById.get(selectedPlaceId);
    if (event && story === null) {
      if (shownId !== `event:${event.id}`) show(`event:${event.id}`, () => renderCard(event, siblingsOf(events, event), actions, pathByEvent.get(event.id)));
    } else if (place && story === null) {
      if (shownId !== `place:${place.id}`) {
        shownUse = inUse(place, getState().currentYear);
        show(`place:${place.id}`, () => renderPlaceCard(place, getState().currentYear, events, selectEvent, places));
      }
    } else {
      hide(story === null);
    }
  }

  subscribe((state, previous) => {
    if (state.currentYear !== previous.currentYear) refreshPlaceCard(state.currentYear);
    if (
      state.selectedEventId !== previous.selectedEventId ||
      state.selectedPlaceId !== previous.selectedPlaceId ||
      state.story !== previous.story
    ) {
      sync();
    }
  });
  sync();
}
