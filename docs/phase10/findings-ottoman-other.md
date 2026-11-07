# Findings: Ottoman era, events without Masalha citations (20 events)

Counts: 8 ok, 7 corrected, 5 need an owner decision. Patches: `patches-ottoman-other.json`.

Sources that could not be read: PalQuest (needs the owner to paste pages), Britannica (403), the Wikisource treaty texts (rate-limited), JSTOR (Mandel), and the books by Gilbert, Gueniffey, Philipp and Cust.

Coordinates: every pin was checked against the Wikipedia coordinates API. All are within about 3 km (Jerusalem about 1.5 km; Haifa about 2.8 km, which is within tolerance for precision `area`). No coordinate fixes are needed.

Naming: the Masalha-based entries spell the name "Dahir al-Umar", while `daher-al-umar-acre` uses "Daher al-Umar". The owner should choose one spelling for the whole dataset.

### ottoman-conquest-of-palestine-1516
- **Verdict:** corrected
- **Checked:** Wikipedia (raw): Ottoman-Mamluk War (1516-17), Ottoman Palestine, Battle of Ridaniya.
- **Findings:**
  - Marj Dabiq (24 August 1516) and Yaunis Khan near Gaza (28 October 1516) are supported.
  - The five sanjaks under Damascus are supported (Doumani 1995 p.34; Gerber 1998 pp.565-566).
  - Ridaniyya: the war article gives 24 January in its body and 22 January in its infobox; the battle article gives 22 January 1517.
  - Underlying works to cite: Daly & Petry, *Cambridge History of Egypt* vol. 2 (CUP 1998, ISBN 9780521471374) p.498; Ze'evi 1996 p.2.
- **Proposed patch:** `dateEnd` "1517-01-24" → "1517-01-22", plus an `editorNote` line explaining the 22/24 January conflict.
- **Coordinates:** ok.

