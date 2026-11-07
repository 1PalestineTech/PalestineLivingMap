# Map v2 Spec: illustrated map and Witcher-style interactions

Status: **draft**. Owner direction from 2026-11-04 is in section 2. Questions 2-6 in
section 11 are still open; until they're answered, the defaults are: place cards on,
style chosen from side-by-side screenshots in Phase 13, and the first threads, paths and
regions picked in their content phases. This extends `docs/SPEC.md`. Where the two disagree, this file wins for the
map; everything else in `SPEC.md` still applies.

## 1. What changes from v1

v1 is a restyled modern world map (OpenFreeMap "Positron") with markers on top. It works,
but it reads as a web map: you can zoom out to the world, and nothing moves except
markers fading in and out.

v2 makes the map feel like one illustrated object about one land, the way the Witcher
interactive map feels like a single painted map of its world:

1. **The look:** painted terrain on parchment, an inked coastline, edges that fade into
   paper, our own era-aware labels. No world view.
2. **Names that change by era:** labels follow the timeline (*Aelia Capitolina* → *Iliya*
   → *al-Quds / Jerusalem*).
3. **Animated paths:** routes draw themselves as time plays.
4. **Follow a thread:** pick a person, place, or theme and the map follows it through time.
5. **Regions light up:** provinces, districts, and lines appear by era and glow when
   something happens inside them.

Everything stays original. Nothing is copied from the Netflix map, its art, or its code
(the project rule 7).

## 2. Owner decisions

From the 2026-11-04 questions:

| Topic | Decision |
|---|---|
| Map art | Stylized terrain built from open elevation and coastline data, drawn in a painted parchment style. Not the 1946 sheet, not a single painted image. |
| Beyond Palestine | Fade into paper toward the edges. No world view, and the camera can't leave the region. |
| Interactions | All four: animated paths, names that change by era, follow a thread, regions light up. |
| Modern labels | Kept, but faint, under our own era labels. |
| Elevation data | **Local:** a pre-built elevation tile set for the region ships with the site. No outside terrain server. |

Carried over from earlier decisions (do not change without the owner):

- Map labels show **English and Arabic only**. `nameHe` stays in the data but is never
  shown (SPEC.md section 8, decision 8).
- The basemap label override in `src/map/style.ts` (now "Palestine", see the 2026-11-04 owner decision in docs/MAP_LOOK.md; it was "Occupied Palestinian Lands" in
  English and Arabic where the basemap says "Israel") stays.
- Place-name spellings follow Palestine Remembered (`docs/place-names.md`).
- Research order: the owner's references first (the Handala/Quora index as a research map,
  then Masalha, then PalQuest and Palestine Remembered), then other sources. Cite the
  underlying documents, never Quora (`docs/SOURCING.md`).

## 3. The look

### 3.1 Layer stack (bottom to top)

| # | Layer | Source |
|---|---|---|
| 1 | Paper background | `--paper-2` |
| 2 | Elevation tint (hypsometric colours) | elevation tiles, MapLibre `color-relief` layer |
| 3 | Relief shading | same elevation tiles, `hillshade` layer |
| 4 | Water fill (sea, lakes, Dead Sea) | OpenFreeMap vector tiles, `water` |
| 5 | Coastline ink and ripple lines | same, line layers on the water outline |
| 6 | Rivers and wadis | same, `waterway` |
| 7 | Modern borders, faint | same, `boundary` |
| 8 | Modern labels, faint | same, label layers |
| 9 | Region overlays (section 7) | `public/data/layers/` |
| 10 | Edge fade into paper | generated in code (3.4) |
| 11 | Paths (section 5) | `public/data/paths.json` |
| 12 | Era labels (section 4) | `public/data/places.json` |
| 13 | Event glows and markers | existing `event-*` layers |
| 14 | Paper texture and vignette | CSS overlay above the canvas, `pointer-events: none` |

Roads, land use, buildings, and other basemap clutter stay hidden. The fade (10) sits
above the basemap and region overlays and below our interactive layers, so markers,
paths, and labels are never washed out.

### 3.2 Terrain

- **Elevation data (local):** a one-off script, `scripts/build-terrain.ts`, produces a
  Terrarium-encoded PNG tile pyramid for the region, from zoom 5 up to zoom 10, into
  `public/terrain/{z}/{x}/{y}.png`. The map overzooms beyond 10, which suits the painted
  look. The tile area is the bounding box of the edge-fade frame (3.4), so nothing is
  fetched outside it.
  - Input: an openly licensed elevation dataset, such as the public AWS "Terrain Tiles"
    (Terrarium) or the Copernicus GLO-30 DEM. Phase 13 confirms the licence allows
    redistribution, records the exact attribution text in the map attribution and in
    `docs/`, and notes the dataset version.
  - The script is run by hand, and its output is committed, so builds and the live site
    never call an outside terrain server.
  - Size target: under about 20 MB. If zoom 10 goes over, cap at zoom 9 and report the
    size difference.
