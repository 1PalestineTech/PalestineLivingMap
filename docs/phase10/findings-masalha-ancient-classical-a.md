# Findings: ancient and classical eras (part A, 23 events, mostly Masalha-cited)

**Counts:** 7 ok, 8 corrected, 8 need an owner decision. Proposed patches are in `patches-masalha-ancient-classical-a.json`.

**How Masalha's pages were checked:** each passage was found in the PDF text with `mp.mjs`, then checked against the book's own index (PDF pp. 405-428). Between PDF pp. 63 and 115, the index runs about one page lower than the `mp.mjs` estimate. Examples:
- Merneptah Stele, index pp. 58-9 → PDF 65-66
- Sargon II, index pp. 67-8 → PDF 74
- Euthymius monastery, index p. 132 → PDF 135

Every cited page range is within 1-2 pages of its passage, so all the passages are confirmed. Small page corrections are listed under each event.

**Reference coordinates used (Wikipedia API):**

| Place | Lat, lng |
|---|---|
| Gaza City | 31.5075, 34.4597 |
| Isdud (ancient Ashdod) | 31.7536, 34.6617 |
| Tel Dor | 32.6175, 34.9175 |
| Beit She'an | 32.5, 35.5 |
| Sidon | 33.5606, 35.3758 |
| Nablus | 32.2211, 35.2608 |
| Caesarea Maritima | 32.5, 34.8917 |
| Monastery of Euthymius | 31.7922, 35.3361 |

## Top issues

1. **merneptah-stele-canaan-gaza-1205-bce:** the title and summary repeat two claims of Masalha's that the stele itself does not support. Standard translations (Hasel 2008) name neither Gaza nor the Peleset. The standard date is about 1208 BCE.
2. **syria-palaestina-province-created-135:** only Masalha's view is given. Most scholars see the renaming as punitive (Eck 1999, Feldman, Magness, Isaac). The exact date is unknown; the name is attested by 139.
3. **military-diploma-syria-palaestina-139:** the findspot is uncertain. The first edition (Villefosse 1897) gives both Nazareth and Der'a in the Hauran, and its author favoured Der'a. The diploma is CIL XVI 87, dated 22 November 139.
4. **philisto-arabian-coinage-gaza-538-bce:** the 538 BCE date rests on Masalha alone. Gitler & Tal 2006 and the British Museum date this coinage to the 5th-4th century BCE.
5. **Missing second perspectives:**
   - Ramesses III / Peleset: Feldman et al. 2019 (ancient DNA) supports a Philistine migration rather than local origin.
   - Herodotus: Feldman 1996 reads his "Palestine" as mainly the coast.

## Per-event findings

### merneptah-stele-canaan-gaza-1205-bce
- **Verdict:** needs owner decision.
- **Checked:** Masalha PDF 65-66 (index pp. 58-9, so the cited pp. 58-59 are correct); Wikipedia "Merneptah Stele" (translation from Hasel 2008 p. 52 and Sparks 1998); the Egyptian-sources table in Wikipedia "Sea Peoples".
- **Findings:**
  - Masalha says the stele calls Gaza the "mouth" of Canaan and links the stele to the Peleset. Standard translations of its Canaan lines mention neither; the Gaza epithet comes from other New Kingdom texts.
  - Merneptah's Great Karnak Inscription lists the Eqwesh, Lukka, Shekelesh, Sherden and Teresh, not the Peleset. Our summary's "such as the Peleset" repeats the error.
  - The standard date is about 1208 BCE: year 5 of Merneptah, who reigned 1213-1203.
- **Proposed patch:**
  - Title: "Merneptah Stele names Canaan".
  - Summary: "An Egyptian victory stele of Merneptah, dated about 1208 BCE in standard chronology (about 1205 BCE per Masalha), ends with a campaign in Canaan naming Ashkelon, Gezer, Yanoam and Israel. Masalha also links the stele to Gaza and to the Peleset; standard translations of the stele name neither."
  - The owner should add a source for the stele text (Hasel 2008 or Sparks 1998).
- **Coordinates:** move to a country-wide point (31.9, 35.1, `approximate`). The stele is from Thebes and does not name Gaza.

### ramesses-iii-war-peleset-1181-bce
- **Verdict:** corrected.
- **Checked:** Masalha PDF 63 (the cited p. 56 is within one page); Wikipedia "Sea Peoples" and "Philistines"; Feldman et al. 2019, abstract read via Europe PMC (PMID 31281897).
- **Findings:**
  - The dates match Masalha, and the reign (1186-1155) matches Wikipedia.
  - The indigenous-origin perspective rests on press reports (Evian 2017, David 2017). The 2019 ancient-DNA study found European-related ancestry in early Iron Age Ashkelon, which supports a migration.
  - The editorNote sentence "Pin is the temple in Egypt" is out of date: the pin is now the Palestine centre point.
