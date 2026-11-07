# Product Spec: Palestine Interactive Map Timeline (v1)

Status: **approved decisions applied** (see section 8). Site title: **Palestine: A Living Map**.

## 1. Concept

A full-screen, stylized historical map of Palestine with a timeline scrubber along the
bottom. Moving through time changes which events are on the map. Places glow while
something is happening there, and clicking a marker opens a story card with sources. The
inspiration is the *idea* of the Netflix Witcher interactive map (scrub through time,
regions light up, click to read). No asset, copy, or layout detail is taken from it.

The look borrows from the 1940s Survey of Palestine 1:250,000 sheets (`Mappalestine.png`):
parchment paper, green-to-ochre-to-umber relief tints, and fine ink linework. These are
reinterpreted as an original, muted palette, not copied.

### Goals

- Let a newcomer understand the long history of the land and its people in a few minutes.
- Every claim is traceable: each event card lists its sources.
- Calm, neutral, encyclopedic tone (see the project rules).
- Works on phones, by keyboard, and with screen readers.

## 2. Features (v1)

| # | Feature | Summary |
|---|---|---|
| F1 | Full-screen map | Stylized, muted historical look over a modern basemap whose labels and borders stay visible but softened. Pan and zoom only, with no rotation or pitch. |
| F2 | Timeline scrubber | Bottom bar from c. 3200 BCE to the present. Dragging changes the year, and events fade in or out. Non-linear scale. |
| F3 | Play / pause | Animates through time at 1x, 2x, or 4x. Faster across empty periods, slower near events. |
| F4 | Story card | Title, date, place (with alternate names), category, summary, optional details and image, "Different accounts", and sources. |
| F5 | Era presets | Ten buttons (section 8) that jump the timeline to an era start and fit the map to the era's area. |
| F6 | Category filters | Checkboxes with the same icon and color as the map markers, plus per-category counts. |
| F7 | Search | Searches place and event names, including Arabic alternates (Hebrew is not shown or searched for now). Up to 25 suggestions. |
| F8 | Story mode | A guided tour of 8-12 events. The camera flies between them, with captions. |
| F9 | Shareable URLs | Year, event, filters, and story step are stored in the URL hash. |
| F10 | "Regions light up" | A soft glow halo under every place with an event active in the current year. Historical boundary overlays only appear once sourced files exist (Phase 7B). |
| F11 | Accessible list view | A text list of the events visible in the current year, reached through a skip link. |

## 3. Screen layout

### Desktop (>= 1024px)

- **Top bar** (56px, translucent parchment): title on the left. On the right: search
  field, Filters button (with a dot when filters are active), Story button, About (?)
  button, and theme toggle.
- **Map**: full bleed behind everything. Zoom (+/-) and reset-view controls sit on the
  right edge. The map attribution stays visible at the bottom right, above the timeline.
- **Event panel**: slides in from the right, 400px wide, full height between the top bar
  and the timeline. The map stays interactive beside it.
