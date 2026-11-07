// Zoom (+/-) and "reset view" controls. Both are real <button>s, so they are keyboard
// accessible and announced by screen readers.

import { NavigationControl } from 'maplibre-gl';
import type { IControl, Map as MapLibreMap } from 'maplibre-gl';

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class ResetViewControl implements IControl {
  private container: HTMLElement | null = null;

  constructor(private readonly resetView: (animate: boolean) => void) {}

  onAdd(): HTMLElement {
    const group = document.createElement('div');
    group.className = 'maplibregl-ctrl maplibregl-ctrl-group';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-reset-button';
    button.title = 'Reset view';
    button.setAttribute('aria-label', 'Reset map view to all of Palestine');
    button.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    button.addEventListener('click', () => this.resetView(!prefersReducedMotion()));

    group.append(button);
    this.container = group;
    return group;
  }

  onRemove(): void {
    this.container?.remove();
    this.container = null;
  }
}

class ViewModeControl implements IControl {
  private container: HTMLElement | null = null;

  constructor(
    private readonly getMode: () => 'tilted' | 'flat',
    private readonly toggle: () => void,
  ) {}

  onAdd(): HTMLElement {
    const group = document.createElement('div');
    group.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-view-button';
    const sync = (): void => {
      const tilted = this.getMode() === 'tilted';
      button.setAttribute('aria-pressed', String(tilted));
      button.title = tilted ? 'Switch to the flat view' : 'Switch to the tilted view';
      button.setAttribute('aria-label', button.title);
      button.innerHTML = tilted
        ? '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M3 18l4-9h10l4 9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M5.5 13h13" stroke="currentColor" stroke-width="1.5"/></svg>'
        : '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 12h16M12 4v16" stroke="currentColor" stroke-width="1.2"/></svg>';
    };
    button.addEventListener('click', () => {
      this.toggle();
      sync();
    });
    sync();
    group.append(button);
    this.container = group;
    return group;
  }

  onRemove(): void {
    this.container?.remove();
    this.container = null;
  }
}

class LookControl implements IControl {
  private container: HTMLElement | null = null;

  constructor(
    private readonly current: 'inked' | 'strong',
    private readonly choose: (look: 'inked' | 'strong') => void,
  ) {}

  onAdd(): HTMLElement {
    const group = document.createElement('div');
    group.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-look-button';
    const inked = this.current === 'inked';
    button.title = inked ? 'Switch to the painted look' : 'Switch to the inked look';
    button.setAttribute('aria-label', button.title);
    button.setAttribute('aria-pressed', String(inked));
    // A quill nib for the inked look, a brush for the painted one.
    button.innerHTML = inked
      ? '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M4 20l3-1 11-11-2-2L5 17z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 6l2 2" stroke="currentColor" stroke-width="2"/></svg>'
      : '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M5 19c4 0 3-4 6-4l7-8-2-2-8 7c0 3-4 2-3 7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
    button.addEventListener('click', () => this.choose(inked ? 'strong' : 'inked'));
    group.append(button);
    this.container = group;
    return group;
  }

  onRemove(): void {
    this.container?.remove();
    this.container = null;
  }
}

export function addControls(
  map: MapLibreMap,
  resetView: (animate: boolean) => void,
  view?: { getMode: () => 'tilted' | 'flat'; toggle: () => void },
  look?: { current: 'inked' | 'strong'; choose: (look: 'inked' | 'strong') => void },
): void {
  map.addControl(new NavigationControl({ showCompass: false, visualizePitch: false }), 'top-right');
  map.addControl(new ResetViewControl(resetView), 'top-right');
  if (view) map.addControl(new ViewModeControl(view.getMode, view.toggle), 'top-right');
  if (look) map.addControl(new LookControl(look.current, look.choose), 'top-right');
}
