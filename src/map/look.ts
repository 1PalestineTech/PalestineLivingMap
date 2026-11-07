// The two map "strengths" from docs/SPEC_MAP_V2.md open question 3. Change MAP_STYLE_STRENGTH
// to switch the whole look. In development, ?look=subtle or ?look=strong overrides it.
//
//   subtle: tinted terrain, soft shading, one ripple line, light grain.
//   inked:  yellowed parchment, colour washes, plates and house sprites, curved region names, roads.
//   strong: near-monochrome sepia, wave-stroke sea with a dark coastal stain, hachure relief
//           marks, three ripple lines, heavier grain and vignette (the "old-map" look).

export type StyleStrength = 'subtle' | 'strong' | 'inked';

/**
 * The look used when the reader has not chosen one. `inked` is the hand-inked fantasy-map look (owner request,
 * 2026-11-04: yellowed parchment, colour washes, plates and house sprites, curved region names, roads);
 * `strong` is the earlier painted old-map look, still available from the map controls.
 */
export const MAP_STYLE_STRENGTH: StyleStrength = 'strong';

export interface StrengthParams {
  /** How far elevation tints are pulled toward paper: 0 keeps full colour, 1 is flat paper. */
  tintMix: number;
  reliefOpacity: number;
  /** Hillshade intensity, 0-1. */
  shade: number;
  /** Ripple lines offset into the sea (1 or 3). */
  ripples: 1 | 3;
  coastWidth: number;
  /** How far the sea is darkened toward ink, so the land reads lighter than the water. */
  seaDarken: number;
  /** Opacity of the dark coastal stain; 0 turns it off. */
  stain: number;
  /** Rows of ink wave strokes over the sea. */
  waves: boolean;
  /** Hachure marks on hills and mountains. */
  marks: boolean;
}

const STRENGTHS: Record<StyleStrength, StrengthParams> = {
  subtle: { tintMix: 0.1, reliefOpacity: 0.9, shade: 0.4, ripples: 1, coastWidth: 1.2, seaDarken: 0, stain: 0, waves: false, marks: false },
  strong: { tintMix: 0.82, reliefOpacity: 0.85, shade: 0.3, ripples: 3, coastWidth: 1.6, seaDarken: 0.2, stain: 0.7, waves: true, marks: true },
  inked: { tintMix: 0.3, reliefOpacity: 0.8, shade: 0.22, ripples: 3, coastWidth: 1.9, seaDarken: 0.05, stain: 0.45, waves: true, marks: true },
};

const LOOK_KEY = 'look';

/** The reader's saved choice between the inked look and the earlier painted one, if any. */
export function savedLook(): 'inked' | 'strong' | null {
  try {
    const saved = window.localStorage.getItem(LOOK_KEY);
    return saved === 'inked' || saved === 'strong' ? saved : null;
  } catch {
    return null;
  }
}

export function saveLook(look: 'inked' | 'strong'): void {
  try {
    window.localStorage.setItem(LOOK_KEY, look);
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

export function activeStrength(): StyleStrength {
  if (import.meta.env.DEV) {
    const asked = new URLSearchParams(window.location.search).get('look');
    if (asked === 'subtle' || asked === 'strong' || asked === 'inked') return asked;
  }
  return savedLook() ?? MAP_STYLE_STRENGTH;
}

export function strengthParams(): StrengthParams {
  return STRENGTHS[activeStrength()];
}
