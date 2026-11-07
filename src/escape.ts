// One Escape handler for the whole app, so the innermost layer closes first
// (docs/SPEC.md section 4: search suggestions, filter sheet, event panel, story mode).
// Each layer registers itself; the lowest priority number that is open handles the key.

export const ESCAPE_PRIORITY = {
  search: 0,
  filters: 1,
  panel: 2,
  story: 3,
} as const;

export interface EscapeLayer {
  priority: number;
  isOpen(): boolean;
  close(): void;
}

const layers: EscapeLayer[] = [];
let listening = false;

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.defaultPrevented) return;
  const open = layers.filter((layer) => layer.isOpen()).sort((a, b) => a.priority - b.priority)[0];
  if (!open) return;
  event.preventDefault();
  open.close();
}

export function registerEscape(layer: EscapeLayer): void {
  layers.push(layer);
  if (!listening) {
    listening = true;
    document.addEventListener('keydown', onKeydown);
  }
}
