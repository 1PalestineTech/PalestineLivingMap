// Tiny DOM helpers. Text is always set with textContent, never innerHTML, so event data
// can't inject markup.

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className !== '') node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** An <a> that opens in a new tab, or plain text if the URL isn't a safe http(s) link. */
export function externalLink(href: string, text: string): HTMLElement {
  const safe = safeHttpUrl(href);
  if (safe === null) return el('span', '', text);
  const link = el('a', '', text);
  link.href = safe;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

/** Returns the URL if it is an absolute http(s) URL, else null (blocks javascript:, data:, etc.). */
export function safeHttpUrl(text: string): string | null {
  try {
    const url = new URL(text);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

/** Like safeHttpUrl but also lets relative paths through (resolved against the page). */
export function safeImageSrc(text: string, base: string = window.location.href): string | null {
  try {
    const url = new URL(text, base);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}