- **Proposed patch:** add the Feldman source and a perspective based on it; delete the stale editorNote sentence.
- **Coordinates:** ok.

### idrimi-statue-kinahhu-1500-bce
- **Verdict:** needs owner decision (date).
- **Checked:** Masalha PDF 65 (about p. 58; the citation is ok); Wikipedia "Idrimi".
- **Findings:**
  - The paraphrase and its attribution are accurate.
  - The date is disputed. Wikipedia gives Idrimi's reign as about 1490-1465 BCE; Lauinger dates the statue to about 1400-1350 BCE.
  - The tag "cuneiorm" is a typo.
  - The editorNote still discusses Alalakh coordinates, which is out of date.
- **Proposed patch:** fix the tag. Add to the editorNote: "Date disputed: Idrimi reigned c. 1490-1465 BCE; Lauinger dates the statue c. 1400-1350 BCE (owner to cite Lauinger)."
- **Coordinates:** ok.

### philistine-expansion-beisan-1100-bce
- **Verdict:** needs owner decision.
- **Checked:** Masalha PDF 70 (index: Beisan p. 63, so the cited pp. 62-63 are ok).
- **Findings:**
  - The summary paraphrases Masalha accurately and attributes the claim to him.
  - Masalha gives no citation. Mainstream archaeology of Beth Shean (an Egyptian garrison, then a local Iron I town) does not attest Philistine rule, so an archaeological source is needed before this can be verified.
- **Proposed patch:** pages "62-63" → "63-64" (optional).
- **Coordinates:** ok.

### adad-nirari-iii-campaign-palashtu-800-bce
- **Verdict:** ok.
- **Checked:** Masalha PDF 66-67 (index: Nimrud pp. 60-1); Wikipedia "Adad-nirari III" (reigned 811-783 BCE).
- **Findings:** the quoted inscriptions (Luckenbill 1926: 260-261; Grayson 1996: 212) match. The summary is attributed and neutral.
- **Proposed patch:** optionally, pages "59-60" → "60-61".
- **Coordinates:** ok.

### qurdi-ashur-lamur-letter-735-bce
- **Verdict:** ok.
- **Checked:** Masalha PDF 67-68 (index p. 61; the citation is ok). The quotation ends on PDF 68 with "Egyptians or Palestinians [pa-la-as-ta-a-a]" (Saggs 2001: 155-157).
- **Findings:** the summary matches. Other translators render pa-la-as-ta-a-a as "Philistines"; this could optionally be noted in the perspective.
- **Proposed patch:** none.
- **Coordinates:** ok (under 1 km off).

### sargon-ii-conquers-ashdod-712-bce
- **Verdict:** corrected.
- **Checked:** Masalha PDF 74 (index: Sargon II pp. 61, 67-8; Iamani p. 68; the citation is ok).
- **Findings:** the summary matches Masalha (who cites Thompson 2016 and Gallagher 1999). Prism A (about 717 BCE) is on PDF 68, about pp. 61-62, not p. 70 as our source note says.
- **Proposed patch:** correct the page in the source note, and fix the coordinates (below).
- **Coordinates:** fix 31.8044, 34.6553 → 31.7536, 34.6617 (Wikipedia "Ashdod (ancient city)" / Isdud). The current point is modern Ashdod, about 5.7 km away.

### esarhaddon-treaty-dor-pilisti-675-bce
- **Verdict:** ok.
- **Checked:** Masalha PDF 68 and 70 (about pp. 61 and 63; the citation is ok).
- **Findings:** the treaty of 675 BCE, Sennacherib about 694 (Luckenbill 1924: 104), and "Tantur controlled the coast to Acre for about a century" all match. The treaty is usually dated about 676-675.
- **Proposed patch:** set circa to true.
- **Coordinates:** ok (about 1 km from Tel Dor).

### philisto-arabian-coinage-gaza-538-bce
- **Verdict:** needs owner decision.
- **Checked:** Masalha PDF 71 and 75-76 (index pp. 67, 69-70). The cited p. 64 does not match; the "late 6th-early 5th century" sentence is on about p. 65. A web search found:
  - the title of Gitler & Tal 2006, *The Coinage of Philistia of the Fifth and Fourth Centuries BC*
  - a review noting that no Phoenician coinage is known before about 450 BCE
  - the British Museum's Gaza drachm, dated to the 5th-4th century BCE
