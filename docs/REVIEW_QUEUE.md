# Review queue for the owner (2026-11-04)

Everything below was done without waiting for answers, as asked. Each item says what was assumed and what to check. Nothing is
`verified`; all new data is `needs-review`.

## 1. Decisions waiting for you

| # | Question | What I did meanwhile |
|---|---|---|
| 1 | Depopulated villages after their depopulation year. | Done as you asked: they keep showing, with "(depopulated)" / "(مهجّرة)" after the name. Check the year of each (Atlas Table 3.9). |
| 2 | Israeli settlements. | Done: 379 localities and 6 Israeli districts, `group: "settlement"`, drawn in an accent colour with their own icon, and switched on and off in Filters > Settlements. Names and positions come from Wikidata (CC0); all `needs-review`. The filter note says most states and the UN consider settlements in occupied territory illegal under international law and that Israel disputes this; check the wording. |
| 3 | Israeli districts. | Added with the settlements (6). Mandate districts and present governorates were already in. |
| 4 | Change the status words on event cards (for example "Occupied" in UN wording)? | Left as the sources word them. |
| 5 | Painted base map (Tier 2). | Exact prompts for ChatGPT and Midjourney are in `docs/BASEMAP_PROMPTS.md`. Code-drawn inked and painted looks stay until you have an image. |
| 6 | Village borders and region outlines. | Still not added. Downloading the datasets (for example HDX West Bank village boundaries, CC BY) needs your explicit yes for each file, and the licences are in `docs/VILLAGE_SOURCES.md` and `docs/REGION_SOURCES.md`. No outlines or traced lines were drawn from memory or from the Atlas. Confirm the 1946 sheet's edition and copyright. |
| 7 | Self-host the UI fonts (needs downloading font files) to remove Google Fonts. | Still external, set to `display=optional` to avoid layout shift. |

## 2. Data to check

