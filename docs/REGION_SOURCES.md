# Region data sources (Phase 17a: research only, no code)

For `docs/SPEC_MAP_V2.md` section 7. Nothing here has been downloaded or added to the map. The owner
approves a file and its licence before Phase 17b uses it. **Licences below are what searches on
2026-11-04 showed; each must be re-checked on the dataset's own page before use.** Anything marked
"unverified" is not yet safe to use.

## Candidates

| Source | What it gives | Licence (as found) | Status |
|---|---|---|---|
| [Natural Earth](https://www.naturalearthdata.com/about/) (admin 0, admin 1, [disputed areas](https://www.naturalearthdata.com/about/disputed-boundaries-policy/)) | Present-day countries, provinces, disputed areas; supports several "worldviews" since v5 | Public domain (stated on the site) | Safe to reuse. Present-day only, small scale. Pick the worldview and say so in the legend. |
| [HDX "State of Palestine - Subnational Administrative Boundaries"](https://geo.btaa.org/catalog/2caf8373-816f-458c-9913-71bddb9cab7c) (Palestinian Authority Ministry of Planning, via UN OCHA) | Governorates and lower levels, 2023 reference year | A catalogue record shows rights "Public"; **the exact licence (for example CC BY-IGO) was not confirmed** | Unverified. Open the HDX page and record the licence text. Good for the 1994-present governorates. |
| [geoBoundaries](https://www.geoboundaries.org) (`gbOpen`) | Open ADM0-ADM2 boundaries | CC BY 4.0 for `gbOpen`; the `gbHumanitarian` release mirrors UN OCHA and may be less open | Check which release has Palestine and its licence file. Attribution required. |
| 1946 *Survey of Palestine* 1:250,000 sheets (our `Mappalestine.png`) | Mandate-era districts, sub-districts and the village grid to trace from | UK Crown copyright, which for a 1946 map has probably expired; the National Library of Israel marks at least one related 1946 index map public domain in Israel. No authoritative ruling was found | The owner already planned to confirm the edition. Tracing from it gives `precision: traced` lines, labelled approximate. |
| [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) | Historical world borders by year | Repository metadata says GPL-3.0; the data licence is **unclear** | Do not use until a data licence is confirmed. Its borders are also coarse for this region. |
| UN documents (Resolution 181 and its map, the 1949 armistice agreements and maps, UNISPAL archive) | The defining documents for the partition plan and the armistice lines | UN documents; reuse terms to be checked on UNISPAL | Cite as the defining source (required for contested lines). Geometry would be traced from the UN map. |
| OpenStreetMap | Present-day admin boundaries | ODbL (share-alike and attribution) | Already the basemap's source. Not for historical boundaries. |

## Recommendation for Phase 17b

1. **Present-day governorates (1994 on):** the HDX / OCHA layer, once its licence text is confirmed.
2. **British Mandate districts (1920-1948):** traced from the 1946 Survey of Palestine sheet after the
   owner confirms the edition and that Crown copyright has expired. Label `traced`, "approximate".
3. **1947 partition plan and 1949 armistice lines:** traced from the UN maps, each citing its defining
   document, shown as `plan` and `line` styles with a legend note.
4. **Ancient and medieval regions** (Jund Filastin, Palaestina, the sanjaks): labels only, no polygons,
   as the spec requires, because no licensed map of their extent was found.

## Needed from the owner

- Approve the files above, or name others.
- Confirm the 1946 sheet's edition (see the project rules).
- Say which Natural Earth worldview to use, if it is used at all.

Contested lines (the partition plan, the armistice lines, the 1967 lines) stay neutral: the legend
names the defining document and says the lines are approximate.
