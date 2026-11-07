// About dialog (docs/SPEC.md Phase 9A). Loaded on first use so it stays out of the main bundle.

import { el } from '../dom.ts';
import { embedCode } from '../embed.ts';
import { copyText } from '../feedback.ts';
import { openMissingVillage } from '../missingVillage.ts';
import { createThemeButton } from '../theme.ts';
import { openWhatsNew } from '../whatsNew.ts';

let dialog: HTMLDialogElement | null = null;

function build(): HTMLDialogElement {
  const node = el('dialog', 'about');
  node.setAttribute('aria-labelledby', 'about-title');

  const title = el('h2', 'about__title', 'About this map');
  title.id = 'about-title';

  const intro = el(
    'p',
    '',
    'An interactive timeline of Palestinian history. Scrub through the years, see where events happened, and open a card to read what the sources say.',
  );
  const status = el(
    'p',
    '',
    'This is a work in progress. Every event is still marked "needs review", and a card lists the sources it relies on. Where accounts differ, the card shows each view with its source.',
  );
  const basemap = el(
    'p',
    '',
    'The background map shows present-day names and boundaries. Locations for older events are approximate, and country-wide events are drawn as soft circles.',
  );

  const close = el('button', 'btn btn--primary', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => node.close());
  node.addEventListener('click', (event) => {
    if (event.target === node) node.close();
  });

  const themeRow = el('p', '');
  themeRow.append(createThemeButton());

  const toolsRow = el('p', '');
  const embedButton = el('button', 'btn', 'Copy embed code');
  embedButton.type = 'button';
  embedButton.addEventListener('click', () => {
    void copyText(embedCode()).then((ok) => {
      embedButton.textContent = ok ? 'Embed code copied' : 'Copy failed';
      window.setTimeout(() => { embedButton.textContent = 'Copy embed code'; }, 2500);
    });
  });
  const missingButton = el('button', 'btn', 'Add a missing village');
  missingButton.type = 'button';
  missingButton.addEventListener('click', () => { node.close(); openMissingVillage(); });
  const newsButton = el('button', 'btn', "What's new");
  newsButton.type = 'button';
  newsButton.addEventListener('click', () => { node.close(); void openWhatsNew(); });
  toolsRow.append(newsButton, ' ', missingButton, ' ', embedButton);
  const discord = (import.meta.env.VITE_DISCORD_URL as string | undefined) ?? '';
  if (discord.startsWith('http')) {
    const join = el('a', 'btn', 'Join the discussion');
    join.href = discord;
    join.target = '_blank';
    join.rel = 'noopener';
    toolsRow.append(' ', join);
  }

  node.append(title, intro, status, basemap, themeRow, toolsRow, close);
  document.body.append(node);
  return node;
}

export function openAbout(): void {
  dialog ??= build();
  dialog.showModal();
}
