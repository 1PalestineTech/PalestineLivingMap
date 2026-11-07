# Phase 10 report: QA and fact-check

Dates: 2026-11-03 to 2026-11-04. Status: DRAFT for the owner's review. Nothing has been committed, and no event is set to `verified`.

## Summary

- **Every event was checked against its sources.** All 175 events were reviewed in eight groups by era. Each group's full findings are in `docs/phase10/findings-<group>.md`, and its proposed fixes are in `docs/phase10/patches-<group>.json`.
- **Verdicts:** 49 ok, 85 corrected, 41 needing your decision. The per-event table is at the end of this report.
- **Clear fixes applied to `events.json`:** 217 of the 221 proposed patches applied cleanly, and the other 4 were applied by hand. A few follow-up fixes were needed, listed below. 127 events changed in all.
- **Not applied:** every judgement call, contested rewrite, merge or removal is listed under "Decisions for the owner".
- **Checks after the changes:** `npm run validate` passes with 3 warnings (the two Lebanon pins outside the region box and the sample map layer). `npx tsc --noEmit` passes, `npx vitest run` passes 90 of 90 tests, and `npm run build` succeeds (with the existing warning about a chunk over 500 kB).
- **Placeholders resolved:** all five events tagged `placeholder` now cite sources that were actually read, and the tag is removed. Each one's `editorNote` now begins "Phase 10 (2026-11-03): placeholder resolved" and says what was read.
- **Coordinates:** every pin was checked against Wikipedia's coordinates. Ten pins were moved to the known site; see "Coordinates moved" below.

### How the Masalha citations were checked
- The owner's PDF was converted to text locally (in the scratchpad, not the repo).
- Each cited passage was located in that text and in the book's own index.
- Page ranges were corrected where the passage lay 1-2 pages away. The Ayyubid chapter was often one page low.
- No text from the book was copied into the data.

### Sources nobody could read
Britannica (403), UNESCO WHC (403), the ICJ PDFs (403), B'Tselem (429), PalQuest and Palestine Remembered (Cloudflare), older mfa.gov.il pages (404), and JSTOR. These were never bypassed. Where a claim rests only on one of them, the group findings say so, and the owner can paste the page.

## Fixes applied to `events.json`

Grouped by kind; the exact old and new values are in the `patches-*.json` files.

- **Masalha page ranges:** about 30 corrected to the passage's real place in the book, checked against the book's index.
- **Dates and precision**, each from a primary or UN source that was read:
  - Peel report: 7 July 1937.
  - Absentees' Property Law: 14 March 1950.
  - Israeli law applied to East Jerusalem: 27-28 June 1967.
  - Jericho World Heritage listing: 17 September 2023.
  - Palestinian legislative elections: 25 January 2006.
  - Gaza war: 7 July to 26 August 2014.
  - Great March of Return: began 30 March 2018.
  - Battle of Ridaniya (end of the Ottoman conquest): 22 January 1517.
  - Al-Fula land sale dispute: ends 1911.
  - `circa` set where the sources say "about": Origen, Eusebius, Esarhaddon, Justinian and the Ghassanids, and the Arab conquest of Jerusalem.
- **Factual corrections in summaries.** These change what a summary says, so they are worth reading first:
  - Ibn Khaldun's Filastin tax figures date from about 780 CE, under al-Mahdi, not from the Mamluk era (Le Strange 1890, pp. 44-45).
  - Hittin: Salah al-Din took Acre in 1187. The Franks regained it in 1191.
  - Resolution 67/19 (2012) did not replace "PLO" with "Palestine".
  - The 1872 Jerusalem mutasarrifate did not yet include Beersheba, and the Vilayet of Beirut dates from 1888.
  - Falastin moved to East Jerusalem in 1948 and ran until 1967.
  - Jaffa-Jerusalem railway: the first trains took 3.5-6 hours, about the same as a carriage.
  - Samu raid: the mine killed soldiers, not border policemen.
  - UNRWA: about 750,000 refugees and operations from 1 May 1950, per the UN.
  - Kafr Qasim: 48 or 49 killed. The court convicted eight men of killing 43.
  - Khan Yunis and Rafah: UNRWA's lists give 275 and 111 named dead.
  - Gaza 2008-09 and 2014: casualty figures now come from the UN fact-finding reports, with each figure attributed.
  - Second intifada: the B'Tselem counts and the Mitchell Report's finding are now attributed.
  - Oslo II: Area C was about 62% of the West Bank per OCHA (2010), and the agreement said it would be transferred in phases.
  - ICJ opinions of 2004 and 2024: the vote counts are now given.
  - Military diploma of 139: exact date 22 November 139, and a disputed findspot.
  - Origen: the "30,000 manuscripts" figure goes back to a 7th-century estimate.
  - Fulcher of Chartres: he was a former chaplain, to Baldwin I.
  - Fatimid conquest: "destroyed" changed to "ordered the destruction of".
  - Al-Uqhuwana: "briefly" removed, since it is not in the source.
  - Madaba map: first partly uncovered in 1884, recognised in full only in 1896.
  - Jacotin maps: the French and Arabic labels are given separately.
  - Maps naming Palestine: only Fra Mauro drew on al-Idrisi.
  - Safad: the province count and the Red Mosque's date (1275-76) now note that sources differ.
  - Deir Yassin: scholarly estimates of the dead are 93-140. The 254 announced at the time is labelled as such.
  - 1929 disturbances: the Shaw Commission findings and Snell's note of reservation are now stated accurately.
  - Arab Revolt: the strike was started by local committees, the Khalidi figures go to the right Khalidi, and the British figures are credited to Levenberg.
  - Supreme Muslim Council: the Mufti was appointed in 1921.
  - The Battle of Yarmuk title no longer claims that the battle alone ended Byzantine rule.