- **Relief shading:** light from the northwest (315°, the cartographic convention),
  shadows in `--ink` at low opacity, highlights in `--paper`. Exaggeration is tuned so the
  Jordan Rift and the central hills read clearly at the home view.
- **Elevation tints** (light theme; values in metres; Phase 13 tunes the exact hex
  values):

  | Elevation | Colour | Note |
  |---|---|---|
  | below 0 | muted blue-grey green | the Jordan valley and Dead Sea shore, down to about −430 m |
  | 0-200 | `--land-low` | coastal plain and valleys |
  | 200-500 | between low and mid | foothills |
  | 500-900 | `--land-mid` | the central hills |
  | 900-1500 | `--land-high` | the highest hills, Galilee and the Naqab highlands |
  | above 1500 | paler umber to paper | Jabal al-Shaykh (Hermon) |

  Dark theme ("night chart"): the same stops, darkened and desaturated from the dark
  tokens.
- **No 3D.** Pitch and rotation stay disabled.

### 3.3 Water and coastline

- Sea and lakes in `--sea`.
- An inked coastline (`--sea-ink`, about 1.2 px), plus three ripple lines offset into the
  sea at roughly 3, 7, and 12 px, fading out (opacity about 0.35, 0.2, 0.1). This is the
  engraved-coast look of old maps, drawn with `line-offset` on the water outline.
- Rivers (the Jordan, Yarmuk, al-Auja and other wadis where the basemap has them) in
  `--sea-ink` at reduced opacity, slightly thicker for the Jordan.

### 3.4 Edge fade into paper

- A geographic frame, built in code: an **ellipse** around the home view
  (`HOME_BOUNDS` in `src/data/region.ts`), with six nested rings outside it. Each ring is
  filled with `--paper-2` at rising opacity (about 0.15 → 0.95), and everything beyond the
  last ring is solid paper. Because it is geographic, it moves with the map like the edge
  of a sheet.
- **The fade is a picture frame, not a border.** It must stay a smooth ellipse. It is never
  traced along any political or historical boundary, and nothing in the UI describes it as
  one.
