# Map look: how the pieces fit (Phase 13)

Source of truth for the look is `docs/SPEC_MAP_V2.md` section 3. This file records what was built
and where, so later phases (era labels, paths, regions) know what they sit on.

## Layer order (bottom to top)

1. `background` (paper). 2. `look-terrain-tint` and `look-terrain-shade` (`src/map/terrain.ts`).
3. Basemap water, then `look-water-waves` (strong), `look-coast-stain` (strong), ripple lines and the
   inked coast (`src/map/water.ts`). 4. Rivers, faint dashed borders and faint labels (basemap
   layers restyled in `src/map/style.ts`). 5. Relief marks (strong, `src/map/relief.ts`), placed before
   `boundary_3`. 6. Region overlays (`overlay-*`). 7. The edge fade `look-fade` (`src/map/fade.ts`, one layer, one polygon per ring with its own paper cover),
   added just under the first event layer so it sits above overlays and under all event layers. 8. Event
   layers (`event-*`). Above the canvas: the paper grain, vignette and compass rose (`src/map/paper.ts`,
   `src/styles/paper.css`).

Era labels (`src/labels/`, layers `era-labels-r1` to `r4`) are added just under `look-fade`, so they fade into paper at the edge; they sit below the event layers, which is why they are drawn just below their point. `restyle` in `src/map/style.ts` skips layers named `era-*`.

Layers we add are named `look-*`. Phases 14-17 should insert their layers under `look-fade` when
they should fade at the edges, or above it when they should not.

## Two strengths

`MAP_STYLE_STRENGTH` in `src/map/look.ts` is `'subtle'` or `'strong'`. The owner chose **strong** (Phase 13). In development, `?look=subtle`
or `?look=strong` in the URL overrides it (this is compiled out of production builds). The choice
sets `data-look` on `<html>`, which the CSS grain and vignette follow.

## Frame

`src/data/frame.ts`: an ellipse around `HOME_BOUNDS` (3.6 x 3.0 degrees clear, six rings out to 1.5
times that, then solid paper). `maxBounds` is the frame's bounding box with 10% extra on each side
(solid paper), and `minZoom` is 6. The ellipse is decoration only. It never follows any boundary, and
no text should call it one.

## Scripts (run by hand, outputs committed)

| Command | Writes | Needs |
|---|---|---|
| `npm run build:terrain` | `public/terrain/` | downloads from the AWS Terrain Tiles bucket |
| `npm run build:sea-mask` | `public/terrain-sea/` | `public/terrain/` |
| `npm run build:relief-marks` | `public/data/relief-marks.json` | `public/terrain/` |
| `npm run build:glyphs -- --fonts DIR` | `public/glyphs/` | the five OFL TTF files |

See `docs/TERRAIN.md` and `docs/GLYPHS.md`.

## Paper texture

The grain is a static inline SVG (`feTurbulence`, one 128 px tile repeated), added by `addGrain` once
the map has loaded; the vignette is a CSS gradient. Both are plain translucent layers: `mix-blend-mode:
multiply` over the WebGL canvas and a CSS background image for the grain each slowed the first paint in
Lighthouse runs, so the spec's "multiply" became ordinary low-opacity brown. Both are off under
`forced-colors`, and neither animates.

## Decisions made while building

- **No RTL text plugin.** MapLibre GL JS 6 shapes Arabic and orders it right to left on its own
  (`docs/GLYPHS.md`).
- **Zoom 9, not 10**, for the elevation tiles (size budget).
- **Stain and ripples:** coastline outlines from the basemap's water polygons can't be offset more
  than about 8 px without drawing seams at tile edges, so the ripples stay within that and the wide
  coastal stain comes from the local distance-to-coast tiles instead.
- **Reference look:** the strong style takes its character (wave-stroke sea, dark coastal stain,
  hachure relief marks, heavy vignette, compass rose) from the owner's reference. Every shape was drawn
  from scratch; nothing is copied or traced.

## Phase 13b: novel-map pass (owner's Witcher-style reference)

Owner direction: the map should read like a map from a novel or game. Changes, all original drawings:

- **Mountains only on ranges.** `scripts/build-relief-marks.ts` now keeps a mark only where the ground is high (450 m or
  more), steep around it, stands above the average within 15 km, and has other such ground within 14 km. Plains, plateaus,
  the coast and open desert stay clean; single hills are dropped. Rebuild with `npm run build:relief-marks`.
- **Flatter parchment land.** In the strong style the elevation tint is pulled further toward paper (`tintMix` 0.82) and the
  hillshade softened (`shade` 0.3), so the ink drawing carries the relief.
- **Ink rivers** (dark ink on the parchment theme, sea-ink on the night chart) and **small tree groves** where the basemap
  has a wood (`landcover_wood`, from zoom 10, `src/map/townIcons.ts`).
- **Tiny drawn towns** before the name on era labels: a walled town, a few houses, two cottages or a watch-tower, by the
  place's `kind` (region, water and mountain labels get none).
