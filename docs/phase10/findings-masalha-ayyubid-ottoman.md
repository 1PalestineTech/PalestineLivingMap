# Findings: Ayyubid-Mamluk era and Masalha-cited Ottoman events (30 events)

There are 17 Ayyubid-Mamluk events and 13 Ottoman events. Counts: 6 ok, 16 corrected, 8 need an owner decision. Proposed fixes are in `patches-masalha-ayyubid-ottoman.json` (33 patches).

**Method.** Masalha page numbers were confirmed with the PDF text, the page-estimate helper and the book's own index. Coordinates were checked against the Wikipedia coordinates API.

**Sources read in full:**
- Le Strange, *Palestine under the Moslems* (1890), public domain, on archive.org
- Lane-Poole, *A History of Egypt in the Middle Ages* (1901), public domain, on archive.org
- pef.org.uk/history
- the JVL treaty page

**Sources not read:** Kark & Goren 2011 was confirmed from Crossref metadata only. The Möhring 2009 article would not open.

**Days that are not in Masalha (reported only; no days were added to the data):**
- Hittin: 4 July 1187 according to Wikipedia (its infobox says 3-4 July). Lane-Poole 1901, p. 211, says "July, 1187", which would support month precision.
- Ain Jalut: 3 September 1260 (26 Ramadan 658) according to Wikipedia, in a section tagged as resting on a single source.
- Fall of Acre: the siege ran from 4 April to 18 May 1291, according to Wikipedia.

## Top issues

1. **ibn-khaldun-filastin-taxes-1377 describes the wrong period.** Le Strange 1890, pp. 44-45, is the source Masalha cites. He shows that Ibn Khaldun copied the revenue figures (310,000 dinars plus 300,000 ratls of oil) from an older work, and that they describe revenue under the caliph al-Mahdi, about 780 CE. They are not Mamluk figures. The summary needs rewriting, and the event may belong in the early-Islamic era.
2. **The "nearly a quarter" waqf figure in ayyubid-madrasahs-jerusalem has no acceptable source.** Masalha's note cites a WordPress blog for Jerusalem, plus Reiter 2010, which is about Acre. A blog is not an acceptable source under SOURCING.md.
3. **Daher al-Umar's dates conflict with other historians.** Philipp 2001 and Joudah 2013 (cited by Wikipedia) differ from Masalha on the battle of Marj Ibn Amer, the taking of Acre, and the founding of New Haifa. Details are under each event.
4. **Several other founding dates are disputed:**
   - Tarikh Safad: 1372-76 according to Luz.
   - Holy Sepulchre keys: 1187, 1192 or 1193 in different sources, or the 7th century in family tradition.
   - Madaba Map: the full map was recognised only in 1896.
   - Ascalon demolition: 1191.
5. **Pages and wording.**
   - Many Ayyubid page citations are one page too low.
   - The Hittin summary implies the Franks held Acre continuously, but Salah al-Din took it in 1187.
   - The maps summary attributes al-Idrisi's influence to all the mapmakers, though Masalha says it only of Fra Mauro.
   - The Ibn Battuta event needs a caveat about the reliability of his account of Palestine.

## Ayyubid-Mamluk era

### hittin-and-ayyubid-recovery-1187
- **Verdict:** corrected.
- **Checked:** Masalha pp. 194-195 (index: Hittin 194); Wikipedia "Battle of Hattin" and the articles on the sieges of Jerusalem in 1099 and 1187 (as pointers only); Lane-Poole 1901, p. 211.
- **Findings:**
  - The list of towns taken in 1187 is on pp. 194-195. The cited pp. 193-194 are one page low.
  - The summary says the Franks kept "a foothold ... with Acre held until 1291". But Masalha says Salah al-Din took Acre in 1187 and the Franks regained parts of the coast in the 1190s. The Franks retook Acre in 1191 (Wikipedia, citing Tyerman 2019, p. 267).
  - The contrast between the conduct of 1099 and 1187 needs a second view:
    - Wikipedia calls the 1187 takeover of Jerusalem "relatively peaceful". It also says, citing Hosler, *The Siege of Acre* (Yale 2018), p. 179, that about 11,000 Christians who could not pay their ransom were enslaved.
    - For 1099, Wikipedia cites Madden 2012 (3,000-10,000 killed) and Krey's collection of eyewitness accounts.
    - Do not use the dokumen.pub link that Wikipedia gives; it is a pirated copy.
