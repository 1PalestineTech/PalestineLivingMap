// Generates the map's self-hosted glyph files (SDF glyphs in the Mapbox/MapLibre PBF format) for
// Almendra (hand-lettered Latin) and IBM Plex Sans Arabic. Run by hand: npm run build:glyphs -- --fonts DIR
//
// DIR holds the OFL-licensed TTF files (see docs/GLYPHS.md for where they come from). Output goes
// to public/glyphs/{font stack}/{start}-{end}.pbf. Nothing is downloaded by this script.
// The SDF settings (24 px, 3 px border, radius 8, cutoff 0.25) are the ones MapLibre's own glyphs
// use, and `top` is stored the way those files store it: the glyph's height above the baseline
// minus 26 (checked against the Noto Sans glyphs the basemap uses).

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import TinySDF from '@mapbox/tiny-sdf';
import opentype from 'opentype.js';

const FONT_SIZE = 24;
const BUFFER = 3;
/** Stored `top` = height above the baseline - TOP_BASE, matching the glyph files the basemap uses. */
const TOP_BASE = 26;

/** TTF files by short name, in the folder passed with --fonts. */
const FILES = {
  'Almendra Regular': 'Almendra-Regular.ttf',
  'Almendra Bold': 'Almendra-Bold.ttf',
  'Almendra Italic': 'Almendra-Italic.ttf',
  'IBM Plex Sans Arabic Regular': 'IBMPlexSansArabic-Regular.ttf',
  'IBM Plex Sans Arabic Medium': 'IBMPlexSansArabic-Medium.ttf',
} as const;
type FontName = keyof typeof FILES;

/**
 * The `text-font` lists the map uses (FONT in src/map/glyphs.ts). MapLibre requests each list as one
 * comma-joined stack, so each gets a merged folder: the first font wins for glyphs both have.
 */
const STACKS: readonly (readonly FontName[])[] = [
  ['Almendra Bold', 'IBM Plex Sans Arabic Medium'],
  ['Almendra Regular', 'IBM Plex Sans Arabic Regular'],
  ['Almendra Italic', 'IBM Plex Sans Arabic Regular'],
];

/**
 * 256-code-point ranges the map can ask for: Latin (with extensions), general punctuation, Arabic
 * and its supplement and extended blocks, and the Arabic presentation forms that MapLibre's
 * built-in shaping turns joined letters into (U+FB50-FDFF and U+FE70-FEFF).
 */
const RANGE_STARTS = [0, 256, 512, 1536, 1792, 2048, 8192, 64256, 64512, 64768, 65024];

function argValue(name: string): string | undefined {
  const at = process.argv.indexOf(name);
  return at === -1 ? undefined : process.argv[at + 1];
}

// A tiny protobuf writer: just varints, zigzag varints and length-delimited fields.
function varint(n: number): number[] {
  const out: number[] = [];
  let v = n >>> 0;
  while (v > 127) {
    out.push((v & 127) | 128);
    v >>>= 7;
  }
  out.push(v);
  return out;
}
const zigzag = (n: number): number => (n << 1) ^ (n >> 31);
const key = (field: number, wire: number): number[] => varint((field << 3) | wire);
const bytesField = (field: number, data: ArrayLike<number>): number[] => [...key(field, 2), ...varint(data.length), ...Array.from(data)];
const stringField = (field: number, text: string): number[] => bytesField(field, Buffer.from(text, 'utf8'));
const numberField = (field: number, n: number): number[] => [...key(field, 0), ...varint(n)];

interface GlyphData {
  id: number;
  bitmap: Uint8ClampedArray;
  width: number;
  height: number;
  left: number;
  top: number;
  advance: number;
}

function encodeGlyph(g: GlyphData): number[] {
  const body = [
    ...numberField(1, g.id),
    ...(g.width > 0 && g.height > 0 ? bytesField(2, g.bitmap) : []),
    ...numberField(3, g.width),
    ...numberField(4, g.height),
    ...numberField(5, zigzag(g.left)),
    ...numberField(6, zigzag(g.top)),
    ...numberField(7, g.advance),
  ];
  return bytesField(3, body);
}

function encodeStack(name: string, range: string, glyphs: readonly GlyphData[]): Buffer {
  const stack = [...stringField(1, name), ...stringField(2, range), ...glyphs.flatMap(encodeGlyph)];
  return Buffer.from(bytesField(1, stack));
}

async function main(): Promise<void> {
  const fontsDir = argValue('--fonts');
  if (!fontsDir) throw new Error('Pass --fonts DIR, the folder that holds the TTF files.');
  const outRoot = path.resolve('public/glyphs');
  // TinySDF draws with a DOM canvas; give it one from @napi-rs/canvas.
  (globalThis as { document?: unknown }).document = { createElement: () => createCanvas(1, 1) };

  const loaded = new Map<FontName, { font: ReturnType<typeof opentype.parse>; sdf: TinySDF }>();
  for (const name of new Set(STACKS.flat())) {
    const file = path.resolve(fontsDir, FILES[name]);
    GlobalFonts.registerFromPath(file, name);
    const raw = await readFile(file);
    loaded.set(name, {
      font: opentype.parse(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength)),
      sdf: new TinySDF({ fontSize: FONT_SIZE, buffer: BUFFER, radius: 8, cutoff: 0.25, fontFamily: `"${name}"` }),
    });
  }

  let files = 0;
  let bytes = 0;
  for (const stack of STACKS) {
    const stackName = stack.join(',');
    const dir = path.join(outRoot, stackName);
    await mkdir(dir, { recursive: true });
    for (const start of RANGE_STARTS) {
      const glyphs: GlyphData[] = [];
      for (let code = start; code < start + 256; code += 1) {
        const char = String.fromCodePoint(code);
        const printable = code >= 32 && !(code >= 127 && code <= 159);
        if (!printable) continue;
        for (const name of stack) {
          const entry = loaded.get(name);
          if (!entry || entry.font.charToGlyphIndex(char) === 0) continue;
          const d = entry.sdf.draw(char);
          glyphs.push({
            id: code,
            bitmap: d.data,
            width: d.glyphWidth,
            height: d.glyphHeight,
            left: d.glyphLeft,
            top: d.glyphTop - TOP_BASE,
            advance: Math.round(d.glyphAdvance),
          });
          break;
        }
      }
      const range = `${start}-${start + 255}`;
      const data = encodeStack(stackName, range, glyphs);
      await writeFile(path.join(dir, `${range}.pbf`), data);
      files += 1;
      bytes += data.length;
    }
    console.log(`${stackName}: done`);
  }
  console.log(`wrote ${files} files, ${(bytes / 1e6).toFixed(2)} MB, into ${outRoot}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