- **Hand-lettered labels:** Almendra for Latin script, IBM Plex Sans Arabic beneath (docs/GLYPHS.md).
- **Borders you can tell apart** (`src/map/borders.ts`): the basemap's present-day lines are no longer faint. Countries are a
  heavy dash-dot line, disputed lines dotted, provinces (admin levels 3-4) dashed, districts (5-6, from zoom 8) finely
  dashed and municipal limits (7-9, from zoom 11) dotted, each on a soft paper casing. They are modern lines from the
  basemap, not historical boundaries.

## One whole land (owner decision, 2026-11-04)

The map shows Palestine as one land: no line or label separates the West Bank and Gaza from Jaffa, Haifa, Acre
and the rest. In `src/map/borders.ts` and `src/map/style.ts`:

- Country lines are drawn only where a neighbour (Egypt, Jordan, Syria, Lebanon, Saudi Arabia) is on one side.
- The basemap's "disputed" lines (the 1949 armistice line, the Golan) are hidden.
- The district level the basemap carries only for the West Bank (admin 5-6) is not drawn; provinces (3-4) and
  municipal limits (7-9) stay.
- Where the basemap says "Israel" the map says "Palestine / فلسطين"; its separate "Palestinian Territories",
  West Bank and Gaza labels are left blank. This replaces the earlier "Occupied Palestinian Lands" label.
- Era-label places (`places.json`) already list all cities and districts together, whatever their present
  administration.

Event cards keep the names and status words used in their sources. The basemap's own tiles still carry its
lines and names; only the drawing and labelling are changed here.

## Focus, night mode, sharper borders, villages (owner request, 2026-11-04)

- **Focus on Palestine:** the clear ellipse of the edge fade is now 1.5 x 2.8 degrees (`FRAME_RADII` in `src/data/frame.ts`),
  so the country sits in the clear area and Sinai, Jordan, Lebanon and Syria fade to paper. Minimum zoom is 6.4.
- **Night mode:** a "Night mode / Day mode" button in the top bar (a sun or moon on phones) sets an explicit light or dark
  theme and saves it; "follow my device" stays in the About dialog.
- **Sharper borders:** wider, darker lines on a stronger casing (`src/map/borders.ts`). Provinces and districts are no longer
  drawn, because the basemap carries them unevenly across the land; countries (neighbours only) and municipal limits are.
- **Villages and towns:** the basemap's village labels (modern OpenStreetMap names and positions, English and Arabic) show from
  zoom 9.5, small and quiet. Individual village borders appear only where the basemap has a municipal limit. Villages
  depopulated before or in 1948, and village-by-village boundaries, are not in the basemap; they need a licensed dataset
  (Palestine Open Maps, the 1945 Village Statistics, PalQuest) approved first (docs/REGION_SOURCES.md).

## Tilted view, banners, landscape (owner request, 2026-11-04; Tier 1 of the painted-map plan)

- **Tilted view (default) and flat view (option):** `src/map/view.ts`. The map tilts 50 degrees over the local elevation tiles drawn as 3D terrain
  (heights x2.2), with the sky fading into paper. A button under the zoom controls switches to the flat top-down view and back; the choice is saved
  in the browser. Rotation stays off (north is up), and reduced motion jumps instead of easing. Relief marks and labels stay upright.
- **Scroll banners:** city names sit on a parchment ribbon (`src/map/banner.ts`, a stretchable 9-slice image sized to each name by MapLibre).
- **Landscape from land cover** (`src/map/landscape.ts`): ink patterns for ploughed fields, olive and fruit groves, vineyards, scrub and
  meadow tufts, dunes, reed beds and bare rock, drawn only where the basemap's land cover says so; woodland keeps its tree groves. Patterns
  show from zoom 8-9.5.
- **Known limits:** the paper-fade rings can show as faint arcs over the sea at an oblique angle; patterns are regular grids close up; painted
  buildings, figures and creatures are not part of this tier (docs/SPEC_MAP_V2.md section 10).

## Inked look (owner request, 2026-11-04; default)

A second, selectable map look modelled on printed fantasy maps (flat, hand-inked, yellowed parchment). `MAP_STYLE_STRENGTH` in `src/map/look.ts`
is now `'inked'`; the earlier painted look is `'strong'`, and the quill button under the map controls switches between them (it saves the choice and
reloads, because the two build different layers). The inked look differs in:

- **Parchment:** warmer tokens in `tokens.css` (light and night), heavier grain, a brown vignette, and static fold creases (`paper.css`).
- **Colour washes** (`src/map/inked.ts`): olive for woods, yellow-green for farmland and groves, pale ochre for sand, blue-green for wetland, grey-brown for rock,
  under the ink patterns of `landscape.ts`.
