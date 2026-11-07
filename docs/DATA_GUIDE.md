# Data Guide: adding an event

All events live in `public/data/events.json`. The shape is defined in
`src/data/types.ts` and `public/data/events.schema.json`. Editorial rules are in
`docs/SOURCING.md`; read them first.

## Steps

1. Read the sources. Don't rely on search snippets.
2. Copy the example below into the `events` array and fill every field.
3. Set `"status": "needs-review"`. Only the owner sets `"verified"`, after checking.
4. Run `npm run validate` and fix every error. Warnings are worth reading too.
5. Commit with a message naming the event(s).

Editors that understand JSON Schema (VS Code, for example) check the file as you type,
because the file starts with `"$schema": "./events.schema.json"`.

## Fields

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Kebab-case, unique, never changed once published (URLs link to it). E.g. `balfour-declaration-1917`. |
| `title` | yes | Short, neutral. |
| `dateStart` | yes | See **Dates** below. |
| `dateEnd` | yes | `null` for a single moment, or a date for events with a span. |
| `datePrecision` | yes | `day`, `month`, `year`, `decade`, or `century`. Use what the sources support, never more. |
| `circa` | no | `true` when sources say "about" or "c.". |
| `ongoing` | no | `true` for events still under way. `dateEnd` must then be `null`. |
| `location` | yes | See **Locations** below. |
| `category` | yes | `political`, `conflict`, `cultural`, `demographic`, `religious-sites`, `displacement`, `economy-daily-life`, `land-settlement`. |
| `era` | yes | Must contain `dateStart`. See **Eras** below. |
| `summary` | yes | Max 60 words, neutral, in your own words (no copied sentences). |
| `details` | no | Longer text shown behind "Read more". Same tone rules. |
| `sources` | yes | At least one: `title`, `url`, `publisher`, `accessedDate` (YYYY-MM-DD), plus optional `author`, `pages`, `note`. |
| `perspectives` | no | For disputed points: `viewpoint`, `claim`, and `sourceIndex` (index into `sources`). |
| `images` | no | `src`, `alt`, `credit`, `license`, `sourceUrl`. Openly licensed only. |
| `status` | yes | `needs-review` or `verified`. |
| `tags` | yes | Kebab-case keywords for search; may be empty `[]`. |
| `editorNote` | no | Internal note for reviewers (not shown in the app), e.g. why coordinates are approximate. |

### Dates

- Format: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Years may be 1-5 digits (`691`, `-3200`).
- **BCE years are negative**, using the normal historical number: `-332` is 332 BCE.
  There is no year 0.
- The shape must match `datePrecision`: `day` = `1948-05-15`, `month` = `1911-01`,
  `year` / `decade` / `century` = year only.
- `decade` uses the first year of the decade (`1920` = the 1920s). `century` uses a year
  ending in `00` (`1800` = the 1800s, i.e. the 19th century CE; `-1300` = the 13th
  century BCE).
- If sources disagree on the day or month, drop to the precision they agree on and say so
  in `editorNote`.

### Locations

- `name` is the common English name. `nameAr` is the Arabic name (always fill it if one
  exists). `nameHe` is the Hebrew name where one exists, else `null`.
- `historicalNames` lists names used at the time, e.g.
  `{ "name": "Aelia Capitolina", "lang": "la", "period": "Roman period" }`.