- **Wording that stated someone's interpretation as fact, now attributed:**
  - Masalha's readings of the Greek writers, of Ptolemy, and of the Seleucid period.
  - Aristotle's lake is now a "report".
  - Al-Maqdisi's names were given to him by others, not only chosen by him.
- **Misattributed perspectives corrected:**
  - Morris on the 1834 revolt (now cited from his own TNR article).
  - Waldner on the 1858 Land Code.
  - Said and Karsh on Oslo (each cited from their own article).
  - Malley and Agha on Camp David 2000.
  - Israeli security forces on the Great March (from the UN Commission report).
  - The four East Jerusalem 1967 perspectives (see the placeholders below).
- **Sources added:** about 70 sources that were actually read, among them:
  - UN reports and resolutions: S/8146, A/3212/Add.1, A/HRC/12/48, A/HRC/29/52, A/HRC/40/74, and the texts of SC 248, SC 252 and GA 2253.
  - Law texts: the Absentees' Property Law and the Law of Return.
  - Hansard.
  - The texts of the PA-X agreements and the Mitchell Report.
  - Public-domain books: Stevenson 1907, Lane-Poole 1901, Le Strange 1890, and Arrian.
  - Articles: Eck & Pangerl 2005, and Feldman et al. 2019 (ancient DNA).
  - The PEF's own history page.
- **Placeholders resolved:**
  - **Montgisard:** the amateur site was replaced by Stevenson and Hamilton.
  - **East Jerusalem 1967:** now cites the UN S/8146 report, the Ben-Dov judgment, JTA, and the texts of SC 252 and GA 2253. The untraceable "Justice Kahan 1970" perspective was replaced.
  - **Legislative elections 2006:** now cites the EU observer statement and UN News.
  - **Gaza war 2014:** now cites A/HRC/29/52.
  - **Great March of Return:** now cites A/HRC/40/74.
- **Formatting:**
  - A tag typo fixed ("cuneiorm").
  - Stale references to `sample-nakba-1948` removed.
  - Precision changed from `exact` to `area` where the pin is a town.
  - The source label for jfc.org.il corrected (it is the Israel Film Archive).
  - Wikipedia URLs that had moved were updated.
  - In 51 editor notes that use the standard wording, "check against GeoNames" now reads "checked against Wikipedia coordinates in Phase 10".

### Coordinates moved
| Event | New point | Was off by |
|---|---|---|
| sargon-ii-conquers-ashdod-712-bce | Tel Ashdod / Isdud | 5.7 km (pin was modern Ashdod) |
| israel-jordan-wadi-araba-treaty-1994 | Wadi Araba crossing | about 14 km |
| israel-extends-law-east-jerusalem-1967 | Old City | about 2 km (pin was in West Jerusalem) |
| king-david-hotel-bombing-1946 | the hotel | about 0.3 km |
| fall-of-haifa-1948 | Haifa downtown | about 2.9 km (pin was on Mount Carmel) |
| end-of-mandate-israel-declaration-1948 | Independence Hall | about 2.7 km |
| dahir-al-umar-takes-acre-1749 | Old City of Acre | about 1.2 km |
| new-haifa-founded-dahir-al-umar-1764 | Old City of Haifa | about 2.7 km |
| battle-of-al-uqhuwana-1029 | east shore of the lake, approximate | Wikipedia's own coordinate for this battle is wrong |
| euthymius-monastery-founded-428 | the monastery site | about 1.3 km; now precision `exact` |

### Follow-up fixes needed after applying the patches
- **Deir Yassin:** the proposed summary ran to 65 words, so it was shortened to 59.
- **Arab conquest of Jerusalem:** the proposed date of 637 falls outside the early-islamic era. It was kept at 638 with `circa`, and the 637/638 disagreement is explained in the `editorNote`.
- **Schema errors:** empty `author` and `pages` values left by the patches were removed, and numeric page values were turned into text.
- **Held back:** the new summary for `oct-7-attack-and-gaza-war-2023` was not applied (see decision 1 below). Its sources were added.

## Decisions for the owner