- **Findings:** 538 BCE is not supported by the numismatic literature Masalha cites, and year precision overstates what is known.
- **Proposed patch (owner decision):**
  - Set `dateStart` to -500 with century precision and circa (or -450, decade, circa).
  - Add to the summary: "numismatists Gitler and Tal treat Philistian coinage as 5th-4th century BCE." The owner should cite Gitler & Tal 2006 directly.
  - Pages → "65, 69-70".
- **Coordinates:** ok.

### herodotus-histories-palaistin-450-bce
- **Verdict:** needs owner decision.
- **Checked:** Masalha PDF 78-82 (index pp. 72-6; the citation is ok). The "does not mention Judaea" sentence is on PDF 81 (about p. 76). Also Wikipedia "Syria Palaestina", which quotes Feldman 1996 p. 553 and Herodotus 3.91.
- **Findings:**
  - The summary is faithful to Masalha, and "I myself saw" (Herodotus 2.106) is ok.
  - Many scholars read the circumcising "Syrians of Palestine" (2.104) as including Jews; Masalha himself quotes Asheri doubting this.
  - Feldman reads Herodotus' "Palestine" as mainly the coastal area.
- **Proposed patch:** add a perspective: "According to Feldman, Herodotus used Palestine mainly for the coastal area once inhabited by the Philistines." Source: Louis H. Feldman, *Studies in Hellenistic Judaism* (Brill, 1996), p. 553. This was seen only as a quotation on Wikipedia; the owner should open the book.
- **Coordinates:** ok.

### aristotle-meteorology-dead-sea-340-bce
- **Verdict:** ok (minor wording).
- **Checked:** Masalha PDF 82 (index pp. 76-7; the citation is ok).
- **Findings:** Aristotle introduces the lake "as is fabled", so the summary should present it as a report.
- **Proposed patch:** "Aristotle mentions a lake" → "Aristotle repeats a report of a lake".
- **Coordinates:** ok.

### siege-of-gaza-332-bce
- **Verdict:** needs owner decision (month precision); a source should also be added.
- **Checked:** Wikipedia (raw): infobox "October 332 BC", coordinates 31°31'N 34°27'E. Arrian, *Anabasis* 2.25-27, in Chinnock's 1884 translation, read via the archive.org text including the translator's notes.
- **Findings:**
  - The summary is supported: Batis held Gaza for the Persians with Arab mercenaries, and taking Gaza secured the road to Egypt.
  - "October" is not firmly sourced. Arrian gives no month. Diodorus 17.48, cited in Chinnock's note, says the siege lasted two months. Wikipedia's own source (Dodge) gives "September 332 to spring 331".
- **Proposed patch:**
  - Add the Arrian translation as a source.
  - Owner decision: change `dateStart` "-332-10" to "-332" with year precision, or keep the month only with a scholarly citation.
- **Coordinates:** ok (the infobox point is about 1.3 km from the Gaza City point).

### seleucid-empire-founded-312-bce
- **Verdict:** corrected.
- **Checked:** Masalha PDF 83-84 (about pp. 77-78; the citation is ok); Wikipedia "Coele-Syria".
- **Findings:**
  - The dates 312-63 BCE and the collapse of 323 are standard.
  - "Greek writers generally distinguished Coele-Syria from Palaestina" is Masalha's thesis, but it is stated in our own voice. In Ptolemaic and Seleucid usage, Koile Syria often covered a broader area.
  - The editorNote "Pin is the Seleucid capital" is out of date.
  - A second source is needed: Cohen 2006, *The Hellenistic Settlements in Syria, the Red Sea Basin, and North Africa*, p. 41, which Masalha argues against.
- **Proposed patch:** attribute that sentence to Masalha.
- **Coordinates:** ok.

### ptolemy-geography-map-palaestina-150
- **Verdict:** corrected.
- **Checked:** Masalha PDF 83-85 (index: Ptolemy pp. 77-9). The 9th-century Arabic translation is mentioned on PDF 85, so "77-80" is a better page range. Also Wikipedia "Geography (Ptolemy)": written about 150, and Muslim cartographers had copies by the 9th century (Edson). The text of Ptolemy's *Geography* 5.15-16 could not be opened.
- **Findings:** Ptolemy treats Palestine/Judaea, Phoenicia and Coele-Syria as sections of his map of Syria (the 4th map of Asia, per Wikipedia). "Three separate countries" is Masalha's reading and should be attributed to him.
- **Proposed patch:** attribute that claim in the summary; pages → "77-80".
- **Coordinates:** ok.

