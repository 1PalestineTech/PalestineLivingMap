# How the land itself changed: notes and sources (2026-11-07)

The owner asked for the geography to be shown over time (the Sea of Galilee and a lake that dried up, the Dead Sea, the forming of the mountains). Only the last
century fits the timeline as it stands (it starts at 3000 BCE) and has sourced numbers, so that part is in the map as events and a story. The deep-time part is
recorded here with its sources and the points where they disagree, ready for when a deep-time view is built.

## In the map now

- Events `hula-lake-drained-1951-1958`, `national-water-carrier-1964`, `dead-sea-shrinking-1960s-present`, and the story "The changing land: lakes and water".
- All three are `needs-review`, cite Wikipedia as a last-resort source (pages read through a web-fetch helper; the Dead Sea page was only read verbatim for its lead and
  infobox, so earlier level figures such as "390 m in 1930" were **not** used), and say so in their source notes.
- **Lake outlines from the 1946 sheet (added 2026-11-07, owner approved):** Filters > Geography over time, `src/map/lakes.ts`, data `public/data/control/lakes.geojson` (26 KB).
  Lake Hula and the Dead Sea as the Survey of Palestine sheet (`E:\PalestineBeforeNakba1948.tif`, 1944, reprinted c. 1946) prints them: water for 1944 to 1950, then a dashed
  outline of the 1946 shore against the base map's present-day lakes. The "Changing land" story switches it on.
  - **Method:** the sheet's own Palestine Grid lines (every 10 km; found as dark rows and columns, labelled 290, 280... for northings and 090, 100... for eastings) give a straight map
    from pixel to grid: easting = 90 + (x - 372) / 19.72 km, northing = 290 - (y - 342) / 19.61 km (checked against the grid lines down the whole sheet). The grid is turned into longitude
    and latitude with the Cassini-Soldner formulae of the Palestine 1923 grid. Lake areas were cut out by their flat grey-beige fill, joined across grid lines and text, then outlined and simplified.
  - **Check:** the sheet's Sea of Galilee fitted to the base map's lake: west shore 35.5161 against 35.5162 and south shore 32.7053 against 32.7055 (about 20 m); the east shore differs by about 450 m (the 1946 shore and the marsh edge). Areas: Lake Hula about 12 km2 (Wikipedia: 12-14), Dead Sea about 905 km2.
  - **Printed level:** the sheet prints "-392 (M.W.L. 1938)" on the Dead Sea; it is quoted in the Dead Sea event.
  - **Limits:** about 150 m accuracy; the datum shift from the 1923 datum to today's was not applied (the Sea of Galilee check shows it is small); only these two lakes are drawn (the Sea of Galilee outline was traced but not used). The sheet's edition and copyright status are still to be confirmed.

## Deep time (not on the timeline yet), from the pages read

| Topic | What the sources say | Caution |
|---|---|---|
| Lake Lisan | A prehistoric lake in the Jordan Rift Valley, 70,000 to 12,000 years before present (Wikipedia, *Lake Lisan*); about 2,000 km2, 200 km long, no more than 17 km wide; its sediments run from the Sea of Galilee to about 35 km south of the Dead Sea. | The same page gives its highest stand as "around 160 m below sea level" and also "about 200 m higher than the Dead Sea" (these do not agree), and writes dates as "BC". The Dead Sea page says 70,000 to 14,000 years ago. Use a geological paper (for example Neev and Emery 1967, cited there) before showing a level. |
| Sea of Galilee | The present lake formed less than 20,000 years ago by subsidence and the shrinking of Lake Lisan; Lake Lisan reached north to it. It lies in the Jordan Rift Valley (Wikipedia, *Sea of Galilee*). | The page gives no date for the final drying of Lisan. |
| Lake Hula basin | A pull-apart basin of the Dead Sea Transform north of the Sea of Galilee; a basalt plug on its south side held the river back (*Hula Valley*, *Dead Sea Transform*). | The Hula page gives no age for the lake itself. |
| Dead Sea | In a pull-apart basin where two segments of the Dead Sea Transform step across; present surface 439.78 m below sea level (2025) (*Dead Sea*). | Dead Sea page: only the first part was read verbatim. |
| The rift and the hills | The Dead Sea Transform runs about 1,000 km between the African and Arabian plates, with about 105-107 km of left-lateral displacement; faulting began in the Oligocene and continued in the Miocene; the basalt under the Sea of Galilee was erupted about four million years ago (*Dead Sea Transform*). | The page does **not** say how the Judean hills, Galilee or Carmel formed; those need a geology source before any claim. |

To build a deep-time view, the timeline would need a new scale before 3000 BCE (for example a separate "deep time" strip), and primary geological sources for each stage.

## Israeli settlement over time

There are no polygon boundaries for "Israeli-controlled areas" by year in the project (nothing sourced, and boundaries are never guessed), so no coloured zone is drawn.
What exists instead: the Settlements filter (379 localities from Wikidata with founding years) which, with the timeline, shows localities appearing year by year in their own colour,
and the story "Settlement and land: how the picture changed", which switches the settlements on while it runs. Zones would need sourced boundary files: for example the 1949 armistice lines,
the post-1967 occupied areas, and the OCHA Areas A, B and C (1995).