### jerusalem-walls-rebuilt-suleiman
- **Verdict:** ok
- **Checked:** Wikipedia Walls of Jerusalem (raw); cojs.org/?p=7394. PalQuest could not be read.
- **Findings:**
  - Wikipedia: ordered in 1535, built 1537-1541 (Murphy-O'Connor, *The Holy Land: An Oxford Archaeological Guide*, OUP 2008, ISBN 978-0-19-923666-4, p.12).
  - COJS gives 1536-1541 in its text (1538 in its title).
  - "About 1537-1541" with circa is fair. The Dome of the Rock claim is attributed to PalQuest and could not be checked.
- **Proposed patch:** none. Optionally cite Murphy-O'Connor.
- **Coordinates:** ok.

### ottoman-population-1878
- **Verdict:** needs owner decision
- **Checked:** Justin McCarthy, *The Population of Palestine* (Columbia UP 1990, ISBN 0-231-07110-8), Tables 1.3 and 1.4A-D and pp.5-14. Only the figures were consulted, from an online PDF copy; do not cite or link that copy. Also the CJPME factsheet (via search). PalQuest could not be read.
- **Findings:**
  - The figures 462,465 / 403,795 / 43,659 / 15,011 are exactly McCarthy's row for AH 1299 (1881-82) in Table 1.4D, p.10. They are his corrected projections (adjusted for the undercount of women and children), not raw Ottoman records, and they are not for 1878.
  - McCarthy gives 440,850 for 1877-78 and "441,000 persons in 1878".
  - He puts non-citizen Jews at only one to two thousand in the early period (p.13), which does not support "about 10,000".
  - CJPME prints 15,001 Jews; 15,011 is the figure that adds up to the total.
  - The 1887 figures in the handala-leads note: the Quora "1887, about 600,000, about 10% Christian, about 25,000 Jews" matches McCarthy's 1902-03 row (602,831 people; 25,257 Jews; Christians 10.9%), not 1887. His 1887-88 row is 497,645 people and 16,897 Jews. Do not use 1887 with those figures.
- **Proposed patch (owner decision):**
  - New title: "Corrected Ottoman figures put Palestine's citizen population at about 441,000 in 1878".
  - New summary: "Justin McCarthy's corrected figures from Ottoman population records give about 441,000 Ottoman citizens in 1878 in the districts of Jerusalem, Nablus and Acre (386,320 Muslims, 40,588 Christians and 13,942 Jews in 1877-78). Foreign nationals and some Bedouin were not registered. His figure for 1881-82 is 462,465."
  - Add McCarthy as a source, pages "10 (Table 1.4D), 13-14".
  - Alternative: keep 462,465, set `dateStart` to 1881, and call it McCarthy's corrected estimate.
- **Coordinates:** ok.

### safed-hebrew-press-1577
- **Verdict:** ok
- **Checked:** cojs.org/?p=36593 (citing Avi-Yonah); Wikipedia Safed and Joseph Karo (raw).
- **Findings:**
  - The Ashkenazis' press printed three books in 1577-1580 and three more in 1587.
  - Karo arrived about 1535 and died in Safed on 24 March 1575. All supported.
  - The "first press in the Middle East" claim is rightly left out.
- **Proposed patch:** none.
- **Coordinates:** ok (about 0.3 km from the Wikipedia point).

### fakhr-al-din-ii-galilee
- **Verdict:** ok
- **Checked:** Wikipedia Fakhr al-Din II and Ottoman Palestine (raw sections).
- **Findings:**
  - Supported (Abu-Husayn 1985): Safed in July 1602; the tax farms (iltizam) of Acre, Tiberias and Safed; exile 1613-18; beheaded in March or April 1635.
  - "Attempt to take Gaza and Nablus failed" compresses two things: his appointments to Gaza, Nablus and Lajjun were never carried out, and he was defeated at the Awja River in 1623. Ottoman Palestine dates the appointments to 1622 (Ze'evi p.49).
- **Proposed patch (optional):** "...but local rivals blocked his appointments to Gaza and Nablus and defeated him at the Awja River in 1623."
- **Coordinates:** ok.

### daher-al-umar-acre
- **Verdict:** ok
- **Checked:** EBSCO Research Starter; Wikipedia Daher al-Umar (raw sections).
- **Findings:**
  - Tiberias in 1730. Acre taken in 1746 per EBSCO, with events of 1743-44 per Wikipedia, so "1740s" is right.
  - The cotton trade with French merchants is supported.
  - Hasan Pasha's fleet arrived on 7 August 1775; Daher was killed on 21 or 22 August; Jazzar was given Acre on 19 September (Cohen 1973 pp.54-55).
  - The dataset spells the name Daher, Dahir and Zahir. The owner should unify it.
- **Proposed patch:** none.
- **Coordinates:** ok.

### napoleon-jaffa-acre-1799
- **Verdict:** needs owner decision
- **Checked:** Wikipedia Siege of Jaffa, Siege of Acre (1799) and Ottoman Palestine (raw). A search for al-Jabarti found nothing readable.
- **Findings:**
  - The dates are supported: Jaffa 3-7 March; Acre 20 March-21 May, with the final assault on 10 May; about 2,000 French deaths from plague.
  - The perspective's only source is Wikipedia itself. The underlying works are Gueniffey, *Bonaparte 1769-1802* (Harvard UP 2015) pp.481-488, and Roberts, *Napoleon: A Life* (2014) pp.189-190.
  - The killing of prisoners at Jaffa: sources give 2,100, about 2,440 and 4,100 prisoners. Ottoman Palestine (citing McGregor 2006 p.44) says about 3,000 surrendered troops "and many civilians" were killed.
  - The summary leaves the killings out entirely. The owner could add one attributed sentence giving the range.
  - An Ottoman or Arab perspective is still missing. Leads: al-Jabarti (trans. Moreh, Markus Wiener); Philipp, *Acre* (2001).
- **Proposed patch:** owner decision (cite Gueniffey and relabel the viewpoint).
- **Coordinates:** ok.

### egyptian-rule-ibrahim-pasha
- **Verdict:** ok, with a source gap
- **Checked:** Wikipedia Egyptian-Ottoman War (1831-33) and Ottoman Palestine (raw).
- **Findings:**
  - The campaign from October/November 1831 and the fall of Acre in May 1832 are supported.
  - Conscription, disarmament, taxes and the 1840 end are in Ottoman Palestine (Doumani 1995 pp.44-45), not in the cited source (src0).
  - "Austrian" is not stated in any page read.
- **Proposed patch:** none. Cite Doumani, *Rediscovering Palestine* (UC Press 1995, open access on eScholarship) pp.44-45, or drop "Austrian".
- **Coordinates:** ok.

### peasants-revolt-1834
- **Verdict:** corrected
- **Checked:** Wikipedia "Peasant's revolt in Palestine" (raw; the article has been moved to this title); Benny Morris, "The Rejection", *The New Republic*, 21 April 2003 (read in full).
- **Findings:**
  - The summary is accurate: the order of 25 April; Jerusalem besieged on 8 May and entered on 20-21 May; Ibrahim back on 30 May; Nablus on 15 July; Hebron on 4 August; leaders executed and the population disarmed (Rood 2004; Beinin).
  - The Morris perspective is misattributed. Morris says the rebels did not demand independence and would have called themselves Ottoman subjects or Arabs. "Sought a return to Ottoman rule" is Judith Rood's view (Brill 2004, p.139), not his.
  - Kimmerling & Migdal's book is *The Palestinian People: A History* (Harvard UP 2003, ISBN 978-0-674-01129-8).
- **Proposed patch:** in the JSON (reworded Morris claim, the TNR article added as a source, and the perspective pointed at it).
- **Coordinates:** ok.

### status-quo-firman-1852
- **Verdict:** needs owner decision
- **Checked:** Wikipedia Status Quo (raw). The Wikisource treaty texts were rate-limited and not read.
- **Findings:**
  - Supported (Dumper & Stanley 2007 p.209): the 1757 firman of Osman III, the 1852 and 1853 firmans of Abdulmecid, the six communities, and year-only dating.
  - The claim that the Treaty of Paris (1856) gave the status quo international recognition is doubtful. From the reviewer's own knowledge (the treaty texts would not load), Article 9 of Paris concerns the Sultan's 1856 reform firman for Christian subjects; the explicit "status quo in the Holy Places" clause is Article 62 of the Treaty of Berlin (1878). The owner should check both texts.
  - A primary source to add: L.G.A. Cust, *The Status Quo in the Holy Places* (1929), on archive.org as "cust-status-quo-holy-places" (not read).
- **Proposed patch (owner, after checking the treaties):** "The Treaty of Berlin of 1878 (Article 62) confirmed it internationally."
- **Coordinates:** ok.

### ottoman-land-code-1858
- **Verdict:** corrected
- **Checked:** Encyclopedia.com (Waldner; read in full); the Hebrew University (HUJI) abstract of Kark 2017 (read in full).
- **Findings:**
  - Supported: registration and deeds, legal title taking precedence over cultivation, and contested outcomes.
  - Waldner presents the peasant-avoidance account as what is "frequently asserted", that is, the older view. He then reports newer research: peasants in the hill country near Jerusalem did register their land, and large estates in Palestine came mainly from state sales of wasteland. Our perspective presents the older view as his own, so it needs rewording.
  - The Kark perspective is supported: per the abstract, effendi ownership eased land purchases for Jewish settlement and for at least 15 German Christian sites.
  - Kark's chapter: Springer 2017, *Perspectives on Geographical Marginality* vol. 2, pp.101-119, doi:10.1007/978-3-319-50998-3_8.
- **Proposed patch:** in the JSON.
- **Coordinates:** ok.

### templer-colony-haifa-1868
- **Verdict:** ok
- **Checked:** Wikipedia German Templer colonies (raw).
- **Findings:**
  - The Templers left Germany on 6 August 1868 and landed at Haifa on 30 October; the colony was founded in 1868, and Jaffa followed in 1869.
  - Sarona is 1871 in the article's text and 1872 in its timeline; it is rightly left out.
  - The article's own timeline dates the Haifa colony "1869-70". Note this in `editorNote`.
  - Wikipedia is still the only source; replace it with Ruhe 1983 before verifying.
- **Proposed patch:** none.
- **Coordinates:** ok (the German Colony is about 2.7 km north of the pin, acceptable for precision `area`).

### jerusalem-mutasarrifate-1872
- **Verdict:** corrected
- **Checked:** Wikipedia Mutasarrifate of Jerusalem, Beirut Vilayet and Ottoman Palestine (raw); McCarthy pp.5-6.
- **Findings:**
  - 1872 is supported (Abu-Manneh 1999 p.38; Büssow 2011, *Hamidian Palestine ... District of Jerusalem 1872-1908*, Brill, ISBN 978-90-04-20569-7).
  - Beersheba became a municipality and kaza only around 1900-1901, so listing it for 1872 is anachronistic.
  - The Vilayet of Beirut was established in 1888. Ottoman Palestine refers to a "reorganisation of 1873" (Biger 2004), and McCarthy says "by 1886". So "belonged to Beirut" needs a date.
  - McCarthy agrees that Jerusalem became an independent sanjak, with Acre and Nablus in the Vilayet of Beirut by 1886. No source supports an 1887 date for the three sanjaks.
- **Proposed patch:** in the JSON.
- **Coordinates:** ok.

### first-aliyah-1882
- **Verdict:** needs owner decision
- **Checked:** JVL First Aliyah (read in full); Wikipedia Jewish land purchase and First Aliyah (raw sections); cojs 36670. PalQuest could not be read.
- **Findings:**
  - The Biluim reached Jaffa on 6 July 1882 (JVL), and the Rothschild aid is supported. JVL gives about 35,000 immigrants, almost half of whom left.
  - Petah Tikva (founded 1878, resettled 1882) is supported only by the First Aliyah Wikipedia article, which is not currently a cited source.
  - Ottoman limits on immigration from 1882 are supported by Mandel 1974, *Middle Eastern Studies* 10(3):312-332 (JSTOR 4282539). The ban on land sales appears only in the 1893 Foreign Office (FO) draft, so "restricted ... land purchase from 1882" is only partly supported.
  - The Pappé quote cited from Wikipedia is about the Mandate period ("during the Mandate"), not 1882.
  - The Masalha phrase comes from Masalha 2012 p.38, so cite that book, not Wikipedia.
  - The "Zionist historiography" perspective (JVL on taxes and Arab opposition) is not a real counter-view. A real second perspective is needed: Mandel 1976 or Kark, read directly.
- **Proposed patch (owner decision; suggested direction):**
  - Add First Aliyah (Wikipedia) or Mandel 1974 as a source.
  - Change "and land purchase from 1882" to "immigration from 1882 and land sales to foreign Jews by the 1890s".
  - Source the Masalha quote to Masalha 2012 p.38.
  - Drop or re-scope the Pappé quote.
- **Coordinates:** ok.

### jaffa-jerusalem-railway-1892
- **Verdict:** corrected
- **Checked:** Wikipedia Jaffa-Jerusalem railway (raw); the First Station site (read in full).
- **Findings:**
  - Supported: concession to Navon on 28 October 1888; the Société du Chemin de Fer Ottoman de Jaffa à Jérusalem; opened on 26 September 1892; 86.5 km.
  - Journey time: Wikipedia (citing Cotterell) says the first trains took about 3.5-6 hours, "about equal" to a carriage, against a planned 3 hours. The First Station site says the trip took about 10 hours by animal before the line and 3 hours after. "Cut ... from a day" overstates it.
- **Proposed patch:** in the JSON.
- **Coordinates:** ok.

### jerusalem-notables-petition-1891
- **Verdict:** needs owner decision
- **Checked:** one web search. It found a Wertheimer genealogy page quoting Martin Gilbert: a telegram of 24 June 1891 from Jerusalem to the Grand Vizier asking for a stop to Russian Jewish entry and land acquisition. Also the Ali Ekrem Bey collection at openjerusalem.org, which catalogues related telegrams to the Grand Vizierate from 1892 (no text). Mandel and Gilbert were not read.
- **Findings:** neither cited source mentions the petition. If Gilbert or Mandel confirms it, the summary should say "telegram" and "Russian Jews".
- **Proposed patch (owner decision):** cite Gilbert, *Israel: A History*, or Mandel 1976 from a real copy, or cut the event.
- **Coordinates:** ok.

### al-khalidi-letter-to-herzl-1899
- **Verdict:** corrected
- **Checked:** Wikipedia Yousef al-Khalidi (raw).
- **Findings:**
  - The letter of 1 March to Zadok Kahn and Herzl's reply of 19 March are supported, and the perspective matches Herzl's reply.
  - Mayoral terms: 1870-76, 1878-79 and 1899-1906 (Büssow 2011 p.554), so calling him a "former mayor" on 1 March 1899 is uncertain. The Ruhi Khalidi article says his term ran to 1907.
  - The birth year 1842 rests on Scholch 2005, "An Ottoman Bismarck from Jerusalem", *Jerusalem Quarterly* 24, pp.65 and 67.
  - An edition of the primary text to read: Walid Khalidi (ed.), *From Haven to Conquest* (IPS 1971) (not read).
- **Proposed patch:** in the JSON.
- **Coordinates:** ok.

### young-turk-revolution-al-karmil-1908
- **Verdict:** ok
- **Checked:** Wikipedia Al-Karmil and Ruhi Khalidi (raw).
- **Findings:**
  - Supported: first issue in December 1908 (Khalidi 1997 p.124); founded by Najib Nassar with the stated aim of opposing Zionist colonisation; Ruhi Khalidi was one of three Jerusalem deputies elected in 1908.
  - The claims about the constitution and press freedom are not in any page read. They are accurate general history (July 1908) but need a source.
  - A better source: Rashid Khalidi, *Palestinian Identity* (Columbia UP 1997) p.124.
- **Proposed patch:** none.
- **Coordinates:** ok.

### falastin-newspaper-founded-1911
- **Verdict:** corrected
- **Checked:** Wikipedia Falastin and Issa El-Issa (raw).
- **Findings:**
  - Supported: founded in January 1911 by the cousins Issa and Yousef El-Issa; addressed its readers as Palestinians (Mandel 1976 p.128); critical of Zionism.
  - The current article now gives only 14 January.
  - The paper moved to East Jerusalem in 1948 and was published until 1967, when it merged into Ad-Dustour. No "1950" appears in the source.
- **Proposed patch:** in the JSON.
- **Coordinates:** ok.

### world-war-i-home-front-1915-1917
- **Verdict:** ok
- **Checked:** Wikipedia 1915 locust plague and 1917 Jaffa deportation (raw); JVL Allenby page (read in full).
- **Findings:**
  - Supported:
    - the locust plague, March-October 1915
    - the expulsion of Gaza's 35,000-40,000 people at the start of March 1917 (Halevy)
    - the evacuation of Jaffa, ordered on 28 March and carried out on 6 April 1917
    - the surrender of Jerusalem on 9 December, with Allenby entering on foot "two days later" (JVL, citing Sebag-Montefiore and the Israel State Archives)
  - The Friedman/Sheffy perspective is supported.
  - Leads to add: Foster 2015 (*Middle Eastern Studies*); Halevy, *Journal of Levantine Studies* 5.
- **Proposed patch:** none.
- **Coordinates:** ok.