- **Places** (`public/data/places.json`, now 248): all `needs-review`.
  - Era names for the 12 Masalha-sourced places start at the first year this dataset has a source, not the name's first use; two end years are inferred (Jerusalem's *Iliya*, Nablus's *Flavia Neapolis*).
  - 24 cities and towns, 6 Mandate districts and 16 governorates: label points are approximations, Arabic forms for governorates and Tel Aviv are standard forms not read from the sources, and the PCBS table and Wikipedia district page were found by search and not read in full.
  - **190 villages** (147 + 43) from the Abu-Sitta register: matched to Wikidata by name or alias. At least one wrong close match was seen earlier (*Yarda* / *Ya'ara*), so spot-check against Table 3.9. 13 ambiguous and 9 out-of-sub-district matches were dropped. About 235 register villages still have no Wikidata match.
- **Threads** (6): intros are written from the event cards and must be checked against them. New: Jerusalem, Gaza, Jaffa, "The name Palestine in texts and maps".
- **Paths** (3): the Napoleon, Dahir al-Umar and Jaffa-Jerusalem railway lines are schematic curves between named places, not routes. Tiberias's point is general knowledge.
- **Page numbers**: every Masalha page number is estimated from the owner's PDF and flagged as unconfirmed.
- **Atlas tables**: the register was read from PDF text and may have mis-read rows; only names, sub-district and depopulation year were used.

## 3. Quality status

- **Lighthouse on the inked look (mobile, headless Chrome, software graphics)**: performance 56, accessibility 100, best practices 100. FCP 1.2 s, LCP 3.9 s,
  CLS 0.099, TBT 2.7 s. Phone width (375 px) loads and shows the plates and region name; software graphics take about 15 s to finish drawing there.
  Earlier run on the painted look: performance 55, TBT about 7 s.
  TBT is almost all MapLibre's main-thread work under software rendering; a real phone GPU would score higher, but this is unmeasured.
  Done: first paint stays flat and light (3D tilt and landscape patterns switch on after the first draw), pixel ratio capped at 1.5, timeline height reserved,
  fonts `display=optional`. Not done: split `places.json` (about 350 KB, about a tenth of that gzipped) so villages load lazily.
- **Console**: four HTTP 500 messages appear in the dev server only; none in the production build run.
- **Not tested by me**: reduced motion with the tilt in a real browser setting; screen readers; keyboard walk through every new control.

## 4. Look

- Tilted view is the default with a flat-view button; banners on cities and towns; landscape patterns from land cover; night mode button;
  edge fade now 12 smooth rings.
- Known: patterns repeat on a grid up close; banners get small at wide zoom; some close neighbours (Ramla/Lydda, Tulkarm/Qalqilya) hide each other until zoomed in.

## 5. Not started

- Done in this pass: era names for Ottoman sanjaks, the Kingdom of Safad, the Mutasarrifate of Jerusalem, the Vilayet of Beirut and Scythopolis (as region labels, all `needs-review`); four displacement paths (schematic curves between places named in the event sources; they say "approximate").
- Traced path and boundary lines (needs the approved licensed maps; see item 6 above).
- Villages that still exist, the remaining register villages without a Wikidata match, and the 1871-77 atlas index as an earlier attestation (left for later, as you asked).
- Places now number 1,479 (1,468 before the book was read): the 635 above plus 833 from the owner's Palestine Remembered file (265 destroyed villages, 568 present towns). See the last section of `docs/VILLAGE_SOURCES.md`. The file has no borders, so none were added.

## 6. Offline edition

`npm run package:offline` makes `share/PalestineLivingMap-offline.zip` (about 18 MB) to send to people. See `docs/OFFLINE.md`. Not tested on a Mac or on a Windows machine without this one's browser; the Mac launcher needs Python 3.

## 7. Changes of 2026-11-05 (owner requests)

- **Settlements** filter is now **off by default**. Tel Aviv, Netanya, Hadera, Petah Tikva and Rehovot are in the group (shown only when it is on), as are the earlier 379 localities and 6 districts. The basemap's own labels for other Israeli towns are not part of the filter.
- **Name order:** towns, cities and regions with an English exonym now read Arabic-in-English-letters first, then English (`Akka / Acre`, `al-Khalil / Hebron`, `Yafa / Jaffa`, `Tabariyya / Tiberias`, `Bayt Lahm / Bethlehem`, `Ariha / Jericho`, `al-Nasira / Nazareth`, `Jinin / Jenin`, `Ghazza / Gaza`, `Isdud / Ashdod`, `al-Tantura / Dor`, `Qaysariyya / Caesarea`, `al-Lidd / Lydda`, `Bir al-Sab' / Beersheba`, `Filastin / Palestine`). Arabic script is unchanged. Districts and governorates were left as they are (no sourced Arabic transliteration in the data).
- **Story "Intro to Palestine: the story in order"** (32 stops, `public/data/stories.json`): follows the order of the five-part "Intro to Palestine" series by Handala on Quora (read in a browser; used as a research map only, never cited on cards) and Masalha. Each caption restates its event card; the series is named in the story intro as a Palestinian-perspective explainer. All events were already in the data; no new facts were added. Check the captions against the cards.
- **Tool names removed** from the docs and from the place source notes ("the project rules" replaces the file name). The rules file itself and the editor's settings folder stay in the project (the tooling needs them) but are left out of the source zip (`.gitattributes`) and the site. Earlier commit messages carry an attribution line; rewriting history to remove it was **not** done (it changes every commit id); say if you want it.
- **All That Remains** (owner's scan, read by OCR): about 330 existing villages cite it, 12 missing ones were added, and the 42 places whose grid reference disagreed with our position are listed at the end of `docs/VILLAGE_SOURCES.md`. Figures in notes are machine-read: check them against the print. About 18 entries (Beersheba, Nazareth, Tulkarm running heads) were not read yet.
- The accessible place list and the search no longer include Israeli localities while the Settlements filter is off.
- **First-visit defaults changed (2026-11-07):** day mode, painted look, tilted view, present day, and the short tour opening on load. Saved choices still win. The inked look is now the optional one.
- **Defaults (2026-11-08 request):** the District areas blocks and lines are off by default and switch on while any story runs. New stories: "The changing land: lakes and water" (3 stops, 3 new events on Lake Hula, the National Water Carrier and the Dead Sea) and "Settlement and land: how the picture changed" (15 stops; switches the Settlements on while it runs). See docs/GEOGRAPHY_NOTES.md for what could and could not be sourced.
- **Control zones (2026-11-07):** Filters > Control of the land (off by default; on in the settlement story). Sources and limits in docs/CONTROL_ZONES.md. **Check the HDX licence terms before launch.**
- **Defaults:** District blocks and lines are on again by default (and give way to the control zones when those are on). Madaba and Aylah (Aqaba), outside Palestine, now show only while their own events or cards are open (`contextEvents` in places.json). The placemark "Lake Hula - Drained" was removed from the villages (it is a drained lake, not a village).
- **Geography as pictures (done 2026-11-07):** Filters > Geography over time shows Lake Hula and the Dead Sea as the 1946 sheet prints them (water to 1950, dashed shore after); the "Changing land" story switches it on. Method and checks in docs/GEOGRAPHY_NOTES.md. Confirm the 1946 sheet's edition and copyright before launch.

## 8. Batch of 2026-11-08
- **Clicks:** a place label under the pointer now beats a marker that only overlaps it (markers win only within 14 px of their centre).
- **Filters:** no categories are selected by default and none can be selected; the empty-state message is gone. The open event (story step, link, search) shows even if its category is off. URLs use cats=all for every category.
- **Zones filter renamed** "Occupation of Palestine since 1948"; **flat view is the default again**.
- **Story and full card** share progress: Open full card remembers the step and closing the card returns to it.
- **Village card:** sub-district, occupation date and 1948 population (Palestine Remembered, 453 villages), 1944/45 population (All That Remains, OCR), and Israeli localities named in the book that match our settlement places (33). Cards of those localities link back. Machine-read figures are flagged on the card.
- **Share button, preview image, Report a mistake:** see docs/DEPLOY.md for VITE_SITE_URL and VITE_FEEDBACK_URL. **Needs your Discord channel link or an email** to point reports at.
- **Search** understands sets: "villages of Safad depopulated 1948" offers "Show all N matching places on the map" (labels only those, camera fits them, a chip clears it). Arabic names were already searchable.
- **Speed:** light mode (docs/DEPLOY.md). Lazy-loading villages was not done: the places file is parsed once and was not the main cost.
- **Arabic interface and right-to-left:** button in the top bar; buttons, filters, eras, card headings and the About text are translated; event and place texts stay English. Please have a native speaker check the Arabic wording.
- **Roads and railways from the 1946 sheet: not done.** The scan has thick hand-drawn black ink loops over the railway lines (for example around Latrun and Jerusalem), so the printed lines cannot be traced reliably. OpenStreetMap has old railway lines but without dates. A sourced list of line openings (Jaffa-Jerusalem 1892 and so on) is needed to draw them by year.

## 9. Sharing and community (2026-11-08, second batch)
- **Share as image** on every card (1200 x 630 picture with the name, Arabic name and key facts; phones use the share sheet, computers download it and copy the link).
- **Embed mode:** `?embed=1` (and `&timeline=0`); About > Copy embed code. **Compare two years:** Filters > Compare two years (a wipe slider; the map cannot be moved meanwhile).
- **Add a missing village** form and **What's new** list (About panel, with a dot for unseen news). Both feed the same report format. Nothing is stored by the map: reports go where `VITE_FEEDBACK_*` points. **Set-up for Discord is in docs/DISCORD_SETUP.md.**
