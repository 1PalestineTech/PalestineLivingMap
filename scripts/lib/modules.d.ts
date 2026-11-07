// Minimal types for the untyped packages the build scripts use.

declare module '@mapbox/tiny-sdf' {
  export interface TinySdfGlyph {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    glyphWidth: number;
    glyphHeight: number;
    glyphTop: number;
    glyphLeft: number;
    glyphAdvance: number;
  }
  export default class TinySDF {
    constructor(options?: {
      fontSize?: number;
      buffer?: number;
      radius?: number;
      cutoff?: number;
      fontFamily?: string;
      fontWeight?: string;
      fontStyle?: string;
    });
    draw(char: string): TinySdfGlyph;
  }
}

declare module 'opentype.js' {
  interface Font {
    charToGlyphIndex(char: string): number;
  }
  const opentype: { parse(buffer: ArrayBuffer): Font };
  export default opentype;
  export type { Font };
}