These were not applied. Each is explained in full in the group findings files.

### Contested or major
1. **oct-7-attack-and-gaza-war-2023.**
   - Should it be split into three events: the attack of 7 October 2023, the war up to the 10 October 2025 ceasefire, and an ongoing period after the ceasefire?
   - A proposed summary with figures as of 28 October 2026 is in `patches-1993-present.json`. It gives OCHA's figures: 74,564 Palestinians killed, according to the Gaza Ministry of Health, and "over 1,200" killed in Israel, according to the Israeli authorities.
   - The figure of 251 hostages still rests on Wikipedia alone.
2. **nakba-1947-1948.**
   - Take the Wikipedia citation out of the summary text and cite the UN Conciliation Commission's 1949 figure of 711,000 refugees instead.
   - Extend `dateEnd` to 1949.
   - Add a current Israeli scholarly view, for example Morris or Karsh.
   - Label the UNISPAL page as the UN Division for Palestinian Rights.
3. **lydda-ramle-expulsions-1948:** a written IDF expulsion order exists, signed by Rabin (Morris 2004, p. 429). The summary's "accounts differ on whether the departure was ordered" understates this. The open dispute is about Ben-Gurion's intent. The Kadish and Sela perspective could not be confirmed.
4. **imru-al-qais-death-328:** Masalha calls him a Ghassanid. Mainstream sources call him a Lakhmid; the Ghassanids are first attested in 473. The inscription was found at al-Namara in Syria. Rewrite the event, or drop it.
5. **merneptah-stele-canaan-gaza-1205-bce:** standard translations of the stele name neither Gaza nor the Peleset, and the standard date is about 1208 BCE. A rewrite is proposed.
6. **syria-palaestina-province-created-135:** add the mainstream view that the renaming was a punishment (Eck 1999) and retitle the event as a renaming. The name is attested by 139.
7. **philisto-arabian-coinage-gaza-538-bce:** numismatists date this coinage to the 5th-4th century BCE, not 538.
8. **ayyubid-madrasahs-jerusalem:** the "nearly a quarter" waqf figure rests on a blog cited in Masalha's notes. Drop it or find a real source.
9. **status-quo-firman-1852:** the international confirmation was probably the Treaty of Berlin (1878, Article 62), not Paris (1856). Check both treaty texts.
10. **ottoman-population-1878:** the figures are Justin McCarthy's corrected estimates for 1881-82. His figure for 1878 is about 441,000. Retitle or redate the event. Also, the "1887, about 600,000" figure in the Quora answer matches McCarthy's 1902-03 row.

### Duplicates and overlaps
- **council-of-chalcedon-451** and **council-of-chalcedon-451-three-palestines:** merge them.
- **crusaders-conquer-palestine-latin-kingdom-1099** and **jerusalem-captured-first-crusade-1099:** make one the founding of the kingdom and the other the capture of the city. The 1099 casualty perspectives also need restructuring into Latin, Arabic and modern estimates.
- **unga-resolution-3236-plo-1974**, **arafat-un-general-assembly-1974** and **rabat-summit-plo-1974:** move Resolution 3237 into the 3236 event, and make their location names, Hebrew names and coordinates consistent.
- **The 1948-1967 era has no Nakba or refugee entry.**

### Dates disputed between sources
- Daher al-Umar:
  - Marj Ibn Amer: Masalha 1735, Philipp after 1738.
  - Acre: taken 1744, formal tax farm 1746, headquarters about 1750.
  - New Haifa: Masalha 1764, Yazbak 1765-69.
- Tarikh Safad: 1372-76 according to Luz.
- Holy Sepulchre keys: 1187, 1192 or 1193.
- Ascalon demolition: 1191.
- Madaba map: 542-570 is the scholarly window, against Masalha's 560-565.
- Euthymius: the laura was founded in 420; 428 is the consecration of its church.
- Idrimi statue: about 1500 or 1400-1350 BCE.
- Siege of Gaza 332 BCE: no ancient source gives the month.
- Aelia Capitolina: about 130 CE.
- Tarikh Safad and Ibn Battuta: Ibn Battuta's account of Palestine may be copied from al-Abdari (Elad).
- Camp David 2000: ended 24 or 25 July.
- Aylah 630: a treaty, not a capture.

### Perspectives still missing or resting on unread sources
- **June 1967 war:** has only the US view.
- **Other gaps:**
  - Camp David 2000: an Israeli and a Palestinian participant's account.
  - ICJ opinion 2024 and Jericho World Heritage listing: Israel's rejection.
  - Second intifada and Gaza 2014: Israeli government figures.
  - Napoleon: an Ottoman or Arab account.
  - Kafr Qasim: a Palestinian-perspective source.
  - Hope Simpson report: a Zionist view.
  - Qassam: a second view, plus context on the killing of Sergeant Rosenfeld.
  - King David Hotel: context on Operation Agatha and the Jewish Agency's condemnation.
  - Peel: the Arab rejection at Bludan (1937).
  - Herodotus: Feldman's reading.
  - Ramesses III and the Peleset: the ancient-DNA perspective was added; check the wording.
