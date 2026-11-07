// "Report a mistake", "Add a missing village" and "Copy link to this view". Reports use one plain format (what the owner asked for):
// the place or event, what is wrong or missing, and a source link. Where a report goes is set when the site is built:
//   VITE_FEEDBACK_POST_URL  an endpoint that takes a POST of JSON {subject, text, link} (for example a small function that forwards
//                           to a Discord webhook); the reader sees "Thank you, your report was sent".
//   VITE_FEEDBACK_URL       mailto:you@example.org   opens the reader's mail app with the report filled in;
//                           https://...              is opened after the report is copied; the address may contain {subject} and {text},
//                           which are filled in (for example a pre-filled Google Form link).
// With none set, the report is only copied, and the reader is told to paste it in the map channel. See docs/DEPLOY.md.

import { el } from './dom.ts';

const FEEDBACK_URL: string = (import.meta.env.VITE_FEEDBACK_URL as string | undefined) ?? '';
const FEEDBACK_POST_URL: string = (import.meta.env.VITE_FEEDBACK_POST_URL as string | undefined) ?? '';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

/** The address of the map as it is now: year, open card, story and layers are all in the hash. */
export const currentLink = (): string => window.location.href;

export function reportText(subject: string, link: string, extra: readonly string[] = ['What is wrong or missing: ', 'Source link: ']): string {
  return [`Map report: ${subject}`, `Link: ${link}`, ...extra].join('\n');
}

/** Sends a report the way the build is set up, and says in words what happened. */
export async function submitReport(subject: string, text: string): Promise<string> {
  if (FEEDBACK_POST_URL !== '') {
    try {
      const response = await fetch(FEEDBACK_POST_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, text, link: currentLink() }) });
      if (response.ok) return 'Thank you: your report was sent.';
    } catch {
      // Fall through to the copy route below.
    }
  }
  if (FEEDBACK_URL.startsWith('mailto:')) {
    window.location.href = `${FEEDBACK_URL}?subject=${encodeURIComponent(`Map report: ${subject}`)}&body=${encodeURIComponent(text)}`;
    return 'Your mail app should open with the report filled in.';
  }
  const copied = await copyText(text);
  if (FEEDBACK_URL.startsWith('http')) {
    const url = FEEDBACK_URL.replaceAll('{subject}', encodeURIComponent(subject)).replaceAll('{text}', encodeURIComponent(text));
    window.open(url, '_blank', 'noopener');
  }
  return copied ? 'Report copied: paste it in the map channel and fill in the last lines.' : 'Could not copy; please describe the mistake and the place or event.';
}

/** A "Report a mistake" button for a card about `subject` (for example "Hunin (place)"). */
export function reportButton(subject: string): HTMLElement {
  const wrap = el('p', 'card__report');
  const button = el('button', 'btn', 'Report a mistake');
  button.type = 'button';
  const status = el('span', 'sr-only');
  status.setAttribute('role', 'status');
  const note = el('span', 'card__muted');
  button.addEventListener('click', () => {
    void submitReport(subject, reportText(subject, currentLink())).then((message) => {
      note.textContent = ` ${message}`;
      status.textContent = message;
    });
  });
  wrap.append(button, status, note);
  return wrap;
}