- `lat` / `lng` in decimal degrees, from a source (note which in the source's `note`).
- `precision`: `exact` for a known building or site, `area` for a town or city, and
  `approximate` for regions or country-wide events (shown as a soft circle, not a pin).
  Explain `approximate` points in `editorNote`.
- Events decided outside Palestine (a conference in Basel, a vote in New York) are placed
  where their effect in Palestine was, usually country-wide with `approximate`
  precision. The venue goes in the summary.

### Eras

| Era id | Years |
|---|---|
| `ancient` | -3200 to -332 |
| `classical` | -332 to 638 |
| `early-islamic` | 638 to 1099 |
| `crusader` | 1099 to 1187 |
| `ayyubid-mamluk` | 1187 to 1516 |
| `ottoman` | 1516 to 1917 |
| `british-mandate` | 1917 to 1948 |
| `1948-1967` | 1948 to 1967 |
| `1967-1993` | 1967 to 1993 |
| `1993-present` | 1993 onward |

Boundary years belong to both neighbouring eras; choose the one that fits the event
(e.g. an event in early 1948 under the Mandate uses `british-mandate`).

## Example

```json
{
  "id": "falastin-newspaper-founded",
  "title": "Falastin newspaper founded in Jaffa",
  "dateStart": "1911-01",
  "dateEnd": null,
  "datePrecision": "month",
  "location": {
    "name": "Jaffa",
    "nameAr": "يافا",
    "nameHe": "יפו",
    "lat": 32.0522,
    "lng": 34.7531,
    "precision": "area"
  },
  "category": "cultural",
  "era": "ottoman",
  "summary": "Cousins Issa and Yousef El-Issa, Arab Christians from Jaffa, founded the Arabic-language newspaper Falastin. It began as a weekly, grew into one of the most influential dailies of Ottoman and Mandate Palestine, and addressed its readers as Palestinians from its first year.",
  "sources": [
    {
      "title": "Falastin",
      "url": "https://en.wikipedia.org/wiki/Falastin",
      "publisher": "Wikipedia",
      "accessedDate": "2026-11-03"
    }
  ],
  "status": "needs-review",
  "tags": ["press", "jaffa"],
  "editorNote": "Sources disagree on 14 vs 15 January 1911, so month precision is used."
}
```

## What the validator checks

`npm run validate` (optionally `npm run validate -- path/to/file.json`) fails on: schema
errors, duplicate ids, invalid dates or year 0, a date shape that doesn't match its
precision, `dateEnd` before `dateStart`, `dateStart` outside the event's era, `ongoing`
with a `dateEnd`, summaries over 60 words, the same title on the same date, missing
sources, and `perspectives` pointing at a source that doesn't exist. It warns about
coordinates outside the Palestine region box, missing Arabic names, approximate
locations without an `editorNote`, future access dates, and events tagged `sample`
or `placeholder`. A `placeholder` event is drafted from general knowledge with no source
read: its source entries are pointers only, its `editorNote` starts with "PLACEHOLDER", and
it must get real, read sources before it can be verified.

## Stories (guided tours)

Stories live in `public/data/stories.json` (shape in `public/data/stories.schema.json` and
`src/data/storyTypes.ts`). Each story has an `id` (kebab-case, never changed once
published), a `title`, an `intro`, and an ordered list of `steps`:

```json
{
  "eventId": "nakba-1947-1948",
  "caption": "At most 40 words, neutral, in your own words.",
  "cameraZoom": 7.5
}
```

`eventId` must be an existing event id. `cameraZoom` (3 to 16) is optional; without it the
map zooms to a level that suits the event's location precision. Stories use the same tone
and sourcing rules as events (`docs/SOURCING.md`): a caption states what the event card
says and never adds facts of its own. Mark unfinished example stories `"placeholder": true`.

`npm run validate` also checks `stories.json`: schema errors, duplicate story ids, step
`eventId`s that don't exist, and captions over 40 words. It warns about placeholder stories.

## Map layers (overlays)

Optional shapes drawn on the map, such as historical boundaries for a period, live in
`public/data/layers/`. `layers.json` lists them (shape in `layers.schema.json` and
`src/data/layerTypes.ts`); each entry names a GeoJSON file in the same folder:

| Field | Notes |
|---|---|
| `id` | Kebab-case, unique, never changed once published. |
| `name`, `description` | Shown in the Filters panel and the map legend. |
| `validFrom`, `validTo` | Historical years (negative = BCE). `validTo: null` means to the present. The layer is shown only while the timeline year is inside this range. |
| `source` | `{ "title": ..., "url": ... }`. The legend links it. Real layers need a url. |
| `license` | The licence or terms the data is published under. |
| `file` | A `.geojson` FeatureCollection in `public/data/layers/`. A feature property `label` is drawn as the map label. |
| `placeholder` | `true` only for invented test layers. |

Only add boundary data you can source; never draw or guess boundaries. The legend always
says "Boundaries shown are approximate; see source." `npm run validate` checks the
manifest, that each file exists and is a GeoJSON FeatureCollection, that `validFrom` is
not after `validTo`, and that real layers have a source url.

## Era place names (`places.json`)

Place names that change over time live in `public/data/places.json` (shape in
`places.schema.json` and `src/data/placeTypes.ts`). The map draws the name(s) valid in the
timeline year, with an Arabic line beneath; hovering or focusing a label shows the name, its
span and its source count, and clicking opens a place card listing every name through time
with its sources and the events within 5 km. Place names are searchable, so "Aelia
Capitolina" finds Jerusalem. Hebrew is never stored or shown here.

| Field | Notes |
|---|---|
| `id` | Kebab-case, unique, never changed once published. Used in the URL as `place=<id>`. |
| `kind` | `city`, `town`, `village`, `site`, `region`, `water` or `mountain`. Regions and water are drawn in spaced capitals. |
| `rank` | 1 (major city) to 4 (minor site). Sets the label size and the zoom it appears at (rank 1 always, 2 from zoom 7, 3 from 8, 4 from 9). |
| `priority` | Optional, 1-9 (default 5). When two labels collide, the lower number keeps its label; cities and towns always beat districts. Used so main cities (Jerusalem 1, Haifa, Jaffa, Gaza, Nablus 2) show before their neighbours. |
| `lat`, `lng` | The label point. The label is drawn beside it (below by default; above, right or left if that avoids a collision), clear of the event pins. |
| `names[].en`, `ar` | English and Arabic forms. `ar` may be `null` only with a `note` that says why. Spellings follow Palestine Remembered (`docs/place-names.md`). **Order (owner rule, 2026-11-05):** where a place has an English exonym, write the Arabic name in English letters first, then the English: `Akka / Acre`, `al-Khalil / Hebron`, `Yafa / Jaffa`. The Arabic-script `ar` field is never changed. |
| `names[].lang` | Language of the name as used at the time (`la`, `grc`, `ar`, `akk`, ...). |
| `names[].from`, `to` | Historical years (negative = BCE, no year 0), both inclusive. `to: null` means in use today. `from: null` means the start is not yet sourced: the name is listed on the card as "Dates not yet sourced" and never drawn. |
| `fromCirca`, `toCirca` | `true` when the source gives the date as approximate. Shown as "c." |
| `names[].sources` | At least one source that attests this name in this span (same shape as an event source). Cite a book by title, publisher, ISBN and page. |
| `names[].note` | Optional. Say who used the name, and how the span was set. |
| `depopulated` | Optional year (villages). From the year after it, the label gains "(depopulated)" and the Arabic "(مهجّرة)". Source: Atlas Table 3.9, named on the card. |
| `group` | Optional, `settlement` for Israeli localities and districts. They are drawn in the accent colour with their own icon, never get a banner, and are hidden by Filters > Settlements, which is **off by default**. Tel Aviv, Netanya, Hadera, Petah Tikva and Rehovot are in this group. |
| `labelPath` | Optional list of `[lng, lat]` points; a region name is drawn along this line (curved lettering) instead of at `lat`, `lng`. Use only for regions. |
| `status` | Everything new is `needs-review`. Only the owner sets `verified`. |

Names valid in the same year are drawn together in their listed order ("A / B"). Years where
no name is attested draw nothing. Keep spans from overlapping unless that is deliberate.

`npm run validate` checks the schema, unique ids, `from` not after `to`, no Hebrew script,
`ar: null` having a note, a null `from` only on a `needs-review` place, and warns about
coordinates outside the region box, overlapping spans and future access dates.

## Animated paths (`paths.json`)

Routes that draw themselves live in `public/data/paths.json` (shape in `paths.schema.json` and
`src/data/pathTypes.ts`). A path belongs to one event. While the event is on the timeline its line
draws from the first waypoint to the last, with a moving head; afterwards it stays as a faint trail
for `lingerYears`, then goes. While the timeline plays the drawing takes about 2.6 seconds; when you
scrub, or with reduced motion, the whole drawn length jumps to match the year. Clicking a path opens
its event card, which gains a "Route:" line.

| Field | Notes |
|---|---|
| `id`, `eventId` | Kebab-case. `eventId` must be an event in `events.json`. |
| `kind` | `campaign` (dashed, with arrowheads), `route` (dotted), `displacement` (solid, with arrowheads), `railway` (thin solid). |
| `shape` | `schematic`: a gentle curve between waypoints, and the card says "approximate". `traced`: follows `geometryFile`, a GeoJSON LineString in `public/data/paths/`. |
| `waypoints` | At least two: `name`, `lat`, `lng`, and `date` (`YYYY`, `YYYY-MM`, `YYYY-MM-DD` or null). Every waypoint is a place named in a source for the event. Undated waypoints are spaced evenly in time between dated neighbours. |
| `lingerYears` | Years the trail stays after the event ends. |
| `sources` | At least one. A traced path cites the map it was traced from (title, year, scale, licence). |
| `status` | `needs-review` until the owner verifies it. |

The timeline moves in whole years, so a campaign that sits inside one year is complete in that year.
Railway cross ticks are not drawn yet (a thin solid line stands in). `npm run validate` checks the
schema, unique ids, that the event exists, waypoint dates in order (and inside the event's span, as a
warning), coordinates in the region box (warning) and that a traced path's geometry file exists.

## Threads (`threads.json`)

A thread follows one subject (a person, a place or a theme) through time (shape in
`threads.schema.json` and `src/data/threadTypes.ts`). "Follow" in the top bar lists them; picking one
shows a "Following: ..." chip with Previous, Next and a close button, dims every marker and path
outside the thread to 30%, marks the thread's events on the timeline track, and, as the year passes
each event, eases the camera to it and opens its card. `thread=<id>` in the URL restores it. A story
is a fixed narrated tour; a thread is a filter and camera-follow you drive with the timeline.

| Field | Notes |
|---|---|
| `id`, `kind` | Kebab-case id; kind is `person`, `place` or `theme`. |
| `title`, `titleAr` | Shown in the list and chip. |
| `intro` | At most 60 words, restating only what the event cards say, with attribution. Threads add no new claims. |
| `eventIds` | At least three, listed explicitly (tags are free-form, so they build no threads). |
| `pathIds`, `placeIds` | Related paths and era-label places (checked to exist). |
| `status` | `needs-review` until the owner checks the intro against the cards. |

Thread mode is announced in a live region. Dimming covers markers, paths and the era labels of places outside the thread (a thread's
`placeIds` keep theirs), and the event list view shows only the thread's events.
