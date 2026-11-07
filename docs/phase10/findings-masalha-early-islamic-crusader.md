# Findings: early-Islamic and crusader eras (19 events)

**Tally:** 5 ok, 9 corrected, 5 need an owner decision. Proposed fixes are in `patches-masalha-early-islamic-crusader.json` (23 patches).

**Masalha page offset.** In the crusader chapter (PDF pages 117-119), the book's printed index gives an offset of -4, not the -3 that `mp.mjs` estimates. The cited pages 113-115 are therefore exactly right.

**Sources that could not be read:**
- Britannica (403): the owner needs to paste the Dome of the Rock text.
- Hirschler 2014 at SOAS (Cloudflare check).
- Cambridge University Press pages (403 and 503).

Hamilton 2000 was read from an archive.org scan for checking only. Cite it by ISBN, never by that link.

**Coordinates:** every pin not discussed below is within 1 km of the Wikipedia point.

## Early-Islamic era

### arab-conquest-of-jerusalem-638
- **Verdict:** corrected.
- **Checked:** Masalha pp. 157-163 (printed 157-159, 163); Wikipedia "First Muslim conquest of Jerusalem" (raw).
- **Findings:**
  - All claims and page numbers are confirmed: Iliya in 638 (p. 163); Jund Filastin organised in the 630s (p. 159); gradual Islamisation (p. 157); Magness (p. 158).
  - Masalha also uses 637-638 (pp. 125, 154). Wikipedia gives a siege from November 636 to April 637 and the surrender to Umar in "637 or 638".
- **Proposed patch:** dateStart 638 → 637, dateEnd null → 638, circa true, and an editorNote line on the 637/638 disagreement.
- **Coordinates:** ok. Consider precision "area", since the event concerns the whole city.

### dome-of-the-rock-completed-691
- **Verdict:** needs owner decision.
- **Checked:** Wikipedia "Dome of the Rock" (raw); Masalha p. 164. Britannica returned 403.
- **Findings:**
  - Wikipedia confirms the inscription date of AH 72 (691-692), Abd al-Malik as builder, and the building as the oldest surviving work of Islamic architecture.
  - The summary's "Britannica calls it..." could not be checked. The owner should paste the Britannica text, or the sentence should be reworded.
- **Proposed patch:** add Masalha p. 164 as a source.
- **Coordinates:** ok.

### abd-al-malik-currency-reform-696
- **Verdict:** needs owner decision.
- **Checked:** Masalha pp. 178-182; Wikipedia "Abd al-Malik ibn Marwan".
- **Findings:**
  - Masalha confirms the dinar of about 696, the name Filastin on coins (p. 179), and "struck in Filastin" from the early 8th century (p. 180).
  - Wikipedia (citing Gibb 1960 and Blankinship 1994) describes two stages. Gold coins showing a standing caliph date from 693; the reform of about 696-697 made the coins inscription-only.
  - Our summary says the 696 dinar replaced the emperor's image with the caliph's. That follows Masalha's wording but merges the two stages.
  - The Gil quotation Masalha gives (p. 181) dates the "bi-Filastin" inscription to 890-904.
  - The autonomy claim is attributed to Masalha but still needs a numismatic second view, for example Bacharach 2010 (*Muqarnas* 27).
- **Proposed patch:** reword the summary to separate the 693 and 696-697 stages; pages → 178-182.
- **Coordinates:** ok (approximate).

### al-aqsa-mosque-completed-705
- **Verdict:** ok.
- **Checked:** Masalha p. 164; Wikipedia "Al-Aqsa Mosque".
- **Findings:**
  - Masalha confirms completion in 705, an earlier mosque on the site, and the Isra and Mi'raj of about 621.
  - Wikipedia says it was built by Abd al-Malik or by al-Walid I (705-715), with no agreed completion year. Our summary attributes the date, so it can stand.
- **Proposed patch:** none. Optionally add the alternative-builder view as a perspective.
- **Coordinates:** ok.

