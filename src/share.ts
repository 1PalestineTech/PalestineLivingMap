// The Share button: copies the address of the map as it is now (year, open card, story, layers and filters are all kept in the
// address), or opens the phone's share sheet where there is one.

import { copyText, currentLink } from './feedback.ts';

export function initShareButton(button: HTMLElement): void {
  const label = button.textContent ?? 'Share';
  const status = document.createElement('span');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  button.after(status);
  let timer = 0;
  const flash = (text: string): void => {
    button.textContent = text;
    status.textContent = text;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.textContent = label;
    }, 2200);
  };
  button.addEventListener('click', () => {
    const url = currentLink();
    if (typeof navigator.share === 'function' && window.matchMedia('(max-width: 599px)').matches) {
      void navigator.share({ title: document.title, url }).catch(() => undefined);
      return;
    }
    void copyText(url).then((ok) => flash(ok ? 'Link copied' : 'Copy failed'));
  });
}