### syria-palaestina-province-created-135
- **Verdict:** needs owner decision.
- **Checked:** Masalha PDF 87-89 (about pp. 82-85; the cited "81, 84" should be "82-85"). Also Wikipedia "Syria Palaestina" (raw), which quotes Eck 1999 pp. 88-89, Feldman 1990/1996, Magness 2012, Isaac 2015, Millar 2001 pp. 107-108, and Jacobson 2001.
- **Findings:**
  - The mainstream account: the province of Judaea was renamed after the Bar Kokhba revolt (132-136), probably by Hadrian. The exact date is unknown, but a military diploma shows the new name by 139.
  - Most scholars see the renaming as a punishment, and Eck calls it unique among Roman provinces. Jacobson suggests a practical motive. Masalha says it had strategic and geographic reasons unrelated to the Bible.
  - Masalha says Hadrian merged Judaea with Philistia, Galilee and Idumaea. The usual account is that Judaea already included those regions and was simply renamed.
  - Only Masalha's perspective is present.
- **Proposed patch (owner decision):**
  - Title: "Province of Judaea renamed Syria Palaestina".
  - Summary: "After the Bar Kokhba revolt (132-136), the Roman province of Judaea was renamed Syria Palaestina, probably under Hadrian; the name is attested by 139. According to Masalha, Hadrian merged Judaea with Philistia, Galilee and Idumaea and drew on long-established Greek and Roman usage."
  - Add a perspective: "According to Werner Eck, the renaming was a punishment, the only known case of a province losing its name after a revolt." Source: W. Eck, "The Bar Kokhba Revolt: The Roman Point of View", *Journal of Roman Studies* 89 (1999), 76-89, pp. 88-89. This was seen only as a quotation; the owner should open the article.
  - Set circa to true.
- **Coordinates:** ok.

### military-diploma-syria-palaestina-139
- **Verdict:** corrected.
- **Checked:**
  - Masalha PDF 87 (about p. 82; the cited p. 81 is within one page).
  - Héron de Villefosse 1897, offprint read in full: https://tpsalomonreinach.mom.fr/files/original/40ead7e57a8f01765c1ca862699b7495fb0e57ee.pdf
  - Eck & Pangerl 2005, read: https://scriptaclassica.org/index.php/sci/article/download/3459/2979/6587
  - Millar 2001 (quotation via Wikipedia).
- **Findings:**
  - The diploma is CIL XVI 87, dated 22 November 139.
  - The provenance is disputed. The donor (J.-A. Durighello of Beirut) reported a find near Nazareth. Clermont-Ganneau's informant, the dealer Farah, said it was found at Der'a in the Hauran; Villefosse found this credible and thought the tablet had been bought at Nazareth.
  - "Earliest" is Masalha's claim, and the summary already attributes it to him.
- **Proposed patch:**
  - Revise the summary to give the full date and both provenance accounts, and add both sources.
  - Owner decision: replace the Nazareth pin with a country-wide point plus an editorNote, or keep it with a note.
  - Day precision ("139-11-22") would be possible if the schema accepts a three-digit year.
- **Coordinates:** owner decision (see above).

### jerusalem-renamed-aelia-capitolina-2nd-century
- **Verdict:** corrected.
- **Checked:** Masalha PDF 90-91 (about pp. 86-87; the cited pp. 85-86 are within one page); Wikipedia "Aelia Capitolina" (raw), citing Metcalf 2012, Weksler-Bdolah 2019 pp. 54-58, Magness 2024 p. 307, and Eshel 2006 p. 107.
- **Findings:**
  - Masalha's statements (five centuries until 638, the Arabic name Iliya, Gil 1997: 114) are paraphrased faithfully.
  - The colony was founded during Hadrian's visit of 129/130. Foundation coins struck before the revolt have led most historians to accept Cassius Dio's account that the founding came first.
- **Proposed patch:**
  - `dateStart` "100" with century precision → "130" with year precision and circa. Add Weksler-Bdolah 2019 (Brill, ISBN 978-90-04-41707-6); the owner should open it.
  - Location precision `exact` → `area`.
- **Coordinates:** ok.

