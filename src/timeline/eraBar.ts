// Era preset buttons above the track. Clicking one animates the handle to the era's start,
// sets the era, and asks the map to fit that era's bounds.

import { ERAS } from '../data/eras.ts';
import type { EraId } from '../data/eras.ts';
import { fitToBounds } from '../map/camera.ts';
import { goToYear } from './navigate.ts';

export interface EraBar {
  element: HTMLElement;
  setActive(era: EraId | null): void;
}

export function createEraBar(): EraBar {
  const element = document.createElement('div');
  element.className = 'eras';
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', 'Jump to an era');

  const buttons = new Map<EraId, HTMLButtonElement>();
  for (const era of ERAS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'era-button';
    button.textContent = era.label;
    button.addEventListener('click', () => {
      fitToBounds(era.bounds);
      goToYear(era.start);
    });
    buttons.set(era.id, button);
    element.append(button);
  }

  return {
    element,
    setActive(active) {
      for (const [id, button] of buttons) {
        if (id === active) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      }
    },
  };
}