- **Roads:** the basemap's motorways, main and minor roads as thin dashed ink trails.
- **Labels:** cities on a square double-outlined plate in capitals; towns and villages as a small house sprite and name (`banner.ts`, `labels/layer.ts`).
- **Region names along a curve** (`src/labels/regions.ts`): a place with `labelPath` (a decorative line of [lng, lat] points, never a boundary) has its name set along it
  in large spaced capitals, Arabic beneath. Set for the Mandate districts and the Palestine region; "District" is dropped from the lettering.
  Curved lettering starts at zoom 8; below that the Mandate district names sit flat at the middle of their path (`era-region-pt-*` layers), so
  they show at the home view. The Palestine region name stays on the base map's own label at low zoom.
  Tried and dropped: curved lettering for the 16 governorates. Their label points are the capitals, whose banners collide with the lettering, and
  giving them a `labelPath` also removed their point label. They keep their ordinary point labels; a later pass could give them paths clear of the banners.
- **Mountains** (`src/map/markInked.ts`): jagged multi-peak ranges with dense hatching and a cross-hatched foot, drawn larger. A third, finer
  grid (3 km, from zoom 8.4, slightly lower height and relief thresholds in `scripts/build-relief-marks.ts`) puts marks on the long ridges of Galilee,
  Carmel, Samaria and the Judean hills; the data file grew from 83 KB to 162 KB (6,095 marks, still from the elevation tiles, nothing traced).
- **Ships** (`src/map/ships.ts`): four small sailing ships on the Mediterranean, zoom 5.5 to 9.5. Pure decoration; they mark no fleet, event or route.
- **Woodland:** tree pattern opacity raised from 0.55 to 0.68.
- **Not done:** landmark sprites and a title cartouche.
- **Camera:** tilted by default (owner request 2026-11-07); the tilt button still switches to flat.
- **Limits:** the engraved quality of an illustrator, a dense painted forest and figures or creatures are not reproduced.

## Illustrated base (optional, owner-commissioned picture)

Filters > Map picture > "Illustrated base" (off by default, remembered in `localStorage` key `illustrated`). `src/map/illustrated.ts`.

- **Where the picture comes from:** the owner's ChatGPT image, painted over `basemap-art/reference/land-relief.png`, which `npm run build:reference-images` makes from our
  own elevation and sea-mask tiles (no other map used). The raw file lives in `basemap-art/illustrated-base-source.webp` (git-ignored);
  `npm run build:illustrated-base` fades its edges and writes `public/basemap/illustrated.webp` (793 x 1983, 475 KB, committed).
- **Placement:** an image source on longitude 34.1 to 36.1 and a 2:5 box from latitude 33.6 south (Mercator, so it lines up with the reference exactly). It sits just under
  our sea, so the shore, the lakes and the coast line stay the real ones from our data and the picture's own sea never shows.
- **While on:** the colour washes, land patterns, woodland pattern and rivers are hidden so nothing is drawn twice. Mountains, roads, borders, labels, events and
  paths stay. The night chart dims it (brightness 0.5, saturation -0.25). Loaded only when switched on; the offline edition includes the file.
- **Honesty:** the fields, groves, scrub and dry valleys are the generator's decoration, not land-use or river data. The filter note says so. Do not describe it as a survey.
- **Limits:** the file is soft past about zoom 9 (a larger original from the generator would help); the 7% edge fade shows slightly where the picture ends on land
  at the east and the south of the home view.

## District areas (optional, schematic; owner request 2026-11-04)

Filters > District areas: "Colour blocks" and "Dashed lines" (two checkboxes, **off by default**, switched on automatically while a story runs (owner request); the map credit line also says they are schematic). `src/map/districts.ts`.

- **What it is:** a nearest-centre diagram. The land is divided between the 18 main cities the owner listed (Acre, Baysan, Beersheba, Bethlehem, Gaza, Haifa, Hebron,
  Jaffa, Jericho, Jerusalem, Jenin, Nablus, Nazareth, Ramallah, al-Ramla, Safad, Tiberias, Tulkarm): every point takes the colour of its nearest city (Voronoi cells,
  computed in the browser from the places' positions, longitude stretched for the latitude). Neighbouring blocks get different tints.
- **What it is not:** **not a boundary** and not the Mandate sub-districts, the governorates or any official area. The filter note says so. Real outlines need a surveyed
  source (see docs/VILLAGE_SOURCES.md); when one is licensed, replace the cells with those polygons and drop the "schematic" wording.
- **Drawing:** the blocks and lines sit just above the land and under the sea, so water is never tinted or crossed; the Illustrated base goes under them.
- **Limits:** the cells ignore terrain, so for example the Beersheba block extends over the whole Negev and the lines through the hills are only straight cuts.

## First-visit defaults (owner request, 2026-11-07)

With nothing saved in the browser the map opens in **day mode**, in the **painted look** (`MAP_STYLE_STRENGTH = 'strong'`; the inked look stays selectable from the quill button), **tilted**, at the **present day** (era 1993-present, current year), with the **short tour** already open at its introduction (the first story; a link to an event, place, thread or story is left alone). A reader's own choices (night mode, look, view) are remembered and win over these defaults.