### foundation-of-al-ramla-705
- **Verdict:** corrected (pages).
- **Checked:** Masalha pp. 164-167 and 170; Wikipedia "Ramla".
- **Findings:**
  - Everything is confirmed, including the Lev and Roded citations and the etymology; Palmer's conventional "sand" view is already given.
  - Wikipedia agrees that Sulayman founded it as governor, about 705-715.
  - The "largest city" claim is on p. 167.
- **Proposed patch:** pages 164-166 → 164-167.
- **Coordinates:** ok (Wikipedia gives 31.9275, 34.8625).

### fatimid-conquest-of-palestine-970
- **Verdict:** corrected.
- **Checked:** Masalha pp. 183-184; Wikipedia "Ja'far ibn Fallah".
- **Findings:**
  - Masalha's account is confirmed.
  - The second source (citing Kennedy 2004 and Brett 2001) shows that Ja'far ibn Fallah took Ramla on 24 May 970, but Fatimid control collapsed after a Qarmatian victory in 971. Masalha's "conquered by 972" is a simplification and should be attributed to him.
- **Proposed patch:**
  - New summary: "The Egypt-based Fatimid state invaded Palestine in 970; its general Ja'far ibn Fallah took al-Ramla in May 970. Masalha says the whole country was conquered by 972; other historians note Fatimid control collapsed after a Qarmatian victory in 971 and was restored only later in the decade. Al-Ramla remained the provincial capital."
  - Add Kennedy 2004, p. 318, once it has been read.
  - Pages → 183-184.
- **Coordinates:** ok.

### al-maqdisi-ahsan-al-taqasim-985
- **Verdict:** corrected.
- **Checked:** Masalha pp. 170-175.
- **Findings:**
  - All claims are confirmed. The 985 date is on p. 172, not p. 174.
  - "Jerusalemite" and "Palestinian" are among 36 names others called him, not only his own self-description.
  - The identity reading needs a second view, for example the *Encyclopaedia of Islam* (2nd ed.) entry "al-Mukaddasi".
- **Proposed patch:** fix the page number in the editorNote and reword that clause of the summary.
- **Coordinates:** ok.

### destruction-holy-sepulchre-1009
- **Verdict:** corrected.
- **Checked:** Masalha p. 186; Wikipedia "Al-Hakim bi-Amr Allah" and "Church of the Holy Sepulchre".
- **Findings:**
  - Confirmed. Wikipedia gives 18 October 1009 and says rebuilding was completed in 1048.
  - Wikipedia also treats the destruction as a contributing factor to the Crusades, so that causal link is not Masalha's alone. The balance is acceptable.
- **Proposed patch:** "destroyed" → "ordered the destruction of", to match the title. Keep year precision until a scholarly source gives the day.
- **Coordinates:** ok.

### bedouin-revolt-sack-of-ramla-1024
- **Verdict:** ok.
- **Checked:** Masalha pp. 183 and 185-186; the background section of Wikipedia "Battle of al-Uqhuwana".
- **Findings:**
  - Everything is confirmed: September 1024, the Bayt Jibrin iqta', Tiberias, Ramla burned, and the revolt lasting until 1029.
  - Wikipedia names the Jarrahid leader "Hassan ibn al-Mufarrij". Optionally use the same spelling as the next event.
- **Proposed patch:** none.
- **Coordinates:** ok.

### battle-of-al-uqhuwana-1029
- **Verdict:** corrected.
- **Checked:** Masalha pp. 186-187; Wikipedia "Battle of al-Uqhuwana" and "Anushtakin al-Dizbari".
- **Findings:**
  - Confirmed, except that "briefly" is not in Masalha: al-Dizbari governed until 1042.
  - Wikipedia (citing Zakkar) dates the battle to 12 or 29 May 1029. Month precision is optional (owner decision).
  - The opposing coalition was the Tayy plus the Kilab under Salih ibn Mirdas, who was killed in the battle.
  - The site is east of the lake at Aqabat Fiq, not precisely identified (Gil).
