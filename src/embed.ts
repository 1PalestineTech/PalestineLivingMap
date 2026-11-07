// Embed mode: ?embed=1 shows the map without the top bar so another website can put it in a frame, for example
// https://example.org/map/?embed=1#story=intro-to-palestine . ?timeline=0 also hides the timeline. The reader gets a link to the full map.
// A plain embedded visit does not open the short tour on its own; a link with story= in it does.

import { el } from './dom.ts';

const params = (): URLSearchParams => new URLSearchParams(window.location.search);

export const isEmbedded = (): boolean => params().get('embed') === '1';

export function initEmbed(): void {
  if (!isEmbedded()) return;
  const root = document.documentElement;
  root.dataset['embed'] = '';
  if (params().get('timeline') === '0') root.dataset['embedNoTimeline'] = '';
  const full = new URL(window.location.href);
  full.searchParams.delete('embed');
  full.searchParams.delete('timeline');
  const link = el('a', 'embed-link', 'Open the full map');
  link.href = full.href;
  link.target = '_blank';
  link.rel = 'noopener';
  document.getElementById('map')?.append(link);
}

/** An iframe snippet for the current view (year, card, story and layers are in the address). */
export function embedCode(): string {
  const url = new URL(window.location.href);
  url.searchParams.set('embed', '1');
  return `<iframe src="${url.href}" width="100%" height="640" style="border:0" loading="lazy" title="Palestine: A Living Map" allow="clipboard-write; fullscreen"></iframe>`;
}
