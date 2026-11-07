# Map fonts and Arabic text (Phase 13)

MapLibre draws map labels from glyph files (signed-distance-field bitmaps in PBF format). The
basemap's own labels used OpenFreeMap's Noto Sans glyphs. Phase 13 adds two self-hosted families
for the new look and for the era labels that come next (`docs/SPEC_MAP_V2.md` section 3.7).

## Fonts

| Family | Used for | Licence | Source |
|---|---|---|---|
| Almendra (Regular, Bold, Italic) | Latin script: the hand-lettered look of the map | SIL Open Font License 1.1 | <https://github.com/google/fonts/tree/main/ofl/almendra> |
| IBM Plex Sans Arabic (Regular, Medium) | Arabic script, and a fallback for anything Almendra lacks | SIL Open Font License 1.1 | <https://github.com/google/fonts/tree/main/ofl/ibmplexsansarabic> |

The OFL allows embedding and redistributing the fonts, and converting them to other formats, as long
as the licence travels with them and the fonts aren't sold on their own. The glyph files are derived
bitmaps, not the font files, and the TTF files are not in the repository. The two licence texts
travel with the glyph files (`public/glyphs/OFL-Almendra.txt`, `public/glyphs/OFL-IBM-Plex.txt`).
Copyright lines: "Copyright (c) 2011-2012, Ana Sanfelippo, with Reserved Font Name 'Almendra'" and "Copyright © 2017 IBM Corp. with
Reserved Font Name 'Plex'".

**Phase 13b:** the Latin face changed from Cormorant Garamond to Almendra (a calligraphic face, closer to a novel's hand-lettered map). The Arabic line is unchanged.

**Reserved Font Name:** IBM's licence reserves the name "Plex" (and Almendra's reserves "Almendra") for modified versions of the font. The
glyph folders use the family name only as a label for an unmodified outline rendered as a bitmap. If
that reading is ever in doubt, rename the stacks (and `FONT` in `src/map/glyphs.ts`) before release.

## Files

`public/glyphs/{stack}/{start}-{end}.pbf`, 33 files, 1.6 MB. MapLibre asks for each `text-font`
list as one comma-joined stack, which a font server would merge on the fly. A static site can't, so
the script writes one merged folder per list the map uses (the first font wins where both have a
glyph):

| `text-font` list (`FONT` in `src/map/glyphs.ts`) | Used for |
|---|---|
| Almendra Bold, IBM Plex Sans Arabic Medium | countries and cities |
| Almendra Regular, IBM Plex Sans Arabic Regular | towns |
| Almendra Italic, IBM Plex Sans Arabic Regular | water, regions |

Eleven 256-code-point ranges are written: Latin and its extensions (0-767), Arabic and its
supplement and extended blocks (1536-2303), general punctuation (8192-8447) and the Arabic
presentation forms (64256-65279). `transformRequest` in `src/map/glyphs.ts` sends only requests for
these two families to `public/glyphs`; every other font (for example the Noto Sans used by cluster
counts) still comes from OpenFreeMap.

## Rebuilding

Download the five TTF files into a folder outside the repository, then:

```bash
npm run build:glyphs -- --fonts path/to/fonts
```

To add a stack, add it to `STACKS` in `scripts/build-glyphs.ts` and to `FONT` in
`src/map/glyphs.ts`, then rebuild.

## Arabic: joined, right to left

Before: the basemap labels (Noto Sans glyphs, no plugin registered) already showed joined Arabic
letters in right-to-left order. MapLibre GL JS 6 does this itself: its type definitions mark
`setRTLTextPlugin` as deprecated ("Right-to-left text is drawn without a plugin"), so Phase 13
**does not register the RTL plugin**. It would add weight and nothing else. The Arabic presentation
forms ranges above exist because the built-in shaping maps joined letters onto them.

After: the same labels in IBM Plex Sans Arabic from `public/glyphs` also join correctly and read right
to left (checked at zoom 11 on the West Bank town labels, for example "عصيرة الشمالية" and "بلاطة").
