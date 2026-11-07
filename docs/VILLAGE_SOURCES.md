# Village data sources (research only, no code or data added)

For the owner's request of 2026-11-04: every village and town in its right place, with its own border where one
exists, across the whole land (no West Bank / Gaza / 1948 split). **Nothing here is downloaded or on the map.**
Licences are what searches on 2026-11-04 showed; each must be re-checked on the dataset's own page, and the owner
approves the list before any import. "Unverified" means not safe to use yet.

## Candidates

| Source | What it gives | Licence (as found) | Coverage | Status |
|---|---|---|---|---|
| [Palestine Open Maps](https://pom-frontend.pages.dev/en/about) | Searchable pre-1948 maps (up to 1:20,000) with population centres, roads, property boundaries; villages marked as remaining, depopulated or built over | The site says the **maps** are public domain (UK Copyright, Designs and Patents Act 1998). The **data licence is not stated** in what I found; the project says it aims to open-source its data | Whole land, Mandate era | Unverified for data. Ask the project, or read its repository's licence file. |
| HDX "Village boundary in the West Bank" (found via the [catalogue record](https://geodev.btaa.org/catalog/8e88b6e5-c8e8-45b3-afa1-268530aadae1)) | Village boundary polygons made during the British Mandate | Listed as **CC BY** on HDX; the catalogue's rights field says "Public". Not confirmed on the HDX page | **West Bank only** | Usable once the licence text is confirmed, but it covers one part of the land, which would reintroduce the split. Needs an equivalent for the rest. |
| *Village Statistics, 1945* (Government of Palestine, Department of Statistics, April 1945; reprinted by [Hadawi, PLO Research Center, 1970](https://en.wikipedia.org/wiki/Village_Statistics,_1945)) | Per village: name, population by religion, land area in dunams, a Palestine Grid reference | Copyright status **not confirmed** (a 1945 government publication; reprints and scans are on Palestine Remembered and the National Library of Israel, terms unchecked) | Whole land | Facts (names, figures) can be cited. The Palestine Grid reference is not lat/long, and no coordinates are in it. |
| [PalQuest](https://palquest.palestine-studies.org/en) (Institute for Palestine Studies) | Interactive encyclopedia with a places section and a destroyed-village search | **No licence or terms found** | Whole land | Research map only, as the project rules says. Ask the Institute for permission before importing. |
| [PLANDS village database](https://www.plands.org/en/Villages-Database) | About 500 depopulated villages: maps, aerial photos, reports; coordinates on the Palestine Grid 1923 | **No licence found**; data requests go through a form | Depopulated villages | Ask for permission. |
| [Wikipedia: list of depopulated towns and villages (1947-49)](https://en.wikipedia.org/wiki/List_of_towns_and_villages_depopulated_during_the_1947%E2%80%931949_Palestine_war) and the per-village pages | Names and coordinates for each depopulated village; many pages cite the 1945 statistics | Wikipedia text is generally CC BY-SA (share-alike; **not verified here**); a table, not a bulk dataset | Depopulated villages | Possible for names and coordinates with attribution. The coordinates' own origin is not stated on the pages. |
| Khalidi, *All That Remains* (Institute for Palestine Studies, 1992) | A gazetteer of 418 depopulated villages with location and history | A published book | Depopulated villages | Cite for facts; never copy text. |
| Nakba Archive georeferenced locations (2025 paper) | Named locations mentioned in interviews, georeferenced | Licence not in the excerpt | Interview places | Unverified. |
| OpenStreetMap community thread on [West Bank locality polygons](https://community.openstreetmap.org/t/administrative-polygon-boundaries-for-palestinian-localities-in-the-west-bank/104547) | Pointers to locality boundary datasets | The thread notes one dataset with "No License Provided. Request permission to use" | West Bank | Do not use without permission. |
| OpenStreetMap / Wikidata (not searched) | Current villages; Wikidata holds coordinates for many depopulated villages | OSM is ODbL (share-alike, attribution). Wikidata is believed to be CC0 (**not verified here**) | Whole land | Worth checking next: a Wikidata query could give names and coordinates under a clear licence. |

## What this means

- **Positions** for a whole-land list can plausibly come from Wikidata or OSM (clear licences, to be verified), with
  Wikipedia as a cross-check. That avoids copying any one project's database.
- **Village names, populations and areas** can be cited to the 1945 *Village Statistics* (facts, with the Hadawi
  reprint as the readable edition) once its copyright status is checked.
- **Individual village borders** exist as open data only for the West Bank (HDX, Mandate era). There is no verified open
  polygon set for the rest of the land. Without one, village borders stay as the basemap's municipal limits; I would not
  trace any by hand, per the boundary rules in `docs/SOURCING.md`.
- **Scale:** the 1945 statistics list about 1,000 villages and towns. As era labels they would be rank 4, appear from
  zoom 9 and need a performance check.

## Needed from the owner

1. Approve a position source (Wikidata, once its licence is confirmed, or another).
2. Approve citing the 1945 *Village Statistics*, and say whether to write to the Institute for Palestine Studies and PLANDS
   for permission.
3. Decide whether West Bank-only village boundaries (HDX) are acceptable, or whether village borders wait for a
   whole-land source.
4. Confirm that each village goes in as `needs-review`, with a start date from a source (the 1945 statistics give 1945).

## Wikidata check (2026-11-04)

**Licence: confirmed.** [Wikidata:Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing) says structured data in the
main, property and lexeme namespaces is CC0 (public domain). Attribution is not required; we would credit it anyway.

**Query run:** every item in a bounding box around the land (lat 29.4-33.4, lng 33.9-35.95) that is an instance of village,
town, city, big city, hamlet, human settlement, municipality or "depopulated Palestinian village" (Wikidata Q12232785),
then trimmed with a rough edge so Jordan, Lebanon, Syria and Sinai are left out. Raw results stay out of the repository;
the candidate list is [`docs/candidates/wikidata-places.csv`](candidates/wikidata-places.csv) (name, Arabic name, lat, lng,
kind, flags).

| | Count |
|---|---|
| Candidates | 1,861 |
| Depopulated Palestinian villages | 355 (of roughly 530 recorded elsewhere, so about two thirds) |
| Villages | 393 |
| Towns | 107 |
| Cities (incl. big cities) | 123 |
| Hamlets, municipalities | 28 |
| Other "human settlements" | 855 (mostly Israeli localities, kibbutzim and West Bank settlements) |

**Problems found (why this needs approval, not just import):**
1. **Not complete.** About a third of the depopulated villages are missing, and nothing says which. The 1945 *Village
   Statistics* would be the checklist.
2. **Positions are uneven.** Some entries are a village centre, others a rough point. 267 entries lie within 400 m of
   another entry (often the same place twice, such as an old village and its successor).
3. **47 entries have no English label and 534 have no Arabic name** (mostly Israeli localities). Names would need
   Palestine Remembered spellings (`docs/place-names.md`) and an Arabic form before use.
4. **Country tags split the land** (Wikidata files places as "Israel" or "Palestine"), so they are not used for anything here.
5. **The edge is rough.** A few places near the Lebanese, Jordanian or Syrian borders may belong to the other side.
6. **No dates.** Wikidata does not say when a name was in use, so each place still needs a sourced start year
   (the 1945 statistics give 1945) and `needs-review`.
7. **Settlements** are listed because you asked for all villages and towns; Israeli localities and West Bank settlements are in
   that group. Say whether to keep, flag or leave them out.

**Suggested rule if approved:** import only entries that (a) appear in the 1945 *Village Statistics* or on the 1946 sheet,
so each has a citable source and year, or (b) are today's cities and towns; use Wikidata only for the position; draw them as
rank-4 labels from zoom 9; keep all as `needs-review`.

## Abu-Sitta's atlases (owner-supplied PDFs, E:\Atlas, 2026-11-04)

Two files: *Atlas of Palestine 1917-1966* (Palestine Land Society, London, 2010; the PDF is the English edition) and
*Atlas of Palestine 1871-1877* (Palestine Land Society, 2020). Both are copyrighted (Abu-Sitta); the project rules allows
citing them for facts, never copying text or tracing maps. The PDFs are not in the repository. Text was extracted
locally to check what each holds.

| Book | What it holds that we can use | How to cite |
|---|---|---|
| *Atlas of Palestine 1917-1966* | **Table 3.9, the Al Nakba Register**: for each depopulated locality, its sub-district, depopulation date, 1948 Arab population and land area (PDF pages 118-125). Section 2.4 explains the 1945 *Village Statistics*; section 2.10 covers selected towns and villages. It counts 773 localities lost, 530 depopulated (the text compares this with Morris's 369 and Khalidi's 418). | Abu-Sitta, *Atlas of Palestine 1917-1966*, Palestine Land Society, London, 2010, Table 3.9 and page. The printed page numbers still need checking against the PDF page numbers. |
| *Atlas of Palestine 1871-1877* | An index of **13,534 names** (9,896 specific names) from the Palestine Exploration Fund's Survey of Western Palestine, in English and Arabic, with grid references (Index, from PDF page 518). This attests many village names in **1871-1877**, which is an earlier, citable start year than 1945. | Abu-Sitta, *Atlas of Palestine 1871-1877*, Palestine Land Society, London, 2020, Index and page; the underlying survey is the PEF *Survey of Western Palestine* (1871-1877). |

**What I did with them.** I parsed the register and compared its village names with the Wikidata candidates
([`docs/candidates/atlas-register-vs-wikidata.csv`](candidates/atlas-register-vs-wikidata.csv): atlas name, sub-district,
depopulation year, the matching Wikidata entry and its coordinates, and how sure the match is). Only the minimum facts
are in the repository; population and land figures are not copied.

| | Count |
|---|---|
| Register rows my parser read | 454 (of about 530; rows with unusual layout were skipped) |
| Exact name match to a Wikidata entry | 176 |
| Close match, needs checking | 43 |
| No match | 235 |

**Why this is not yet an import list**
1. Name matching is weak: spellings differ between the atlas and Wikidata, and I saw at least one wrong close match
   (for example *Yarda* matched *Ya'ara*). A person must confirm each match, or a second source (the 1945 *Village
   Statistics* grid references) must settle it.
2. About half the register has no Wikidata entry, so positions for those would have to come from elsewhere. The atlases'
   own maps cannot be traced.
3. The atlas gives the end of a village (depopulation) but not its start; the 1871-1877 index could give the start for
   villages in the Survey area, but its Arabic text did not extract and its names need matching too.
4. Dates and populations are Abu-Sitta's figures; contested numbers must be shown with attribution
   (`docs/SOURCING.md`).
5. Parsing the PDF text may have mis-read some rows. The CSV is a review aid, not verified data.

**Suggested next step:** approve a small pilot (the 176 exact matches, each `needs-review`, cited to Table 3.9, with
Wikidata positions) and judge how it looks on the map before doing the rest.

## Pilot added (2026-11-04)

147 villages from the 176 exact matches are now in `places.json` as `needs-review` rank-4 places, cited to Table 3.9 of
the Atlas (and to their Wikidata item for the position). Dropped: 13 whose name matched several Wikidata items, 9 whose
Wikidata position fell outside the register's sub-district, and 7 that lie within 1.5 km of a place already on the map.
Each runs from 1945 (the 1945 gazetteer is the source the atlas names for its village names) to its depopulation year,
so it shows until then and not after. Showing them afterwards as remembered sites is a choice for the owner. `places.json`
is now about 340 KB (about a tenth of that gzipped); if the full 1,800-place list goes in, it should be split by region
and loaded as you zoom in.

## Owner-supplied files (E:\, 2026-11-04) and what they contain

| File | What it is | Used for |
|---|---|---|
| `Palestine.KMZ` (347 KB, unzips to `Palestine.kml`, 10.6 MB) | The Palestine Remembered "All That Remains" Google Earth file: **3,916 points and nothing else** (no polygons, no lines). Styles: 727 destroyed towns, 496 West Bank towns, 21 Gaza towns, 214 Palestinian towns in Israel, 57 refugee camps, 1,338 Israeli towns, 957 highway points, 94 railway points. Each placemark has an English name, Arabic name, district, and sometimes an occupation date and a population figure. | Added **833 places** (below). The page text, pictures and links were not copied. Israeli towns, camps, highway and railway points were not used. |
| `PalestineBeforeNakba1948.tif` (39 MB, 3110 x 8600, 250 dpi, no georeferencing) | The same 1946 Survey of Palestine 1:250,000 North and South sheets as `Mappalestine.png`, in layered colour, with a signature and **hand-drawn black ink lines** (not part of the print). It shows no village or district boundaries. | Reference only. Nothing traced. |
| `Palestine1948MainRoadsAndRailways.gif` (692 x 1164) | A schematic map marked "Copyright PalestineRemembered.com". | Not copied or traced (copyrighted). Our railway path stays sourced from the books and the Survey sheet. |

**There are no village borders or region outlines in any of the three files**, so none were added. Drawing cells between village points
would invent borders, which the data rules forbid. Real outlines would need a surveyed dataset (for example the 1945 Village Statistics
land-ownership maps, or HDX village boundaries for the West Bank); see the table above.

### What the import added (`public/data/places.json`, 635 to 1,468 places)

- **Destroyed villages** (265 new): `kind: village`, rank 4, `depopulated` from the placemark's occupation date (1947 to 1949). Where the page gives
  no date the year is 1948 and the name's note says it is an approximation. The "1945" start year is the Village Statistics date, not a founding date.
- **West Bank, Gaza and Palestinian towns in Israel** (568 new): shown from the year of the population figure the page gives (2007 for most, 1961 to 1982 for a few);
  earlier years are not yet sourced, so these appear only on the late timeline.
- **Skipped as already present:** 265 (matched within 1.2 km, or within 5 km with the same name or Arabic form; Israeli settlements were not counted as a match, because they
  stand on destroyed villages' land).
- **Every one** is `needs-review`, cites the placemark's PalestineRemembered.com page as a community-compiled source, and says so in its note.
  Positions are Palestine Remembered's, not checked against the Survey of Palestine. Arabic forms are as the page gives them (some are
  double names such as "عرب السمني/ الصوانة"). Rename "Khirbat X" spellings to match the Atlas if you prefer.
- **Expect some overlap and mismatches:** the duplicate check is by name and distance only. Spot-check places near each other.

## All That Remains (Khalidi, 1992; owner-supplied scan `E:\allthatremains.pdf`, 2026-11-05)

The owner added a 690-page scan of Walid Khalidi (ed.), *All That Remains: The Palestinian Villages Occupied and Depopulated by Israel in 1948*
(Institute for Palestine Studies, Washington, D.C., 1992; a Google Books digitisation, so no text layer). It is copyrighted: only facts are used, no text or photographs.

- **How it was read:** each page was rendered and run through OCR (Tesseract) on this computer. Village entries are alphabetical within each sub-district
  (the running head reads "ACRE • al-Bassa"), so 400 entries were found by their running heads (about 18 of the book's roughly 418 villages are still missing, mostly in Beersheba, Nazareth and Tulkarm sub-districts, whose running heads the OCR garbled) and still need a pass.
- **What was added (`public/data/places.json`):**
  - **about 330 villages** gained a citation to the book (title, editor, publisher, year, page), plus a note in `editorNote` with its sub-district and, where read,
    the 1944/45 population and the occupation date in the text. A village counted as matched only if its name matched and its Palestine Grid reference
    (PGR, converted to latitude and longitude; checked against known points to within about 0.7 km) fell within 4 km of our position, or the grid reference
    alone put an existing place within 2 km.
  - **12 villages** the book lists and we lacked were added (position and Arabic form from the Palestine Remembered file): Tarbikha, 'Arab Suqrir, al-Sawamir,
    al-Ghubayya al-Tahta and al-Fawqa, Barqusya, Ijlil al-Shamaliyya, Khirbat Ism Allah, Ma'lul, Mallaha, Majdal Yaba, Khirbat al-Buwayra.
  - Printed page numbers are the book's own where the scan shows them; otherwise "PDF n".
- **Machine-read figures need checking against the print:** OCR can drop or change digits. Populations and dates are in notes only, flagged as machine-read; none was
  used to change a `depopulated` year.
- **Not annotated (about 42 entries):** the name matched a place of ours, but the book's grid reference is far from it (more than 4 km). Either the OCR misread the
  reference, the name belongs to a different village, or our position is wrong. These need a manual look:

  - al-Kabri (Acre): al-kabri is 8.5 km from the grid reference
  - Kafr 'Inan (Acre): kafr-inan is 8.2 km from the grid reference
  - al-Manshiyya (Acre): al-manshiyya-2 is 55.0 km from the grid reference
  - al-Nabi Rubin (Acre): nabi-rubin is 115.6 km from the grid reference
  - al-Sumayriyya (Acre): al-sumayriyya is 8.6 km from the grid reference
  - al-Fatur (Baysan): al-fatur is 10.3 km from the grid reference
  - Sirin (Baysan): sirin is 24.4 km from the grid reference
  - Tall al-Shawk (Baysan): tall-al-shawk is 10.4 km from the grid reference
  - Yubla (Baysan): yubla is 7.2 km from the grid reference
  - 'Iraq al-Manshiyya (Gaza): iraq-al-manshiyya is 9.1 km from the grid reference
  - al-Khisas (Gaza): al-khisas is 201.3 km from the grid reference
  - 'Arab Zahrat al-Dumayri (Haifa): arab-zahrat-al-dumayri is 5.1 km from the grid reference
  - Burayka (Haifa): burayka is 4.8 km from the grid reference
  - al-Butaymat (Haifa): al-butaymat is 15.5 km from the grid reference
  - Khirbat al-Damun (Haifa): khirbat-al-damun is 10.1 km from the grid reference
  - Jaba' (Haifa): jaba-2 is 43.8 km from the grid reference
  - Kabara (Haifa): kabara is 24.8 km from the grid reference
  - Khubbayza (Haifa): khubbayza is 10.1 km from the grid reference
  - Khirbat Sa'sa' (Haifa): khirbat-sasa is 40.1 km from the grid reference
  - Wadi 'Ara (Haifa): wadi-ara is 8.6 km from the grid reference
  - Tall al-Safi (Hebron): tall-al-safi is 4.9 km from the grid reference
  - al-'Abbasiyya (Jaffa): al-abbasiyya is 8.6 km from the grid reference
  - Kafr 'Ana (Jaffa): kafr-ana is 8.9 km from the grid reference
  - al-Muwaylih (Jaffa): al-muwaylih is 9.3 km from the grid reference
  - Saqiya (Jaffa): saqiya is 9.2 km from the grid reference
  - Yazur (Jaffa): yazur is 9.1 km from the grid reference
  - 'Aqqur (Jerusalem): aqqur is 9.5 km from the grid reference
  - al-Buwayziyya (Safad): al-buwayziyya is 26.4 km from the grid reference
  - Dallata (Safad): dallata is 9.3 km from the grid reference
  - al-Dawwara (Safad): al-dawwara is 9.0 km from the grid reference
  - al-Dirdara (Safad): al-dirdara is 9.8 km from the grid reference
  - Fara (Safad): fara is 9.8 km from the grid reference
  - al-Farradiyya (Safad): farradiyya is 9.2 km from the grid reference
  - al-Khalisa (Safad): al-khalisa is 33.6 km from the grid reference
  - al-Malikiyya (Safad): al-malikiyya is 12.9 km from the grid reference
  - al-Mansura (Safad): al-mansura-5 is 46.6 km from the grid reference
  - al-Ras al-Ahmar (Safad): al-ras-al-ahmar is 9.8 km from the grid reference
  - al-Sanbariyya (Safad): al-sanbariyya is 90.0 km from the grid reference
  - al-Manshiyya (Tiberias): al-manshiyya-3 is 41.3 km from the grid reference
  - al-'Ubaydiyya (Tiberias): al-ubaydiyya is 109.6 km from the grid reference
