# Candidate events: Ayyubid and Mamluk period, 1187-1516 (era id `ayyubid-mamluk`)

Status: DRAFT for owner review (Phase 8A). Nothing here is in `events.json`. Compiled 2026-11-03.

> **Page-number correction (2026-11-03):** the printed page numbers in this list used a constant offset (PDF page + 2). Later calibration against the book's index showed the offset drifts across the book, so the page numbers in `events.json` were remapped (accuracy about 1-2 pages). Treat the numbers below as superseded by `events.json`.

## How this list was built

Source priority set by the owner: 1) Handala's answers, 2) Nur Masalha, 3) everything else.
- **Handala (Palestine Today index):** "Intro to Palestine 1" gives only a few lines on this era (the name Filastin in Abbasid coins and Genizah manuscripts, Jund Filastin, the Marj Dabiq defeat of the Mamluks in 1516). It points to Masalha's chapters for detail. See `docs/candidates/handala-leads.md`.
- **Masalha, *Palestine: A Four Thousand Year History*** (Zed Books, 2018, ISBN 978-1-78699-272-7), Chapter 7 "Between Egypt and al-Sham", read from the owner's PDF. **Page numbers below are printed pages**, found by matching the book's own index against the PDF (printed page = PDF page + 2). Spot-checked on three index entries. Please confirm a few against your paper or reader copy before they go into `events.json`.
- Masalha is a Palestinian historian writing from a critical perspective, so interpretive claims are written "according to Masalha". Dates he does not give are left open here (day-level dates are not invented); other sources will be needed for them.

Flags: **[DATE]** date not given or uncertain, **[DISPUTED]** interpretive or contested, **[2ND]** second source needed.

## Candidates from Masalha, chapter 7

### 1. Battle of Hittin and Ayyubid recovery of Palestine, 1187
- Date: 1187 (year only; Masalha gives no day) **[DATE]**. Location: Hittin (Galilee) / Palestine-wide, `approximate`. Category: conflict / political.
- Why: Salah al-Din's victory over the Franks began the Ayyubid period in Palestine; in the same year Acre, Nazareth, Haifa, Jaffa, Ramla, Gaza, Ascalon and Jerusalem fell to Ayyubid forces, though the Franks kept parts of the coast, with Acre until 1291.
- Masalha: pp.194-195. **[DISPUTED]** Masalha contrasts Ayyubid and Frankish conduct, saying the Crusaders had slaughtered or expelled the Muslims and Jews of Jerusalem; the figures and the contrast are debated, so it needs a second source (Crusader-era chronicle or modern scholar) **[2ND]**. Overlaps `crusader` (boundary year 1187; choose era).

### 2. Jerusalem restored as Palestine's capital under the Ayyubids; al-Ramla declines
- Date: from 1187; Ayyubid rule 1187-1260 (year to year). Location: Jerusalem. Category: political / religious-sites.
- Why: According to Masalha, al-Quds permanently replaced al-Ramla as the provincial and religious capital, which Mamluks and Ottomans kept, and Jews and Muslims returned to the city. Al-Ramla had been weakened by two earthquakes in the 11th century.
- Masalha: pp.195, 197-198. **[2ND]** for return of Jews (needs a Geniza or historian source).

### 3. Ayyubid madrasahs and institutions in Jerusalem
- Date: 1187-1260. Location: Jerusalem. Category: cultural.
- Why: The earliest madrasahs after the Frankish period were built by the Ayyubids; ribats, zawiyas, baths, markets and khans followed; Masalha says nearly a quarter of Jerusalem's institutions and commercial property later belonged to waqf endowments (Ottoman deed records show this still in late Ottoman times).
- Masalha: p.196 (citing Galor and Bloedhorn 2013, Hillenbrand and Auld 2009). Fits Handala's "continuity of Palestinian institutions" theme.