### hadrian-visits-gaza-130
- **Verdict:** ok.
- **Checked:** Masalha PDF 89 (about p. 85; the cited p. 84 is ok); the Birley 1997: 234 quotation is present in Masalha. Wikipedia "Hadrian": he was in Egypt before 29 August 130, which is consistent with a July visit to Gaza. Birley was not opened.
- **Findings:** accurate and attributed.
- **Proposed patch:** location precision `exact` → `area`.
- **Coordinates:** ok.

### justin-martyr-first-apology-155
- **Verdict:** ok.
- **Checked:** Masalha PDF 90 (about p. 86; the cited p. 85 is ok); Wikipedia "Justin Martyr": the First Apology dates to about 155 (Rokeah 2002 p. 2), and he describes himself as from "Flavia Neapolis in Palestine" (Apology 1.1).
- **Findings:** accurate.
- **Proposed patch:**
  - Location precision `exact` → `area`.
  - Optional: category "religious-sites" → "cultural", since this is a written work.
- **Coordinates:** ok (0.6 km off).

### origen-settles-caesarea-232
- **Verdict:** corrected.
- **Checked:**
  - Masalha PDF 106 (index pp. 100-03; the passage is on about pp. 101-102).
  - Wikipedia "Origen": he stopped in Caesarea about 231, then settled there permanently (McGuckin 2004; Crouzel 1989).
  - Wikipedia "Theological Library of Caesarea Maritima", citing Murphy-O'Connor 2008 p. 241: Pamphilus built the library on Origen's collection, and the figure of 30,000 volumes is for the year 630, based on Isidore of Seville.
- **Findings:**
  - The 30,000 figure is a later estimate, not a 3rd-century one.
  - "Helping build a large theological library" overstates Origen's role.
  - 232 should be marked circa.
- **Proposed patch:** new summary and circa true; pages "100-101" → "101-102".
- **Coordinates:** ok.

### eusebius-martyrs-of-palestine-311
- **Verdict:** corrected.
- **Checked:** Masalha PDF 108-109 (about pp. 104-105; the cited pp. 103-104 are ok); Wikipedia "Martyrs of Palestine".
- **Findings:**
  - Wikipedia says the long version was written after 311, when the persecution in Caesarea stopped, and published in 315-316. The work survives in a short version (in the *Ecclesiastical History*) and a long version found in 1866.
  - The 311 date is Masalha's. Mark it circa, or add "published c. 315-316".
  - The page references in the editorNote ("p.111 / p.110") are wrong; the passage is on pp. 104-105.
  - Calling Eusebius "Bishop of Caesarea" at the time of writing is doubtful, since he became bishop around 313. This date was not verified; the owner should check it and consider "later bishop".
- **Proposed patch:** circa true; correct the editorNote pages to 104-105.
- **Coordinates:** ok.

### council-of-nicaea-325-palestine
- **Verdict:** ok.
- **Checked:** Masalha PDF 111 and 113 (index pp. 106-7, 109). The cited "106, 108" should be "106-107, 109".
- **Findings:** everything matches and is attributed: Eusebius, Macarius of Aelia and 17 other Palestinian bishops attended (Wallace-Hadrill 1982: 165); Aelia was given honour while Caesarea stayed the metropolitan see; Maximus later used the ambiguity. This is consistent with Canon 7 of Nicaea, which the reviewer knows but did not re-read.
- **Proposed patch:** pages → "106-107, 109".
- **Coordinates:** ok as an approximate anchor.

### euthymius-monastery-founded-428
- **Verdict:** needs owner decision (date), plus a coordinate fix.
- **Checked:** Masalha PDF 135-136 (index pp. 132, 147; the cited pp. 133-134 should be "132-133"); Wikipedia "Monastery of Euthymius" (raw).
- **Findings:**
  - Per Wikipedia, Euthymius (377-473) founded the laura in 420, and Juvenal consecrated its church on 7 May 428 (Pringle 1993 p. 229). It was abandoned in the 13th century; the site is now known as Khan al-Ahmar.
  - "Established in 428" is therefore the church consecration, not the founding.
  - Masalha gives Euthymius' dates once as 377-475 and once as 377-473; the standard is 473. Our summary gives no dates.
  - Masalha calls Euthymius an "Armenian monk" (he was born at Melitene); the summary leaves this as it is.
- **Proposed patch (owner decision):** summary → "The monk Euthymius founded a laura east of Jerusalem around 420; its church was consecrated in 428..."; add Pringle 1993, *The Churches of the Crusader Kingdom of Jerusalem* vol. 1 (Cambridge UP), p. 229.
- **Coordinates:** fix 31.79, 35.35 → 31.7922, 35.3361 with precision `exact` (Wikipedia; the current point is about 1.3 km off).