- **Proposed patch:** remove "briefly".
- **Coordinates:** move the pin from 32.82, 35.55 to about 32.78, 35.66 (east side of the lake), still approximate. Wikipedia's own title coordinate for this battle (near Ramla) is wrong; don't use it.

## Crusader era

### crusaders-conquer-palestine-latin-kingdom-1099
- **Verdict:** needs owner decision.
- **Checked:** Masalha pp. 113, 167 and 188; Fordham Medieval Sourcebook; Wikipedia.
- **Findings:**
  - The page numbers and claims are confirmed.
  - It duplicates the capture event below: same year, same pin, and both describe founding the kingdom.
  - "Occupied Palestine in 1099", stated in our own voice, overstates it: Tyre fell in 1124 and Ascalon in 1153 (Stevenson).
  - The comparison with Europe is attributed but needs a second view.
- **Proposed patch:** make this the "kingdom founded" event and attribute Masalha's wording.
  - New title: "Latin Kingdom of Jerusalem founded".
  - New summary: "After the First Crusade took Jerusalem in July 1099, the crusaders set up the Crusader states, among them the Latin Kingdom of Jerusalem; its first king, Baldwin I, was crowned at Christmas 1100. The coast was conquered over the following decades. Masalha dates the kingdom 1099-1187, then at Acre from 1192 until 1291."

### jerusalem-captured-first-crusade-1099
- **Verdict:** needs owner decision.
- **Checked:**
  - Read: Wikipedia articles on the siege and the massacre; World History Encyclopedia (WHE); Fordham, Fulcher (Krey and Duncan 1912, pp. 109-115) and the Gesta (Krey 1921, p. 262); a UWM course page reproducing Gabrieli's translations of Ibn al-Athir and Ibn al-Qalanisi.
  - Could not read: Hirschler 2014 and Kedar 2004.
- **Findings:**
  - The dates are confirmed by the primary texts. Ibn al-Qalanisi gives 14 July, a small discrepancy.
  - The casualty perspectives are mislabelled and partly wrong:
    - Ibn al-Arabi, a Muslim writer, is listed under "Latin chroniclers". His figure of 3,000 comes only via WHE and could not be traced further.
    - The "about 75,000" figure for Ibn al-Athir comes from WHE. Gabrieli's translation says "more than 70,000" killed in al-Aqsa. Ibn al-Athir wrote about 1231, more than a century after the event.
    - Fulcher, an eyewitness, gives "almost ten thousand" killed in the Temple area.
    - Matthew of Edessa's 65,000 (per WHE) is not listed.
  - Ibn al-Qalanisi and a Geniza letter add the Arabic and Jewish sides.
- **Proposed patch:** replace the casualty claims with three perspectives:
  - (a) Latin: almost 10,000 killed in the Temple area according to Fulcher, and about 10,000 according to William of Tyre.
  - (b) Arabic: more than 70,000 in al-Aqsa according to Ibn al-Athir; Ibn al-Qalanisi reports "a great host" killed and the Jews burned in their synagogue.
  - (c) Modern estimates: 3,000-10,000 dead in a city of about 30,000 (Madden 2012; Boas 2001, via Wikipedia).
  - Add the Fordham and UWM pages as sources, and drop the Baldwin sentence if the kingdom event takes it.
- **Coordinates:** ok.

### latin-patriarch-orthodox-patriarch-exile-1099
- **Verdict:** corrected.
- **Checked:** Masalha p. 113; Fordham (Gesta); Wikipedia "Latin Patriarchate of Jerusalem".
- **Findings:**
  - Confirmed. Arnulf was chosen on 1 August 1099 (Gesta), so circa is not needed.
  - Wikipedia says Orthodox patriarchs continued to be appointed between 1099 and 1187 but lived in Constantinople.
- **Proposed patch:** circa → false. Reword to "the Orthodox patriarchate went into exile in Constantinople until 1187". Add Fordham as a source.