### 4. Ayyubid destruction of coastal fortifications
- Date: after 1187, circa; the order for Ascalon is attributed to Salah al-Din (day and year **[DATE]**). Location: Ascalon and the Palestinian coast, `approximate`. Category: conflict / land-settlement.
- Why: To prevent Crusader landings, the Ayyubids demolished the walls of coastal cities such as Ascalon and blocked harbours (Caesarea's port is still blocked by debris). Masalha cautions that the evidence contradicts a claim of wholesale destruction; Yaqut al-Hamawi (early 13th century) still lists coastal towns among Filastin's main cities.
- Masalha: pp.196-197 (Mujir al-Din 1973; Rosen-Ayalon 1998). **[DISPUTED]** extent of destruction.

### 5. Mamluk victory over the Mongols at 'Ain Jalut, 1260
- Date: 1260 (the standard day, 3 September, is not in Masalha; verify elsewhere) **[DATE]**. Location: 'Ain Jalut (Jezreel Valley), `area`. Category: conflict.
- Why: The first major defeat of the Mongol army, two years after the sack of Baghdad; it opened the Mamluk period in Palestine.
- Masalha: p.198. Needs coordinates and day from a second source **[2ND]**.

### 6. Mamluks make Safad the capital of northern Palestine, 1266
- Date: 1266 (Safad recovered from the Franks; Bilad al-Sham divided into six provinces). Red Mosque in Safad built in 1276, attributed to Baybars. Location: Safad. Category: political.
- Why: The Mamluks shifted regional power from coastal Acre to mountainous Safad ("Kingdom of Safad", ten districts including Lajjun and Jenin); the Ottomans later changed its name to the sanjak of Safad.
- Masalha: p.203 (Tarawneh 1982; Luz 2014; Drory 2004). Links to Ottoman events 1 and 4 in the data.

### 7. Fall of Acre, 1291
- Date: 1291 (day not in Masalha) **[DATE]**. Location: Acre. Category: conflict.
- Why: The last Crusader-held city in Palestine fell to the Mamluks; Masalha notes that modern historians see it as the end of the Crusades, while contemporary Muslims still feared attacks from the sea. Venice and others lost trade and property.
- Masalha: pp.191, 202. Add a second source for the siege itself **[2ND]**.

### 8. Jerusalem, the "city without walls" under the Mamluks, 13th-15th centuries
- Date: 1260-1517 (range; city expanded in the 13th and 14th centuries). Location: Jerusalem. Category: cultural.
- Why: With the walls largely demolished by the Ayyubids after 1187, Masalha says the city grew under the Mamluks into an organised medieval city of madrasahs, baths, fountains, hostels and covered markets (such as Suq el-Qattanin); much of the Old City's fabric dates from then.
- Masalha: pp.198-200 (quoting Rosen-Ayalon 1998). Contrasts with Suleiman's 16th-century walls (Ottoman event 2).

### 9. Ibn Battuta travels through Palestine, 1326
- Date: summer 1326. Location: Jerusalem, Ascalon, Ramla, Nablus, Acre. Category: cultural.
- Why: His Rihla describes Ascalon in ruins, Nablus's olive oil exported to Cairo and Damascus, and Ramla "also called Filastin". Masalha uses it as evidence that the name Filastin stayed in use.
- Masalha: pp.204-205 (Ibn Battuta 2005: 57-58).

### 10. Tarikh Safad written, 1378
- Date: 1378. Location: Safad. Category: cultural.
- Why: Judge Shams al-Din al-Uthmani's local history of Safad survives in part and records Galilee villages and Sufi institutions under the Mamluks.
- Masalha: p.204 (Drory 2004: 184).

### 11. Ibn Khaldun reports Filastin's taxes, 1377
- Date: 1377 (Muqaddimah). Location: Palestine-wide, `approximate`. Category: economy-daily-life.
- Why: He gives the province's revenue as 310,000 gold dinars plus 300,000 ratls of olive oil, showing Filastin as an administrative unit.
- Masalha: p.198 (via Le Strange 1890/2010: 45). Figures: attribute to Ibn Khaldun, as quoted by Masalha.

### 12. Hebron's glass industry and the Jerusalem mosaics school, Mamluk period
- Date: 13th century (century precision). Location: Hebron; Jerusalem. Category: economy-daily-life / cultural.
- Why: Masalha argues Hebron developed a respected glass trade (zujaj al-khalili), supplying lamps and ornaments to Egypt, Syria and Arabia, and that Jerusalem had a distinct school of wall mosaics and glass (for example the Tankiziyya Madrasa).
- Masalha: pp.208-209 (Galor and Bloedhorn 2013: 230; al-Ju'beh 2008). **[DISPUTED]** "genuine Palestinian school" is Masalha's interpretation, not a settled view.

### 13. Mujir al-Din al-Ulaymi writes his history of Jerusalem and Hebron, c. 1495
- Date: c. 1495. Location: Jerusalem. Category: cultural.
- Why: A Jerusalem judge and historian, he uses the name Filastin 22 times and describes it as running from near al-Arish to Lajjun.
- Masalha: pp.205-206. **[DATE]** his dates appear garbled in the PDF text ("15221456", probably 1456-1522); check the printed book.

### 14. Maps naming Palestine: al-Idrisi (1154), Sanudo-Vesconte (c. 1320), Fra Mauro (1450)
- Date: 1154 (al-Idrisi, in the Crusader period), c. 1320, 1450. Location: Palestine-wide, `approximate`. Category: cultural.
- Why: World maps by al-Idrisi (Tabula Rogeriana, for King Roger II of Sicily), Sanudo and Vesconte, and Fra Mauro show Filastin/Palestina and shaped European and Arab images of the region.
- Masalha: pp.190-193. al-Idrisi falls in `crusader`; the other two fit here.

## Additional leads not found in Masalha (sources still to find)

Masalha's chapter 7 is thin on these, so no page citation exists. The first step is Handala's answers and the owner's other references, then outside sources:
- Treaty of Jaffa 1229 (Frederick II and al-Kamil, Jerusalem briefly Frankish): not in Masalha (the "1229" hit is Yaqut's death date).
- 1244 Khwarazmian sack of Jerusalem; Nahmanides in Jerusalem 1267; the Black Death in Palestine, 1347-48; Timur's campaign in Syria 1400-01; Nebi Musa shrine near Jericho under Baybars: none are in the Masalha text searched.
- Ottoman conquest 1516-17 and Marj Dabiq: Masalha p.223 mentions it, and Handala names the Marj Dabiq defeat (1516). Already in the data as an Ottoman event.

## Suggestions for the owner

1. Check three or four printed page numbers against your copy (for example p.198 'Ain Jalut and Ibn Khaldun; p.203 Safad).
2. Decide whether items 2-4 stay separate or merge into one Ayyubid entry.
3. Masalha supplies ideas and pages, but second sources are needed for events 1, 2, 5 and 7. Give me any of Handala's linked sources (Abu Sitta's Atlas begins in 1917, so does not help here) or paste Palestine Remembered pages.
