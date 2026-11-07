// "What's new": a short list of changes from public/data/whatsnew.json, newest first, so testers can see what happened after their
// feedback. A small dot on the About button shows when there is an entry the reader has not seen.

import { el } from './dom.ts';

interface Entry {
  id: string;
  date: string;
  title: string;
  text: string;
}

const KEY = 'seenNews';
let dialog: HTMLDialogElement | null = null;
let cache: Entry[] | null = null;

async function load(): Promise<Entry[]> {
  if (cache) return cache;
  try {
    const response = await fetch(new URL('data/whatsnew.json', document.baseURI).href);
    const data = (await response.json()) as { entries?: Entry[] };
    cache = Array.isArray(data.entries) ? data.entries : [];
  } catch {
    cache = [];
  }
  return cache;
}

const seen = (): string => {
  try {
    return window.localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
};

function markSeen(id: string): void {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    // Storage can be blocked.
  }
}

export async function openWhatsNew(): Promise<void> {
  const entries = await load();
  const box = dialog ?? el('dialog', 'about whats-new');
  if (!dialog) {
    dialog = box;
    box.setAttribute('aria-labelledby', 'news-title');
    box.addEventListener('click', (event) => {
      if (event.target === box) box.close();
    });
    document.body.append(box);
  }
  const title = el('h2', 'about__title', "What's new");
  title.id = 'news-title';
  const list = el('ul', 'card__list');
  for (const entry of entries) {
    const item = el('li');
    item.append(el('strong', '', `${entry.date}: ${entry.title}`), el('br'), entry.text);
    list.append(item);
  }
  const close = el('button', 'btn btn--primary', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => box.close());
  box.replaceChildren(title, entries.length > 0 ? list : el('p', '', 'Nothing to show yet.'), close);
  box.showModal();
  const first = entries[0];
  if (first) markSeen(first.id);
  document.getElementById('about-button')?.classList.remove('has-news');
}

/** Puts a dot on the About button when the newest entry has not been seen. */
export async function initWhatsNewBadge(): Promise<void> {
  const entries = await load();
  const first = entries[0];
  if (first && seen() !== first.id) document.getElementById('about-button')?.classList.add('has-news');
}