- **Claims resting on unread search snippets:**
  - end-of-israeli-military-government-1966: the "PalQuest 1968" perspective.
  - land-day-1976: "three of the dead were women", which seems doubtful; one woman is named.
  - law-of-return-1950: "unanimously".
  - jerusalem-notables-petition-1891: no source read mentions the petition.
  - first-aliyah-1882: the Pappé and Masalha quotes need re-sourcing.
- **Spelling consistency:** Daher, Dahir or Zahir al-Umar; Judeh or Joudeh; Sursock.
- **Location of october-war-1973:** "Palestine" is odd for a war in Sinai and the Golan.

### Still to do before verification
Wikipedia is still a source on many events. Under SOURCING.md it may serve only as a pointer and must be replaced before an event is verified. Each group findings file names the better source to use where one was found.

## App QA

Run in the built-in browser against `npm run dev`. Before any change: `npm run validate` passed (175 events, 4 warnings), `tsc` passed, and `vitest` passed 90 of 90 tests.

### Passed
- **Story mode** ("palestine-through-the-ages"): the intro, Start, all 10 steps, Back, Next, Full card, Exit and Finish work. The year and camera move at each step, and each caption matches its card. The "Sample story" tag is correctly hidden.
- **Search**: English, Arabic (حيفا, القدس, الرملة, يافا, دير ياسين, غزة) and Hebrew (חיפה, ירושלים, יפו) queries all return results. Matching ignores case and works on prefixes.
- **`#event=` links**: the card opens on page load and on an in-page hash change. An unknown id is ignored.
- **Filters**: the dialog is labelled and focus moves into it. Toggling a category updates `cats=` in the URL and the event list. Escape closes the dialog and returns focus to the Filters button.
- **About dialog and theme toggle**: the dialog is labelled. The theme cycles device → light → dark → device, is saved, and the page background follows it.
- **Keyboard**: the tab order is top bar → map → zoom and reset → attribution → era chips → Play, speed and year handle → event list. The skip link appears on focus and moves focus to the event list. A list item opens the card and moves focus to the card title.
- **Phone, 375 × 812**: there is no horizontal scroll and the top-bar buttons are 44 px. The sheet is a modal dialog with a working focus trap. Escape closes it and removes `event=` from the URL. The phone search sheet puts focus in the input and works in Arabic.

### Issues (app code; not changed in this phase)
1. **Marker contrast in the dark theme.** Against the dark basemap, the political, conflict and religious-sites fills reach only 1.4–2.0:1; WCAG 1.4.11 asks for 3:1. The outline uses the dark paper colour, so it doesn't help. In the light theme, economy (#8A7420) reaches 2.85:1 on the land tints and cultural about 3.0:1. Suggested fix: lighter fills, or a light outline, in the dark theme.
2. **Choosing a multi-year event from the event list moves the timeline to the event's start year.** For example, picking "Gaza Strip under Egyptian administration" while viewing 1956 jumps the timeline to 1948. Suggested fix: keep the current year when it falls inside the event's span.
3. **Search shows at most 8 results** with no "more results" hint. غزة returns the 8 oldest Gaza events, so the 2005–2023 Gaza events can't be reached that way. Search has no typo tolerance: "balfor", "nakbah" and "nabka" return nothing.
4. **The "SAMPLE: placeholder shape" layer still appears in Filters.** Remove or replace it before launch.
5. **An unknown `#event=` id shows no message.**
6. **Attribution is doubled in perspective blocks.** A heading such as "According to Irgun:" is followed by a claim that starts "According to the Irgun's ...". Drop one of the two.

### Not done or still open
- **Lighthouse**: not available in the built-in browser. Run it in Chrome DevTools before deploying.
- **Screen readers**: a real NVDA or VoiceOver pass was not possible here. ARIA roles and labels were checked by inspection only.
- **About dialog**: there is no error-report contact yet; the owner needs to supply one.
- **Basemap loading**: OpenFreeMap tiles can take a few seconds on first load, and the empty map shows no loading indicator.

## Per-event verdicts

The verdicts are those of the review groups. "Corrected" means a clear fix was proposed; those fixes were applied, except for the oct-7 summary. Details for each event are in the findings file named in the last column.

