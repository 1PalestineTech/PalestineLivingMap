// "Add a missing village": a short form that turns into the same plain report as "Report a mistake" (see src/feedback.ts), so it
// reaches the owner's review queue with a source link. Nothing is added to the map by itself.

import { el } from './dom.ts';
import { currentLink, reportText, submitReport } from './feedback.ts';

let dialog: HTMLDialogElement | null = null;

function field(label: string, hint: string, multiline = false, required = false): { wrap: HTMLElement; input: HTMLInputElement | HTMLTextAreaElement } {
  const wrap = el('p', 'form__field');
  const id = `missing-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  const lab = el('label', '', required ? `${label} (required)` : label);
  lab.setAttribute('for', id);
  const input = multiline ? el('textarea') : el('input');
  input.id = id;
  if (input instanceof HTMLInputElement) input.type = 'text';
  if (input instanceof HTMLTextAreaElement) input.rows = 3;
  input.required = required;
  input.placeholder = hint;
  wrap.append(lab, input);
  return { wrap, input };
}

function build(): HTMLDialogElement {
  const node = el('dialog', 'about missing');
  node.setAttribute('aria-labelledby', 'missing-title');
  const title = el('h2', 'about__title', 'Add a missing village');
  title.id = 'missing-title';
  const intro = el('p', '', 'Tell us about a village or place that is missing from the map. We check every report against its source before anything is added.');
  const name = field('Name in English letters', 'for example al-Bassa', false, true);
  const arabic = field('Name in Arabic', 'optional');
  const where = field('Where', 'sub-district or nearest town, and coordinates if you know them');
  const know = field('What we should know', 'what happened and when, population, anything else', true);
  const source = field('Source link', 'a web page, book title and page, or document', false, true);
  const status = el('p', 'form__status');
  status.setAttribute('role', 'status');
  const send = el('button', 'btn btn--primary', 'Send report');
  send.type = 'button';
  const close = el('button', 'btn', 'Close');
  close.type = 'button';
  close.addEventListener('click', () => node.close());
  send.addEventListener('click', () => {
    if (name.input.value.trim() === '' || source.input.value.trim() === '') {
      status.textContent = 'Please fill in the name and the source link.';
      return;
    }
    const text = reportText(`Missing village: ${name.input.value.trim()}`, currentLink(), [
      `Name: ${name.input.value.trim()}`,
      `Arabic name: ${arabic.input.value.trim()}`,
      `Where: ${where.input.value.trim()}`,
      `What we know: ${know.input.value.trim()}`,
      `Source link: ${source.input.value.trim()}`,
    ]);
    send.disabled = true;
    void submitReport(`Missing village: ${name.input.value.trim()}`, text).then((message) => {
      status.textContent = message;
      send.disabled = false;
    });
  });
  node.addEventListener('click', (event) => {
    if (event.target === node) node.close();
  });
  const buttons = el('p', '');
  buttons.append(send, ' ', close);
  node.append(title, intro, name.wrap, arabic.wrap, where.wrap, know.wrap, source.wrap, status, buttons);
  document.body.append(node);
  return node;
}

export function openMissingVillage(): void {
  dialog ??= build();
  dialog.showModal();
}