- `maxBounds` and `minZoom` are tightened so the viewport can't show past the solid paper.
  Neighbouring places (Damascus, Beirut, Amman, Cairo's direction) can be partly visible
  in the fade, which keeps routes that leave the region readable.
- A light screen-space vignette (CSS radial gradient, at most about 10% darker at the
  corners) adds to the effect.

### 3.5 Paper texture

A static grain made from an inline SVG `feTurbulence` noise (a data URI, no image file),
over the map at about 6-10% opacity with `mix-blend-mode: multiply`. It is never
animated. It is turned off under `forced-colors` and when it would hurt contrast in the
dark theme.

### 3.6 Modern labels and borders (faint)

- Kept per the owner's decision, at about 35% opacity, in `--ink-2`, about 0.9× the size
  of era labels. Only countries, cities, and towns are kept; villages, suburbs, and points
  of interest are hidden.
- Borders are no longer faint (owner request, Phase 13b): one line style per admin level, set in `src/map/borders.ts` (see `docs/MAP_LOOK.md`).
- Era labels sit above them, and MapLibre places upper layers first, so era labels win
  collisions and modern labels drop out where they would overlap.
- The "Occupied Palestinian Lands" label override and the attribution note
  ("Basemap shows present-day names and boundaries") stay.

### 3.7 Typography on the map

- Era labels use Almendra for Latin script (Phase 13b, owner's decision; originally Cormorant Garamond), with an
  Arabic line beneath in IBM Plex Sans Arabic.
- MapLibre draws text from glyph files, so Phase 13 generates them for these two fonts
  (glyph PBF ranges) and self-hosts them under `public/glyphs/`.
- **Arabic shaping:** MapLibre needs the RTL text plugin (`setRTLTextPlugin`, loaded
  lazily) to join Arabic letters and order them right to left. The app doesn't register it
  today, so Phase 13 first checks whether the Arabic in the current basemap labels renders
  correctly, and adds the plugin either way.
- Label hierarchy:

  | Kind | Style |
  |---|---|
  | Region | Spaced small caps, italic, `--ink-2` (e.g. JUND FILASTIN) |
  | City | Almendra bold, size by `rank` |
  | Town or village | Almendra regular, smaller |
  | Site | Italic |
  | Water | Italic, `--sea-ink`, letter-spaced along the water where possible |

### 3.8 Performance budget

- Lighthouse stays at 90+ on mobile (`docs/SPEC.md` section 6 targets).
- Elevation tiles are local, zoom 10 at most, and overzoomed beyond.
- The new map code adds at most about 40 KB gzipped, not counting the lazily loaded RTL
  plugin and the glyph files.
- The paper texture and vignette are CSS only.

## 4. Names that change by era

### Behaviour

- Each place has one or more names, each valid for a span of years. As the year changes,
  the label shows the name(s) valid in that year, with a 300 ms crossfade.
- Names valid at the same time are shown together in their listed order, e.g.
  *al-Quds / Jerusalem*.
- In years where a place has no attested name in our data, it shows no label.
- Hovering or focusing a label shows a tooltip: the name, its span, and "1 source".
- Clicking a label opens a **place card**, a small panel that lists every name of the
  place through time, each with its span and sources, plus the events at that place.
  (Open question 2.)
- Place names are added to search, so "Aelia Capitolina" finds Jerusalem.
- Region labels (Jund Filastin, the sanjaks, Palaestina Prima) are places of kind
  `region`, positioned at a label point. They can link to a region overlay (section 7).

### Data: `public/data/places.json`

```json
{
  "$schema": "./places.schema.json",
  "version": 1,
  "places": [
    {
      "id": "jerusalem",
      "kind": "city",
      "rank": 1,
      "lat": 31.7767,
      "lng": 35.2345,
      "names": [
        {
          "en": "Aelia Capitolina",
          "ar": null,
          "lang": "la",
          "from": 135,
          "to": 638,
          "fromCirca": false,
          "toCirca": true,
          "sources": [{ "title": "...", "url": "https://...", "publisher": "...", "accessedDate": "2026-11-05" }],
          "note": "Roman colony founded by Hadrian."
        }
      ],
      "status": "needs-review",
      "editorNote": "..."
    }
  ]
}
```

The values above show the shape only. They are not checked facts.

| Field | Notes |
|---|---|
| `kind` | `city`, `town`, `village`, `site`, `region`, `water`, `mountain` |
| `rank` | 1-4, from major city to minor site; sets label size and the zoom where it appears |
| `names[].en` / `ar` | English and Arabic forms. `ar` is null only with a note. Hebrew is not used here. |
| `names[].lang` | Language of the name as used at the time (`la`, `grc`, `ar`, `akk`...) |
| `names[].from` / `to` | Historical years (negative = BCE, no year 0). `to: null` means to the present. |
| `fromCirca` / `toCirca` | True when the source gives the date as approximate |
| `names[].sources` | At least one source attesting this name in this span |

### Sourcing rules for names

- Each name needs a source that attests the name in use in that span: an inscription,
  coin, text, map, or a scholarly work that says so. Masalha's chapters are the first stop
  for ancient through Ottoman names (cite the book and page).
- Spans follow the evidence: the first and last attestation, or the political change that
  brought the name in or out (cite it). Use `circa` honestly.
- Village and town spellings follow Palestine Remembered, as already decided.
- Where naming is itself contested (for example Hebraized names given to Palestinian
  places after 1948, as covered in Masalha chapter 10), the place card states who used
  which name, with attribution, in a note.
- Never back-project a name to a period where no source attests it.

### Validator additions

Unique ids, valid years (no 0, `from` ≤ `to`), at least one source per name, `ar` present
or explained, coordinates in the region box (warning), and overlapping spans on the same
place (warning, since they are shown together, which should be deliberate).

## 5. Animated paths

### Behaviour

- A path belongs to one event (`eventId`). When the year enters the event's span, the
  line draws itself from its first waypoint toward its last, timed to the waypoint dates.
  A small moving head marks the leading point.
- While playing, drawing follows time. While scrubbing, the drawn length jumps to match the
  year.
- After the event's span ends, the full path stays as a faint trail for `lingerYears`, then
  fades out.
- Clicking or focusing a path opens its event card. The card gains a **Route** line, e.g.
  "Route: Lydda → Ramla → Ramallah area (approximate)".
- Style follows the event's category colour, with a pattern by kind:

  | Kind | Pattern |
  |---|---|
  | `campaign` | Dashed, with arrowheads |
  | `route` (trade, pilgrimage, roads) | Dotted |
  | `displacement` | Solid, with chevrons |
  | `railway` | Thin solid line with cross ticks |

- **Reduced motion:** no drawing animation. The whole path appears while its event is
  visible.

### Data: `public/data/paths.json`

```json
{
  "$schema": "./paths.schema.json",
  "version": 1,
  "paths": [
    {
      "id": "lydda-ramle-expulsion-route-1948",
      "eventId": "lydda-ramle-expulsions-1948",
      "kind": "displacement",
      "shape": "schematic",
      "waypoints": [
        { "name": "Lydda", "lat": 31.95, "lng": 34.89, "date": "1948-07-12" },
        { "name": "...", "lat": 0, "lng": 0, "date": null }
      ],
      "lingerYears": 5,
      "sources": [{ "title": "...", "url": "https://...", "publisher": "...", "accessedDate": "2026-11-05" }],
      "status": "needs-review",
      "editorNote": "..."
    }
  ]
}
```

The values above show the shape only. They are not checked facts.

- `shape`: `schematic` means the line between waypoints is drawn as a gentle curve and the
  card says "route approximate". `traced` means the line follows a sourced geometry file
  (`geometryFile`, a GeoJSON LineString in `public/data/paths/`), for example a railway
  traced from a public-domain survey map.
- Undated waypoints are spaced evenly in time between their dated neighbours.

### Sourcing rules for paths

- Every waypoint is a place named in a source for that event.
- Schematic lines never imply a precise road. The card always says "approximate".
- Traced lines cite the map they were traced from (title, year, scale, licence). Only trace
  from public-domain or openly licensed maps; the 1946 Survey of Palestine sheet qualifies
  once its edition is confirmed.
- Displacement routes are drawn only where sources document the route, not inferred from
  where people ended up.
- Any number in the route text follows the numbers rule.

### Validator additions

`eventId` exists; at least two waypoints; dates in order and inside the event's span
(warning); coordinates inside the extended region box; at least one source; a
`geometryFile` exists when `shape` is `traced`.

## 6. Follow a thread

### Behaviour

- A thread follows one subject (a person, a place, or a theme) through time, like
  following one character on the Witcher map.
- Starting a thread:
  - The top bar shows a chip, "Following: Jaffa", with Previous, Next, and ×.
  - Events not in the thread dim to 30%, and their paths and labels dim too.
  - The timeline highlights the thread's events with marks on the track.
  - Scrub or play freely. As the year passes each thread event, the camera eases to it
    (or jumps, with reduced motion) and its card opens in peek size.
  - Previous and Next jump between thread events.
- **How it differs from story mode:** a story is a fixed, narrated tour you step through.
  A thread is a filter and camera-follow you drive yourself with the timeline.
- Ways in: a "Follow" button in the top bar opens a list grouped by person, place, and
  theme. The event card's location line and the place card each get "Follow this place".
- The URL hash gains `thread=<id>`.

### Data: `public/data/threads.json`

```json
{
  "$schema": "./threads.schema.json",
  "version": 1,
  "threads": [
    {
      "id": "dahir-al-umar",
      "kind": "person",
      "title": "Dahir al-Umar",
      "titleAr": "ظاهر العمر",
      "intro": "Max 60 words, restating only what the event cards say.",
      "eventIds": ["dahir-al-umar-victory-marj-ibn-amer-1735", "dahir-al-umar-takes-acre-1749"],
      "pathIds": [],
      "placeIds": ["acre"],
      "status": "needs-review"
    }
  ]
}
```

- Threads list their events explicitly. Tags are not used to build threads, because tags
  are inconsistent (see the note below).
- Threads add **no new claims**: the intro restates event-card facts, like story captions.
- Validator: all referenced ids exist, at least 3 events, and an intro of at most 60 words.

**Data note:** tags from commit `c792ba6` had lost every "f", "0", "3", and "6"
(`atimids`, `raah`, `resolution-2`). They were restored in `cc8a429`. Tags are still
free-form, which is why threads list their events explicitly.

## 7. Regions light up

### Behaviour

- The existing overlay system (Phase 7B: `layers.json` manifest, `validFrom` / `validTo`,
  fades, legend, "approximate" notice, source links) is extended, not replaced.
- New overlay styles:

  | Style | Look | Example |
  |---|---|---|
  | `province` | Soft tint plus an inked edge | Ottoman sanjaks, Mandate districts |
  | `line` | Dashed or double line, no fill | 1949 armistice lines |
  | `plan` | Hatched fill with a legend | 1947 partition plan |

- **Lighting up:** while an event inside a region is visible, the region's tint brightens
  once and holds while the event stays visible. Event-in-region matching is computed once
  at load (point in polygon).
- The region's label comes from a `places.json` place of kind `region` (`labelPlaceId`).

### Data: additions to the `layers.json` manifest

New optional fields: `style`, `labelPlaceId`, `precision` (`surveyed`, `traced`, or
`schematic`), `digitizedFrom` (the map or dataset the geometry came from, with year and
scale), and `sources` (an array, so a layer can cite both the defining document and the
geometry source). Existing fields stay as they are.

### Sourcing rules for boundaries (strictest of all)

- Geometry only comes from a published dataset or map whose licence allows reuse
  (public domain, CC BY, CC BY-SA, or similar). Record where it came from in
  `digitizedFrom`.
- Lines traced by hand from a map are `traced` and labelled approximate in the UI.
- Never trace from a copyrighted atlas without permission. Abu Sitta's *Atlas* can be
  cited as a source for facts, not traced.
- Contested lines (the 1947 partition plan, the 1949 armistice lines, the 1967 lines) cite
  their defining document (the UN resolution and its map, the armistice agreements and
  their maps), and the legend says so.
- Ancient and medieval regions without a sourced map stay as **labels only** (section 4).
  No guessed polygons.

## 8. Rules shared by all four features

- Each new data file gets a JSON Schema, validator checks in `npm run validate`, a section
  in `docs/DATA_GUIDE.md`, and a "Names and geometry" section in `docs/SOURCING.md`.
- Everything new starts as `needs-review`, and only the owner sets `verified`.
- Each feature works by keyboard, with a text alternative:
  - Place cards list names through time.
  - Event cards describe routes.
  - Thread mode is announced in a live region.
  - The legend lists active regions with sources.
  - The event list view shows the thread filter.
- Reduced motion: no line drawing, no label crossfade, no glow pulse, and jumps instead of
  camera flights.
- URL hash additions: `thread=`, `place=`. Existing keys keep working.
- Files stay under 250 lines, and modules are split per feature (`src/map/terrain.ts`,
  `src/map/fade.ts`, `src/labels/`, `src/paths/`, `src/threads/`).

## 9. Phase order

One phase per session, as in the playbook. Each phase starts with "Before writing code,
give me a short plan and wait for my OK."

| Phase | Work | Model / effort | Check |
|---|---|---|---|
| 12 | This spec, plus answers to the open questions | Opus 5.5 / high | You approve the spec |
| 12b | ~~Fix the damaged tags from commit `c792ba6`~~ Done in `cc8a429` | | |
| 13 | **New look:** terrain, tints, coast ink, edge fade, texture, faint modern labels, glyphs, RTL plugin. Visual only. | Sonnet 5.5 / high | Screenshots at desktop and phone size in both themes, Lighthouse still 90+, Arabic labels joined and right to left |
| 14a | Era labels: schema, validator, rendering, crossfade, place card, search | Sonnet / high | One sample place with 3 names changes as you scrub |
| 14b | Era-label content, era by era, from the owner's references | Sonnet / medium | Candidate list approved first (8A style) |
| 15a | Paths: schema, validator, drawing engine, Route line on cards | Sonnet / high | One sample path draws while playing, appears whole with reduced motion |
| 15b | Path content: first sourced routes | Sonnet / medium | Each route checked against its source |
| 16 | Follow a thread: picker, chip, dimming, camera follow, hash | Sonnet / high | Following a thread from the URL restores it |
| 17a | Region sources: research datasets and licences, no code | Sonnet / high, or Opus | A list of usable files with licences for the owner to approve |
| 17b | Regions: new overlay styles, light-up, approved files | Sonnet / high | Regions fade by year and glow with their events |
| 18 | Re-run accessibility (9C), performance (9D), and fact-check (10) on everything new | Opus 5.5 / high, fresh session | Reports in `docs/review/` |

Phase 13 is independent of the rest and gives the biggest visible change. 14a, 15a, and
16 can each follow it in any order. 17b waits for 17a's sources.

## 10. Out of scope for v2

- 3D terrain, pitch, or rotation.
- Hand-painted artwork, character portraits, animated figures or armies.
- Sound or narration.
- User-made threads or stories.
- Guessed boundaries for any period.
- The 1946 sheet as a georeferenced overlay (still a later candidate; it can serve as a
  tracing source for 15b and 17).

## 11. Open questions

1. ~~Elevation tiles~~ **Decided:** local (section 3.2).
2. **Place card:** should clicking a label open the place card (names through time,
   events there)?
3. ~~Hand-drawn strength~~ **Decided (Phase 13): strong old-map.** Wave-stroke sea with a coastal
   stain, hachure relief marks, three ripple lines, heavier grain and vignette, compass rose. The
   subtle style stays in the code behind `MAP_STYLE_STRENGTH` in `src/map/look.ts`.
4. **First threads:** which subjects first?
5. **First paths:** which routes first?
6. **First regions:** which layers first?