| Event | Era | Verdict | Findings file |
|---|---|---|---|
| merneptah-stele-canaan-gaza-1205-bce | ancient | needs owner decision. | findings-masalha-ancient-classical-a |
| ramesses-iii-war-peleset-1181-bce | ancient | corrected. | findings-masalha-ancient-classical-a |
| idrimi-statue-kinahhu-1500-bce | ancient | needs owner decision (date). | findings-masalha-ancient-classical-a |
| philistine-expansion-beisan-1100-bce | ancient | needs owner decision. | findings-masalha-ancient-classical-a |
| adad-nirari-iii-campaign-palashtu-800-bce | ancient | ok. | findings-masalha-ancient-classical-a |
| qurdi-ashur-lamur-letter-735-bce | ancient | ok. | findings-masalha-ancient-classical-a |
| sargon-ii-conquers-ashdod-712-bce | ancient | corrected. | findings-masalha-ancient-classical-a |
| esarhaddon-treaty-dor-pilisti-675-bce | ancient | ok. | findings-masalha-ancient-classical-a |
| philisto-arabian-coinage-gaza-538-bce | ancient | needs owner decision. | findings-masalha-ancient-classical-a |
| herodotus-histories-palaistin-450-bce | ancient | needs owner decision. | findings-masalha-ancient-classical-a |
| aristotle-meteorology-dead-sea-340-bce | ancient | ok (minor wording). | findings-masalha-ancient-classical-a |
| siege-of-gaza-332-bce | classical | needs owner decision (month precision); a source should also be added. | findings-masalha-ancient-classical-a |
| seleucid-empire-founded-312-bce | classical | corrected. | findings-masalha-ancient-classical-a |
| ptolemy-geography-map-palaestina-150 | classical | corrected. | findings-masalha-ancient-classical-a |
| syria-palaestina-province-created-135 | classical | needs owner decision. | findings-masalha-ancient-classical-a |
| military-diploma-syria-palaestina-139 | classical | corrected. | findings-masalha-ancient-classical-a |
| jerusalem-renamed-aelia-capitolina-2nd-century | classical | corrected. | findings-masalha-ancient-classical-a |
| hadrian-visits-gaza-130 | classical | ok. | findings-masalha-ancient-classical-a |
| justin-martyr-first-apology-155 | classical | ok. | findings-masalha-ancient-classical-a |
| origen-settles-caesarea-232 | classical | corrected. | findings-masalha-ancient-classical-a |
| eusebius-martyrs-of-palestine-311 | classical | corrected. | findings-masalha-ancient-classical-a |
| council-of-nicaea-325-palestine | classical | ok. | findings-masalha-ancient-classical-a |
| euthymius-monastery-founded-428 | classical | needs owner decision (date), plus a coordinate fix. | findings-masalha-ancient-classical-a |
| council-of-chalcedon-451-three-palestines | classical | needs owner decision (it duplicates another event; the content is sound). | findings-masalha-classical-b |
| mar-saba-monastery-founded-484 | classical | corrected (pages). | findings-masalha-classical-b |
| justinian-creates-patriarch-of-aelia-531 | classical | corrected (pages). | findings-masalha-classical-b |
| madaba-mosaic-map-560-565 | classical | needs owner decision. | findings-masalha-classical-b |
| sasanian-conquest-palestine-614 | classical | corrected (pages). | findings-masalha-classical-b |
| imru-al-qais-death-328 | classical | needs owner decision. | findings-masalha-classical-b |
| petros-aspebetos-phylarch-bishop-427 | classical | ok. | findings-masalha-classical-b |
| council-of-chalcedon-451 | classical | needs owner decision (duplicate of the event above). | findings-masalha-classical-b |
| elias-patriarch-jerusalem-494 | classical | ok (source added). | findings-masalha-classical-b |
| justinian-ghassanid-phylarchates-529 | classical | corrected (circa). | findings-masalha-classical-b |
| muslim-capture-of-aylah-630 | classical | needs owner decision. | findings-masalha-classical-b |
| battle-of-yarmuk-636 | classical | corrected (title); summary wording for the owner. | findings-masalha-classical-b |
| dome-of-the-rock-completed-691 | early-islamic | needs owner decision. | findings-masalha-early-islamic-crusader |
| arab-conquest-of-jerusalem-638 | early-islamic | corrected. | findings-masalha-early-islamic-crusader |
| abd-al-malik-currency-reform-696 | early-islamic | needs owner decision. | findings-masalha-early-islamic-crusader |
| al-aqsa-mosque-completed-705 | early-islamic | ok. | findings-masalha-early-islamic-crusader |
| foundation-of-al-ramla-705 | early-islamic | corrected (pages). | findings-masalha-early-islamic-crusader |
| fatimid-conquest-of-palestine-970 | early-islamic | corrected. | findings-masalha-early-islamic-crusader |
| al-maqdisi-ahsan-al-taqasim-985 | early-islamic | corrected. | findings-masalha-early-islamic-crusader |
| destruction-holy-sepulchre-1009 | early-islamic | corrected. | findings-masalha-early-islamic-crusader |
| bedouin-revolt-sack-of-ramla-1024 | early-islamic | ok. | findings-masalha-early-islamic-crusader |
| battle-of-al-uqhuwana-1029 | early-islamic | corrected. | findings-masalha-early-islamic-crusader |
| crusaders-conquer-palestine-latin-kingdom-1099 | crusader | needs owner decision. | findings-masalha-early-islamic-crusader |
| latin-patriarch-orthodox-patriarch-exile-1099 | crusader | corrected. | findings-masalha-early-islamic-crusader |
| caesarea-subordinated-latin-patriarchate-12th-c | crusader | ok. | findings-masalha-early-islamic-crusader |
| fulcher-of-chartres-we-have-become-orientals-1124 | crusader | corrected. | findings-masalha-early-islamic-crusader |
| rorgo-fretellus-guidebook-1130s | crusader | ok. | findings-masalha-early-islamic-crusader |
| papal-document-nazareth-1145 | crusader | ok. | findings-masalha-early-islamic-crusader |
| al-idrisi-world-map-1154 | crusader | corrected (pages). | findings-masalha-early-islamic-crusader |
| jerusalem-captured-first-crusade-1099 | crusader | needs owner decision. | findings-masalha-early-islamic-crusader |
| battle-of-montgisard-1177 | crusader | corrected. This was a placeholder; it now has real sources that were read. | findings-masalha-early-islamic-crusader |
| hittin-and-ayyubid-recovery-1187 | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| jerusalem-capital-restored-ayyubids | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| ayyubid-madrasahs-jerusalem | ayyubid-mamluk | needs owner decision. | findings-masalha-ayyubid-ottoman |
| ayyubid-coastal-demolitions | ayyubid-mamluk | needs owner decision. | findings-masalha-ayyubid-ottoman |
| ain-jalut-1260 | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| safad-regional-capital-1266 | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| fall-of-acre-1291 | ayyubid-mamluk | ok. | findings-masalha-ayyubid-ottoman |
| jerusalem-city-without-walls-mamluk | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| ibn-battuta-palestine-1326 | ayyubid-mamluk | needs owner decision. | findings-masalha-ayyubid-ottoman |
| tarikh-safad-1378 | ayyubid-mamluk | needs owner decision. | findings-masalha-ayyubid-ottoman |
| ibn-khaldun-filastin-taxes-1377 | ayyubid-mamluk | corrected (important). | findings-masalha-ayyubid-ottoman |
| hebron-glass-industry-mamluk | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| mujir-al-din-history-1495 | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| maps-naming-palestine-14th-15th-c | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| latin-kingdom-reestablished-acre-1192 | ayyubid-mamluk | ok. | findings-masalha-ayyubid-ottoman |
| holy-sepulchre-keys-nuseibeh-judeh-1193 | ayyubid-mamluk | needs owner decision. | findings-masalha-ayyubid-ottoman |
| treaty-of-ramla-1192 | ayyubid-mamluk | corrected. | findings-masalha-ayyubid-ottoman |
| ottoman-conquest-of-palestine-1516 | ottoman | corrected | findings-ottoman-other |
| jerusalem-walls-rebuilt-suleiman | ottoman | ok | findings-ottoman-other |
| ottoman-population-1878 | ottoman | needs owner decision | findings-ottoman-other |
| safed-hebrew-press-1577 | ottoman | ok | findings-ottoman-other |
| fakhr-al-din-ii-galilee | ottoman | ok | findings-ottoman-other |
| daher-al-umar-acre | ottoman | ok | findings-ottoman-other |
| napoleon-jaffa-acre-1799 | ottoman | needs owner decision | findings-ottoman-other |
| egyptian-rule-ibrahim-pasha | ottoman | ok, with a source gap | findings-ottoman-other |
| peasants-revolt-1834 | ottoman | corrected | findings-ottoman-other |
| status-quo-firman-1852 | ottoman | needs owner decision | findings-ottoman-other |
| ottoman-land-code-1858 | ottoman | corrected | findings-ottoman-other |
| templer-colony-haifa-1868 | ottoman | ok | findings-ottoman-other |
| jerusalem-mutasarrifate-1872 | ottoman | corrected | findings-ottoman-other |
| first-aliyah-1882 | ottoman | needs owner decision | findings-ottoman-other |
| jaffa-jerusalem-railway-1892 | ottoman | corrected | findings-ottoman-other |
| jerusalem-notables-petition-1891 | ottoman | needs owner decision | findings-ottoman-other |
| al-khalidi-letter-to-herzl-1899 | ottoman | corrected | findings-ottoman-other |
| young-turk-revolution-al-karmil-1908 | ottoman | ok | findings-ottoman-other |
| falastin-newspaper-founded-1911 | ottoman | corrected | findings-ottoman-other |
| world-war-i-home-front-1915-1917 | ottoman | ok | findings-ottoman-other |
| al-ramli-al-fatawa-al-khairiyyah-1670 | ottoman | ok. | findings-masalha-ayyubid-ottoman |
| al-tumurtashi-khabar-al-tamm-gaza-1695 | ottoman | ok. | findings-masalha-ayyubid-ottoman |
| dahir-al-umar-victory-marj-ibn-amer-1735 | ottoman | needs owner decision. | findings-masalha-ayyubid-ottoman |
| dahir-al-umar-takes-acre-1749 | ottoman | needs owner decision (page and coordinate fixes are in the patches file). | findings-masalha-ayyubid-ottoman |
| new-haifa-founded-dahir-al-umar-1764 | ottoman | needs owner decision (page and coordinate fixes are in the patches file). | findings-masalha-ayyubid-ottoman |
| ottoman-recognition-of-dahir-al-umar-1768 | ottoman | ok. | findings-masalha-ayyubid-ottoman |
| al-jazzar-mosque-acre-1781 | ottoman | corrected. | findings-masalha-ayyubid-ottoman |
| jacotin-maps-of-palestine-1799 | ottoman | corrected. | findings-masalha-ayyubid-ottoman |
| palestine-association-london-1805 | ottoman | ok. | findings-masalha-ayyubid-ottoman |
| palestine-exploration-fund-founded-1865 | ottoman | corrected. | findings-masalha-ayyubid-ottoman |
| ordnance-survey-western-palestine-1871 | ottoman | corrected. | findings-masalha-ayyubid-ottoman |
| madaba-mosaic-map-discovered-1884 | ottoman | corrected. | findings-masalha-ayyubid-ottoman |
| al-fula-land-sale-dispute-1910 | ottoman | corrected. | findings-masalha-ayyubid-ottoman |
| nakba-1947-1948 | british-mandate | needs owner decision. | findings-british-mandate |
| balfour-declaration-1917 | british-mandate | corrected (editorNote). | findings-british-mandate |
| san-remo-and-mandate-1920-1923 | british-mandate | corrected (editorNote). | findings-british-mandate |
| nebi-musa-disturbances-1920 | british-mandate | ok. | findings-british-mandate |
| jaffa-riots-1921 | british-mandate | corrected (note on sources[1]). | findings-british-mandate |
| white-paper-and-census-1922 | british-mandate | ok. | findings-british-mandate |
| supreme-muslim-council-1921 | british-mandate | corrected (summary). | findings-british-mandate |
| disturbances-1929 | british-mandate | corrected (second perspective). | findings-british-mandate |
| hope-simpson-passfield-1930 | british-mandate | ok. | findings-british-mandate |
| izz-ad-din-al-qassam-killed-1935 | british-mandate | needs owner decision. | findings-british-mandate |
| arab-revolt-1936-1939 | british-mandate | corrected (summary and two perspectives). | findings-british-mandate |
| peel-commission-partition-1937 | british-mandate | corrected (date, precision, and an added source). | findings-british-mandate |
| white-paper-1939 | british-mandate | corrected (editorNote). | findings-british-mandate |
| jewish-immigration-1930s | british-mandate | ok. | findings-british-mandate |
| king-david-hotel-bombing-1946 | british-mandate | corrected (added source and coordinates). | findings-british-mandate |
| un-partition-plan-1947 | british-mandate | corrected (added source). | findings-british-mandate |
| deir-yassin-1948 | british-mandate | corrected (summary). | findings-british-mandate |
| fall-of-haifa-1948 | british-mandate | corrected (editorNote and coordinates). | findings-british-mandate |
| end-of-mandate-israel-declaration-1948 | british-mandate | corrected (editorNote and coordinates). | findings-british-mandate |
| armistice-agreements-1949 | 1948-1967 | ok. | findings-1948-1993 |
| un-general-assembly-resolution-194-1948 | 1948-1967 | needs owner decision. | findings-1948-1993 |
| lydda-ramle-expulsions-1948 | 1948-1967 | needs owner decision (contested). | findings-1948-1993 |
| un-relief-and-works-agency-established-1949 | 1948-1967 | corrected. | findings-1948-1993 |
| absentees-property-law-1950 | 1948-1967 | corrected. | findings-1948-1993 |
| law-of-return-1950 | 1948-1967 | corrected (minor), plus a decision on "unanimously". | findings-1948-1993 |
| jordan-west-bank-union-1950 | 1948-1967 | corrected (wording), and a source is still needed. | findings-1948-1993 |
| gaza-egyptian-administration-1948-1967 | 1948-1967 | ok (rests on Wikipedia only). | findings-1948-1993 |
| kafr-qasim-killings-1956 | 1948-1967 | corrected, plus an owner decision. | findings-1948-1993 |
| khan-yunis-rafah-killings-1956 | 1948-1967 | corrected. | findings-1948-1993 |
| suez-sinai-war-gaza-1956 | 1948-1967 | corrected. | findings-1948-1993 |
| plo-founded-1964 | 1948-1967 | ok, with a source to add. | findings-1948-1993 |
| samu-raid-1966 | 1948-1967 | corrected. | findings-1948-1993 |
| end-of-israeli-military-government-1966 | 1948-1967 | corrected, plus an owner decision. | findings-1948-1993 |
| june-1967-war-1967 | 1967-1993 | needs owner decision. | findings-1948-1993 |
| unsc-resolution-242-1967 | 1967-1993 | ok. | findings-1948-1993 |
| imwas-yalu-beit-nuba-demolished-1967 | 1967-1993 | needs owner decision. | findings-1948-1993 |
| allon-plan-and-first-settlements-1967 | 1967-1993 | ok (rests on Wikipedia only). | findings-1948-1993 |
| battle-of-karameh-1968 | 1967-1993 | corrected (a primary source to add). | findings-1948-1993 |
| black-september-jordan-1970 | 1967-1993 | ok (rests on Wikipedia only). | findings-1948-1993 |
| land-day-1976 | 1967-1993 | needs owner decision. | findings-1948-1993 |
| unga-resolution-3236-plo-1974 | 1967-1993 | corrected (a source to add, and an editorNote fix). | findings-1948-1993 |
| camp-david-accords-and-egypt-israel-treaty-1978 | 1967-1993 | ok. | findings-1948-1993 |
| israel-invades-lebanon-1982 | 1967-1993 | ok (rests on Wikipedia only). | findings-1948-1993 |
| sabra-and-shatila-killings-1982 | 1967-1993 | ok (rests on Wikipedia only; the Kahan report could not be read). | findings-1948-1993 |
| first-intifada-1987 | 1967-1993 | ok (rests on Wikipedia only). | findings-1948-1993 |
| palestinian-declaration-of-independence-1988 | 1967-1993 | corrected (a source to add). | findings-1948-1993 |
| madrid-conference-1991 | 1967-1993 | ok (rests on Wikipedia only). | findings-1948-1993 |
| israel-extends-law-east-jerusalem-1967 | 1967-1993 | corrected; the placeholder now has real sources. Removing the placeholder tag and the "PLACEHOLDER" note is th | findings-1948-1993 |
| october-war-1973 | 1967-1993 | needs owner decision (location). | findings-1948-1993 |
| rabat-summit-plo-1974 | 1967-1993 | ok. | findings-1948-1993 |
| arafat-un-general-assembly-1974 | 1967-1993 | ok. | findings-1948-1993 |
| jericho-world-heritage-2023 | 1993-present | corrected. | findings-1993-present |
| oslo-declaration-of-principles-1993 | 1993-present | corrected. | findings-1993-present |
| hebron-ibrahimi-mosque-attack-1994 | 1993-present | ok. | findings-1993-present |
| israel-jordan-wadi-araba-treaty-1994 | 1993-present | corrected. | findings-1993-present |
| oslo-ii-interim-agreement-1995 | 1993-present | corrected. | findings-1993-present |
| camp-david-summit-2000 | 1993-present | needs owner decision. | findings-1993-present |
| second-intifada-begins-2000 | 1993-present | corrected. | findings-1993-present |
| west-bank-barrier-and-icj-opinion-2002-2004 | 1993-present | corrected. | findings-1993-present |
| gaza-disengagement-2005 | 1993-present | corrected. | findings-1993-present |
| hamas-gaza-takeover-and-blockade-2007 | 1993-present | needs owner decision. | findings-1993-present |
| unga-non-member-observer-state-2012 | 1993-present | corrected. | findings-1993-present |
| icj-advisory-opinion-occupation-2024 | 1993-present | corrected. | findings-1993-present |
| oct-7-attack-and-gaza-war-2023 | 1993-present | needs owner decision. | findings-1993-present |
| gaza-jericho-agreement-1994 | 1993-present | ok. | findings-1993-present |
| rabin-assassination-1995 | 1993-present | ok. | findings-1993-present |
| palestinian-legislative-elections-2006 | 1993-present | corrected (placeholder resolved). | findings-1993-present |
| gaza-war-2008-2009 | 1993-present | corrected. | findings-1993-present |
| gaza-war-2014 | 1993-present | corrected (placeholder resolved). | findings-1993-present |
| gaza-escalation-2021 | 1993-present | ok. | findings-1993-present |
| great-march-of-return-2018 | 1993-present | corrected (placeholder resolved). | findings-1993-present |

## Owner decisions made after Phase 10

- **2026-11-04, basemap label:** where the basemap labels "Israel", the map shows "Occupied Palestinian Lands" and the Arabic "الأراضي الفلسطينية المحتلة" (`src/map/style.ts`). This changes labels only. The basemap's borders and all other labels are unchanged. The assistant noted that this departs from the neutrality rule in the project rules and from UN usage ("occupied Palestinian territory" for the West Bank, East Jerusalem and Gaza); the owner chose it knowingly. Event cards still use the names in the data (for example "Israel (country-wide)").
- **2026-11-04, Hebrew:** hidden on cards, in search and on the basemap; the `nameHe` field is kept in the data.
- **2026-11-04, place names:** spellings follow the owner's Palestine Remembered town list.
- **2026-11-04, one whole land:** the owner replaced the "Occupied Palestinian Lands" label with "Palestine" and asked that no border or label separate the West Bank and Gaza from the rest. See `docs/MAP_LOOK.md`. Event cards are unchanged.