- **Timeline bar** (about 150px): era preset row (scrolls horizontally if the ten eras
  don't fit), then the current year in large type
  with the era name and play controls, then the density sparkline, the track with its
  handle, and the tick labels.

```
+----------------------------------------------------------------------------------+
| PALESTINE: A LIVING MAP          [ / Search places & events...  ] [Filters*] [Story] [?] [o] |
+----------------------------------------------------------------+-----------------+
|                                                                | [x]  POLITICAL  |
|                                                                | Title of event  |
|                 . (glow)                              [ + ]    | March 1948      |
|            <>   ()                                    [ - ]    | Jaffa / Yafa    |
|                    []    /\                           [ @ ]    |                 |
|          ~ Mediterranean ~                                     | Summary text... |
|                        o  (approximate area)                   | [Read more]     |
|                                                                | Different accts |
|                                                                | Sources (3)     |
|                                                 (c) attribution| [< Prev][Next >]|
+----------------------------------------------------------------+-----------------+
| [Ancient][Classical][Early Islamic][Crusader][Ayyubid-Mamluk][Ottoman][Mandate]  > |
| 1917 CE   British Mandate                                  [ > Play ] [ 1x v ]   |
|  ._.._.__.--._.._..__.-=##=-._                  (event density sparkline)        |
| |-------|-------|------|-----|----|---|--|-O-|-|--|                              |
| 3000 BCE  1500 BCE  1 CE  600  1100  1500  1800 1900 1948 2000                   |
+----------------------------------------------------------------------------------+
```

### Mobile (360-430px)

- **Top bar** (48px): title (shortened), with search and filter icons. Search and
  filters open as full-screen sheets.
- **Map** fills the space between the top bar and the timeline.
- **Event card** is a bottom sheet with two heights. *Peek* (about 35% of the screen)
  shows the title, date, and summary start. *Full* (about 90%) shows everything. Drag
  or tap the grab handle to switch, and swipe down to close.
- **Timeline** (about 130px): era chips in a horizontally scrollable row, the year with
  the era and play button, then the track with a large handle (a touch target of at
  least 44px).
- Height uses `dvh` units so the mobile address bar doesn't hide the timeline.

```
+-----------------------------+        +-----------------------------+
| = Palestine      [Q] [F*]   |        | = Palestine      [Q] [F*]   |
+-----------------------------+        +-----------------------------+
|                             |        |          (map dimmed)       |
|        <>   ()        [+]   |        +-------------================+
|           []   /\      [-]  |        |            ----             |
|   ~ sea ~         o    [@]  |        | POLITICAL        [x]        |
|                             |        | Title of event              |
|                             |        | March 1948 - Jaffa / Yafa   |
|                (c) attrib.  |        | Summary text begins...      |
+-----------------------------+        |   (drag up for full card)   |
| <Ancient|Classical|Islamic> |        +-----------------------------+
| 1917 CE  Mandate     [ > ]  |        | 1948 CE  Nakba ...   [ > ]  |
| |--------O--------------|   |        | |----------O-----------|    |
+-----------------------------+        +-----------------------------+
        Map view                               Card open (peek)
```

## 4. Interaction details

**Drag the timeline.** Pointer, touch, and keyboard all work. With the keyboard, Left and
Right step one unit, where a unit is a year, a decade, or a century depending on the
local scale density. Shift plus an arrow takes a big step, and Home and End jump to the
ends. Updates are throttled to about one per animation frame. Markers whose date range
includes the current year fade in over 300ms, and ones that no longer match fade out. The
year label and era name update live. Dragging pauses playback and clears story mode's
dim effect.

**Play / pause.** Advances the year continuously. Speed is adaptive: playback slows near
event dates and moves fast across empty stretches. At 1x the full range takes about 90
seconds. The user can choose 1x, 2x, or 4x. Playback pauses on drag, on a marker click,
when the panel opens, and when it reaches the end. With reduced motion enabled, Play steps
from event to event every 2 seconds without animation.

**Hover a marker** (desktop). A small tooltip shows the title and date. Focusing a marker
with the keyboard shows the same tooltip.

**Click a marker.** Selects the event, pauses playback, flies the camera to it (or jumps,
with reduced motion), opens the panel, and moves focus to the panel heading. Clicking a
cluster zooms in to expand it. Clicking empty map closes the panel.

**Close things.** Escape closes the innermost layer first, in this order: search
suggestions, filter sheet, event panel, story mode. Focus returns to the element that
opened it.

**Filter.** Toggling a category updates the map markers and the density sparkline
together. The Filters button shows a dot and a count while filters are active. If nothing
matches, the map shows a "No events match these filters" message with a "Clear filters"
button.

**Search.** Press `/` to focus. Typing shows up to 25 suggestions (title, year, category
icon) in an ARIA combobox. Matching ignores case and diacritics and covers English,
and Arabic names, and forgives one typo in longer words. Choosing a result sets the year, selects the event, and flies
to it.

**Era jump.** Clicking an era button animates the handle to the era start over 600ms,
sets the era, and fits the map to that era's bounds. A screen-reader live region
announces the era, for example "Ottoman era, 1516 to 1917".

**Story mode.** A compact overlay shows "Step 3 of 10", the caption, and Back, Next, and
Exit buttons. Each step animates the year, flies to the event, highlights its marker, and
dims the others to 30% opacity. Arrow keys move between steps and Escape exits.

**URL hash.** The hash stores `#year=1917&event=balfour-1917&cats=political,cultural&story=intro&step=3`.
It updates with `replaceState` (no history spam) and restores state on load.

## 5. Visual design direction

### Color palette (light theme, default)

Inspired by the relief tints of the 1940s survey sheets: muted and slightly warm.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F4ECDC` | App background, panels |
| `--paper-2` | `#EADFC8` | Secondary surfaces, timeline bar |
| `--ink` | `#2A211A` | Primary text, linework |
| `--ink-2` | `#5B4A3B` | Secondary text, tick labels |
| `--rule` | `#C9B99C` | Borders, dividers, track |
| `--sea` | `#C7D6D3` | Water fill |
| `--sea-ink` | `#4F6F73` | Water labels, coastline |
| `--land-low` | `#C9D2A8` | Lowland and valley tint (green, subdued) |
| `--land-mid` | `#E3C99A` | Hill-country tint (ochre) |
| `--land-high` | `#B88A62` | Highland tint (umber) |
| `--accent` | `#A3362B` | Selection, focus ring, current-year handle |
| `--glow` | `#E8A54B` | "Lights up" halo for active places |

Dark theme (night chart): `--paper #1C1A17`, `--paper-2 #26231F`, `--ink #EFE6D6`,
`--ink-2 #B9AC97`, `--rule #4A4339`, `--sea #1F2C2F`, `--land-low #2E3427`,
`--land-mid #3A3326`, `--land-high #4A3A2B`, `--accent #E0705F`, `--glow #F2B65E`.
All text pairs must meet WCAG AA. This is checked in Phase 9C, and these values may
shift slightly to pass.

### Typography (Google Fonts)

| Role | Font | Notes |
|---|---|---|
| Display (title, big year, card titles) | **Cormorant Garamond** 500/600 | Bookish, archival feel |
| UI and body | **IBM Plex Sans** 400/500/600 | Clear at small sizes |
| Arabic text | **IBM Plex Sans Arabic** | Matches Plex metrics |
| Numerals on the timeline | IBM Plex Sans, tabular figures | Year label doesn't jitter while dragging |

Modern basemap labels and borders stay visible (decision 5). They use the basemap glyphs,
softened to `--ink-2` at reduced opacity and thinner line weights, so event markers and
glows stay the strongest elements. A small note near the attribution says "Basemap shows
present-day names and boundaries" so modern lines aren't read as historical ones.

### Marker styles per category

Shape and color both encode the category, so color is never the only cue. Markers are
16px on desktop and 20px on touch, with a 2px paper-colored outline.

| Category | Shape | Color |
|---|---|---|
| Political | Square | `#2F4B6E` (slate blue) |
| Conflict | Diamond | `#8C3B2E` (brick) |
| Cultural | Circle | `#5E7A3A` (olive) |
| Demographic | Triangle | `#2E6E6A` (teal) |
| Religious sites | Octagon | `#6B4A7A` (plum) |
| Displacement | Ring with outward chevron | `#9A5A1E` (burnt ochre) |
| Economy and daily life | Hexagon | `#8A7420` (brass) |
| Land and settlement | Pentagon | `#9B4467` (rose) |

Eight colors this close in tone need checking on the real basemap. Phase 9C verifies at
least 3:1 contrast against the land tints and adjusts hues if needed.

Clusters are paper-colored circles with an ink count, sized by count.
**Approximate locations** show as a soft, dashed-edge circle area in the category color
at 20% fill instead of a pin. The **selected** marker gets an `--accent` ring and scales
to 1.25x. **Active places** (events in the current year) get a radial `--glow` halo under
the marker that pulses once when it appears and then stays still.

### Motion rules

- One easing curve: `cubic-bezier(0.2, 0, 0, 1)` (fast out, gentle settle).
- Duration scale: `--dur-1 120ms` (hover and press), `--dur-2 240ms` (panels and
  sheets), `--dur-3 300ms` (marker fades), `--dur-4 600ms` (era handle animation).
  Camera flights run 800-1600ms, scaled by distance.
- Nothing loops forever. The glow pulse plays once.
- `prefers-reduced-motion`: all durations become 0, camera moves become jumps, autoplay
  animation is off, and Play steps between events instead.

## 6. Accessibility and performance

### Accessibility (target: WCAG 2.2 AA)

- Everything works by keyboard in a logical tab order, with a visible 2px `--accent`
  focus ring.
- The timeline is a `role="slider"` with `aria-valuetext` such as "1917, British Mandate
  era".
- A live region announces era changes and story steps.
- The panel and sheets use semantic HTML (`article`, `h2`, `ul`). Focus moves in on open,
  is trapped in the mobile sheet, and returns to the opener on close.
- A "Skip to event list" link opens a text list of the events visible in the current
  year. This is the map's text alternative.
- Arabic strings get `lang="ar"` and `dir="rtl"`.
- Tap targets are at least 44x44px. Contrast is AA in both themes.
- `prefers-reduced-motion` and `prefers-color-scheme` are respected, and the manual theme
  toggle overrides the system setting.

### Performance

- Target Lighthouse 90+ on mobile for performance, accessibility, best practices, and
  SEO.
- Smooth drag (no dropped frames on a mid-range phone) with up to 500 events.
- App code under 80 KB gzipped, not counting MapLibre. Story mode and the About modal
  are lazy-loaded.
- `events.json` is split by era if it passes 300 KB. Images are lazy-loaded.
- A clear error state in the UI if data or tiles fail to load.

## 7. Out of scope for v1

- Backend, CMS, user accounts, comments, or reader submissions (corrections go by a
  mailto or form link).
- Historical boundary polygons we draw or guess. Overlays appear only from sourced files
  the owner supplies.
- 3D terrain, map rotation, or pitch.
- Animated movement paths (for example routes of displacement). Candidate for v2.
- The 1946 survey map as a georeferenced overlay. Candidate for v2.
- An Arabic or bilingual interface. Candidate for v2.
- Audio or video narration.
- Offline or PWA mode.
- In-app editing of events (data is edited in `events.json` and validated by script).

## 8. Decisions

Answered by the owner on 2026-11-03.

1. **Title:** Palestine: A Living Map.
2. **Time range:** starts c. 3200 BCE (Early Bronze Age cities) and runs to the present.
   Ongoing events (since October 2023) are included and labelled **"Ongoing"** on the
   card and in the tooltip. Their figures must come from a named source with a date (for
   example UN OCHA), shown as a range where sources differ, with the "as of" date
   visible.
3. **Eras:** ten, contiguous and non-overlapping (exact boundary years can be revisited
   in Phase 2):

   | Era | Years |
   |---|---|
   | Ancient | c. 3200 BCE - 332 BCE |
   | Classical | 332 BCE - 638 CE |
   | Early Islamic | 638 - 1099 |
   | Crusader | 1099 - 1187 |
   | Ayyubid-Mamluk | 1187 - 1516 |
   | Ottoman | 1516 - 1917 |
   | British Mandate | 1917 - 1948 |
   | 1948-1967 | 1948 - 1967 |
   | 1967-1993 | 1967 - 1993 |
   | 1993-present | 1993 - present |

   The Crusader states held parts of the coast until 1291, which overlaps the
   Ayyubid-Mamluk era. Events from those years go in the era by date, and the card text
   explains who controlled the place.
4. **Categories:** eight. Political, conflict (renamed from "military"), cultural,
   demographic, religious sites, displacement, economy and daily life, land and
   settlement.
5. **Modern basemap labels and borders:** shown, but softened (section 5), with a note
   that they are present-day.
6. **1946 survey map:** style reference only in v1. A georeferenced overlay is a v2
   candidate.
7. **Language:** English UI.
8. **Place-name order:** the common English name first. The Arabic name is always shown,
   and no Hebrew name is shown for now (the `nameHe` data field is kept, hidden). Basemap labels show the English name and the Arabic name only. A historical name from the event's time
   (for example *Aelia Capitolina*) can be listed as an alternate.

### Still open (for later phases)

- Whether to hide or label "needs-review" events at launch (decide before Phase 11).
- The topic of the first guided story (Phase 8D).
- The error-report contact for the About modal (Phase 9A).
