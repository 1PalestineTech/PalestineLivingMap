// Manual theme toggle (docs/SPEC.md section 6): system, light or dark. The choice is saved
// in localStorage when it is available and sets data-theme on <html>; "system" removes it.
// With no saved choice the map opens in day mode.

type Theme = 'system' | 'light' | 'dark';
const ORDER: readonly Theme[] = ['system', 'light', 'dark'];
const KEY = 'theme';

function readSaved(): Theme {
  try {
    const saved = window.localStorage.getItem(KEY);
    // Day mode unless the reader has chosen night or "follow my device".
    return saved === 'dark' || saved === 'system' ? saved : 'light';
  } catch {
    return 'light';
  }
}

function apply(theme: Theme): void {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

/** Applies the saved choice at startup, before the first paint where possible. */
export function applySavedTheme(): void {
  apply(readSaved());
}

/** A button that cycles system, light and dark; used inside the About dialog. */
export function createThemeButton(): HTMLButtonElement {
  let theme = readSaved();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn';

  const label = (): void => {
    button.textContent = theme === 'system' ? 'Colour theme: follow my device' : `Colour theme: ${theme}`;
  };
  label();
  button.addEventListener('click', () => {
    theme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? 'system';
    apply(theme);
    label();
  });
  return button;
}

const isDark = (): boolean => {
  const set = document.documentElement.dataset['theme'];
  return set === 'dark' || (set !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

/**
 * The quick day / night switch in the top bar. It reads as "Night mode" (pressed when the night chart
 * is on) and always sets an explicit light or dark choice; "follow my device" stays in the About dialog.
 */
export function initThemeToggle(button: HTMLElement): void {
  const sync = (): void => {
    const dark = isDark();
    button.setAttribute('aria-pressed', String(dark));
    button.textContent = dark ? 'Day mode' : 'Night mode';
    button.setAttribute('aria-label', dark ? 'Switch to day mode' : 'Switch to night mode');
    button.dataset['glyph'] = dark ? '☀' : '☾';
  };
  sync();
  button.addEventListener('click', () => {
    apply(isDark() ? 'light' : 'dark');
    sync();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