### caesarea-subordinated-latin-patriarchate-12th-c
- **Verdict:** ok.
- **Checked:** Masalha pp. 113-115.
- **Findings:** confirmed, and the interpretation is attributed. A church-history second source is advisable, for example Hamilton, *The Latin Church in the Crusader States* (1980; not read).
- **Coordinates:** ok.

### fulcher-of-chartres-we-have-become-orientals-1124
- **Verdict:** corrected.
- **Checked:** Masalha p. 114; Fordham "Fulcher of Chartres" (Book III, Krey 1921, pp. 280-281); Wikipedia.
- **Findings:**
  - The content is confirmed.
  - "July 1124" rests on Masalha alone; Fordham gives the passage without a date.
  - In 1124 the king was Baldwin II, so Fulcher was a former chaplain to Baldwin I.
  - The assimilation reading needs a second view.
- **Proposed patch:** "former chaplain to King Baldwin I"; add Fordham as a source; optionally reduce to year precision.

### rorgo-fretellus-guidebook-1130s
- **Verdict:** ok.
- **Checked:** Masalha p. 115; Wikipedia "Rorgo Fretellus" (about 1130).
- **Findings:** confirmed, and the inference is attributed. Optionally add the public-domain Palestine Pilgrims' Text Society edition (Macpherson 1896) once it has been read.
- **Coordinates:** ok.

### papal-document-nazareth-1145
- **Verdict:** ok.
- **Checked:** Masalha p. 115 (index entry "Library of Nazareth 115").
- **Findings:** confirmed. The underlying source is Riley-Smith 2005, p. 75 (not read).
- **Coordinates:** ok.

### al-idrisi-world-map-1154
- **Verdict:** corrected (pages).
- **Checked:** Masalha pp. 188-190; Wikipedia "Tabula Rogeriana" (commissioned 1138, completed 1154).
- **Findings:** confirmed.
- **Proposed patch:** pages → 188-190.
- **Coordinates:** ok.

### battle-of-montgisard-1177
- **Verdict:** corrected. This was a placeholder; it now has real sources that were read.
- **Checked:** Stevenson, *The Crusaders in the East* (CUP 1907, public domain, pp. 216-218; archive.org/details/in.ernet.dli.2015.22159); Hamilton, *The Leper King and His Heirs* (CUP 2000, ISBN 9780521017473, pp. 134-137); Wikipedia. Britannica returned 403.
- **Findings:**
  - Both books confirm the date of 25 November 1177. Stevenson's footnote cites William of Tyre (xxi.23) and Abu Shama's "Friday, beginning of Jumada II 573". 25 November 1177 (Julian) was a Friday, so the Latin and Arabic dates agree.
  - Both confirm the rout and that Salah al-Din reached Cairo on 8 December.
  - Frankish losses were 1,100 killed and 750 wounded, according to the letter of the Master of the Hospital.
  - The site is disputed: Hamilton places it at Tell Jazar (Gezer), while Barber and Imad al-Din point to Tell es-Safi.
- **Proposed patch:**
  - Drop the crusaderkingdoms.com source and the "placeholder" tag, and rewrite the editorNote.
  - New summary: "On 25 November 1177 the army of the Kingdom of Jerusalem under the young king Baldwin IV surprised and routed Salah al-Din's invading Egyptian army near Ramla, at Montgisard, a site historians place at Tell Gezer or Tell es-Safi. Salah al-Din reached Cairo on 8 December with heavy losses, ending his invasion; Frankish losses were also severe."
  - Perspective (a), Latin: about 1,100 Franks killed and 750 wounded, according to the Hospital letter. Stevenson calls William of Tyre's figure of 26,000 for Salah al-Din's army "greatly exaggerated".
  - Perspective (b), Arabic: according to Abu Shama and Baha al-Din, as reported by Hamilton, Salah al-Din admitted he had been caught unawares and said the defeat was made good only at Hattin.
- **Coordinates:** the Ramla pin is acceptable as approximate. Better: Tell Gezer (31.859, 34.919), Hamilton's site. Tell es-Safi is at 31.704, 34.847.
