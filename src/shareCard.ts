// "Share as image": draws a card picture (1200 x 630) with the name, the Arabic name and a few key facts, and shares or downloads it
// so it can be posted in a chat. Drawn in the browser with canvas, nothing is uploaded.

import { formatEventDate, formatYear } from './data/format.ts';
import type { Place } from './data/placeTypes.ts';
import type { HistoricalEvent } from './data/types.ts';
import { el } from './dom.ts';
import { copyText, currentLink } from './feedback.ts';

export interface ShareCardData {
  kind: string;
  title: string;
  arabic: string | null;
  lines: string[];
  footer: string;
}

const W = 1200;
const H = 630;

function wrap(g: CanvasRenderingContext2D, text: string, width: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line === '' ? word : `${line} ${word}`;
    if (g.measureText(next).width > width && line !== '') {
      lines.push(line);
      line = word;
    } else line = next;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line !== '') lines.push(line);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) lines[maxLines - 1] = `${(lines[maxLines - 1] ?? '').replace(/[ ,.;:]+$/, '')}...`;
  return lines;
}

async function loadPicture(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = new URL('basemap/illustrated.webp', document.baseURI).href;
  });
}

export async function drawShareCard(data: ShareCardData): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#efe3c2';
  g.fillRect(0, 0, W, H);
  const picture = await loadPicture();
  if (picture) {
    g.globalAlpha = 0.55;
    const sh = Math.round((picture.width * H) / (W * 0.34));
    g.drawImage(picture, 0, Math.round(picture.height * 0.4), picture.width, sh, W * 0.68, 0, W * 0.32, H);
    g.globalAlpha = 1;
    const fade = g.createLinearGradient(W * 0.62, 0, W * 0.75, 0);
    fade.addColorStop(0, 'rgba(239,227,194,1)');
    fade.addColorStop(1, 'rgba(239,227,194,0)');
    g.fillStyle = fade;
    g.fillRect(W * 0.62, 0, W * 0.13, H);
  }
  g.fillStyle = '#8c3b2e';
  g.fillRect(60, 60, 8, 90);
  g.fillStyle = '#6b5a40';
  g.font = '600 26px Arial, sans-serif';
  g.textBaseline = 'alphabetic';
  g.fillText(data.kind.toUpperCase(), 90, 90);
  g.fillStyle = '#2b2117';
  g.font = '600 66px Georgia, "Times New Roman", serif';
  const titleLines = wrap(g, data.title, 700, 2);
  titleLines.forEach((line, i) => g.fillText(line, 90, 150 + i * 74));
  let y = 150 + titleLines.length * 74;
  if (data.arabic) {
    g.font = '600 54px "IBM Plex Sans Arabic", "Segoe UI", Arial, sans-serif';
    g.direction = 'rtl';
    g.textAlign = 'left';
    g.fillStyle = '#4a3b27';
    g.fillText(data.arabic, 90, y + 8);
    g.direction = 'ltr';
    y += 70;
  }
  g.fillStyle = '#3b2f20';
  g.font = '30px Arial, sans-serif';
  y += 24;
  for (const text of data.lines.slice(0, 5)) {
    const lines = wrap(g, text, 720, 2);
    for (const line of lines) {
      g.fillText(line, 90, y);
      y += 40;
    }
  }
  g.fillStyle = '#6b5a40';
  g.font = '24px Arial, sans-serif';
  g.fillText(data.footer, 90, H - 44);
  g.fillStyle = '#2b2117';
  g.font = '600 26px Georgia, serif';
  g.textAlign = 'right';
  g.fillText('Palestine: A Living Map', W - 50, H - 44);
  g.textAlign = 'left';
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}

const fileName = (title: string): string => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'card'}.png`;

/** Shares the picture (a phone's share sheet) or downloads it and copies the link; returns what happened in words. */
export async function shareCardImage(data: ShareCardData): Promise<string> {
  const blob = await drawShareCard(data);
  if (!blob) return 'Could not make the picture.';
  const file = new File([blob], fileName(data.title), { type: 'image/png' });
  const link = currentLink();
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: data.title, text: link });
      return 'Shared.';
    } catch {
      return 'Sharing was cancelled.';
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  const copied = await copyText(link);
  return copied ? 'Picture saved, and the link is copied.' : 'Picture saved.';
}

export function placeCardData(place: Place, year: number): ShareCardData {
  const now = place.names.find((n) => n.from !== null && (n.to === null || n.to >= year) && n.from <= year) ?? place.names[0];
  const f = place.facts;
  const lines: string[] = [];
  if (f?.subDistrict) lines.push(`Mandate sub-district: ${f.subDistrict}`);
  if (f?.occupied) lines.push(`Occupied: ${f.occupied.text}`);
  if (f?.population) lines.push(`Population in ${f.population.year}: ${f.population.value.toLocaleString('en-US')}`);
  else if (f?.population1944) lines.push(`Population in ${f.population1944.year}: ${f.population1944.value.toLocaleString('en-US')}`);
  if (place.depopulated !== undefined) lines.push(`Depopulated in ${formatYear(place.depopulated, true)}`);
  if (f?.localities?.length) lines.push(`Israeli locality on its land: ${f.localities.map((l) => l.name).join(', ')}`);
  return {
    kind: place.kind === 'village' ? 'Village' : place.kind,
    title: now?.en ?? place.id,
    arabic: now?.ar ?? null,
    lines,
    footer: 'Sources: see the card. Needs review.',
  };
}

export function eventCardData(event: HistoricalEvent): ShareCardData {
  return {
    kind: event.category.replace(/-/g, ' '),
    title: event.title,
    arabic: event.location.nameAr ?? null,
    lines: [formatEventDate(event), event.location.name, event.summary],
    footer: 'Sources: see the card. Needs review.',
  };
}

/** The button shown on cards. */
export function shareImageButton(make: () => ShareCardData): HTMLElement {
  const wrap = el('span', 'card__share-image');
  const button = el('button', 'btn', 'Share as image');
  button.type = 'button';
  const status = el('span', 'sr-only');
  status.setAttribute('role', 'status');
  button.addEventListener('click', () => {
    button.disabled = true;
    void shareCardImage(make()).then((message) => {
      status.textContent = message;
      button.textContent = message.startsWith('Picture saved') ? 'Picture saved' : 'Share as image';
      button.disabled = false;
    });
  });
  wrap.append(button, status);
  return wrap;
}