- **Proposed patch:** pages → "194-195"; end the summary with "though the Franks regained parts of the coast in the 1190s and held Acre until 1291." Whether to add a Hosler perspective is the owner's decision.
- **Coordinates:** ok.

### jerusalem-capital-restored-ayyubids
- **Verdict:** corrected.
- **Checked:** Masalha pp. 167, 195 and 198; Le Strange 1890, p. 29; Wikipedia "Siege of Jerusalem (1187)".
- **Findings:**
  - The capital claim is on p. 195 (also p. 167), and the Ramla earthquakes are on p. 198. The cited "194, 196-197" is too low.
  - Le Strange, p. 29, translates the 13th-century geographer Yaqut as saying that the capital of Filastin is Jerusalem. This is support from a primary text, so add it as a source.
  - "Seven centuries" remains Masalha's interpretation.
  - Wikipedia says Jews were allowed to resettle, citing Scharfstein & Gelabert 1997, p. 145. Use that only as a pointer.
- **Proposed patch:** pages → "167, 195, 198"; add Le Strange, p. 29, as a source.
- **Coordinates:** ok.

### ayyubid-madrasahs-jerusalem
- **Verdict:** needs owner decision.
- **Checked:** Masalha p. 196, and his chapter 7, note 2.
- **Findings:**
  - The text is on p. 196, not the cited p. 195.
  - The waqf figure ("nearly a quarter" of the city's institutions and commercial property) rests on a WordPress blog for Jerusalem plus Reiter 2010, p. 110, which covers Acre only (20-25%).
- **Proposed patch:** pages → "196". Drop the figure or find a real source. One option: "He says waqf endowments came to hold a large share of the city's institutions and commercial property."
- **Coordinates:** ok.

### ayyubid-coastal-demolitions
- **Verdict:** needs owner decision.
- **Checked:** Masalha pp. 196-197; Wikipedia "Ascalon" (citing Sharon 1995, pp. 70-71); the JVL page on the 1192 treaty between Richard and Saladin (read).
- **Findings:**
  - The text is on pp. 196-197; the cited pp. 195-196 are too low.
  - The order to demolish Ascalon dates to 1191. Wikipedia says so, and JVL says the walls had already been razed by Saladin before the winter of 1191-92. "Circa 1187" is too early.
- **Proposed patch:** pages → "196-197"; add JVL as a source. Changing the date (to 1191, or to a range of 1187-1219 for the wider policy) is the owner's decision.
- **Coordinates:** ok (about 1.9 km from the Wikipedia point).

### ain-jalut-1260
- **Verdict:** corrected.
- **Checked:** Masalha p. 198 (index); Wikipedia.
- **Findings:** the summary is ok. The cited p. 197 should be p. 198. No day has been added. A source on the battle itself is still needed; Wikipedia cites Amitai-Preiss 1995.
- **Proposed patch:** pages → "198".
- **Coordinates:** ok.

### safad-regional-capital-1266
- **Verdict:** corrected.
- **Checked:** Masalha p. 203 (index); Wikipedia "Safed" (citing Drory 2004, Luz 2014 and Rhode 1979).
- **Findings:**
  - The page and the capture in July 1266 are confirmed.
  - "Six provinces" is Masalha's count; Wikipedia, citing Rhode, says seven.
  - Masalha dates the Red Mosque to 1276; Wikipedia gives 1275.
- **Proposed patch:** "one of six provinces" → "one of the Mamluk provinces"; "dates from 1276." → "dates from 1275-1276 (sources differ)."
- **Coordinates:** ok.

### fall-of-acre-1291
- **Verdict:** ok.
- **Checked:** Masalha pp. 190-191 and 202 (index: Latin Kingdom of Acre 190, 202); Wikipedia.
- **Findings:** all claims and pages are confirmed. A source on the siege itself is still needed.
- **Proposed patch:** none.
- **Coordinates:** ok.

### jerusalem-city-without-walls-mamluk
- **Verdict:** corrected.
- **Checked:** Masalha pp. 198-200; Wikipedia "Walls of Jerusalem" (citing Möhring 2009, doi 10.11588/BUS.2009.4.48565, not opened).
- **Findings:**
  - The text is on pp. 198-200; the cited pp. 197-199 are too low.
  - Wikipedia says the Ayyubid ruler al-Mu'azzam Isa rebuilt the walls in 1202-12 and pulled them down in 1219. The summary's "after 1187" hides this.
- **Proposed patch:** pages → "198-200". Optionally, once Möhring has been read: "pulled down by the Ayyubids (in 1219, according to Möhring)".
- **Coordinates:** ok.

### ibn-battuta-palestine-1326
- **Verdict:** needs owner decision.
- **Checked:** Masalha pp. 204-205 (index ok); Wikipedia "Ibn Battuta" (citing Gibb 1958, Hrbek 1962 and Elad 1987); Le Strange 1890.
- **Findings:**
  - The content and page numbers are ok.
  - A caveat about reliability is missing. The time between leaving Cairo (about 16 July) and reaching Damascus (9 August 1326) is too short for the route he describes. Gibb and Hrbek say he merged separate journeys, and Elad found the descriptions of Palestine copied from the earlier traveller al-Abdari.
  - Le Strange's translation of the Ramla passage does not contain "also called Filastin".
- **Proposed patch:** add a perspective attributed to Gibb and Hrbek, using Wikipedia as a pointer for now. Replace it later with Gibb, *The Travels of Ibn Battuta*, vol. 1 (Hakluyt 1958), p. 81, n. 48.
- **Coordinates:** ok.

### tarikh-safad-1378
- **Verdict:** needs owner decision.
- **Checked:** Masalha p. 204; Wikipedia "Safed" (citing Luz 2014, pp. 178-180).
- **Findings:**
  - Masalha says the author died in 1378 and that the work was written in 1378.
  - Luz says it was written under the governor Alamdar (1372-76). The 10 surviving folios cover villages, agriculture, trade and geography.
- **Proposed patch:** the owner should decide whether to date it 1372-1378, circa, and add Luz, *The Mamluk City in the Middle East* (CUP 2014), pp. 178-180.
- **Coordinates:** ok.

### ibn-khaldun-filastin-taxes-1377
- **Verdict:** corrected (important).
- **Checked:** Masalha p. 198 (index); Le Strange 1890, pp. 44-45.
- **Findings:**
  - The figures themselves are confirmed.
  - Le Strange says Ibn Khaldun copied them from an older account, the *Jirab al-Dawla*, which dates them to the reign of al-Mahdi (158-170 AH, about 780 CE). They are not Mamluk-era revenue.
  - The cited p. 197 should be p. 198.
- **Proposed patch:** pages → "198"; rewrite the summary for the reading of about 780 CE; add Le Strange, pp. 44-45, as a source. Moving the event to another era is the owner's decision.
- **Coordinates:** ok.

### hebron-glass-industry-mamluk
- **Verdict:** corrected.
- **Checked:** Masalha pp. 208-210 (index: glass 206-10, mosaics 208-9); Wikipedia "Hebron glass" (citing al-Ju'beh, and the traveller Niccolò da Poggibonsi, 1345-50).
- **Findings:** the quotation from Galor & Bloedhorn is on p. 210. A second source exists via Wikipedia: al-Ju'beh dates the industry to the 13th century. The Saudi Aramco World page would not load.
- **Proposed patch:** pages → "208-210".
- **Coordinates:** ok.

### mujir-al-din-history-1495
- **Verdict:** corrected.
- **Checked:** Masalha pp. 205-207 (index 205-7); Wikipedia "Mujir al-Din" (citing Little 1995 and Khalidi 1998); Le Strange 1890.
- **Findings:** his life dates (1456-1522) are confirmed. Little dates the work to about 1495; Le Strange says 1496. The count of "22 times" the name Filastin appears stays attributed to Masalha.
- **Proposed patch:** pages → "205-207"; in the editorNote, replace the remark about "garbled" dates with the confirmed dates.
- **Coordinates:** ok.

### maps-naming-palestine-14th-15th-c
- **Verdict:** corrected.
- **Checked:** Masalha pp. 190-193; Wikipedia "Pietro Vesconte" and "Fra Mauro map".
- **Findings:** the dates are ok (Vesconte and Sanudo, about 1320-21; Fra Mauro, about 1450, with a copy finished in 1459). But Masalha links only Fra Mauro to al-Idrisi.
- **Proposed patch:** "they followed al-Idrisi's" → "Fra Mauro drew partly on al-Idrisi's map of 1154".
- **Coordinates:** ok.

### latin-kingdom-reestablished-acre-1192
- **Verdict:** ok.
- **Checked:** Masalha pp. 167 and 194; Wikipedia "Kingdom of Jerusalem" (citing Tyerman 2019, p. 267).
- **Findings:** the kingdom's re-establishment in 1192 with Acre as its capital is the standard account, not just Masalha's wording. Acre was the capital from 1191.
- **Proposed patch:** none (an optional editorNote update).
- **Coordinates:** ok.

### holy-sepulchre-keys-nuseibeh-judeh-1193
- **Verdict:** needs owner decision.
- **Checked:** Masalha p. ~117 (estimated; the cited p. 116 is within tolerance); Wikipedia "Nusaybah family" and "Church of the Holy Sepulchre".
- **Findings:**
  - The origin of the arrangement is contested: Masalha gives 1193; Wikipedia gives 1192 for the Nusaybah family and 1187 for the Joudeh al-Goudia family; the Nuseibeh family's own tradition places it in the 7th century.
  - The family name is spelled both Judeh and Joudeh.
- **Proposed patch (owner decision):** a suggested summary: "According to Masalha ... in 1193; other accounts date it to 1187 or 1192, and the Nuseibeh family traces its role to the 7th century."
- **Coordinates:** ok.

### treaty-of-ramla-1192
- **Verdict:** corrected.
- **Checked:** Wikipedia (the article is now titled "Treaty of Jaffa (1192)"); JVL (read); Lane-Poole 1901, pp. 210-211.
- **Findings:** all three support the summary. Lane-Poole describes a three-year treaty made in September 1192 that left the coast from Acre (Tyre in another passage) to Jaffa with the Franks and allowed pilgrims access.
- **Proposed patch:** change the Wikipedia title and URL to "Treaty of Jaffa (1192)"; add Lane-Poole as a source.
- **Coordinates:** ok (approximate).

## Ottoman era (Masalha-cited events)

### al-ramli-al-fatawa-al-khairiyyah-1670
- **Verdict:** ok.
- **Checked:** Masalha pp. 215-217 (index 214-6).
- **Findings:**
  - Confirmed: his dates (1585-1671), the final compilation in 1670, his Hanafi influence, and the relevance of the fatwas to waqf and farming.
  - The phrases "Filastin" and "our country" come from Gerber 2008, p. 50, quoted by Masalha. Gerber says these "possibly" point to a loose community.
- **Proposed patch:** optionally add Gerber, *Remembering and Imagining Palestine* (Palgrave Macmillan 2008, ISBN 978-0-230-53701-9 per Open Library), p. 50. Gerber is an Israeli historian, which helps the balance rule. The book was not read directly.
- **Coordinates:** ok.

### al-tumurtashi-khabar-al-tamm-gaza-1695
- **Verdict:** ok.
- **Checked:** Masalha p. 217 (index 216-7, 247).
- **Findings:**
  - Confirmed: the title, the boundaries given (al-Arish or Rafah to al-Lajjun), the dependence on Mujir al-Din, the four surviving copies, and his death around 1715.
  - The date 1695-96 is the date Masalha cites; the editorNote is right to call it ambiguous.
  - Gerber 2008, pp. 50-51, is a second, independent pointer.
- **Proposed patch:** none.
- **Coordinates:** ok (about 1 km off).

### dahir-al-umar-victory-marj-ibn-amer-1735
- **Verdict:** needs owner decision.
- **Checked:** Masalha p. 228; Wikipedia "Daher al-Umar" (citing Philipp 2001, p. 33 and notes 14-16, and Joudah 2013, pp. 25 and 30).
- **Findings:**
  - Masalha's text is confirmed: 1735, with people of Nazareth and Christian women supplying food and water.
  - Philipp dates the battle "probably sometime after 1738", against the Jarrar-Saqr coalition near al-Mansi. The Nablus chronicler al-Nimr does not mention the battle.
  - Philipp names the opponents; the summary should add them.
- **Proposed patch:** the owner should decide. One option: keep 1735 marked circa, and note "after 1738 according to Philipp" in the editorNote or as a perspective.
- **Coordinates:** ok at precision area. The battle was near al-Mansi on the west of the plain; no coordinates were found for that site.

### dahir-al-umar-takes-acre-1749
- **Verdict:** needs owner decision (page and coordinate fixes are in the patches file).
- **Checked:** Masalha pp. 224, 228-229, 232-233 and 263 (index: Acre as capital 229, 233, 263); Wikipedia (citing Joudah 2013, p. 22, and Philipp 2001, p. 36).
- **Findings:**
  - Masalha's "1749" comes from an 1859 British gazetteer he quotes (p. 232) and from his own p. 263. On p. 228 he gives 1746.
  - Wikipedia gives three steps: Daher took Acre by force in 1744 (Joudah), was formally made its tax farmer in July 1746 (Philipp), and made it his headquarters around 1750.
  - "Displacing the older province of Sidon" is Masalha's view and should be attributed to him.
- **Proposed patch:** pages → "224, 228-229, 232-233, 263"; coordinates as below. Changing the date to 1744-1750 with an editorNote is the owner's decision.
- **Coordinates:** fix to 32.9214, 35.0689 (Old City of Acre, Wikipedia). The current point is about 1.2 km east, although its precision is marked exact.

### new-haifa-founded-dahir-al-umar-1764
- **Verdict:** needs owner decision (page and coordinate fixes are in the patches file).
- **Checked:** Masalha pp. 234-235 (index); Wikipedia "Daher al-Umar" (citing Yazbak 1998, p. 14).
- **Findings:** Masalha says the town was founded in 1764-65 and that its 250 inhabitants moved 2.4 km east. Yazbak says old Haifa was demolished in 1765-69 and the new town built 3 km to the south-east. The figures should be attributed to Masalha.
- **Proposed patch:** pages → "234-235". The date range is the owner's decision.
- **Coordinates:** fix to 32.8158, 35.0022 (Old City of Haifa, Wikipedia). The current point is about 2.7 km off, on the slope of Mount Carmel.

### ottoman-recognition-of-dahir-al-umar-1768
- **Verdict:** ok.
- **Checked:** Masalha pp. 229 and 263 (index: the title, 229); Wikipedia (citing Philipp 2001, p. 36, and Joudah 2013, p. 141).
- **Findings:** Philipp confirms the title granted in 1768. A neutral second view exists: Joudah calls it "a recognition of his de facto status".
- **Proposed patch:** optionally add the perspective "According to Joudah, the title recognised his de facto status." Wikipedia is only the pointer; the real source is Joudah 2013 (Gorgias Press, ISBN 978-1-4632-0002-2).
- **Coordinates:** ok (approximate; the Old City point would also do).

### al-jazzar-mosque-acre-1781
- **Verdict:** corrected.
- **Checked:** Masalha pp. 233-234 (index 233); Wikipedia "El-Jazzar Mosque" (built in 1781 and completed within the year, citing Archnet and Philipp 2001, p. 58).
- **Findings:** the date is confirmed. "Remains Acre's best-known landmark" is a claim in our own voice; soften it to "one of Acre's best-known landmarks". The "first college" claim is correctly attributed to Masalha.
- **Proposed patch:** pages → "233-234". Softening the wording is the owner's decision.
- **Coordinates:** ok (0.3 km off).

### jacotin-maps-of-palestine-1799
- **Verdict:** corrected.
- **Checked:** Masalha pp. 255-256 (index 255-6).
- **Findings:**
  - Confirmed: surveyed in 1799 on Napoleon's orders, six sheets covering Palestine, published in 1826.
  - Masalha gives two different labels: the French "Palestine or Holy Land" and an Arabic "land of al-Quds". The summary wrongly says both languages read "Palestine or Holy Land".
  - A second source for the owner: Karmon 1960, *Israel Exploration Journal* 10.
- **Proposed patch:** pages → "255-256"; correct the labels in the summary.
- **Coordinates:** ok (region).

### palestine-association-london-1805
- **Verdict:** ok.
- **Checked:** Masalha p. 246 (index: Hamilton 246); Crossref metadata.
- **Findings:** confirmed: founded in March 1805 as the Syrian Society, renamed on 24 April 1805, linked with Hamilton, and merged into the Royal Geographical Society in 1834. Masalha's source is Kark & Goren, *Geographical Journal* 177(3): 264-274 (2011), doi 10.1111/j.1475-4959.2011.00404.x. It would be a good second source (by Israeli geographers), but it has not been read.
- **Proposed patch:** none (optionally add Kark & Goren after reading it).
- **Coordinates:** ok (a country-wide point, as the data guide allows).

### palestine-exploration-fund-founded-1865
- **Verdict:** corrected.
- **Checked:** Masalha pp. 246 and 257 (index); pef.org.uk/history (read); Wikipedia "Palestine Exploration Fund".
- **Findings:**
  - The year 1865 and Dean Stanley's role are confirmed.
  - The PEF's own account describes royal patronage from Queen Victoria, founders who were academics and clergymen, and a research mission. Wikipedia dates the founding meeting to 22 June 1865.
  - The founder list in the summary ("military officers") is Masalha's wording and should be attributed to him.
- **Proposed patch:** add the PEF history page as a second perspective.
- **Coordinates:** ok (a country-wide point).

### ordnance-survey-western-palestine-1871
- **Verdict:** corrected.
- **Checked:** Masalha pp. 255-258; pef.org.uk/history; Wikipedia "PEF Survey of Palestine".
- **Findings:**
  - The dates differ: Masalha gives 1871-1877, the PEF 1871-1878, and Wikipedia fieldwork from 1872 to 1877. Note the range in the editorNote.
  - Wikipedia's sentence about a strategic motive cites Masalha himself, so it cannot count as a second source. The PEF page is an independent one.
- **Proposed patch:** add the PEF page as a source; add an editorNote on the dates.
- **Coordinates:** ok (region).

### madaba-mosaic-map-discovered-1884
- **Verdict:** corrected.
- **Checked:** Masalha pp. 266 and 281-282 (index); Wikipedia "Madaba Map" (citing Meimaris 1999).
- **Findings:** parts of the mosaic were found in 1884 and 1886, but the full map was noticed only in October 1896 and reproduced in 1897. Masalha mentions this too.
- **Proposed patch:** in the summary, say the map was "first partly uncovered in 1884 and recognised in full only in 1896".
- **Coordinates:** ok.

### al-fula-land-sale-dispute-1910
- **Verdict:** corrected.
- **Checked:** Masalha pp. 286-287 (index); Wikipedia "Merhavia (kibbutz)", citing Ben-Bassat 2013, *Middle Eastern Studies* 49(3), doi 10.1080/00263206.2013.783823 (not read).
- **Findings:**
  - Masalha's account is confirmed. Wikipedia adds that 10,000 dunams were sold in 1910-11, that the peasants petitioned the grand vizier, and that al-Asali refused to complete the sale.
  - The newspaper Falastin only began in January 1911, so the press campaign ran into 1911.
  - The usual English spelling of the seller's family name is "Sursock".
  - Ben-Bassat is the non-Palestinian second source to add.
- **Proposed patch:** `dateEnd` → 1911; add Ben-Bassat after reading it. The spelling of the name is the owner's decision.
- **Coordinates:** ok as approximate. The village site is now Merhavia (32.6058, 35.3072), about 1.8 km east; moving the pin there is optional.
