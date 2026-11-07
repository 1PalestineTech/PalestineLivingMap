# Control of the land by year (Filters > Control of the land)

Owner request (2026-11-07): show how Israel's control grew from 1948, with the whole land as Palestine before. Off by default; the story "Settlement and land" switches it on.
Code: `src/map/control.ts`; data: `public/data/control/control.geojson` (121 KB, built by hand from the two files below; the build script is not in the project, see "Rebuilding").

## What is drawn

| Years | Green (Palestine) | Blue (Israeli control) | Lighter blue (occupied territory) |
|---|---|---|---|
| 1917 to 1948 | The whole land west of the Jordan (the Mandate area) | | |
| 1949 to 1966 | West Bank (Jordanian rule) and Gaza (Egyptian administration) | Israel within the 1949 armistice lines | |
| 1967 to 1993 | | Israel within the 1949 lines | West Bank and Gaza, occupied by Israel from June 1967 |
| 1994 on | Gaza (Palestinian Authority from 1994) | Israel within the 1949 lines | |
| 1995 on | West Bank (Areas A and B, Palestinian Authority) | as above | Area C, Israeli-declared East Jerusalem and H2 (Hebron) |

Gaza is drawn green from 1994 although Israel kept control of its airspace, waters and crossings and the UN and others say that is effective control (see the event card for 2005). The 1948 war year shows the whole land green; the armistice lines are drawn from 1949 (control changed through 1948).

## Sources

- **Outlines of Israel, the West Bank and Gaza:** Natural Earth 10 m admin-0 countries (public domain), `ne_10m_admin_0_countries.geojson` from github.com/nvkelso/natural-earth-vector. Israel's polygon there excludes the West Bank and Gaza; the Golan Heights were cut away at longitude 35.62. Natural Earth draws these lines by de facto control; its scale (1:10 million) makes them rough, so they do not match the base map's own lines exactly.
- **Area C, East Jerusalem (as declared by Israel), H2:** "State of Palestine - Oslo Agreement in the West Bank" (shapefile), Palestinian Authority Ministry of Planning, published on the Humanitarian Data Exchange by OCHA oPt (2004 data, issued 2015), https://data.humdata.org/dataset/d3a843df-a640-4e9d-b867-8ca974c2aa74. Licence on HDX: "Other", the legacy HR.info terms of use (https://data.humdata.org/about/license/legacy_hrinfo). **Read those terms and confirm they allow public use before the site goes live.** Area B is not in that file and is not drawn separately (the West Bank outline underneath stands for A and B).
- The shapes were simplified (about 130 m for the outlines, 65 m for Area C).

## Limits

- Approximate and schematic: **not boundaries**. The legend says so.
- No intermediate states (the Partition Plan lines, the 1948 front lines, settlement blocs, the barrier, Gaza after 2005 beyond the note above). They need sourced files; OCHA also publishes the barrier route and settlement footprints.
- The picture the owner attached (Al Jazeera, based on UN OCHA, CC BY-NC-SA) was used only as a guide to the idea; none of its drawing was copied or traced.

## Rebuilding

The files were joined with a small script (polygon clipping and simplification) kept outside the project. To redo it: download the two files above, cut Israel at 35.62, simplify, and write features with `kind` (palestine, israel, occupied), `from`, `to` (null for the present) and `label`.
